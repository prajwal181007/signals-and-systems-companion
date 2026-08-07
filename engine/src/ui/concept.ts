// Concept page. First pass = the 7-beat arc (hook → predict → studio →
// resolution → autopsy → examples → checkpoint). Once Learned, the page is a
// reference: all facets anchored, instantly reachable, never re-gated.
import { el, clear } from './dom';
import type { App } from '../main';
import { conceptHash } from '../router';
import { newWidgetHost, WidgetHost } from '../widget-host';
import { renderItem, renderCheckpoint, markLearned } from '../quiz';

const FACET_LABELS: Array<[string, string]> = [
  ['definition', 'Definition & formulas'],
  ['derivation', 'Where it comes from'],
  ['examples', 'Worked examples'],
  ['misconceptions', 'Where intuition misfires'],
  ['applications', 'Engineering applications'],
  ['exam', 'Exam lens'],
  ['interview', 'Interview lens'],
  ['code', 'In code'],
  ['history', 'History'],
  ['research', 'Research connections'],
  ['whatif', 'What if the assumptions change?'],
  ['summary', 'Quick reference'],
];

let timeTracker: any = null;

export function renderConcept(app: App, id: string, facet?: string) {
  const { registry, store, main } = app;
  clear(main).appendChild(el('div', { class: 'content' }, el('p', { class: 'muted' }, 'loading…')));
  registry.loadConcept(id).then(
    (c) => {
      registry.whenCssReady('katex').then(() => showConcept(app, c, facet));
    },
    () => {
      clear(main).appendChild(el('div', { class: 'content' },
        el('div', { class: 'boot-error' }, `Could not load "${id}". The data file may be missing from the data/concepts folder.`)));
    },
  );
}

function showConcept(app: App, c: any, facet?: string) {
  const { store, main } = app;
  const host = newWidgetHost(app);

  // Track time + facet views; mark 'seen'.
  clearInterval(timeTracker);
  store.update((st) => {
    const p = (st.progress[c.id] ||= { status: 'untouched', facetsSeen: [], checkpointPassedAt: null, secondsSpent: 0, lastVisit: null });
    if (p.status === 'untouched') p.status = 'seen';
    p.lastVisit = new Date().toISOString();
  });
  timeTracker = setInterval(() => {
    if (document.hidden) return;
    store.update((st) => { st.progress[c.id].secondsSpent += 10; });
  }, 10000);

  const status = store.state.progress[c.id]?.status || 'seen';
  const arcDone = status === 'learned' || status === 'secure' || status === 'mastered';
  const arcMode = !arcDone && !facet;

  const content = el('div', { class: 'content' });
  clear(main).appendChild(content);

  // ---------- header ----------
  const tierChip = el('span', { class: `chip chip-${c.tier === 'supplementary' ? 'supp' : c.tier === 'enrichment' ? 'enrich' : 'core'}` },
    c.tier === 'core' ? 'course core' : c.tier);
  content.appendChild(el('div', { style: 'display:flex;align-items:center;gap:.6rem;flex-wrap:wrap' },
    el('h1', { html: c.titleHtml || c.title, style: 'margin:0' }), tierChip));
  if (c.prereqs?.length) {
    content.appendChild(el('div', { class: 'muted', style: 'margin:.2rem 0 .8rem' },
      'Builds on: ',
      ...c.prereqs.flatMap((p: string, i: number) => {
        const meta = app.registry.conceptMeta(p);
        return [i ? ' · ' : '', el('a', { href: conceptHash(p) }, meta?.title || p)];
      })));
  }

  if (arcMode) renderArc(app, c, content, host);
  else renderReference(app, c, content, host, facet, arcDone);
}

// ================================================================ reference
function renderReference(app: App, c: any, content: HTMLElement, host: WidgetHost, facet?: string, arcDone?: boolean) {
  if (!arcDone && facet) {
    content.appendChild(el('div', { class: 'panel panel-inset', style: 'display:flex;justify-content:space-between;gap:1rem;align-items:center;flex-wrap:wrap' },
      el('span', {}, 'You skipped ahead — everything is open, and the guided first pass is waiting whenever you want it.'),
      el('a', { class: 'btn', href: conceptHash(c.id), onclick: () => setTimeout(() => location.reload(), 0) }, 'Start guided pass')));
  }

  const sections: HTMLElement[] = [];
  // Intuition first, always.
  const intu = el('section', { id: 'facet-intuition' }, el('h2', {}, 'Intuition'));
  for (const b of c.facets.intuition.blocks) {
    intu.appendChild(el('div', { class: 'prose', html: b.html }));
    if (b.vizState) intu.appendChild(el('div', { dataset: { widgetSlot: b.vizState.widget } }));
  }
  sections.push(intu);

  if (c.facets.visual) sections.push(sectionFromHtml('visual', 'Visual', c.facets.visual.html));

  for (const [key, label] of FACET_LABELS) {
    const f = c.facets[key];
    if (!f) continue;
    if (key === 'derivation') {
      const sec = el('section', { id: 'facet-derivation' }, el('h2', {}, label));
      sec.appendChild(renderDerivation(c.facets.derivation, true));
      sections.push(sec);
    } else if (key === 'misconceptions') {
      const sec = el('section', { id: 'facet-misconceptions' }, el('h2', {}, label));
      for (const m of f) {
        sec.appendChild(el('div', { class: 'panel' },
          el('div', { class: 'prose', style: 'color:var(--bad)', html: '<strong>Tempting but wrong:</strong> ' + m.wrongHtml }),
          m.temptingHtml ? el('div', { class: 'prose muted', html: '<em>Why it tempts:</em> ' + m.temptingHtml }) : '',
          el('div', { class: 'prose', html: '<strong>The repair:</strong> ' + m.correctionHtml })));
      }
      sections.push(sec);
    } else {
      sections.push(sectionFromHtml(key, label, f.html));
    }
  }

  // Deduplicate widget slots: only first occurrence of each mounts.
  const seen = new Set<string>();
  for (const s of sections) {
    s.querySelectorAll('[data-widget-slot]').forEach((slot) => {
      const wid = (slot as HTMLElement).dataset.widgetSlot!;
      if (seen.has(wid)) slot.remove();
      else seen.add(wid);
    });
    content.appendChild(s);
  }
  // Any widget not referenced by a slot gets appended to the visual flow.
  for (const w of c.widgets) {
    if (!seen.has(w.id)) {
      seen.add(w.id);
      (content.querySelector('#facet-visual') || content.querySelector('#facet-intuition'))!
        .appendChild(el('div', { dataset: { widgetSlot: w.id } }));
    }
  }

  // Cross-links footer.
  if (c.crossLinks?.length) {
    content.appendChild(el('section', {}, el('h2', {}, 'Connected ideas'),
      el('ul', { class: 'prose' }, ...c.crossLinks.map((l: any) => {
        const meta = app.registry.conceptMeta(l.target);
        return el('li', {}, el('a', { href: conceptHash(l.target) }, meta?.title || l.target), l.relation ? ` — ${l.relation}` : '');
      }))));
  }

  host.activate(content, c.widgets, c.id);
  markFacetsSeen(app, c, content);

  if (facet) {
    setTimeout(() => document.getElementById('facet-' + facet.split('#')[0])?.scrollIntoView({ block: 'start' }), 30);
  }
}

function sectionFromHtml(key: string, label: string, html: string): HTMLElement {
  return el('section', { id: 'facet-' + key }, el('h2', {}, label), el('div', { class: 'prose', html }));
}

// ================================================================ the arc
function renderArc(app: App, c: any, content: HTMLElement, host: WidgetHost) {
  const stages = el('div', {});
  content.appendChild(stages);

  // Test-out is always available — prior knowledge is respected.
  content.insertBefore(
    el('div', { class: 'panel panel-inset', style: 'display:flex;justify-content:space-between;gap:1rem;align-items:center;flex-wrap:wrap' },
      el('span', { class: 'muted' }, 'Already know this? Prove it and skip the walkthrough.'),
      el('button', { class: 'btn', onclick: () => {
        clear(stages);
        stages.appendChild(el('h2', {}, 'Challenge checkpoint'));
        renderCheckpoint(app, c, stages, (passed) => {
          if (passed) addContinueFooter(app, c, stages);
        });
      } }, 'Challenge the checkpoint')),
    stages);

  let stageIdx = 0;
  const nextStage = () => { stageIdx++; runStage(); };

  const blocks = c.facets.intuition.blocks;

  const runStage = () => {
    switch (stageIdx) {
      case 0: { // Hook = first intuition block
        const hook = el('section', {},
          el('div', { class: 'prose', html: blocks[0].html }));
        stages.appendChild(hook);
        if (c.predict) {
          hook.appendChild(el('button', { class: 'btn btn-primary', onclick: (e: Event) => { (e.target as HTMLElement).remove(); nextStage(); } }, 'Make a prediction →'));
        } else { nextStage(); }
        break;
      }
      case 1: { // Predict — commit before learning; never graded. Asked once:
        // a stored commitment (e.g. from an interrupted first pass) is honored.
        if (!c.predict || app.store.state.predictions[c.id]) { nextStage(); break; }
        const sec = el('section', { class: 'panel', style: 'border-color:var(--accent)' },
          el('h2', { style: 'margin-top:0' }, 'Before we start — commit to a guess'),
          el('div', { class: 'prose', html: c.predict.promptHtml }));
        const done = (given: any) => {
          app.store.update((st) => { st.predictions[c.id] = { given, at: new Date().toISOString() }; });
          sec.appendChild(el('p', {}, el('strong', {}, 'Locked in. '), 'Let’s find out.'));
          sec.querySelectorAll('button').forEach((b) => b.setAttribute('disabled', ''));
          setTimeout(nextStage, 400);
        };
        if (c.predict.kind === 'choice' && c.predict.choices) {
          const list = el('div', { style: 'display:flex;flex-direction:column;gap:.4rem;margin:.5rem 0' });
          c.predict.choices.forEach((ch: string, i: number) => {
            list.appendChild(el('button', { class: 'btn', style: 'justify-content:flex-start;text-align:left', onclick: () => done(i) },
              el('span', { class: 'prose', html: ch })));
          });
          sec.appendChild(list);
        }
        sec.appendChild(el('button', { class: 'btn btn-quiet', onclick: () => done(null) }, 'I genuinely have no idea'));
        stages.appendChild(sec);
        break;
      }
      case 2: { // Intuition studio — block-by-block reveal, viz in lockstep.
        const sec = el('section', {}, el('h2', {}, 'Build the idea'));
        stages.appendChild(sec);
        let bi = 1; // block 0 was the hook
        const revealNext = () => {
          if (bi >= blocks.length) { nextStage(); return; }
          const b = blocks[bi];
          sec.appendChild(el('div', { class: 'prose', html: b.html }));
          if (b.vizState) {
            let frame = content.querySelector(`[data-widget-frame="${b.vizState.widget}"]`);
            if (!frame) {
              sec.appendChild(el('div', { dataset: { widgetSlot: b.vizState.widget } }));
              host.activate(sec, c.widgets, c.id);
            }
            host.setParams(b.vizState.widget, b.vizState.params || {});
            host.scrollToWidget(b.vizState.widget);
          }
          bi++;
          if (bi < blocks.length) {
            const btn = el('button', { class: 'btn', onclick: () => { btn.remove(); revealNext(); } }, 'Continue ↓');
            sec.appendChild(btn);
          } else {
            const btn = el('button', { class: 'btn btn-primary', onclick: () => { btn.remove(); nextStage(); } },
              c.predict ? 'Resolve my prediction →' : 'On to the mathematics →');
            sec.appendChild(btn);
          }
        };
        revealNext();
        break;
      }
      case 3: { // Resolution
        if (!c.predict) { nextStage(); break; }
        const given = app.store.state.predictions[c.id]?.given;
        const sec = el('section', { class: 'panel' }, el('h2', { style: 'margin-top:0' }, 'Your prediction, resolved'));
        if (c.predict.kind === 'choice' && c.predict.choices && typeof c.predict.answer === 'number') {
          const yours = typeof given === 'number' ? c.predict.choices[given] : null;
          const right = c.predict.choices[c.predict.answer];
          if (yours != null) {
            sec.appendChild(el('div', { class: 'prose' },
              el('p', { html: '<strong>You committed to:</strong> ' + yours }),
              el('p', { html: '<strong>What actually happens:</strong> ' + right })));
            sec.appendChild(el('p', {}, given === c.predict.answer
              ? el('strong', {}, 'Your instinct was right — now you know why.')
              : el('strong', {}, 'A very common instinct — and exactly the one this concept repairs.')));
          } else {
            sec.appendChild(el('div', { class: 'prose', html: '<strong>What actually happens:</strong> ' + right }));
          }
        }
        if (c.predict.resolutionHtml) sec.appendChild(el('div', { class: 'prose', html: c.predict.resolutionHtml }));
        sec.appendChild(el('button', { class: 'btn btn-primary', onclick: (e: Event) => { (e.target as HTMLElement).remove(); nextStage(); } }, 'Now the mathematics →'));
        stages.appendChild(sec);
        break;
      }
      case 4: { // Formula autopsy: definition + stepped derivation.
        const sec = el('section', {}, el('h2', {}, 'The mathematics'),
          el('div', { class: 'prose', html: c.facets.definition.html }));
        sec.appendChild(el('h3', {}, 'Where it comes from — one step at a time'));
        sec.appendChild(renderDerivation(c.facets.derivation, false, () => {
          const btn = el('button', { class: 'btn btn-primary', onclick: () => { btn.remove(); nextStage(); } }, 'Try it on real problems →');
          sec.appendChild(btn);
        }));
        stages.appendChild(sec);
        host.activate(sec, c.widgets, c.id);
        break;
      }
      case 5: { // Worked examples + misconceptions
        const sec = el('section', {}, el('h2', {}, 'Worked examples'),
          el('div', { class: 'prose', html: c.facets.examples.html }));
        if (c.facets.misconceptions) {
          sec.appendChild(el('h3', {}, 'Where intuition misfires'));
          for (const m of c.facets.misconceptions) {
            sec.appendChild(el('div', { class: 'panel' },
              el('div', { class: 'prose', html: '<strong>Tempting but wrong:</strong> ' + m.wrongHtml }),
              el('div', { class: 'prose', html: '<strong>The repair:</strong> ' + m.correctionHtml })));
          }
        }
        const btn = el('button', { class: 'btn btn-primary', onclick: () => { btn.remove(); nextStage(); } }, 'Checkpoint →');
        sec.appendChild(btn);
        stages.appendChild(sec);
        host.activate(sec, c.widgets, c.id);
        break;
      }
      case 6: { // Checkpoint
        const sec = el('section', {}, el('h2', {}, 'Checkpoint'));
        stages.appendChild(sec);
        renderCheckpoint(app, c, sec, (passed) => {
          if (passed) addContinueFooter(app, c, sec);
          else sec.appendChild(el('a', { class: 'btn', href: conceptHash(c.id, 'intuition') }, 'Revisit as reference'));
        });
        break;
      }
    }
  };
  runStage();
}

function addContinueFooter(app: App, c: any, container: HTMLElement) {
  const { registry } = app;
  // Next concept in module order.
  const all = registry.manifest.modules.flatMap((m: any) => m.concepts);
  const next = all[all.indexOf(c.id) + 1];
  const row = el('div', { style: 'display:flex;gap:.6rem;margin-top:1rem;flex-wrap:wrap' },
    el('a', { class: 'btn', href: conceptHash(c.id), onclick: () => setTimeout(() => app.router.dispatch(), 0) }, 'Reread as reference'));
  if (next) row.appendChild(el('a', { class: 'btn btn-primary', href: conceptHash(next) }, `Next: ${registry.conceptMeta(next)?.title || next} →`));
  row.appendChild(el('a', { class: 'btn', href: '#/' }, 'Back to Today'));
  container.appendChild(row);
}

// Derivation stepper: steps reveal one at a time; every step's "why is this
// legal?" is one tap away.
function renderDerivation(deriv: any, showAll: boolean, onComplete?: () => void): HTMLElement {
  const root = el('div', {});
  if (deriv.preambleHtml) root.appendChild(el('div', { class: 'prose', html: deriv.preambleHtml }));
  const steps = deriv.list;
  const holder = el('div', {});
  root.appendChild(holder);

  const renderStep = (s: any, i: number) => {
    const whyBtn = s.why
      ? el('button', { class: 'btn btn-quiet', style: 'font-size:.78rem', onclick: (e: Event) => {
          const b = e.currentTarget as HTMLElement;
          const note = el('div', { class: 'muted', style: 'margin:.2rem 0 .4rem', html: s.why });
          b.replaceWith(note);
        } }, 'why is this step allowed?')
      : null;
    return el('div', { style: 'margin:.6rem 0;padding-left:.9rem;border-left:2px solid var(--line)' },
      el('div', { style: 'font-weight:600', html: `${i + 1}. ${s.claim}` }),
      whyBtn,
      s.html ? el('div', { class: 'prose', html: s.html }) : '');
  };

  if (showAll) {
    steps.forEach((s: any, i: number) => holder.appendChild(renderStep(s, i)));
  } else {
    let i = 0;
    const reveal = () => {
      holder.appendChild(renderStep(steps[i], i));
      i++;
      if (i < steps.length) {
        const btn = el('button', { class: 'btn', onclick: () => { btn.remove(); reveal(); } }, 'Next step');
        holder.appendChild(btn);
      } else onComplete?.();
    };
    reveal();
  }
  return root;
}

// Mark facets seen as their sections scroll into view.
function markFacetsSeen(app: App, c: any, content: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const fid = (e.target as HTMLElement).id.replace('facet-', '');
      app.store.update((st) => {
        const p = st.progress[c.id];
        if (p && !p.facetsSeen.includes(fid)) p.facetsSeen.push(fid);
      });
      io.unobserve(e.target);
    }
  }, { threshold: 0.3 });
  content.querySelectorAll('section[id^="facet-"]').forEach((s) => io.observe(s));
}
