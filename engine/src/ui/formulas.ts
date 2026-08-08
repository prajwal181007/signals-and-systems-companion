// Formula sheets: every concept's quick-reference facet, grouped by module.
// Reference mode for mid-problem lookup; print-clean per-module sheets.
import { el, clear } from './dom';
import type { App } from '../main';
import { conceptHash } from '../router';

export function renderFormulas(app: App) {
  const { registry, main } = app;
  const content = el('div', { class: 'content' });
  clear(main).appendChild(content);
  content.appendChild(el('div', { style: 'display:flex;justify-content:space-between;align-items:baseline;gap:1rem;flex-wrap:wrap' },
    el('h1', {}, 'Formula sheets'),
    el('button', { class: 'btn no-print', onclick: () => window.print() }, 'Print')));
  content.appendChild(el('p', { class: 'muted no-print' },
    'Every concept’s quick-reference card, in course order. This page is built for mid-problem lookup — and prints as clean revision sheets, one module per page.'));
  const holder = el('div', {}, el('p', { class: 'muted' }, 'loading all concepts…'));
  content.appendChild(holder);

  (async () => {
    await app.registry.whenCssReady('katex');
    const mods = registry.manifest.modules.filter((m: any) => m.concepts.length);
    clear(holder);
    for (const m of mods) {
      const sec = el('section', { style: 'page-break-before:auto' }, el('h2', {}, m.title || m.short));
      let any = false;
      for (const cid of m.concepts) {
        try {
          const c = await registry.loadConcept(cid);
          if (!c.facets.summary) continue;
          any = true;
          sec.appendChild(el('div', { class: 'panel', style: 'page-break-inside:avoid' },
            el('div', { style: 'display:flex;justify-content:space-between;gap:1rem;align-items:baseline' },
              el('strong', { html: c.titleHtml || c.title }),
              el('a', { class: 'no-print muted', href: conceptHash(cid) }, 'open')),
            el('div', { class: 'prose', html: c.facets.summary.html })));
        } catch {}
      }
      if (any) holder.appendChild(sec);
    }
  })();
}
