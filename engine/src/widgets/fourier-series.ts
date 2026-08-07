// ★ HERO: Fourier Series Builder — three linked representations of one partial
// sum: time reconstruction, coefficient spectrum (click a stem to solo that
// harmonic), and a Gibbs magnifier evaluated on an adaptive fine grid so what
// you see at any zoom is genuinely Gibbs, not pixels.
// Coefficients are analytic (closed forms) — exactness is pedagogy.
import { defineWidget, controls, slider, select, annotation, readout, button, buttonRow } from './framework';
import { Plot, palette } from '../sigplot/plot';

// Targets on period T=2π, described by their exact FS: x(t) = Σ aₖcos(kt) + bₖsin(kt).
// Closed forms (standard results, Oppenheim §3.3):
interface Target {
  label: string;
  f: (t: number) => number;
  a: (k: number) => number;      // cos coeffs, k ≥ 0 (a(0) = DC)
  b: (k: number) => number;      // sin coeffs, k ≥ 1
  jump: number | null;           // location of a discontinuity for the Gibbs zoom
  decay: string;                 // headline law
  symmetry: string;
}
const T2 = 2 * Math.PI;
const sq = (t: number) => (((t % T2) + T2) % T2 < Math.PI ? 1 : -1);
const saw = (t: number) => {
  const u = ((t % T2) + T2) % T2;
  return u / Math.PI - 1;
};
const tri = (t: number) => {
  const u = ((t % T2) + T2) % T2;
  return u < Math.PI ? -1 + (2 * u) / Math.PI : 3 - (2 * u) / Math.PI;
};
const halfsin = (t: number) => Math.max(0, Math.sin(t));

const TARGETS: Record<string, Target> = {
  square: {
    label: 'square wave', f: sq,
    a: () => 0,
    b: (k) => (k % 2 === 1 ? 4 / (Math.PI * k) : 0),
    jump: Math.PI, decay: 'odd harmonics only, falling as 1/k — a jump costs you slow decay',
    symmetry: 'odd + half-wave symmetric ⇒ only odd sine harmonics survive',
  },
  triangle: {
    label: 'triangle wave', f: tri,
    a: () => 0,
    b: (k) => (k % 2 === 1 ? (8 / (Math.PI * Math.PI * k * k)) * (k % 4 === 1 ? 1 : -1) : 0),
    jump: null, decay: 'continuous (corner, not jump) ⇒ coefficients fall as 1/k² — smoothness buys decay',
    symmetry: 'odd + half-wave symmetric ⇒ only odd sine harmonics',
  },
  sawtooth: {
    label: 'sawtooth', f: saw,
    a: () => 0,
    b: (k) => -2 / (Math.PI * k) * (k % 2 === 0 ? 1 : -1) * -1,
    jump: 0, decay: 'every harmonic present, falling as 1/k',
    symmetry: 'odd ⇒ sines only',
  },
  halfsin: {
    label: 'half-rectified sine', f: halfsin,
    a: (k) => (k === 0 ? 1 / Math.PI : k === 1 ? 0 : k % 2 === 0 ? -2 / (Math.PI * (k * k - 1)) : 0),
    b: (k) => (k === 1 ? 0.5 : 0),
    jump: null, decay: 'DC + fundamental sine + even cosines falling as 1/k²',
    symmetry: 'neither even nor odd — both families appear (and a DC term: the average is 1/π)',
  },
};

defineWidget('FourierSeriesBuilder', (root, params) => {
  let targetName = params.target || 'square';
  let N = params.n ?? 5;
  let solo: number | null = null;   // clicked harmonic
  let shift = 0;                    // time-shift property demo
  let logSpec = false;

  root.appendChild(annotation(
    'Build a waveform out of pure tones. <b>Click a spectrum stem</b> to hear out one harmonic on its own; ' +
    'the magnifier tracks the discontinuity — watch what the overshoot does (and doesn’t do) as N grows.'));

  const paneTime = document.createElement('div');
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const paneSpec = document.createElement('div');
  const paneZoom = document.createElement('div');
  paneSpec.style.cssText = 'flex:2;min-width:16rem';
  paneZoom.style.cssText = 'flex:1;min-width:11rem';
  row.append(paneSpec, paneZoom);
  root.append(paneTime, row);

  const time = new Plot(paneTime, { x: { min: -T2, max: T2, label: 't' }, y: { min: -1.7, max: 1.7 }, height: 180 });
  const spec = new Plot(paneSpec, { x: { min: 0, max: 41, label: 'harmonic k' }, y: { min: 0, max: 1.4 }, height: 140, title: '|cₖ| — magnitude spectrum' });
  const zoom = new Plot(paneZoom, { x: { min: 0, max: 1, label: '' }, y: { min: 0.75, max: 1.35 }, height: 140, title: 'Gibbs magnifier' });
  const info = readout();
  root.appendChild(info.el);

  const tgt = () => TARGETS[targetName];

  function partialSum(t: number, n: number): number {
    const g = tgt();
    let s = g.a(0);
    for (let k = 1; k <= n; k++) {
      const ph = k * shift;
      const a = g.a(k), b = g.b(k);
      // time shift x(t−t0): aₖ,bₖ rotate together — implemented by evaluating at t−shift
      s += a * Math.cos(k * (t - shift)) + b * Math.sin(k * (t - shift));
    }
    return s;
  }

  function draw() {
    const p = palette();
    const g = tgt();
    // ---- time pane ----
    time.begin();
    const M = 1600;
    const ts = Array.from({ length: M }, (_, i) => -T2 + (2 * T2 * i) / (M - 1));
    time.trace(ts, ts.map((t) => g.f(t - shift)), { color: p.axis, width: 1.2, dash: [4, 3] });
    if (solo != null) {
      const a = g.a(solo), b = g.b(solo);
      time.trace(ts, ts.map((t) => (solo === 0 ? g.a(0) : a * Math.cos(solo * (t - shift)) + b * Math.sin(solo * (t - shift)))), { color: p.traces[1], width: 2 });
      info.set(`harmonic k=${solo} alone: amplitude ${(solo === 0 ? Math.abs(g.a(0)) : Math.hypot(g.a(solo), g.b(solo))).toFixed(3)} — every partial sum is just these pure tones added up`);
    } else {
      time.trace(ts, ts.map((t) => partialSum(t, N)), { color: p.traces[0], width: 2 });
      info.set(`${g.symmetry}. Decay law: ${g.decay}.`);
    }
    // ---- spectrum ----
    const mags: number[] = [];
    for (let k = 0; k <= 40; k++) mags.push(k === 0 ? Math.abs(g.a(0)) : Math.hypot(g.a(k), g.b(k)) / 2 * 2);
    const maxMag = Math.max(...mags, 0.01);
    spec.opts.y.log = logSpec;
    spec.setYRange(logSpec ? Math.max(1e-4, maxMag / 3000) : 0, maxMag * 1.15);
    spec.begin();
    const used = mags.map((m, k) => ({ k, m })).filter((x) => x.m > 1e-9);
    spec.stems(used.map((x) => x.k), used.map((x) => x.m), { color: p.traces[0] });
    // highlight active range
    spec.regionX(-0.5, N + 0.5, p.fill);
    if (solo != null) spec.marker(solo, mags[solo], { shape: 'o', color: p.traces[1], size: 7 });
    // ---- Gibbs zoom ----
    if (g.jump != null && solo == null) {
      const j = g.jump + shift;
      const w = Math.max(0.5 / N, 0.02);
      zoom.setXRange(j - 3 * w, j + 3 * w);
      zoom.setYRange(0.7, 1.35);
      zoom.begin();
      const Z = 900;
      const zts = Array.from({ length: Z }, (_, i) => j - 3 * w + (6 * w * i) / (Z - 1));
      zoom.trace(zts, zts.map((t) => g.f(t - shift)), { color: p.axis, width: 1, dash: [4, 3] });
      zoom.trace(zts, zts.map((t) => partialSum(t, N)), { color: p.traces[0], width: 1.8 });
      zoom.hline(1.0895, { color: p.bad, dash: [2, 3], label: '8.95% — never shrinks' });
      zoom.hline(1, { color: p.axis, dash: [1, 4] });
    } else {
      zoom.begin();
      zoom.label(0.5, 1.05, g.jump == null ? 'no jump — no Gibbs' : 'click ✕ to leave solo', { align: 'center' });
    }
  }

  // click a stem to solo
  spec.canvas.addEventListener('pointerdown', (e) => {
    const r = spec.canvas.getBoundingClientRect();
    const k = Math.round(spec.fromX(e.clientX - r.left));
    const g = tgt();
    const mag = k === 0 ? Math.abs(g.a(0)) : k > 0 ? Math.hypot(g.a(k), g.b(k)) : 0;
    solo = k >= 0 && k <= 40 && mag > 1e-9 && solo !== k ? k : null;
    draw();
  });

  const ctl = controls();
  const tSel = select('target', Object.entries(TARGETS).map(([k, t]) => [k, t.label]), targetName, (v) => { targetName = v; solo = null; draw(); });
  const nCtl = slider('N terms', 1, 60, 1, N, (v) => { N = Math.round(v); solo = null; draw(); }, (v) => String(Math.round(v)));
  const shiftCtl = slider('time shift', 0, Math.PI, 0.01, 0, (v) => { shift = v; draw(); }, (v) => v.toFixed(2));
  const logBtn = button('log |cₖ| (see the decay law)', () => { logSpec = !logSpec; logBtn.textContent = logSpec ? 'linear |cₖ|' : 'log |cₖ| (see the decay law)'; draw(); });
  ctl.append(tSel.el, nCtl.el, shiftCtl.el, buttonRow(logBtn));
  root.appendChild(ctl);
  root.appendChild(annotation(
    'Shift the wave in time and watch the magnitude spectrum <b>not move</b> — only phases tilt. ' +
    'Magnitude says <i>what ingredients</i>; phase says <i>how they line up</i>.'));

  draw();

  return {
    setParams(p: any) {
      if (p.target) { targetName = p.target; tSel.set(p.target); }
      if (typeof p.n === 'number') { N = p.n; nCtl.set(p.n); }
      solo = null;
      draw();
    },
    pause() {},
    resume() { draw(); },
    destroy() { time.destroy(); spec.destroy(); zoom.destroy(); },
    getState() { return { target: targetName, n: N, solo, shift }; },
  };
});
