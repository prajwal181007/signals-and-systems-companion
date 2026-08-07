// Module overview: concept list with mastery, tier chips, and a short brief.
import { el, clear } from './dom';
import type { App } from '../main';
import { conceptHash } from '../router';

export function renderModule(app: App, num: number) {
  const { registry, store, main } = app;
  const mod = registry.manifest.modules.find((m: any) => m.num === num);
  const content = el('div', { class: 'content' });
  clear(main).appendChild(content);
  if (!mod) {
    content.appendChild(el('p', {}, 'Unknown module.'));
    return;
  }
  content.appendChild(el('h1', {}, mod.title || mod.short));
  const list = el('div', {});
  for (const cid of mod.concepts) {
    const meta = registry.conceptMeta(cid);
    if (!meta) continue;
    const status = store.state.progress[cid]?.status || 'untouched';
    list.appendChild(
      el('a', { class: 'panel', href: conceptHash(cid), style: 'display:flex;align-items:center;gap:.8rem;text-decoration:none;color:var(--ink)' },
        el('span', { class: `mastery-dot ${status}` }),
        el('span', { style: 'flex:1' }, meta.title),
        meta.tier !== 'core' ? el('span', { class: `chip chip-${meta.tier === 'supplementary' ? 'supp' : 'enrich'}` }, meta.tier) : '',
        el('span', { class: 'muted' }, status === 'untouched' ? '' : status)),
    );
  }
  content.appendChild(list);
}
