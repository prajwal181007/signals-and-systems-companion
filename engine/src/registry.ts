// Runtime data registry. Data files are classic scripts that call
// SC.register(kind, payload) — the only local-read primitive that works on
// file:// in every browser. Lazy loads happen via <script> injection.

export type Concept = any;

export class Registry {
  manifest: any = null;
  searchIndex: any = null;
  concepts = new Map<string, Concept>();
  widgetTypes = new Map<string, any>();
  private loading = new Map<string, Promise<void>>();
  private cssReady = new Set<string>();
  private cssWaiters: Array<() => void> = [];

  register(kind: string, payload: any) {
    if (kind === 'manifest') this.manifest = payload;
    else if (kind === 'searchIndex') this.searchIndex = payload;
    else if (kind === 'concept') this.concepts.set(payload.id, payload);
    else if (kind === 'widgetType') this.widgetTypes.set(payload.name, payload);
    else console.warn('unknown register kind', kind);
  }

  markCssReady(name: string) {
    this.cssReady.add(name);
    this.cssWaiters.splice(0).forEach((fn) => fn());
  }

  whenCssReady(name: string): Promise<void> {
    if (this.cssReady.has(name)) return Promise.resolve();
    // Belt & braces: if the preload onload never fired (e.g. cached edge cases),
    // check for an applied stylesheet after a beat, then give up gracefully —
    // math still renders, just in fallback fonts, and we retry the swap.
    return new Promise((resolve) => {
      this.cssWaiters.push(resolve);
      setTimeout(() => {
        const link = document.querySelector('link[href$="katex.css"]') as HTMLLinkElement | null;
        if (link && link.rel !== 'stylesheet') link.rel = 'stylesheet';
        resolve();
      }, 1500);
    });
  }

  conceptMeta(id: string) {
    return this.manifest?.concepts.find((c: any) => c.id === id) || null;
  }

  loadConcept(id: string): Promise<Concept> {
    if (this.concepts.has(id)) return Promise.resolve(this.concepts.get(id));
    const slug = id.replace(/\//g, '--');
    if (!this.loading.has(slug)) {
      this.loading.set(slug, injectScript(`data/concepts/${slug}.js`).finally(() => this.loading.delete(slug)));
    }
    return this.loading.get(slug)!.then(() => {
      const c = this.concepts.get(id);
      if (!c) throw new Error(`concept data for "${id}" did not register`);
      return c;
    });
  }
}

export function injectScript(src: string): Promise<void> {
  // Version-stamp lazy loads too — a replaced app folder must never be
  // shadowed by cached concept data from a previous build.
  const v = (window as any).__SC_BUILD;
  if (v) src += (src.includes('?') ? '&' : '?') + 'v=' + v;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    const timer = setTimeout(() => {
      s.remove();
      reject(new Error(`timeout loading ${src}`));
    }, 10000);
    s.onload = () => { clearTimeout(timer); resolve(); };
    s.onerror = () => { clearTimeout(timer); s.remove(); reject(new Error(`failed to load ${src}`)); };
    s.src = src;
    document.head.appendChild(s);
  });
}
