// App frame: sidebar navigation built from the manifest, main content region.
import { el, clear } from './dom';
import type { App } from '../main';
import { conceptHash } from '../router';

export function buildFrame(registry: any, store: any, router: any) {
  const appRoot = clear(document.getElementById('app')!);
  const sidebar = el('aside', { class: 'sidebar', id: 'sidebar' });
  const main = el('main', { class: 'main', id: 'main' });
  appRoot.appendChild(el('div', { class: 'frame' }, sidebar, main));
  renderSidebar({ registry, store, router, main } as App);
  return { main, sidebar };
}

export function refreshSidebar(app: App) {
  renderSidebar(app);
}

function renderSidebar(app: App) {
  const { registry, store } = app;
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const m = registry.manifest;
  const activeHash = location.hash || '#/';
  clear(sidebar as HTMLElement);

  sidebar.appendChild(
    el('div', { class: 'brand' },
      el('a', { href: '#/' }, 'Signals Companion'),
      el('span', { class: 'brand-course' }, m.course.code)),
  );

  const nav = (href: string, label: string, extra?: Node) =>
    el('a', { class: 'nav-item' + (activeHash === href ? ' active' : ''), href }, extra ?? '', label);

  sidebar.appendChild(
    el('div', { class: 'nav-section' },
      nav('#/', 'Today'),
      nav('#/review', 'Review'),
      nav('#/exam', 'Exam mode'),
      nav('#/atlas', 'Atlas'),
      nav('#/formulas', 'Formulas'),
      el('a', { class: 'nav-item', href: '#', onclick: (e: Event) => { e.preventDefault(); (window as any).SC?.app && openSearch(); } },
        'Search ', el('kbd', {}, navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl K'))),
  );

  const currentConceptId = app.router?.current?.view === 'concept' ? app.router.current.params.id : null;

  for (const mod of m.modules) {
    const open = mod.concepts.includes(currentConceptId) || m.modules.length <= 2;
    const details = el('details', { class: 'nav-module', ...(open ? { open: true } : {}) },
      el('summary', {}, `${mod.num > 0 ? mod.num + ' · ' : ''}${mod.short}`),
    );
    for (const cid of mod.concepts) {
      const meta = registry.conceptMeta(cid);
      if (!meta) continue;
      const status = store.state.progress[cid]?.status || 'untouched';
      const href = conceptHash(cid);
      details.appendChild(
        el('a', { class: 'nav-item' + (currentConceptId === cid ? ' active' : ''), href },
          el('span', { class: `mastery-dot ${status}` }),
          meta.short || meta.title),
      );
    }
    sidebar.appendChild(details);
  }
}

function openSearch() {
  dispatchEvent(new CustomEvent('sc:open-search'));
}
