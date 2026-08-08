// ⌘K search overlay: prefix hits + inverted-index results grouped by concept,
// each result deep-linking to a facet anchor. Queries run in <5 ms over the
// prebuilt index — no worker needed.
import { el } from './dom';
import type { App } from '../main';
import { conceptHash } from '../router';

export function initSearchOverlay(app: App) {
  let overlay: HTMLElement | null = null;

  const open = () => {
    if (overlay) return;
    const input = el('input', {
      type: 'text', placeholder: 'Search concepts, formulas, misconceptions…  (esc to close)',
      style: 'width:100%;font-size:1.05rem;padding:.7rem .9rem;border:none;background:transparent;color:var(--ink);outline:none',
    });
    const results = el('div', { style: 'max-height:60vh;overflow-y:auto;border-top:1px solid var(--line)' });
    const box = el('div', {
      style: 'width:min(40rem,92vw);background:var(--bg);border:1px solid var(--line);border-radius:8px;overflow:hidden',
    }, input, results);
    overlay = el('div', {
      style: 'position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.25);display:flex;justify-content:center;padding-top:12vh;align-items:flex-start',
      onclick: (e: Event) => { if (e.target === overlay) close(); },
    }, box);
    document.body.appendChild(overlay);
    input.focus();
    input.addEventListener('input', () => renderResults((input as HTMLInputElement).value, results));
    renderResults('', results);
  };
  const close = () => { overlay?.remove(); overlay = null; };

  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); overlay ? close() : open(); }
    if (e.key === 'Escape') close();
  });
  addEventListener('sc:open-search', open);
  addEventListener('hashchange', close);

  function renderResults(q: string, container: HTMLElement) {
    container.innerHTML = '';
    const idx = app.registry.searchIndex;
    if (!idx) return;
    const query = q.trim().toLowerCase();
    if (!query) {
      container.appendChild(el('div', { style: 'padding: .8rem 1rem', class: 'muted' },
        'Try “convolution”, “roc”, “flip and slide”, “gibbs”, “phase margin”…'));
      return;
    }
    const hits = runQuery(app, query);
    if (!hits.length) {
      container.appendChild(el('div', { style: 'padding:.8rem 1rem', class: 'muted' }, 'No matches.'));
      return;
    }
    // Group results by concept, best-first.
    const byConcept = new Map<string, any[]>();
    for (const h of hits) {
      if (!byConcept.has(h.doc.concept)) byConcept.set(h.doc.concept, []);
      byConcept.get(h.doc.concept)!.push(h);
    }
    let shown = 0;
    for (const [cid, group] of byConcept) {
      if (shown >= 8) break;
      shown++;
      const meta = app.registry.conceptMeta(cid);
      const section = el('div', { style: 'padding:.55rem 1rem;border-bottom:1px solid var(--line)' });
      section.appendChild(el('a', { href: conceptHash(cid), style: 'font-weight:650' }, meta?.title || cid));
      for (const h of group.slice(0, 4)) {
        section.appendChild(el('a', {
          href: conceptHash(cid, h.doc.facet + (h.doc.ref.includes('#') ? '#' + h.doc.ref.split('#')[1] : '')),
          style: 'display:block;padding:.15rem 0 .15rem .9rem;color:var(--ink-soft);font-size:.86rem',
        }, el('span', { style: 'color:var(--accent)' }, h.doc.facetTitle + ' — '), h.doc.snippet.slice(0, 90)));
      }
      container.appendChild(section);
    }
  }
}

function runQuery(app: App, query: string): Array<{ doc: any; score: number }> {
  const idx = app.registry.searchIndex;
  const tokens = query.split(/\s+/).filter(Boolean).map((t) => (t.endsWith('s') && t.length > 4 ? t.slice(0, -1) : t));
  const scores = new Map<number, number>();
  for (const tok of tokens) {
    const expand = [tok, ...(idx.synonyms[tok] || [])];
    let matched = false;
    for (const term of expand) {
      const posts = idx.postings[term];
      if (posts) {
        matched = true;
        for (let i = 0; i < posts.length; i += 2) {
          scores.set(posts[i], (scores.get(posts[i]) || 0) + posts[i + 1]);
        }
      }
    }
    // Prefix fallback: partial word typed.
    if (!matched && tok.length >= 2) {
      const pre = idx.prefixes[tok.slice(0, 8)];
      if (pre) {
        for (const cid of pre) {
          idx.docs.forEach((d: any, di: number) => {
            if (d.concept === cid && d.facet === 'definition') scores.set(di, (scores.get(di) || 0) + 5);
          });
        }
      }
    }
  }
  return [...scores.entries()]
    .map(([di, score]) => ({ doc: idx.docs[di], score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 40);
}
