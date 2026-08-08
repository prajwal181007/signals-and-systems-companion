// Exam mode: countdowns, per-exam readiness, crash-course spine, drills, and a
// printable mock assembler. Triage is a designed feature: when time is short
// the app says what it is sacrificing, never silently overflows.
import { el, clear, daysUntil, fmtDate } from './dom';
import type { App } from '../main';
import { conceptHash } from '../router';
import { renderItem } from '../quiz';
import { DRILL_FAMILIES, seedDrills } from '../drills';
import { retrievability } from '../srs';

export function renderExam(app: App) {
  const { registry, store, main } = app;
  const content = el('div', { class: 'content' });
  clear(main).appendChild(content);
  content.appendChild(el('h1', {}, 'Exam mode'));

  const exams: Array<{ key: 'minor1' | 'minor2' | 'major'; label: string }> = [
    { key: 'minor1', label: 'Minor I' }, { key: 'minor2', label: 'Minor II' }, { key: 'major', label: 'Major' },
  ];
  const anyDate = exams.some((e) => store.state.exams[e.key]);
  if (!anyDate) {
    content.appendChild(el('div', { class: 'panel' },
      el('p', {}, 'Set your exam dates first — everything here plans around them. Default scope: Minor I covers Modules 1–2, Minor II covers 3–4, the Major is cumulative. If your instructor announces a different scope, this page follows the modules listed in the course structure.'),
      el('a', { class: 'btn btn-primary', href: '#/settings' }, 'Set exam dates')));
  }

  for (const ex of exams) {
    const date = store.state.exams[ex.key];
    const scope: number[] = registry.manifest.exams[ex.key]?.modules || [];
    const inScope = registry.manifest.concepts.filter((c: any) => scope.includes(c.module) && c.tier !== 'enrichment');
    const days = daysUntil(date);
    const panel = el('div', { class: 'panel' });
    panel.appendChild(el('div', { style: 'display:flex;justify-content:space-between;align-items:baseline;gap:1rem;flex-wrap:wrap' },
      el('strong', {}, `${ex.label} — modules ${scope.filter((m: number) => m > 0).join(', ')}`),
      el('span', { class: 'muted' }, date ? (days! < 0 ? 'done' : `${days} days (${fmtDate(date)})`) : 'date not set')));

    // readiness heatmap
    const dots = el('div', { style: 'display:flex;gap:3px;flex-wrap:wrap;margin:.5rem 0' });
    let ready = 0;
    for (const c of inScope) {
      const status = store.state.progress[c.id]?.status || 'untouched';
      if (status === 'learned' || status === 'secure' || status === 'mastered') ready++;
      dots.appendChild(el('a', { class: `mastery-dot ${status}`, href: conceptHash(c.id), title: c.title }));
    }
    panel.appendChild(dots);
    panel.appendChild(el('div', { class: 'muted' }, `${ready}/${inScope.length} concepts at Learned or better.`));

    // triage: what matters most right now
    if (date && days != null && days >= 0) {
      const untouched = inScope.filter((c: any) => {
        const s = store.state.progress[c.id]?.status || 'untouched';
        return s === 'untouched' || s === 'seen';
      });
      const triage = untouched
        .map((c: any) => ({ c, weight: examWeight(app, c) }))
        .sort((a: any, b: any) => b.weight - a.weight);
      if (triage.length) {
        const feasible = Math.max(3, Math.floor(days * 1.5)); // ~1.5 concepts/day of catch-up is honest
        const doing = triage.slice(0, feasible);
        const sacrificing = triage.slice(feasible);
        panel.appendChild(el('div', { style: 'margin-top:.5rem' },
          el('strong', {}, days <= 14 ? 'Crash-course priority (highest exam value first):' : 'Still to learn (by exam value):'),
          el('ol', { class: 'prose', style: 'margin:.3rem 0 0' },
            ...doing.slice(0, 8).map(({ c }: any) =>
              el('li', {}, el('a', { href: conceptHash(c.id) }, c.title),
                el('span', { class: 'muted' }, ' — compressed pass: definition → one worked example → checkpoint'))))));
        if (sacrificing.length && days <= 14) {
          panel.appendChild(el('div', { class: 'muted', style: 'margin-top:.4rem' },
            `Being honest about time: at ~1.5 new concepts/day, the plan above sacrifices ${sacrificing.length} lower-weight item${sacrificing.length === 1 ? '' : 's'} (${sacrificing.slice(0, 3).map(({ c }: any) => c.short || c.title).join(', ')}${sacrificing.length > 3 ? '…' : ''}). Deliberate triage beats silent overwhelm.`));
        }
      }
    }
    content.appendChild(panel);
  }

  // ---- drills ----
  const drillPanel = el('div', { class: 'panel' }, el('strong', {}, 'Drills — unlimited generated practice'));
  const drillArea = el('div', {});
  const row = el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap;margin:.5rem 0' });
  for (const [key, fam] of Object.entries(DRILL_FAMILIES)) {
    row.appendChild(el('button', { class: 'btn', onclick: () => {
      seedDrills(Date.now() & 0xffff);
      clear(drillArea);
      const item = fam.gen();
      drillArea.appendChild(renderItem(app, item, () => {
        drillArea.appendChild(el('button', { class: 'btn', style: 'margin-top:.5rem', onclick: () => {
          clear(drillArea);
          const next = fam.gen();
          drillArea.appendChild(renderItem(app, next, () => {}));
        } }, 'Another one'));
      }));
    } }, fam.label));
  }
  drillPanel.append(row, drillArea);
  content.appendChild(drillPanel);

  // ---- printable mock ----
  content.appendChild(el('div', { class: 'panel' },
    el('strong', {}, 'Printable mock exam'),
    el('p', { class: 'muted' }, 'Assembles exam-tagged questions from every in-scope concept into a paper-style set. Print it, solve by hand against the clock (real exams are handwritten), then self-mark with the solutions page.'),
    el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap' },
      ...exams.map((ex) => el('button', { class: 'btn', onclick: () => buildMock(app, ex.key, ex.label) }, `Mock ${ex.label}`)))));
}

function examWeight(app: App, meta: any): number {
  // crude but honest: hero > core > supplementary; earlier prereq chains first
  const tierW = meta.tier === 'core' ? 2 : 1;
  return (meta.heroes ? 3 : 0) + tierW + (meta.quiz || 0) * 0.1;
}

async function buildMock(app: App, key: 'minor1' | 'minor2' | 'major', label: string) {
  const { registry } = app;
  const scope: number[] = registry.manifest.exams[key]?.modules || [];
  const inScope = registry.manifest.concepts.filter((c: any) => scope.includes(c.module) && c.tier === 'core');
  const questions: Array<{ concept: string; promptHtml: string; explanationHtml: string; marks: number }> = [];
  for (const meta of inScope) {
    try {
      const c = await registry.loadConcept(meta.id);
      const pool = c.quiz.filter((q: any) => q.kind !== 'widget');
      if (pool.length) {
        const q = pool[Math.floor(Math.random() * pool.length)];
        questions.push({ concept: c.title, promptHtml: q.promptHtml, explanationHtml: q.explanationHtml || '', marks: meta.heroes ? 8 : 4 });
      }
    } catch {}
  }
  if (!questions.length) { alert('No in-scope questions available yet.'); return; }
  const win = questions.slice(0, 12);
  const total = win.reduce((a, q) => a + q.marks, 0);
  const page = el('div', { class: 'content' },
    el('h1', {}, `Mock ${label} — EC2102 Signals and Systems`),
    el('p', { class: 'muted no-print' }, 'Print this page (⌘P), solve on paper under time, then scroll to the solutions.'),
    el('p', {}, `Time: ${key === 'major' ? '3 hours' : '90 minutes'} · Maximum marks: ${total} · Answer all questions. Show regime boundaries, integration limits, and ROCs explicitly — method marks live there.`),
    ...win.map((q, i) => el('div', { style: 'margin:1rem 0;page-break-inside:avoid' },
      el('div', { style: 'display:flex;justify-content:space-between;gap:1rem' },
        el('strong', {}, `Q${i + 1}.`), el('span', { class: 'muted' }, `[${q.marks} marks]`)),
      el('div', { class: 'prose', html: q.promptHtml }),
      el('div', { style: 'height:6rem;border-bottom:1px dashed var(--line)', class: 'print-space' }))),
    el('div', { style: 'page-break-before:always' },
      el('h2', {}, 'Solutions & marking notes'),
      ...win.map((q, i) => el('div', { style: 'margin: .8rem 0' },
        el('strong', {}, `Q${i + 1} (${q.concept}). `),
        el('div', { class: 'prose', html: q.explanationHtml || '<em>see the concept page</em>' })))),
    el('button', { class: 'btn btn-primary no-print', onclick: () => window.print() }, 'Print'),
    el('a', { class: 'btn no-print', href: '#/exam', style: 'margin-left:.5rem' }, 'Back'));
  clear(app.main).appendChild(page);
}
