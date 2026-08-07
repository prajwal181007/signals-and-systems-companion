// Widget lifecycle host. Every widget mounts inside an error boundary; a dead
// widget shows a quiet fallback and can never kill the page. Widgets mount
// lazily on approach and pause off-screen — idle pages run zero timers.
import type { App } from './main';
import { el } from './ui/dom';

export interface WidgetHandle {
  setParams?(p: Record<string, any>): void;
  pause?(): void;
  resume?(): void;
  destroy?(): void;
  getState?(): Record<string, any>;
}

interface Mounted { handle: WidgetHandle | null; root: HTMLElement; def: any; visible: boolean }

export class WidgetHost {
  private mounted = new Map<string, Mounted>();
  private io: IntersectionObserver | null = null;
  private app: App;

  constructor(app: App) {
    this.app = app;
    this.onVisibility = this.onVisibility.bind(this);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  // Scan container for slots, wrap them in widget frames, arm lazy mounting.
  activate(container: HTMLElement, widgetDefs: any[], conceptId: string) {
    const defs = new Map(widgetDefs.map((w) => [w.id, w]));
    const slots = container.querySelectorAll('[data-widget-slot]');
    const targets: HTMLElement[] = [];
    slots.forEach((slot) => {
      const id = (slot as HTMLElement).dataset.widgetSlot!;
      const def = defs.get(id);
      if (!def) return;
      const frame = el('div', { class: 'widget', dataset: { widgetFrame: id } },
        el('div', { class: 'widget-title' }, el('span', {}, def.title || def.type)),
        el('div', { class: 'widget-body' }, el('div', { class: 'widget-failed' }, 'loading…')));
      slot.replaceWith(frame);
      this.mounted.set(id, { handle: null, root: frame, def: { ...def, conceptId }, visible: false });
      targets.push(frame);
    });
    if (typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.widgetFrame!;
          const m = this.mounted.get(id);
          if (!m) continue;
          m.visible = e.isIntersecting;
          if (e.isIntersecting) {
            if (!m.handle) this.mount(id);
            else m.handle.resume?.();
          } else {
            m.handle?.pause?.();
          }
        }
      }, { rootMargin: '250px' });
      targets.forEach((t) => this.io!.observe(t));
    } else {
      // Ancient fallback: mount everything eagerly.
      [...this.mounted.keys()].forEach((id) => this.mount(id));
    }
  }

  private mount(id: string) {
    const m = this.mounted.get(id);
    if (!m || m.handle) return;
    const type = this.app.registry.widgetTypes.get(m.def.type);
    const body = m.root.querySelector('.widget-body') as HTMLElement;
    if (!type) {
      body.innerHTML = '';
      body.appendChild(el('div', { class: 'widget-failed' }, `interactive "${m.def.type}" is not available — the explanation continues below`));
      return;
    }
    try {
      body.innerHTML = '';
      m.handle = type.create(body, m.def.params || {}, {
        app: this.app,
        def: m.def,
        presets: m.def.presets || [],
      }) || {};
      if (!m.visible) m.handle!.pause?.();
    } catch (err) {
      console.error(`widget ${id} failed to mount`, err);
      body.innerHTML = '';
      body.appendChild(el('div', { class: 'widget-failed' }, 'This interactive hit an error — the content continues below.'));
    }
  }

  setParams(id: string, params: Record<string, any>) {
    const m = this.mounted.get(id);
    if (m && !m.handle) this.mount(id);
    this.mounted.get(id)?.handle?.setParams?.(params);
  }

  scrollToWidget(id: string) {
    this.mounted.get(id)?.root.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private onVisibility() {
    for (const m of this.mounted.values()) {
      if (document.hidden) m.handle?.pause?.();
      else if (m.visible) m.handle?.resume?.();
    }
  }

  destroy() {
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.io?.disconnect();
    for (const m of this.mounted.values()) {
      try { m.handle?.destroy?.(); } catch (e) { console.error(e); }
    }
    this.mounted.clear();
  }
}

// One live host at a time (per page); the router swaps it on navigation.
let current: WidgetHost | null = null;
export function newWidgetHost(app: App): WidgetHost {
  current?.destroy();
  current = new WidgetHost(app);
  return current;
}
