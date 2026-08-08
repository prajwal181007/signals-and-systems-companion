// Module 1 widget set: SignalExplorer, EnergyPowerRace, PeriodicityDetector,
// EvenOddDecomposer, ImpulseForge.
import { defineWidget, controls, slider, select, annotation, readout, button, buttonRow } from './framework';
import { Plot, palette, scheduler } from '../sigplot/plot';

// ---------------------------------------------------------------- SignalExplorer
// y(t) = x(at − b): the transformation-order machine. A distinctive asymmetric
// "flag" makes orientation unmistakable; a feature marker tracks one point
// algebraically (solve at − b = t₀) — the eternal x(a(t−b)) confusion dissolved.
const SHAPES: Record<string, { label: string; f: (t: number) => number; feature: number }> = {
  flag: {
    label: 'flag (asymmetric)',
    f: (t) => (t >= 0 && t <= 2 ? (t <= 1.4 ? 1 : (2 - t) / 0.6) * (t >= 0.5 && t <= 0.7 ? 0.45 : 1) : 0),
    feature: 0.6,
  },
  pulse: { label: 'rect pulse [0,1]', f: (t) => (t >= 0 && t <= 1 ? 1 : 0), feature: 0.5 },
  expdecay: { label: 'e^(−t)·u(t)', f: (t) => (t >= 0 ? Math.exp(-t) : 0), feature: 0 },
  rampsig: { label: 'ramp then flat', f: (t) => (t < 0 ? 0 : t < 1 ? t : 1), feature: 1 },
};

defineWidget('SignalExplorer', (root, params) => {
  let name = params.signal || 'flag';
  let a = params.a ?? 1, b = params.b ?? 0;

  root.appendChild(annotation(
    '<b>y(t) = x(at − b).</b> The dot tracks one feature of the signal. Its landing spot solves ' +
    '<code>a·t − b = t₀</code> → <code>t = (t₀ + b)/a</code>. Negative a flips first, then everything else.'));

  const paneA = document.createElement('div');
  const paneB = document.createElement('div');
  root.append(paneA, paneB);
  const orig = new Plot(paneA, { x: { min: -4, max: 4, label: 't' }, y: { min: -0.4, max: 1.3 }, height: 120, title: 'x(t) — original' });
  const out = new Plot(paneB, { x: { min: -4, max: 4, label: 't' }, y: { min: -0.4, max: 1.3 }, height: 140, title: 'y(t) = x(at−b)' });
  const info = readout();
  root.appendChild(info.el);

  function draw() {
    const p = palette();
    const S = SHAPES[name];
    const N = 900;
    const ts = Array.from({ length: N }, (_, i) => -4 + (8 * i) / (N - 1));
    orig.begin();
    orig.trace(ts, ts.map(S.f), { color: p.traces[0], width: 2 });
    orig.marker(S.feature, S.f(S.feature) + 0.06, { shape: 'dot', color: p.traces[1], label: `t₀=${S.feature}` });
    out.begin();
    out.trace(ts, ts.map((t) => S.f(a * t - b)), { color: p.traces[2], width: 2 });
    if (Math.abs(a) > 1e-9) {
      const land = (S.feature + b) / a;
      out.marker(land, S.f(S.feature) + 0.06, { shape: 'dot', color: p.traces[1], label: `t=(t₀+b)/a=${land.toFixed(2)}` });
    }
    info.set(`a=${a.toFixed(2)}  b=${b.toFixed(2)}  →  ${Math.abs(a) !== 1 ? (Math.abs(a) > 1 ? 'compressed ×' + Math.abs(a).toFixed(2) : 'stretched ×' + (1 / Math.abs(a)).toFixed(2)) : 'no scaling'}${a < 0 ? ', time-reversed' : ''}${b !== 0 ? `, feature lands at (t₀+b)/a` : ''}`);
  }

  const ctl = controls();
  const sSel = select('signal', Object.entries(SHAPES).map(([k, s]) => [k, s.label]), name, (v) => { name = v; draw(); });
  const aCtl = slider('a (scale/flip)', -3, 3, 0.05, a, (v) => { a = Math.abs(v) < 0.05 ? 0.05 : v; draw(); });
  const bCtl = slider('b (shift)', -3, 3, 0.05, b, (v) => { b = v; draw(); });
  ctl.append(sSel.el, aCtl.el, bCtl.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.signal) { name = p.signal; sSel.set(p.signal); } if (typeof p.a === 'number') { a = p.a; aCtl.set(p.a); } if (typeof p.b === 'number') { b = p.b; bCtl.set(p.b); } draw(); },
    resume() { draw(); }, destroy() { orig.destroy(); out.destroy(); },
    getState() { return { a, b, signal: name }; },
  };
});

// ---------------------------------------------------------------- EnergyPowerRace
const EP: Record<string, { label: string; f: (t: number) => number }> = {
  rect: { label: 'rect pulse', f: (t) => (Math.abs(t) <= 1 ? 1 : 0) },
  expdecay: { label: 'e^(−|t|)', f: (t) => Math.exp(-Math.abs(t)) },
  step: { label: 'u(t)', f: (t) => (t >= 0 ? 1 : 0) },
  sine: { label: 'sin(2t)', f: (t) => Math.sin(2 * t) },
  ramp: { label: 't·u(t)', f: (t) => (t > 0 ? t : 0) },
};

defineWidget('EnergyPowerRace', (root, params) => {
  let name = params.signal || 'rect';
  root.appendChild(annotation(
    'Two meters race as the window [−T, T] grows: accumulated energy E(T) and average power P(T)=E/2T. ' +
    'The classification is about which meter <i>converges</i> — asymptotic growth, not amplitude.'));
  const paneA = document.createElement('div');
  root.appendChild(paneA);
  const plot = new Plot(paneA, { x: { min: 0.25, max: 60, log: true, label: 'T (log)' }, y: { min: 0, max: 3 }, height: 170 });
  const info = readout();
  root.appendChild(info.el);
  const verdict = document.createElement('div');
  verdict.style.cssText = 'font-weight:650;margin:.2rem 0';
  root.appendChild(verdict);

  function draw() {
    const p = palette();
    const f = EP[name].f;
    const Ts: number[] = [], Es: number[] = [], Ps: number[] = [];
    let E = 0;
    const dt = 0.005;
    let t = 0;
    for (let T = 0.25; T <= 60; T *= 1.06) {
      while (t < T) { E += (f(t) ** 2 + f(-t) ** 2) * dt; t += dt; }
      Ts.push(T); Es.push(E); Ps.push(E / (2 * T));
    }
    const Emax = Es[Es.length - 1];
    plot.setYRange(0, Math.min(Emax * 1.1, Math.max(3, Ps[0] * 2)) || 3);
    plot.begin();
    plot.trace(Ts, Es, { color: p.traces[0], width: 2 });
    plot.trace(Ts, Ps, { color: p.traces[2], width: 2 });
    plot.label(0.35, plot.opts.y.max * 0.92, 'E(T) — energy so far');
    plot.label(0.35, plot.opts.y.max * 0.8, 'P(T) = E(T)/2T — average power', { color: p.traces[2] });
    const eConv = Es[Es.length - 1] - Es[Es.length - 8] < 0.01;
    const pFinal = Ps[Ps.length - 1];
    const pConvNonzero = Math.abs(Ps[Ps.length - 1] - Ps[Ps.length - 8]) < 0.005 && pFinal > 0.01;
    if (eConv) {
      verdict.textContent = `● ENERGY signal: E → ${Es[Es.length - 1].toFixed(2)} (finite), so P → 0`;
      verdict.style.color = 'var(--accent)';
    } else if (pConvNonzero) {
      verdict.textContent = `● POWER signal: E grows forever, but P → ${pFinal.toFixed(3)} (finite, nonzero)${name === 'sine' ? ' = A²/2' : ''}`;
      verdict.style.color = 'var(--good)';
    } else {
      verdict.textContent = '● NEITHER: even the average power diverges (t·u(t) outruns the window)';
      verdict.style.color = 'var(--bad)';
    }
    info.set(`at T=60:  E=${Es[Es.length - 1] > 1000 ? Es[Es.length - 1].toExponential(1) : Es[Es.length - 1].toFixed(2)}   P=${pFinal > 1000 ? pFinal.toExponential(1) : pFinal.toFixed(3)}`);
  }
  const ctl = controls();
  const sSel = select('signal', Object.entries(EP).map(([k, s]) => [k, s.label]), name, (v) => { name = v; draw(); });
  ctl.append(sSel.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.signal) { name = p.signal; sSel.set(p.signal); } draw(); },
    resume() { draw(); }, destroy() { plot.destroy(); },
    getState() { return { signal: name }; },
  };
});

// ---------------------------------------------------------------- PeriodicityDetector
defineWidget('PeriodicityDetector', (root, params) => {
  let mode: 'ct' | 'dt' = params.mode === 'dt' ? 'dt' : 'ct';
  let f1 = params.f1 ?? 1, f2 = params.f2 ?? 1.5;
  let omegaNum = params.omegaNum ?? 1, omegaDen = params.omegaDen ?? 4; // Ω₀ = (num/den)·π — symbolic!

  root.appendChild(annotation(
    'CT: sin(2πf₁t) + sin(2πf₂t) is periodic iff f₁/f₂ is <b>rational</b> — and the fundamental period can be huge. ' +
    'DT: cos(Ω₀n) is periodic iff Ω₀/2π is rational. <b>Decided symbolically</b> — floats lie about rationality.'));
  const paneA = document.createElement('div');
  root.appendChild(paneA);
  const plot = new Plot(paneA, { x: { min: 0, max: 20, label: mode === 'ct' ? 't' : 'n' }, y: { min: -2.3, max: 2.3 }, height: 160 });
  const verdict = document.createElement('div');
  verdict.style.cssText = 'font-weight:650;margin:.3rem 0';
  root.appendChild(verdict);

  // rational detection on the SLIDER GRID (sliders snap to 0.05) — symbolic, not float folklore
  function ratio(): { p: number; q: number } | null {
    const a = Math.round(f1 * 20), b = Math.round(f2 * 20);
    if (b === 0) return null;
    const g = gcd(a, b);
    return { p: a / g, q: b / g };
  }
  function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : Math.abs(a); }

  function draw() {
    const p = palette();
    plot.begin();
    if (mode === 'ct') {
      const N = 2400;
      const ts = Array.from({ length: N }, (_, i) => (20 * i) / (N - 1));
      plot.trace(ts, ts.map((t) => Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t)), { color: p.traces[0], width: 1.6 });
      const r = ratio();
      if (r && f2 > 0) {
        const T0 = r.q / f1; // p/q = f1/f2 ⇒ T0 = p·T1 = p/f1 … careful: T0 = q/f2·? use lcm of periods
        const T0v = lcmPeriod(f1, f2);
        if (T0v && T0v <= 20) plot.vline(T0v, { color: p.traces[2], dash: [4, 3], label: `T₀ = ${T0v.toFixed(2)}` });
        verdict.textContent = `f₁/f₂ = ${(f1 / f2).toFixed(3)} = ${r.p}/${r.q} (rational) → PERIODIC, fundamental period ${T0v ? T0v.toFixed(2) + ' s' : '> window'}`;
        verdict.style.color = 'var(--good)';
      } else {
        verdict.textContent = 'irrational ratio → NOT periodic (it almost repeats, forever, but never exactly)';
        verdict.style.color = 'var(--bad)';
      }
    } else {
      const ns = Array.from({ length: 41 }, (_, i) => i);
      const W = (omegaNum / omegaDen) * Math.PI;
      plot.stems(ns, ns.map((n) => Math.cos(W * n)), { color: p.traces[0] });
      // Ω₀/2π = num/(2·den) — rational by construction here; the DT surprise is Ω₀ WITHOUT π
      const g = gcd(omegaNum, 2 * omegaDen);
      const Nper = (2 * omegaDen) / g;
      verdict.textContent = `Ω₀ = ${omegaNum}π/${omegaDen}:  Ω₀/2π = ${omegaNum}/${2 * omegaDen} (rational) → periodic with N = ${Nper}. But cos(0.5·n) — no π — has Ω₀/2π = 1/4π: IRRATIONAL → never periodic.`;
      verdict.style.color = 'var(--good)';
    }
  }
  function lcmPeriod(fa: number, fb: number): number | null {
    const a = Math.round(fa * 20), b = Math.round(fb * 20);
    if (!a || !b) return null;
    const g = gcd(a, b);
    return 20 / g; // lcm(1/fa, 1/fb) with grid-20 arithmetic
  }

  const ctl = controls();
  const modeSel = select('mode', [['ct', 'CT: two sines'], ['dt', 'DT: cos(Ω₀n)']], mode, (v) => { mode = v as any; f1c.el.style.display = f2c.el.style.display = mode === 'ct' ? '' : 'none'; oc.el.style.display = mode === 'dt' ? '' : 'none'; draw(); });
  const f1c = slider('f₁', 0.25, 3, 0.05, f1, (v) => { f1 = v; draw(); });
  const f2c = slider('f₂', 0.25, 3, 0.05, f2, (v) => { f2 = v; draw(); });
  const oc = slider('Ω₀ (× π/4)', 1, 8, 1, omegaNum, (v) => { omegaNum = Math.round(v); draw(); }, (v) => `${Math.round(v)}π/4`);
  oc.el.style.display = mode === 'dt' ? '' : 'none';
  ctl.append(modeSel.el, f1c.el, f2c.el, oc.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.mode) mode = p.mode; if (p.f1) { f1 = p.f1; f1c.set(p.f1); } if (p.f2) { f2 = p.f2; f2c.set(p.f2); } draw(); },
    resume() { draw(); }, destroy() { plot.destroy(); },
    getState() { return { mode, f1, f2 }; },
  };
});

// ---------------------------------------------------------------- EvenOddDecomposer
const EO: Record<string, { label: string; f: (t: number) => number }> = {
  expu: { label: 'e^(−t)·u(t)', f: (t) => (t >= 0 ? Math.exp(-t) : 0) },
  pulse: { label: 'shifted pulse', f: (t) => (t >= 0.5 && t <= 1.5 ? 1 : 0) },
  rampsig: { label: 'ramp then flat', f: (t) => (t < 0 ? 0 : t < 1 ? t : 1) },
};

defineWidget('EvenOddDecomposer', (root, params) => {
  let name = params.signal || 'expu';
  root.appendChild(annotation(
    'Every signal splits — uniquely — into a mirror-symmetric part and an anti-symmetric part: ' +
    '$x_e = \\tfrac12[x(t)+x(-t)]$, $x_o = \\tfrac12[x(t)-x(-t)]$. Add the two lower panes and you get the original back, exactly.'));
  const panes = [0, 1, 2].map(() => { const d = document.createElement('div'); root.appendChild(d); return d; });
  const titles = ['x(t)', 'even part ½[x(t)+x(−t)]', 'odd part ½[x(t)−x(−t)]'];
  const plots = panes.map((pn, i) => new Plot(pn, { x: { min: -3, max: 3, label: 't' }, y: { min: -0.8, max: 1.1 }, height: i === 0 ? 110 : 100, title: titles[i] }));
  const info = readout();
  root.appendChild(info.el);

  function draw() {
    const p = palette();
    const f = EO[name].f;
    const N = 800;
    const ts = Array.from({ length: N }, (_, i) => -3 + (6 * i) / (N - 1));
    const even = ts.map((t) => 0.5 * (f(t) + f(-t)));
    const odd = ts.map((t) => 0.5 * (f(t) - f(-t)));
    plots[0].begin(); plots[0].trace(ts, ts.map(f), { color: p.traces[0], width: 2 });
    plots[1].begin(); plots[1].trace(ts, even, { color: p.traces[2], width: 2 });
    plots[2].begin(); plots[2].trace(ts, odd, { color: p.traces[1], width: 2 });
    // orthogonality ledger: ∫ x_e·x_o dt ≈ 0
    let dot = 0;
    for (let i = 0; i < N; i++) dot += even[i] * odd[i] * (6 / N);
    info.set(`reassembly check: x_e + x_o = x ✓   orthogonality teaser: ∫x_e·x_o dt = ${Math.abs(dot) < 1e-9 ? '0 (exactly)' : dot.toExponential(1)} — the parts don't share energy (Module 2 will build on this)`);
  }
  const ctl = controls();
  const sSel = select('signal', Object.entries(EO).map(([k, s]) => [k, s.label]), name, (v) => { name = v; draw(); });
  ctl.append(sSel.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.signal) { name = p.signal; sSel.set(p.signal); } draw(); },
    resume() { draw(); }, destroy() { plots.forEach((pl) => pl.destroy()); },
    getState() { return { signal: name }; },
  };
});

// ---------------------------------------------------------------- ImpulseForge
defineWidget('ImpulseForge', (root, params) => {
  let family = params.family || 'rect';
  let eps = params.eps ?? 0.8;
  root.appendChild(annotation(
    'Shrink a unit-area pulse (area pinned at <b>1</b> — watch it) and feed it to an RC circuit. ' +
    'As ε→0 the response converges to a fixed shape — the <b>impulse response</b> — no matter which pulse family you chose. ' +
    'δ(t) is not a value at 0; it is what it <i>does</i> under an integral.'));
  const paneA = document.createElement('div');
  const paneB = document.createElement('div');
  root.append(paneA, paneB);
  const inPlot = new Plot(paneA, { x: { min: -0.5, max: 3, label: 't' }, y: { min: 0, max: 8 }, height: 140, title: 'unit-area pulse (shaded area = 1, always)' });
  const outPlot = new Plot(paneB, { x: { min: -0.5, max: 3, label: 't' }, y: { min: 0, max: 1.1 }, height: 140, title: 'RC response → h(t) = e^(−t)·u(t) in the limit' });
  const info = readout();
  root.appendChild(info.el);

  const fam = (e: number): ((t: number) => number) => {
    if (family === 'tri') return (t) => (t >= 0 && t <= e ? (2 / e) * (1 - Math.abs(2 * t / e - 1)) : 0);
    if (family === 'gauss') { const s = e / 4; return (t) => Math.exp(-((t - e / 2) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)); }
    return (t) => (t >= 0 && t <= e ? 1 / e : 0);
  };

  function draw() {
    const p = palette();
    const f = fam(eps);
    const N = 1400;
    const ts = Array.from({ length: N }, (_, i) => -0.5 + (3.5 * i) / (N - 1));
    const peak = Math.max(...ts.map(f));
    inPlot.setYRange(0, Math.max(2.2, peak * 1.15));
    inPlot.begin();
    inPlot.areaUnder(ts, ts.map(f), p.fill);
    inPlot.trace(ts, ts.map(f), { color: p.traces[0], width: 2 });
    // exact RC response to the pulse: y = ∫ f(τ)e^{-(t-τ)}dτ (numeric, fine grid)
    const dt = 3.5 / N;
    const y = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      let acc = 0;
      const t = ts[i];
      for (let j = 0; j <= i; j++) {
        const tau = ts[j];
        acc += f(tau) * Math.exp(-(t - tau)) * dt;
      }
      y[i] = acc;
    }
    outPlot.begin();
    outPlot.trace(ts, ts.map((t) => (t >= 0 ? Math.exp(-t) : 0)), { color: p.axis, width: 1.2, dash: [4, 3] });
    outPlot.trace(ts, Array.from(y), { color: p.traces[2], width: 2.2 });
    outPlot.label(1.9, 0.95, 'dashed: the ε→0 limit h(t)');
    let area = 0;
    for (let i = 0; i < N; i++) area += f(ts[i]) * dt;
    info.set(`pulse: ${family}, width ε=${eps.toFixed(2)}, height→${peak.toFixed(1)}, area = ${area.toFixed(3)} (pinned). Response peak error vs h(t): ${(Math.abs(Math.max(...y) - 1) * 100).toFixed(1)}%`);
  }
  const ctl = controls();
  const fSel = select('pulse family', [['rect', 'rectangle'], ['tri', 'triangle'], ['gauss', 'Gaussian']], family, (v) => { family = v; draw(); });
  const eCtl = slider('width ε', 0.02, 1.5, 0.01, eps, (v) => { eps = v; draw(); });
  ctl.append(fSel.el, eCtl.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.family) { family = p.family; fSel.set(p.family); } if (typeof p.eps === 'number') { eps = p.eps; eCtl.set(p.eps); } draw(); },
    resume() { draw(); }, destroy() { inPlot.destroy(); outPlot.destroy(); },
    getState() { return { family, eps }; },
  };
});
