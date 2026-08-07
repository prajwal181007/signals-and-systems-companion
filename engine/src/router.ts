// Hash routing only — history.pushState throws SecurityError on file:// in
// Chromium. Hash URLs double as copy-pasteable bookmarks into specific facets:
//   #/c/m1/convolution@derivation      concept, scrolled to a facet
//   #/review   #/exam   #/atlas   #/formulas   #/settings   #/          (today)

export interface Route { view: string; params: Record<string, string> }

export function parseHash(hash: string): Route {
  const h = (hash || '#/').replace(/^#\/?/, '');
  if (!h) return { view: 'today', params: {} };
  const [pathPart, query = ''] = h.split('?');
  const params: Record<string, string> = {};
  for (const kv of query.split('&')) {
    if (!kv) continue;
    const [k, v] = kv.split('=');
    params[decodeURIComponent(k)] = decodeURIComponent(v || '');
  }
  const segs = pathPart.split('/');
  if (segs[0] === 'c' && segs.length >= 3) {
    let rest = segs.slice(1).join('/');
    let facet = '';
    const at = rest.indexOf('@');
    if (at >= 0) { facet = rest.slice(at + 1); rest = rest.slice(0, at); }
    return { view: 'concept', params: { ...params, id: rest, facet } };
  }
  if (segs[0] === 'm' && segs[1]) return { view: 'module', params: { ...params, num: segs[1] } };
  const known = ['today', 'review', 'practice', 'exam', 'atlas', 'formulas', 'settings', 'search'];
  if (known.includes(segs[0])) return { view: segs[0], params: { ...params, arg: segs.slice(1).join('/') } };
  return { view: 'today', params: {} };
}

export class Router {
  private handlers = new Map<string, (params: Record<string, string>) => void>();
  private fallback: ((r: Route) => void) | null = null;
  current: Route = { view: 'today', params: {} };

  on(view: string, fn: (params: Record<string, string>) => void) { this.handlers.set(view, fn); return this; }
  otherwise(fn: (r: Route) => void) { this.fallback = fn; return this; }

  start() {
    addEventListener('hashchange', () => this.dispatch());
    this.dispatch();
  }
  go(hash: string) {
    if (location.hash === hash) this.dispatch();
    else location.hash = hash;
  }
  dispatch() {
    this.current = parseHash(location.hash);
    const h = this.handlers.get(this.current.view);
    try {
      if (h) h(this.current.params);
      else this.fallback?.(this.current);
    } catch (e) {
      console.error('route render failed', e);
      this.fallback?.(this.current);
    }
  }
}

export const conceptHash = (id: string, facet?: string) => `#/c/${id}${facet ? '@' + facet : ''}`;
