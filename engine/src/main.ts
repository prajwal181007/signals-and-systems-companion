// Signals Companion — engine entry point.
import { Registry, Concept } from './registry';
import { Store } from './store';
import { Router } from './router';
import { applyAppearance, watchSystemTheme } from './appearance';
import { buildFrame, refreshSidebar } from './ui/layout';
import { renderToday } from './ui/today';
import { renderConcept } from './ui/concept';
import { renderModule } from './ui/module';
import { renderSettings } from './ui/settings';
import { renderReview } from './ui/review';
import { renderExam } from './ui/exam';
import { renderAtlas } from './ui/atlas';
import { renderFormulas } from './ui/formulas';
import { renderNotFound } from './ui/notfound';
import { initSearchOverlay } from './ui/search';

export interface App {
  registry: Registry;
  store: Store;
  router: Router;
  main: HTMLElement;
}

function boot() {
  const registry = new Registry();

  // Drain the bootstrap queue, then become the live registry.
  const scAny = (window as any).SC || {};
  const queued: Array<[string, any]> = scAny._q || [];
  const live = {
    register: (kind: string, payload: any) => registry.register(kind, payload),
    _cssReady: (name: string) => registry.markCssReady(name),
    app: null as App | null,
  };
  (window as any).SC = live;
  for (const [kind, payload] of queued) registry.register(kind, payload);

  // Global error surface: a dead widget or bad route must never leave a blank
  // page with no explanation.
  const errors: string[] = [];
  const showErrorRibbon = (msg: string) => {
    errors.push(msg);
    let ribbon = document.getElementById('error-ribbon');
    if (!ribbon) {
      ribbon = document.createElement('div');
      ribbon.id = 'error-ribbon';
      ribbon.style.cssText =
        'position:fixed;bottom:0;left:0;right:0;z-index:99;background:var(--bg);color:var(--ink);' +
        'border-top:2px solid var(--bad);padding:.4rem 1rem;font-size:.8rem;display:flex;gap:1rem;align-items:center';
      const dismiss = document.createElement('button');
      dismiss.textContent = 'dismiss';
      dismiss.className = 'btn btn-quiet';
      dismiss.onclick = () => ribbon!.remove();
      ribbon.appendChild(document.createElement('span'));
      ribbon.appendChild(dismiss);
      document.body.appendChild(ribbon);
    }
    (ribbon.firstChild as HTMLElement).textContent =
      `Something went wrong (${errors.length}): ${msg} — your progress is safe.`;
  };
  addEventListener('error', (e) => showErrorRibbon(e.message));
  addEventListener('unhandledrejection', (e: any) => showErrorRibbon(String(e.reason?.message || e.reason)));

  if (!registry.manifest) {
    document.getElementById('app')!.innerHTML =
      '<div class="boot-error"><strong>Could not load course data.</strong> ' +
      'Make sure the whole “Signals Companion” folder was copied (index.html needs the app/ and data/ folders beside it).</div>';
    return;
  }

  const store = new Store();
  const router = new Router();
  applyAppearance(store);
  watchSystemTheme(() => router.dispatch());
  const { main } = buildFrame(registry, store, router);
  const app: App = { registry, store, router, main };
  live.app = app;

  if (store.bootNote) showErrorRibbon(store.bootNote);

  router
    .on('today', () => renderToday(app))
    .on('concept', (p) => renderConcept(app, p.id, p.facet))
    .on('module', (p) => renderModule(app, +p.num))
    .on('review', () => renderReview(app))
    .on('exam', () => renderExam(app))
    .on('atlas', () => renderAtlas(app))
    .on('formulas', () => renderFormulas(app))
    .on('settings', () => renderSettings(app))
    .otherwise(() => renderNotFound(app));

  store.subscribe(() => refreshSidebar(app));
  initSearchOverlay(app);
  router.start();
}

if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot);
else boot();
