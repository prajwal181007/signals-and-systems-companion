// sigplot — purpose-built Canvas-2D plotting kernel. One visual language for
// the whole app: CT traces, DT stems, complex planes, log axes, shaded regions.
// DPR-aware, deterministic teardown, zero dependencies.

export interface AxisSpec { min: number; max: number; log?: boolean; label?: string }
export interface PlotOpts {
  x: AxisSpec; y: AxisSpec;
  height?: number;                 // CSS px; width tracks container
  grid?: boolean;
  complexPlane?: boolean;          // square aspect, axes through origin, unit-circle helper
  title?: string;
}

// Trace colours CARRY INFORMATION and are stable app-wide: 0 = the primary
// signal (the app's one accent blue), 1 = the sliding/secondary object
// (amber — τ, by convention), 2 = the result (green). Everything else in the
// plot chrome is monochrome: hairline grid, grey axes, grey text.
// One theme: light ground, always (the design's home; no auto-dark variant).
export const palette = () => ({
  bg: 'transparent',
  grid: 'rgba(0,0,0,.05)',
  axis: 'rgba(0,0,0,.30)',
  text: '#6b6f75',
  traces: ['#2451cc', '#9a6700', '#177245', '#82868c', '#b3261e', '#5c626a'],
  fill: 'rgba(36,81,204,.09)',
  fillWarm: 'rgba(154,103,0,.11)',
  good: '#177245',
  bad: '#b3261e',
});

export class Plot {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  opts: PlotOpts;
  w = 0; h = 0;                    // CSS px
  pad = { l: 44, r: 10, t: 8, b: 26 };
  private ro: ResizeObserver | null = null;

  constructor(container: HTMLElement, opts: PlotOpts) {
    this.opts = opts;
    if (opts.title) this.pad.t = 20; // room so the title never collides with tick labels
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `display:block;width:100%;height:${opts.height || 180}px;touch-action:none`;
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    if (typeof ResizeObserver !== 'undefined') {
      // ResizeObserver always fires once on observe — resizing the backing
      // store WIPES the canvas, so skip no-op fires or the first draw is lost.
      this.ro = new ResizeObserver(() => {
        const rect = this.canvas.getBoundingClientRect();
        if (Math.abs(rect.width - this.w) < 1) return;
        this.resize();
        this.onResize?.();
      });
      this.ro.observe(this.canvas);
    }
  }
  onResize: (() => void) | null = null;

  destroy() { this.ro?.disconnect(); this.canvas.remove(); }

  resize() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const rect = this.canvas.getBoundingClientRect();
    this.w = Math.max(80, rect.width);
    this.h = this.opts.height || 180;
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---------------- coordinate mapping ----------------
  private lx(v: number, a: AxisSpec) { return a.log ? Math.log10(Math.max(v, 1e-140)) : v; }
  toX(v: number): number {
    const a = this.opts.x;
    const [m0, m1] = [this.lx(a.min, a), this.lx(a.max, a)];
    return this.pad.l + ((this.lx(v, a) - m0) / (m1 - m0)) * (this.w - this.pad.l - this.pad.r);
  }
  toY(v: number): number {
    const a = this.opts.y;
    const [m0, m1] = [this.lx(a.min, a), this.lx(a.max, a)];
    return this.h - this.pad.b - ((this.lx(v, a) - m0) / (m1 - m0)) * (this.h - this.pad.t - this.pad.b);
  }
  fromX(px: number): number {
    const a = this.opts.x;
    const [m0, m1] = [this.lx(a.min, a), this.lx(a.max, a)];
    const v = m0 + ((px - this.pad.l) / (this.w - this.pad.l - this.pad.r)) * (m1 - m0);
    return a.log ? Math.pow(10, v) : v;
  }
  fromY(py: number): number {
    const a = this.opts.y;
    const [m0, m1] = [this.lx(a.min, a), this.lx(a.max, a)];
    const v = m0 + ((this.h - this.pad.b - py) / (this.h - this.pad.t - this.pad.b)) * (m1 - m0);
    return a.log ? Math.pow(10, v) : v;
  }

  setXRange(min: number, max: number) { this.opts.x.min = min; this.opts.x.max = max; }
  setYRange(min: number, max: number) { this.opts.y.min = min; this.opts.y.max = max; }

  // ---------------- frame ----------------
  begin() {
    const p = palette();
    this.ctx.clearRect(0, 0, this.w, this.h);
    if (this.opts.grid !== false) this.drawGrid();
    if (this.opts.title) {
      this.ctx.fillStyle = p.text;
      this.ctx.font = '600 11px -apple-system, sans-serif';
      this.ctx.fillText(this.opts.title, this.pad.l, this.pad.t + 4);
    }
  }

  private niceTicks(a: AxisSpec, count: number): number[] {
    if (a.log) {
      const ticks: number[] = [];
      const d0 = Math.ceil(Math.log10(a.min)), d1 = Math.floor(Math.log10(a.max));
      for (let d = d0; d <= d1; d++) ticks.push(Math.pow(10, d));
      return ticks;
    }
    const span = a.max - a.min;
    const step0 = span / count;
    const mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count + 1) || mag * 10;
    const ticks: number[] = [];
    for (let v = Math.ceil(a.min / step) * step; v <= a.max + 1e-12; v += step) ticks.push(Math.abs(v) < step / 1e6 ? 0 : v);
    return ticks;
  }

  drawGrid() {
    const { ctx } = this;
    const p = palette();
    const cp = this.opts.complexPlane;
    ctx.font = '10px -apple-system, sans-serif';
    for (const t of this.niceTicks(this.opts.x, Math.max(3, this.w / 90))) {
      const px = this.toX(t);
      ctx.strokeStyle = p.grid;
      ctx.beginPath(); ctx.moveTo(px, this.pad.t); ctx.lineTo(px, this.h - this.pad.b); ctx.stroke();
      ctx.fillStyle = p.text;
      ctx.textAlign = 'center';
      ctx.fillText(fmtTick(t, this.opts.x.log), px, this.h - this.pad.b + 14);
    }
    for (const t of this.niceTicks(this.opts.y, Math.max(3, this.h / 45))) {
      const py = this.toY(t);
      ctx.strokeStyle = p.grid;
      ctx.beginPath(); ctx.moveTo(this.pad.l, py); ctx.lineTo(this.w - this.pad.r, py); ctx.stroke();
      ctx.fillStyle = p.text;
      ctx.textAlign = 'right';
      ctx.fillText(fmtTick(t, this.opts.y.log), this.pad.l - 5, py + 3);
    }
    // axes through zero
    ctx.strokeStyle = p.axis;
    ctx.lineWidth = 1;
    if (this.opts.y.min < 0 && this.opts.y.max > 0) {
      const py = this.toY(0);
      ctx.beginPath(); ctx.moveTo(this.pad.l, py); ctx.lineTo(this.w - this.pad.r, py); ctx.stroke();
    }
    if (this.opts.x.min < 0 && this.opts.x.max > 0) {
      const px = this.toX(0);
      ctx.beginPath(); ctx.moveTo(px, this.pad.t); ctx.lineTo(px, this.h - this.pad.b); ctx.stroke();
    }
    if (cp) {
      // unit circle for z-plane style plots
      ctx.strokeStyle = p.axis;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const r = Math.abs(this.toX(1) - this.toX(0));
      ctx.arc(this.toX(0), this.toY(0), r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // axis labels
    ctx.fillStyle = p.text;
    ctx.textAlign = 'right';
    if (this.opts.x.label) ctx.fillText(this.opts.x.label, this.w - this.pad.r, this.h - 6);
    if (this.opts.y.label) { ctx.textAlign = 'left'; ctx.fillText(this.opts.y.label, 4, this.pad.t + 4); }
  }

  // ---------------- marks ----------------
  trace(xs: ArrayLike<number>, ys: ArrayLike<number>, o: { color?: string; width?: number; dash?: number[]; alpha?: number; clipY?: number } = {}) {
    const { ctx } = this;
    const p = palette();
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.pad.l, this.pad.t, this.w - this.pad.l - this.pad.r, this.h - this.pad.t - this.pad.b);
    ctx.clip();
    ctx.strokeStyle = o.color || p.traces[0];
    ctx.lineWidth = o.width || 1.8;
    ctx.globalAlpha = o.alpha ?? 1;
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath();
    let started = false;
    const cap = o.clipY ?? 1e6;
    for (let i = 0; i < xs.length; i++) {
      const yv = Math.max(-cap, Math.min(cap, ys[i]));
      if (!isFinite(yv)) { started = false; continue; }
      const px = this.toX(xs[i]), py = this.toY(yv);
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  stems(xs: ArrayLike<number>, ys: ArrayLike<number>, o: { color?: string; alpha?: number; radius?: number } = {}) {
    const { ctx } = this;
    const p = palette();
    const y0 = this.toY(Math.max(this.opts.y.min, Math.min(this.opts.y.max, 0)));
    ctx.save();
    ctx.strokeStyle = ctx.fillStyle = o.color || p.traces[0];
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.lineWidth = 1.6;
    for (let i = 0; i < xs.length; i++) {
      const px = this.toX(xs[i]), py = this.toY(ys[i]);
      if (px < this.pad.l - 2 || px > this.w - this.pad.r + 2) continue;
      ctx.beginPath(); ctx.moveTo(px, y0); ctx.lineTo(px, py); ctx.stroke();
      ctx.beginPath(); ctx.arc(px, py, o.radius || 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // Shaded area between curve and zero (the "signed area" story of integrals).
  areaUnder(xs: ArrayLike<number>, ys: ArrayLike<number>, color?: string) {
    const { ctx } = this;
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.pad.l, this.pad.t, this.w - this.pad.l - this.pad.r, this.h - this.pad.t - this.pad.b);
    ctx.clip();
    ctx.fillStyle = color || palette().fill;
    ctx.beginPath();
    const y0 = this.toY(0);
    ctx.moveTo(this.toX(xs[0]), y0);
    for (let i = 0; i < xs.length; i++) ctx.lineTo(this.toX(xs[i]), this.toY(ys[i]));
    ctx.lineTo(this.toX(xs[xs.length - 1]), y0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  regionX(x0: number, x1: number, color: string) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = color;
    const a = Math.max(this.pad.l, Math.min(this.toX(x0), this.toX(x1)));
    const b = Math.min(this.w - this.pad.r, Math.max(this.toX(x0), this.toX(x1)));
    ctx.fillRect(a, this.pad.t, b - a, this.h - this.pad.t - this.pad.b);
    ctx.restore();
  }

  marker(x: number, y: number, o: { shape?: 'x' | 'o' | 'dot'; color?: string; size?: number; label?: string } = {}) {
    const { ctx } = this;
    const p = palette();
    const px = this.toX(x), py = this.toY(y);
    const s = o.size || 5;
    ctx.save();
    ctx.strokeStyle = ctx.fillStyle = o.color || p.traces[0];
    ctx.lineWidth = 2;
    if (o.shape === 'x') {
      ctx.beginPath();
      ctx.moveTo(px - s, py - s); ctx.lineTo(px + s, py + s);
      ctx.moveTo(px - s, py + s); ctx.lineTo(px + s, py - s);
      ctx.stroke();
    } else if (o.shape === 'o') {
      ctx.beginPath(); ctx.arc(px, py, s, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(px, py, s - 1, 0, Math.PI * 2); ctx.fill();
    }
    if (o.label) {
      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillStyle = p.text;
      ctx.textAlign = 'left';
      ctx.fillText(o.label, px + s + 3, py - s);
    }
    ctx.restore();
  }

  vline(x: number, o: { color?: string; dash?: number[]; label?: string } = {}) {
    const { ctx } = this;
    const p = palette();
    const px = this.toX(x);
    if (px < this.pad.l || px > this.w - this.pad.r) return;
    ctx.save();
    ctx.strokeStyle = o.color || p.axis;
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(px, this.pad.t); ctx.lineTo(px, this.h - this.pad.b); ctx.stroke();
    if (o.label) {
      ctx.fillStyle = o.color || p.text;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(o.label, px + 4, this.pad.t + 10);
    }
    ctx.restore();
  }

  hline(y: number, o: { color?: string; dash?: number[]; label?: string } = {}) {
    const { ctx } = this;
    const p = palette();
    const py = this.toY(y);
    if (py < this.pad.t || py > this.h - this.pad.b) return;
    ctx.save();
    ctx.strokeStyle = o.color || p.axis;
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(this.pad.l, py); ctx.lineTo(this.w - this.pad.r, py); ctx.stroke();
    if (o.label) {
      ctx.fillStyle = o.color || p.text;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(o.label, this.w - this.pad.r - 3, py - 4);
    }
    ctx.restore();
  }

  label(x: number, y: number, text: string, o: { color?: string; align?: CanvasTextAlign } = {}) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = o.color || palette().text;
    ctx.font = '11px -apple-system, sans-serif';
    ctx.textAlign = o.align || 'left';
    ctx.fillText(text, this.toX(x), this.toY(y));
    ctx.restore();
  }
}

function fmtTick(v: number, log?: boolean): string {
  if (log) {
    const e = Math.round(Math.log10(v));
    return e >= -2 && e <= 3 ? String(v) : `1e${e}`;
  }
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1000 || a < 0.01) return v.toExponential(0);
  return String(Math.round(v * 100) / 100);
}

// ---------------- shared animation scheduler ----------------
// One rAF loop owns all animation; widgets register tick callbacks. Paused
// widgets consume zero callbacks; an idle page runs zero timers.
type Tick = (dtMs: number) => void;
class Scheduler {
  private ticks = new Map<object, Tick>();
  private running = false;
  private last = 0;
  add(key: object, fn: Tick) {
    this.ticks.set(key, fn);
    if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame(this.loop); }
  }
  remove(key: object) { this.ticks.delete(key); }
  private loop = (now: number) => {
    if (this.ticks.size === 0) { this.running = false; return; }
    const dt = Math.min(100, now - this.last);
    this.last = now;
    for (const fn of this.ticks.values()) {
      try { fn(dt); } catch (e) { console.error('tick error', e); }
    }
    requestAnimationFrame(this.loop);
  };
}
export const scheduler = new Scheduler();

// ---------------- drag helper ----------------
export function attachDrag(
  plot: Plot,
  hit: (x: number, y: number, pxTol: number) => string | null,
  move: (id: string, x: number, y: number) => void,
  end?: () => void,
) {
  let active: string | null = null;
  const canvas = plot.canvas;
  const toXY = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: plot.fromX(e.clientX - r.left), y: plot.fromY(e.clientY - r.top) };
  };
  const down = (e: PointerEvent) => {
    const { x, y } = toXY(e);
    const pxTol = Math.abs(plot.fromX(12) - plot.fromX(0));
    active = hit(x, y, pxTol);
    if (active) { canvas.setPointerCapture(e.pointerId); e.preventDefault(); }
  };
  const moveEv = (e: PointerEvent) => {
    if (!active) return;
    const { x, y } = toXY(e);
    move(active, x, y);
    e.preventDefault();
  };
  const up = () => { if (active) { active = null; end?.(); } };
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', moveEv);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  return () => {
    canvas.removeEventListener('pointerdown', down);
    canvas.removeEventListener('pointermove', moveEv);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointercancel', up);
  };
}
