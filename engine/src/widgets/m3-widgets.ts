// Module 3 widget suite: SPlaneAtlas, ROCExplorer (s & z), ZPlaneAtlas,
// DifferenceEquationMachine.
import { defineWidget, controls, slider, select, annotation, readout, button, buttonRow } from './framework';
import { Plot, palette, attachDrag } from '../sigplot/plot';
import { polyRoots } from '../math/zpk';

// ---------------------------------------------------------------- SPlaneAtlas
defineWidget('SPlaneAtlas', (root, params) => {
  let sigma = params.sigma ?? -0.4, omega = params.omega ?? 2;
  root.appendChild(annotation(
    '<b>Drag the point s = σ + jω.</b> The s-plane is a map of behaviors: left half = dies, right half = explodes, ' +
    'the axis = sustains forever; height = how fast it spins. A conjugate ghost keeps the waveform real. ' +
    'Every pole-zero plot in this course is read through this atlas.'));
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const paneS = document.createElement('div');
  const paneT = document.createElement('div');
  paneS.style.cssText = 'flex:1;min-width:14rem';
  paneT.style.cssText = 'flex:1.4;min-width:16rem';
  row.append(paneS, paneT);
  root.appendChild(row);
  const sp = new Plot(paneS, { x: { min: -2, max: 2, label: 'σ' }, y: { min: -6, max: 6, label: 'jω' }, height: 210, title: 's-plane' });
  const tp = new Plot(paneT, { x: { min: 0, max: 6, label: 't' }, y: { min: -3, max: 3 }, height: 210, title: '2·Re{e^{st}} = 2e^{σt}cos(ωt)' });
  const info = readout();
  root.appendChild(info.el);

  function draw() {
    const p = palette();
    sp.begin();
    sp.regionX(-2, 0, p.grid);
    sp.marker(sigma, omega, { shape: 'dot', color: p.traces[0], size: 6, label: `s = ${sigma.toFixed(2)} + j${omega.toFixed(2)}` });
    if (Math.abs(omega) > 0.01) sp.marker(sigma, -omega, { shape: 'o', color: p.traces[0], size: 5, label: 'conjugate ghost' });
    tp.begin();
    const ts = Array.from({ length: 1200 }, (_, i) => (6 * i) / 1199);
    const y = ts.map((t) => 2 * Math.exp(sigma * t) * Math.cos(omega * t));
    tp.trace(ts, ts.map((t) => 2 * Math.exp(sigma * t)), { color: p.traces[1], width: 1.2, dash: [4, 3], clipY: 20 });
    tp.trace(ts, ts.map((t) => -2 * Math.exp(sigma * t)), { color: p.traces[1], width: 1.2, dash: [4, 3], clipY: 20 });
    tp.trace(ts, y, { color: p.traces[0], width: 2, clipY: 20 });
    const tc = Math.abs(sigma) > 1e-6 ? Math.abs(1 / sigma) : Infinity;
    info.set(`σ = ${sigma.toFixed(2)} → ${sigma < -0.01 ? `decays, time constant 1/|σ| = ${tc.toFixed(2)} s` : sigma > 0.01 ? `GROWS, doubling every ${(0.693 / sigma).toFixed(2)} s` : 'sustains — pure oscillation, forever'} · ω = ${omega.toFixed(2)} → ${Math.abs(omega) < 0.01 ? 'no rotation (real exponential)' : `${(Math.abs(omega) / (2 * Math.PI)).toFixed(2)} cycles/s`}`);
  }
  attachDrag(sp, () => 'pt', (_, x, y) => {
    sigma = Math.max(-2, Math.min(2, x));
    omega = Math.max(-6, Math.min(6, Math.abs(y) < 0.25 ? 0 : y));
    draw();
  });
  draw();
  return {
    setParams(p: any) { if (typeof p.sigma === 'number') sigma = p.sigma; if (typeof p.omega === 'number') omega = p.omega; draw(); },
    resume() { draw(); }, destroy() { sp.destroy(); tp.destroy(); },
    getState() { return { sigma, omega }; },
  };
});

// ---------------------------------------------------------------- ROCExplorer
// σ-slider tames the signal: the integrability verdict paints the ROC stroke by
// stroke. The punchline preset: two different signals, identical X(s).
const ROC_SIGNALS: Record<string, { label: string; f: (t: number) => number; kind: 'right' | 'left' | 'two' | 'growright'; a: number }> = {
  rightexp: { label: 'e^(−t)·u(t)  (right-sided)', f: (t) => (t >= 0 ? Math.exp(-t) : 0), kind: 'right', a: -1 },
  growright: { label: 'e^(+t)·u(t)  (grows!)', f: (t) => (t >= 0 ? Math.exp(t) : 0), kind: 'growright', a: 1 },
  leftexp: { label: '−e^(−t)·u(−t)  (left-sided twin)', f: (t) => (t < 0 ? -Math.exp(-t) : 0), kind: 'left', a: -1 },
  twosided: { label: 'e^(−|t|)  (two-sided)', f: (t) => Math.exp(-Math.abs(t)), kind: 'two', a: -1 },
};

defineWidget('ROCExplorer', (root, params) => {
  let mode: 's' | 'z' = params.mode === 'z' ? 'z' : 's';
  let name = params.signal || 'rightexp';
  let sigma = params.sigma ?? 0.2;
  const painted = new Set<number>();

  root.appendChild(annotation(mode === 's'
    ? 'The Laplace transform is "the Fourier transform of the exponentially tamed signal x(t)·e^{−σt}". ' +
      '<b>Slide σ:</b> where the weighted signal has finite area (green), that σ joins the ROC — painted stroke by stroke ' +
      'on the s-plane. The ROC is not decoration: <b>e^{−t}u(t) and −e^{−t}u(−t) have the SAME X(s) = 1/(s+1)</b>; only the ROC tells them apart.'
    : 'Same story in z: weight x[n] by r^{−n} and ask where Σ|x[n]r^{−n}| converges. Right-sided ⇒ OUTSIDE the outermost ' +
      'pole; left-sided ⇒ inside; two-sided ⇒ a ring. The DTFT exists iff the ROC contains the unit circle.'));
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const paneT = document.createElement('div');
  const paneS = document.createElement('div');
  paneT.style.cssText = 'flex:1.4;min-width:16rem';
  paneS.style.cssText = 'flex:1;min-width:14rem';
  row.append(paneT, paneS);
  root.appendChild(row);
  const tp = new Plot(paneT, { x: { min: -4, max: 4, label: mode === 's' ? 't' : 'n' }, y: { min: -2.5, max: 2.5 }, height: 190, title: mode === 's' ? 'x(t)·e^{−σt} — the tamed signal (shaded |area| must be finite)' : 'x[n]·r^{−n}' });
  const sp = new Plot(paneS, { x: { min: -3, max: 3, label: 'σ' }, y: { min: -2, max: 2, label: 'jω' }, height: 190, title: 'ROC painted so far (green strokes)' });
  const info = readout();
  root.appendChild(info.el);

  // Exact ROC boundaries in σ: right-sided ⇒ right of the rightmost pole;
  // the left-sided twin of 1/(s+1) ⇒ σ < −1; two-sided e^{−|t|} ⇒ the strip (−1, 1).
  const rocOf = (sig: typeof ROC_SIGNALS[string]): [number, number] => {
    if (sig.kind === 'right') return [-1, Infinity];
    if (sig.kind === 'growright') return [1, Infinity];
    if (sig.kind === 'left') return [-Infinity, -1];
    return [-1, 1];
  };

  function draw() {
    const p = palette();
    const sig = ROC_SIGNALS[name];
    const [lo, hi] = rocOf(sig);
    const inRoc = sigma > lo && sigma < hi;
    tp.begin();
    const N = 1000;
    const ts = Array.from({ length: N }, (_, i) => -4 + (8 * i) / (N - 1));
    const tamed = ts.map((t) => sig.f(t) * Math.exp(-sigma * t));
    tp.areaUnder(ts, tamed.map(Math.abs), inRoc ? 'rgba(74,222,128,.18)' : 'rgba(248,113,113,.2)');
    tp.trace(ts, tamed, { color: inRoc ? p.good : p.bad, width: 2, clipY: 10 });
    tp.trace(ts, ts.map(sig.f), { color: p.axis, width: 1, dash: [3, 4], clipY: 10 });
    if (inRoc) painted.add(Math.round(sigma * 20));
    sp.begin();
    // painted strokes
    for (const s20 of painted) {
      const s = s20 / 20;
      if (s > lo && s < hi) sp.regionX(s - 0.024, s + 0.024, 'rgba(74,222,128,.25)');
    }
    // true ROC boundary lines
    if (isFinite(lo)) sp.vline(lo, { color: p.traces[0], dash: [5, 3], label: `pole boundary σ=${lo}` });
    if (isFinite(hi) && hi !== Infinity) sp.vline(hi, { color: p.traces[0], dash: [5, 3], label: `σ=${hi}` });
    sp.vline(0, { color: p.axis, label: 'jω axis' });
    sp.vline(sigma, { color: p.traces[1], label: `σ=${sigma.toFixed(2)}` });
    const ftExists = 0 > lo && 0 < hi;
    let msg = inRoc
      ? `σ=${sigma.toFixed(2)} TAMES this signal — finite area, transform converges here.`
      : `σ=${sigma.toFixed(2)} fails — the weighted tail ${sigma <= lo ? 'still grows' : 'now grows on the other side'}: not in the ROC.`;
    if (name === 'rightexp' || name === 'leftexp') {
      msg += ` Both this signal and its ${name === 'rightexp' ? 'left' : 'right'}-sided twin give X(s)=1/(s+1) — the ROC (${name === 'rightexp' ? 'σ>−1, right of the pole' : 'σ<−1, left of it'}) is the only difference.`;
    }
    msg += ftExists ? ' ROC ⊇ jω axis ⇒ the ordinary FT exists.' : ' The jω axis is outside the ROC ⇒ no ordinary FT.';
    info.set(msg);
  }
  const ctl = controls();
  const sSel = select('signal', Object.entries(ROC_SIGNALS).map(([k, s]) => [k, s.label]), name, (v) => { name = v; painted.clear(); draw(); });
  const sCtl = slider('σ (taming rate)', -3, 3, 0.05, sigma, (v) => { sigma = v; draw(); });
  ctl.append(sSel.el, sCtl.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.signal) { name = p.signal; sSel.set(p.signal); painted.clear(); } if (typeof p.sigma === 'number') { sigma = p.sigma; sCtl.set(p.sigma); } draw(); },
    resume() { draw(); }, destroy() { tp.destroy(); sp.destroy(); },
    getState() { return { signal: name, sigma, mode }; },
  };
});

// ---------------------------------------------------------------- ZPlaneAtlas
defineWidget('ZPlaneAtlas', (root, params) => {
  let r = params.r ?? 0.85, Om = params.omega ?? 0.6;
  root.appendChild(annotation(
    '<b>Drag z = r·e^{jΩ}.</b> The z-plane is the s-plane seen through sampling: inside the unit circle = decays, ' +
    'outside = grows, ON the circle = sustains. The DT surprise: the <b>negative real axis alternates</b> sign every ' +
    'sample — Ω = π is the fastest a DT signal can wiggle.'));
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const paneZ = document.createElement('div');
  const paneT = document.createElement('div');
  paneZ.style.cssText = 'flex:1;min-width:14rem';
  paneT.style.cssText = 'flex:1.4;min-width:16rem';
  row.append(paneZ, paneT);
  root.appendChild(row);
  const zp = new Plot(paneZ, { x: { min: -1.6, max: 1.6, label: 'Re' }, y: { min: -1.6, max: 1.6, label: 'Im' }, height: 210, title: 'z-plane (dashed: unit circle)', complexPlane: true });
  const tp = new Plot(paneT, { x: { min: 0, max: 24, label: 'n' }, y: { min: -2.5, max: 2.5 }, height: 210, title: 'rⁿ·cos(Ωn)' });
  const info = readout();
  root.appendChild(info.el);

  function draw() {
    const p = palette();
    zp.begin();
    zp.marker(r * Math.cos(Om), r * Math.sin(Om), { shape: 'dot', color: p.traces[0], size: 6, label: `r=${r.toFixed(2)}, Ω=${Om.toFixed(2)}` });
    if (Math.abs(Om) > 0.01 && Math.abs(Om - Math.PI) > 0.01) zp.marker(r * Math.cos(Om), -r * Math.sin(Om), { shape: 'o', color: p.traces[0], size: 5 });
    tp.begin();
    const ns = Array.from({ length: 25 }, (_, i) => i);
    tp.stems(ns, ns.map((n) => Math.pow(r, n) * Math.cos(Om * n)), { color: p.traces[0] });
    tp.trace(Array.from({ length: 200 }, (_, i) => (24 * i) / 199), Array.from({ length: 200 }, (_, i) => Math.pow(r, (24 * i) / 199)), { color: p.traces[1], width: 1, dash: [4, 3], clipY: 10 });
    const alt = Math.abs(Om - Math.PI) < 0.15;
    info.set(`r = ${r.toFixed(2)} → ${r < 0.995 ? 'decays' : r > 1.005 ? 'GROWS' : 'sustains'} · Ω = ${Om.toFixed(2)} rad/sample → repeats visual pattern every ~${Om > 0.05 ? (2 * Math.PI / Om).toFixed(1) : '∞'} samples` +
      (alt ? ' · <b>near Ω=π: sign alternation, the fastest DT oscillation</b> — no j in sight, yet it oscillates' : '') +
      ` · stability rule: ${r < 1 ? 'inside the circle — a system pole here is stable' : 'not inside the circle — a pole here is ' + (r > 1 ? 'unstable' : 'marginal')}`);
  }
  attachDrag(zp, () => 'pt', (_, x, y) => {
    r = Math.min(1.5, Math.hypot(x, y));
    Om = Math.abs(Math.atan2(y, x));
    draw();
  });
  draw();
  return {
    setParams(p: any) { if (typeof p.r === 'number') r = p.r; if (typeof p.omega === 'number') Om = p.omega; draw(); },
    resume() { draw(); }, destroy() { zp.destroy(); tp.destroy(); },
    getState() { return { r, omega: Om }; },
  };
});

// ---------------------------------------------------------------- DifferenceEquationMachine
defineWidget('DifferenceEquationMachine', (root, params) => {
  let a1 = params.a1 ?? 1.0, a2 = params.a2 ?? -0.5, b0 = params.b0 ?? 1;
  let input: 'delta' | 'step' | 'cos' = params.input || 'delta';
  let nMax = 0;
  root.appendChild(annotation(
    'A difference equation is a <b>program</b>: y[n] = a₁y[n−1] + a₂y[n−2] + b₀x[n]. <b>Crank it</b> one tick at a time ' +
    'and watch the tape compute — then look right: the poles (roots of 1 − a₁z⁻¹ − a₂z⁻²) predict everything the ' +
    'crank will ever produce. Preset: Fibonacci — the golden ratio is a pole.'));
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const paneT = document.createElement('div');
  const paneZ = document.createElement('div');
  paneT.style.cssText = 'flex:1.5;min-width:16rem';
  paneZ.style.cssText = 'flex:1;min-width:13rem';
  row.append(paneT, paneZ);
  root.appendChild(row);
  const tp = new Plot(paneT, { x: { min: -1, max: 30, label: 'n' }, y: { min: -3, max: 3 }, height: 190, title: 'y[n] — cranked so far' });
  const zp = new Plot(paneZ, { x: { min: -1.7, max: 1.7, label: 'Re' }, y: { min: -1.7, max: 1.7, label: 'Im' }, height: 190, title: 'poles', complexPlane: true });
  const tape = document.createElement('div');
  tape.style.cssText = 'font-family:var(--mono);font-size:.8rem;color:var(--ink-soft);margin:.3rem 0;min-height:1.4em;overflow-x:auto;white-space:nowrap';
  root.appendChild(tape);

  const xIn = (n: number) => input === 'delta' ? (n === 0 ? 1 : 0) : input === 'step' ? (n >= 0 ? 1 : 0) : Math.cos(0.5 * n);
  function computeY(upTo: number): number[] {
    const y: number[] = [];
    for (let n = 0; n <= upTo; n++) {
      y.push(a1 * (y[n - 1] ?? 0) + a2 * (y[n - 2] ?? 0) + b0 * xIn(n));
    }
    return y;
  }

  function draw() {
    const p = palette();
    const y = computeY(29);
    const shown = y.slice(0, nMax + 1);
    let yAbs = Math.max(1, ...shown.map(Math.abs));
    yAbs = Math.min(yAbs, 200);
    tp.setYRange(-yAbs * 1.2, yAbs * 1.2);
    tp.begin();
    tp.stems(shown.map((_, i) => i), shown, { color: p.traces[0] });
    if (nMax < 29) tp.stems(y.slice(nMax + 1).map((_, i) => i + nMax + 1), y.slice(nMax + 1), { color: p.traces[0], alpha: 0.15 });
    zp.begin();
    const roots = polyRoots([1, -a1, -a2]);
    let unstable = false;
    for (const rt of roots) {
      const mag = Math.hypot(rt.re, rt.im);
      if (mag > 1.001) unstable = true;
      zp.marker(rt.re, rt.im, { shape: 'x', color: mag > 1.001 ? p.bad : p.traces[0], size: 6, label: `|z|=${mag.toFixed(2)}` });
    }
    const n = nMax;
    tape.innerHTML = n <= 29
      ? `y[${n}] = ${a1.toFixed(2)}·y[${n - 1}](${(computeY(29)[n - 1] ?? 0).toFixed(2)}) + ${a2.toFixed(2)}·y[${n - 2}](${(computeY(29)[n - 2] ?? 0).toFixed(2)}) + ${b0.toFixed(2)}·x[${n}](${xIn(n).toFixed(2)}) = <b>${(computeY(29)[n]).toFixed(3)}</b>` +
        (unstable ? '  — a pole is OUTSIDE the unit circle: keep cranking and watch it blow up in slow motion' : '')
      : '';
  }
  const ctl = controls();
  const a1c = slider('a₁', -2, 2, 0.05, a1, (v) => { a1 = v; nMax = 0; draw(); });
  const a2c = slider('a₂', -1.5, 1.5, 0.05, a2, (v) => { a2 = v; nMax = 0; draw(); });
  const inSel = select('input x[n]', [['delta', 'δ[n] (impulse → h[n])'], ['step', 'u[n]'], ['cos', 'cos(0.5n)']], input, (v) => { input = v as any; nMax = 0; draw(); });
  const crank = button('crank one tick →', () => { nMax = Math.min(29, nMax + 1); draw(); });
  const runAll = button('run to n=29', () => { nMax = 29; draw(); });
  const fib = button('Fibonacci preset (φ pole!)', () => {
    a1 = 1; a2 = 1; b0 = 1; input = 'delta'; nMax = 0;
    a1c.set(1); a2c.set(1); inSel.set('delta');
    draw();
  });
  ctl.append(a1c.el, a2c.el, inSel.el, buttonRow(crank, runAll, fib));
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (typeof p.a1 === 'number') { a1 = p.a1; a1c.set(p.a1); } if (typeof p.a2 === 'number') { a2 = p.a2; a2c.set(p.a2); } nMax = 0; draw(); },
    resume() { draw(); }, destroy() { tp.destroy(); zp.destroy(); },
    getState() {
      const roots = polyRoots([1, -a1, -a2]);
      return { a1, a2, maxPoleMag: Math.max(...roots.map((rt) => Math.hypot(rt.re, rt.im))) };
    },
  };
});
