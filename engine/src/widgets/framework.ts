// Widget framework: registration, control builders, prediction prompts,
// widget-state store for quiz predicates.

const SC = () => (window as any).SC;

export interface WidgetCtx { app: any; def: any; presets: any[] }
export interface WidgetHandleOut {
  setParams?(p: Record<string, any>): void;
  pause?(): void;
  resume?(): void;
  destroy?(): void;
  getState?(): Record<string, any>;
}

const liveStates = new Map<string, () => Record<string, any>>();

export function defineWidget(name: string, create: (el: HTMLElement, params: any, ctx: WidgetCtx) => WidgetHandleOut) {
  SC().register('widgetType', {
    name,
    create(el: HTMLElement, params: any, ctx: WidgetCtx) {
      const handle = create(el, params, ctx);
      const key = ctx.def.conceptId + '#' + ctx.def.id;
      if (handle.getState) liveStates.set(key, handle.getState.bind(handle));
      const origDestroy = handle.destroy?.bind(handle);
      handle.destroy = () => { liveStates.delete(key); origDestroy?.(); };
      return handle;
    },
  });
}

// Quiz "widget-state" items evaluate an authored predicate over the widget's
// serialized state. Predicates are trusted content (authored at build time).
(window as any).SC = (window as any).SC || {};
(window as any).SC.evalWidgetPredicate = (widgetRef: string, predicate: string): boolean | null => {
  // widgetRef may be "conceptId#widgetId" or bare widgetId (resolved on page)
  let getter = liveStates.get(widgetRef);
  if (!getter) {
    for (const [k, g] of liveStates) if (k.endsWith('#' + widgetRef)) { getter = g; break; }
  }
  if (!getter) return null;
  try {
    const state = getter();
    return !!new Function('s', `return (${predicate});`)(state);
  } catch (e) {
    console.error('predicate failed', e);
    return null;
  }
};

// ---------------- control builders ----------------
export function controls(): HTMLElement {
  const d = document.createElement('div');
  d.className = 'widget-controls';
  return d;
}

export function slider(
  label: string, min: number, max: number, step: number, value: number,
  onInput: (v: number) => void, fmt: (v: number) => string = (v) => String(Math.round(v * 100) / 100),
): { el: HTMLElement; set: (v: number) => void; get: () => number } {
  const wrap = document.createElement('div');
  wrap.className = 'wctl';
  const lab = document.createElement('label');
  const name = document.createElement('span');
  name.textContent = label;
  const val = document.createElement('span');
  val.className = 'val';
  val.textContent = fmt(value);
  lab.append(name, val);
  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(min); input.max = String(max); input.step = String(step); input.value = String(value);
  input.addEventListener('input', () => {
    const v = parseFloat(input.value);
    val.textContent = fmt(v);
    onInput(v);
  });
  wrap.append(lab, input);
  return {
    el: wrap,
    set: (v) => { input.value = String(v); val.textContent = fmt(v); },
    get: () => parseFloat(input.value),
  };
}

export function select(label: string, options: Array<[string, string]>, value: string, onChange: (v: string) => void): { el: HTMLElement; set: (v: string) => void } {
  const wrap = document.createElement('div');
  wrap.className = 'wctl';
  const lab = document.createElement('label');
  lab.innerHTML = `<span>${label}</span>`;
  const sel = document.createElement('select');
  for (const [v, text] of options) {
    const o = document.createElement('option');
    o.value = v; o.textContent = text;
    sel.appendChild(o);
  }
  sel.value = value;
  sel.addEventListener('change', () => onChange(sel.value));
  wrap.append(lab, sel);
  return { el: wrap, set: (v) => { sel.value = v; } };
}

export function button(text: string, onClick: () => void, primary = false): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'btn' + (primary ? ' btn-primary' : '');
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
}

export function buttonRow(...btns: HTMLElement[]): HTMLElement {
  const d = document.createElement('div');
  d.style.cssText = 'display:flex;gap:.5rem;flex-wrap:wrap;align-items:center';
  d.append(...btns);
  return d;
}

// Play/pause/step/scrub cluster — every animation is student-paced.
export function playControls(opts: {
  min: number; max: number; step: number; value: number;
  onScrub: (v: number) => void; speed?: number;
}): { el: HTMLElement; get: () => number; set: (v: number) => void; playing: () => boolean; stop: () => void; tick: (dtMs: number) => void } {
  let playing = false;
  let v = opts.value;
  const s = slider('t', opts.min, opts.max, opts.step, opts.value, (x) => { v = x; opts.onScrub(x); });
  s.el.style.minWidth = '14rem';
  const play = button('▶', () => { playing = !playing; play.textContent = playing ? '⏸' : '▶'; });
  const stepBtn = button('step', () => { setV(Math.min(opts.max, v + opts.step * 8)); });
  const reset = button('↺', () => { setV(opts.min); });
  const setV = (x: number) => { v = x; s.set(x); opts.onScrub(x); };
  const wrap = buttonRow(play, stepBtn, reset, s.el);
  return {
    el: wrap,
    get: () => v,
    set: setV,
    playing: () => playing,
    stop: () => { playing = false; play.textContent = '▶'; },
    tick: (dtMs: number) => {
      if (!playing) return;
      const next = v + (opts.speed || (opts.max - opts.min) / 6) * (dtMs / 1000);
      if (next >= opts.max) { setV(opts.max); playing = false; play.textContent = '▶'; }
      else setV(next);
    },
  };
}

// Inline prediction prompt: commit-before-reveal, logged, never graded.
// Widget controls stay locked until commitment (or explicit "no idea").
export function predictGate(container: HTMLElement, conceptKey: string, question: string, choices: string[], answerNote: string, onDone: () => void) {
  const store = SC().app?.store;
  const key = 'w:' + conceptKey;
  if (store?.state.predictions[key]) { onDone(); return; }
  const box = document.createElement('div');
  box.style.cssText = 'border-left:2px solid var(--accent);padding-left:1.2rem;margin:1.2rem 0';
  box.innerHTML = `<div style="font-weight:600;margin-bottom:.4rem">Predict first</div><div class="prose">${question}</div>`;
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;flex-direction:column;gap:.35rem;margin-top:.5rem';
  const commit = (i: number | null) => {
    store?.update((st: any) => { st.predictions[key] = { given: i, at: new Date().toISOString() }; });
    box.innerHTML = `<div><strong>Locked in.</strong> ${answerNote}</div>`;
    setTimeout(() => { box.remove(); onDone(); }, 900);
  };
  choices.forEach((c, i) => {
    const b = button(c, () => commit(i));
    b.style.cssText = 'justify-content:flex-start;text-align:left';
    row.appendChild(b);
  });
  const skip = button('I genuinely have no idea', () => commit(null));
  skip.className = 'btn btn-quiet';
  row.appendChild(skip);
  box.appendChild(row);
  container.appendChild(box);
}

export function annotation(text: string): HTMLElement {
  const d = document.createElement('div');
  d.className = 'muted';
  d.style.cssText = 'margin:.3rem 0;font-size:.83rem';
  d.innerHTML = text;
  return d;
}

export function readout(): { el: HTMLElement; set: (html: string) => void } {
  const d = document.createElement('div');
  d.style.cssText = 'font-family:var(--mono);font-size:.82rem;color:var(--ink-soft);margin:.25rem 0;min-height:1.2em';
  return { el: d, set: (html) => { d.innerHTML = html; } };
}
