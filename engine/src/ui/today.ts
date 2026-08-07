// Today screen: where you left off, due reviews, exam countdowns, export ritual.
import { el, clear, fmtDate, daysUntil, download } from './dom';
import type { App } from '../main';
import { conceptHash } from '../router';
import { dueCards } from '../srs';

export function renderToday(app: App) {
  const { registry, store, main } = app;
  const content = el('div', { class: 'content' });
  clear(main).appendChild(content);
  const st = store.state;

  content.appendChild(el('h1', {}, 'Today'));

  // ---- exam countdowns ----
  const exams: Array<[string, string | null]> = [
    ['Minor I', st.exams.minor1], ['Minor II', st.exams.minor2], ['Major', st.exams.major],
  ];
  const anySet = exams.some(([, d]) => d);
  const examRow = el('div', { class: 'panel', style: 'display:flex;gap:2rem;flex-wrap:wrap' });
  if (anySet) {
    for (const [name, date] of exams) {
      const d = daysUntil(date);
      examRow.appendChild(
        el('div', {},
          el('div', { class: 'muted' }, name),
          el('div', { style: 'font-size:1.3rem;font-weight:650' }, d == null ? '—' : d < 0 ? 'done' : `${d} days`),
          el('div', { class: 'muted' }, fmtDate(date))),
      );
    }
  } else {
    examRow.appendChild(
      el('div', {},
        el('p', {}, 'Enter your exam dates so the review scheduler can plan around Minor I, Minor II and the Major.'),
        el('a', { class: 'btn', href: '#/settings' }, 'Set exam dates')),
    );
  }
  content.appendChild(examRow);

  // ---- continue where you left off ----
  const lastId = Object.entries(st.progress)
    .filter(([, p]) => p.lastVisit)
    .sort((a, b) => (b[1].lastVisit! > a[1].lastVisit! ? 1 : -1))[0]?.[0];
  const nextId = pickNextConcept(app);
  const row = el('div', { style: 'display:flex;gap:1rem;flex-wrap:wrap;margin:1rem 0' });
  if (lastId && registry.conceptMeta(lastId)) {
    row.appendChild(el('a', { class: 'btn', href: conceptHash(lastId) }, `Continue: ${registry.conceptMeta(lastId).title}`));
  }
  if (nextId && nextId !== lastId) {
    row.appendChild(el('a', { class: 'btn btn-primary', href: conceptHash(nextId) }, `Next up: ${registry.conceptMeta(nextId).title}`));
  }
  content.appendChild(row);

  // ---- reviews due ----
  const due = dueCards(store.state, registry).length;
  content.appendChild(
    el('div', { class: 'panel' },
      el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap' },
        el('div', {},
          el('strong', {}, due === 0 ? 'No reviews due' : `${due} review${due === 1 ? '' : 's'} due`),
          el('div', { class: 'muted' }, due === 0 ? 'Spaced repetition keeps what you learn — cards appear here as you complete checkpoints.' : 'A short session now beats a long one later.')),
        due > 0 ? el('a', { class: 'btn btn-primary', href: '#/review' }, 'Review now') : null)),
  );

  // ---- progress overview ----
  const m = registry.manifest;
  const grid = el('div', { class: 'panel' });
  grid.appendChild(el('strong', {}, 'Course progress'));
  for (const mod of m.modules) {
    if (!mod.concepts.length) continue;
    const states = mod.concepts.map((cid: string) => st.progress[cid]?.status || 'untouched');
    const learned = states.filter((s: string) => s !== 'untouched' && s !== 'seen').length;
    const rowEl = el('div', { style: 'display:flex;align-items:center;gap:.75rem;margin-top:.5rem' },
      el('a', { href: `#/m/${mod.num}`, style: 'width:11rem;flex-shrink:0' }, mod.short),
      el('div', { style: 'display:flex;gap:3px;flex-wrap:wrap' },
        ...states.map((s: string, i: number) =>
          el('a', { class: `mastery-dot ${s}`, href: conceptHash(mod.concepts[i]), title: registry.conceptMeta(mod.concepts[i])?.title || '' }))),
      el('span', { class: 'muted' }, `${learned}/${mod.concepts.length}`));
    grid.appendChild(rowEl);
  }
  content.appendChild(grid);

  // ---- export ritual ----
  const days = store.daysSinceExport();
  const stale = days == null || days > 2;
  content.appendChild(
    el('div', { class: 'panel' + (stale ? '' : ' panel-inset') },
      el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap' },
        el('div', {},
          el('strong', {}, 'Backup'),
          el('div', { class: 'muted' },
            store.storageMode === 'session-only'
              ? 'Browser storage is unavailable — progress lives only in this tab. Export before closing!'
              : days == null
                ? 'Your progress lives in the browser, not this folder. Export a backup file once a week.'
                : `Last export: ${days === 0 ? 'today' : days + ' day' + (days === 1 ? '' : 's') + ' ago'}.`)),
        el('button', { class: 'btn' + (stale ? ' btn-primary' : ''), onclick: () => {
          const { name, blob } = store.exportBlob();
          download(name, blob);
        } }, 'Export progress'))),
  );
}

// Next concept: first prereq-satisfied untouched concept in module order.
export function pickNextConcept(app: App): string | null {
  const { registry, store } = app;
  const learned = (id: string) => {
    const s = store.state.progress[id]?.status;
    return s === 'learned' || s === 'secure' || s === 'mastered';
  };
  for (const mod of registry.manifest.modules) {
    for (const cid of mod.concepts) {
      const st = store.state.progress[cid]?.status || 'untouched';
      if (st !== 'untouched' && st !== 'seen') continue;
      const meta = registry.conceptMeta(cid);
      if (meta.prereqs?.every((p: string) => learned(p)) ?? true) return cid;
    }
  }
  return null;
}
