// Module 2 widget suite: FSFTBridge, CTFTExplorer, UncertaintySeeSaw,
// NoisePSDLab, HilbertDemo, WalshMixer, FreqResponseProbe.
import { defineWidget, controls, slider, select, annotation, readout, button, buttonRow } from './framework';
import { Plot, palette, attachDrag } from '../sigplot/plot';
import { fft, nextPow2 } from '../math/fft';

const sinc = (x: number) => (x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x));

// ---------------------------------------------------------------- FSFTBridge
// Pulse train, period T grows: lines T·cₖ densify under the invariant sinc
// envelope. At the T→∞ end the FT emerges as the envelope.
defineWidget('FSFTBridge', (root, params) => {
  let T = params.T ?? 4;
  const w = params.width ?? 1;
  root.appendChild(annotation(
    'A pulse train with the <b>period T on a slider</b>. The spectrum is plotted as <b>T·cₖ</b> — with that scaling, ' +
    'the lines are samples of a FIXED envelope (the sinc). Stretch T: lines densify, envelope stays. ' +
    'At T→∞ the discrete lines fuse into the continuous curve — <b>that curve is the Fourier transform</b>.'));
  const paneA = document.createElement('div');
  const paneB = document.createElement('div');
  root.append(paneA, paneB);
  const time = new Plot(paneA, { x: { min: -16, max: 16, label: 't' }, y: { min: -0.15, max: 1.25 }, height: 120, title: 'periodic pulse train (width fixed = 1)' });
  const freq = new Plot(paneB, { x: { min: -14, max: 14, label: 'ω (rad/s)' }, y: { min: -0.35, max: 1.15 }, height: 170, title: 'T·cₖ at ω = kω₀   +   the invariant envelope' });
  const info = readout();
  root.appendChild(info.el);

  function draw() {
    const p = palette();
    time.begin();
    const N = 1600;
    const ts = Array.from({ length: N }, (_, i) => -16 + (32 * i) / (N - 1));
    time.trace(ts, ts.map((t) => {
      const u = ((t % T) + T) % T;
      return u <= w / 2 || u >= T - w / 2 ? 1 : 0;
    }), { color: p.traces[0], width: 1.6 });
    freq.begin();
    // envelope: FT of one pulse = w·sinc(ωw/2π)
    const ws = Array.from({ length: 900 }, (_, i) => -14 + (28 * i) / 899);
    freq.trace(ws, ws.map((om) => w * sinc((om * w) / (2 * Math.PI))), { color: p.traces[1], width: 1.6, dash: [5, 4] });
    // lines at k·ω₀ with heights T·cₖ = w·sinc(kw/T)
    const w0 = (2 * Math.PI) / T;
    const ks: number[] = [], hs: number[] = [];
    for (let k = -Math.floor(14 / w0); k <= Math.floor(14 / w0); k++) {
      ks.push(k * w0);
      hs.push(w * sinc((k * w) / T));
    }
    freq.stems(ks, hs, { color: p.traces[0], radius: T > 24 ? 1.4 : 2.6 });
    info.set(`T = ${T.toFixed(1)} s → line spacing ω₀ = 2π/T = ${w0.toFixed(3)} rad/s, ${ks.length} lines in view. ` +
      (T > 30 ? 'The lines are fusing into the envelope: aperiodic = periodic with T = ∞.' : 'Doubling T halves the spacing — the envelope never moves.'));
  }
  const ctl = controls();
  const tCtl = slider('period T', 4, 48, 0.5, T, (v) => { T = v; draw(); }, (v) => v.toFixed(1) + ' s');
  ctl.append(tCtl.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (typeof p.T === 'number') { T = p.T; tCtl.set(p.T); } draw(); },
    resume() { draw(); }, destroy() { time.destroy(); freq.destroy(); },
    getState() { return { T }; },
  };
});

// ---------------------------------------------------------------- CTFTExplorer
// Pair gallery + property levers + Parseval band-energy ledger.
const PAIRS: Record<string, { label: string; f: (t: number) => number; X: (w: number) => number; E: number }> = {
  rect: { label: 'rect [−1,1]', f: (t) => (Math.abs(t) <= 1 ? 1 : 0), X: (w) => 2 * sinc(w / Math.PI), E: 2 },
  tri: { label: 'triangle', f: (t) => Math.max(0, 1 - Math.abs(t)), X: (w) => sinc(w / (2 * Math.PI)) ** 2, E: 2 / 3 },
  gauss: { label: 'Gaussian', f: (t) => Math.exp(-t * t / 2), X: (w) => Math.sqrt(2 * Math.PI) * Math.exp(-w * w / 2), E: Math.sqrt(Math.PI) },
  expu: { label: 'e^(−t)·u(t)', f: (t) => (t >= 0 ? Math.exp(-t) : 0), X: (w) => 1 / Math.sqrt(1 + w * w), E: 0.5 },
  twoexp: { label: 'e^(−|t|)', f: (t) => Math.exp(-Math.abs(t)), X: (w) => 2 / (1 + w * w), E: 1 },
};

defineWidget('CTFTExplorer', (root, params) => {
  let name = params.signal || 'rect';
  let t0 = 0, a = 1, wc = 0;
  let band = params.band ?? 0; // band half-width for the Parseval ledger; 0 = off
  root.appendChild(annotation(
    'A transform-pair gallery with <b>property levers</b>. Shift: |X| frozen, phase tilts. Scale: reciprocal stretch ' +
    '(squeeze time ⇒ smear frequency). Modulate by cos(ω_c t): the spectrum splits and slides to ±ω_c. ' +
    'Drag the shaded band edge to run the <b>Parseval energy ledger</b>.'));
  const paneA = document.createElement('div');
  const paneB = document.createElement('div');
  root.append(paneA, paneB);
  const time = new Plot(paneA, { x: { min: -6, max: 6, label: 't' }, y: { min: -1.3, max: 1.3 }, height: 140, title: 'x(t)' });
  const freq = new Plot(paneB, { x: { min: -12, max: 12, label: 'ω' }, y: { min: -0.4, max: 2.7 }, height: 160, title: '|X(jω)|' });
  const info = readout();
  root.appendChild(info.el);

  const xf = (t: number) => {
    const g = PAIRS[name];
    const base = g.f(a * (t - t0));
    return wc > 0 ? base * Math.cos(wc * t) : base;
  };
  const Xmag = (w: number) => {
    const g = PAIRS[name];
    const scaled = (om: number) => Math.abs(g.X(om / a) / Math.abs(a));
    return wc > 0 ? 0.5 * (scaled(w - wc) + scaled(w + wc)) : scaled(w);
  };

  function draw() {
    const p = palette();
    time.begin();
    const N = 1200;
    const ts = Array.from({ length: N }, (_, i) => -6 + (12 * i) / (N - 1));
    time.trace(ts, ts.map(xf), { color: p.traces[0], width: 1.8 });
    const peak = Math.max(...Array.from({ length: 400 }, (_, i) => Xmag(-12 + 24 * i / 399)));
    freq.setYRange(0, Math.max(0.4, peak * 1.15));
    freq.begin();
    const wsArr = Array.from({ length: 900 }, (_, i) => -12 + (24 * i) / 899);
    if (band > 0) {
      freq.regionX(-band, band, p.fill);
      // band-energy fraction: ∫|X|² over band / total (numeric on analytic mags)
      let inBand = 0, total = 0;
      for (const om of wsArr) {
        const m2 = Xmag(om) ** 2;
        total += m2;
        if (Math.abs(om) <= band) inBand += m2;
      }
      info.set(`Parseval ledger: band |ω| ≤ ${band.toFixed(1)} holds <b>${((inBand / total) * 100).toFixed(1)}%</b> of the signal energy. ` +
        `Total energy checks: ∫|x|²dt = (1/2π)∫|X|²dω — same number from either side.`);
    } else {
      info.set(`t₀=${t0.toFixed(1)} (phase ramp e^{−jωt₀}, |X| untouched) · a=${a.toFixed(2)} (widths trade reciprocally) · ` + (wc > 0 ? `carrier ω_c=${wc.toFixed(1)}: two half-copies at ±ω_c` : 'no modulation'));
    }
    freq.trace(wsArr, wsArr.map(Xmag), { color: p.traces[2], width: 2 });
  }

  attachDrag(freq,
    (x) => (band > 0 && Math.abs(Math.abs(x) - band) < 1 ? 'edge' : null),
    (_, x) => { band = Math.max(0.3, Math.abs(x)); draw(); });

  const ctl = controls();
  const sSel = select('signal', Object.entries(PAIRS).map(([k, s]) => [k, s.label]), name, (v) => { name = v; draw(); });
  const shiftCtl = slider('shift t₀', -2, 2, 0.1, 0, (v) => { t0 = v; draw(); });
  const scaleCtl = slider('scale a', 0.4, 2.5, 0.05, 1, (v) => { a = v; draw(); });
  const modCtl = slider('carrier ω_c', 0, 8, 0.1, 0, (v) => { wc = v; draw(); });
  const bandBtn = button('toggle Parseval band', () => { band = band > 0 ? 0 : 3; draw(); });
  ctl.append(sSel.el, shiftCtl.el, scaleCtl.el, modCtl.el, buttonRow(bandBtn));
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.signal) { name = p.signal; sSel.set(p.signal); } if (typeof p.band === 'number') band = p.band; draw(); },
    resume() { draw(); }, destroy() { time.destroy(); freq.destroy(); },
    getState() { return { signal: name, t0, a, wc, band }; },
  };
});

// ---------------------------------------------------------------- UncertaintySeeSaw
defineWidget('UncertaintySeeSaw', (root, params) => {
  let family = params.family || 'gauss';
  let sigma = params.sigma ?? 1;
  root.appendChild(annotation(
    'One slider, two panes: compress time and the spectrum broadens — a <b>theorem, not a tendency</b>. ' +
    'And "bandwidth" is a convention: the definitions below give different numbers for the same signal. ' +
    'RMS width is only finite when ∫ω²|X|²dω converges — where it diverges, we say so.'));
  const paneA = document.createElement('div');
  const paneB = document.createElement('div');
  root.append(paneA, paneB);
  const time = new Plot(paneA, { x: { min: -5, max: 5, label: 't' }, y: { min: 0, max: 1.15 }, height: 120, title: 'x(t)' });
  const freq = new Plot(paneB, { x: { min: -14, max: 14, label: 'ω' }, y: { min: 0, max: 1.1 }, height: 140, title: '|X(jω)| (normalized)' });
  const table = document.createElement('div');
  table.style.cssText = 'font-family:var(--mono);font-size:.8rem;color:var(--ink-soft);white-space:pre;margin:.3rem 0;overflow-x:auto';
  root.appendChild(table);

  const fam = (): { f: (t: number) => number; X: (w: number) => number; rms: (s: number) => string; note: string } => {
    if (family === 'rect') return {
      f: (t) => (Math.abs(t) <= sigma ? 1 : 0),
      X: (w) => Math.abs(sinc((w * sigma) / Math.PI)),
      rms: () => 'DIVERGES (|X|²~1/ω² ⇒ ∫ω²|X|² = ∞)',
      note: 'hard edges in time ⇒ 1/ω tails in frequency: the RMS integral blows up',
    };
    if (family === 'expu') return {
      f: (t) => (t >= 0 ? Math.exp(-t / sigma) : 0),
      X: (w) => 1 / Math.sqrt(1 + (w * sigma) ** 2),
      rms: () => 'DIVERGES (same 1/ω² energy tail)',
      note: 'the jump at t=0 costs the same slow spectral decay',
    };
    return {
      f: (t) => Math.exp(-t * t / (2 * sigma * sigma)),
      X: (w) => Math.exp(-w * w * sigma * sigma / 2),
      rms: (s) => `Δt·Δω = ${(0.5).toFixed(3)} — the MINIMUM. Gaussian is the unique optimizer`,
      note: 'smooth everywhere ⇒ fastest possible spectral decay',
    };
  };

  function widthMetrics(X: (w: number) => number): { db3: number; e90: number } {
    // 3-dB: |X| = max/√2 ; 90%-energy half width
    const peak = X(0);
    let db3 = 14;
    for (let w2 = 0; w2 < 14; w2 += 0.005) if (X(w2) < peak / Math.SQRT2) { db3 = w2; break; }
    let total = 0, cum = 0, e90 = 14;
    const dw = 0.01;
    for (let w2 = 0; w2 < 60; w2 += dw) total += X(w2) ** 2 * dw;
    for (let w2 = 0; w2 < 60; w2 += dw) { cum += X(w2) ** 2 * dw; if (cum >= 0.9 * total) { e90 = w2; break; } }
    return { db3, e90 };
  }

  function draw() {
    const p = palette();
    const g = fam();
    time.begin();
    const ts = Array.from({ length: 900 }, (_, i) => -5 + (10 * i) / 899);
    time.trace(ts, ts.map(g.f), { color: p.traces[0], width: 2 });
    freq.begin();
    const ws = Array.from({ length: 900 }, (_, i) => -14 + (28 * i) / 899);
    freq.trace(ws, ws.map((w) => g.X(w) / g.X(0)), { color: p.traces[2], width: 2 });
    const m = widthMetrics(g.X);
    freq.vline(m.db3, { color: p.traces[1], dash: [3, 3], label: '3-dB' });
    freq.vline(m.e90, { color: p.traces[3] || p.traces[1], dash: [6, 3], label: '90%-energy' });
    table.textContent =
      `width slider σ = ${sigma.toFixed(2)}\n` +
      `3-dB bandwidth      : ${m.db3.toFixed(2)} rad/s\n` +
      `90%-energy bandwidth: ${m.e90.toFixed(2)} rad/s   ← different number, same signal\n` +
      `RMS product Δt·Δω   : ${g.rms(sigma)}\n` +
      `why: ${g.note}`;
  }
  const ctl = controls();
  const fSel = select('family', [['gauss', 'Gaussian'], ['rect', 'rect'], ['expu', 'one-sided exp']], family, (v) => { family = v; draw(); });
  const sCtl = slider('width σ', 0.3, 2.5, 0.05, sigma, (v) => { sigma = v; draw(); });
  ctl.append(fSel.el, sCtl.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.family) { family = p.family; fSel.set(p.family); } draw(); },
    resume() { draw(); }, destroy() { time.destroy(); freq.destroy(); },
    getState() { return { family, sigma }; },
  };
});

// ---------------------------------------------------------------- NoisePSDLab
// Seeded noise (xoshiro-lite): reproducibility is pedagogy. The counterintuitive
// centerpiece: a single periodogram stays jagged as N grows; AVERAGING flattens.
defineWidget('NoisePSDLab', (root, params) => {
  let seed = params.seed ?? 7;
  let segs = 8;
  let filtered = false;
  root.appendChild(annotation(
    '<b>The measured view of white noise.</b> One periodogram is wildly jagged — and stays jagged no matter how long ' +
    'you record (variance does not shrink with N). Averaging segments (Welch) is what flattens it toward the true flat ' +
    'PSD. The analytic CT story (N₀/2 through |H(jω)|²) lives in the text — this lab is what a spectrum analyzer sees.'));
  const paneA = document.createElement('div');
  const paneB = document.createElement('div');
  root.append(paneA, paneB);
  const time = new Plot(paneA, { x: { min: 0, max: 256, label: 'n' }, y: { min: -4, max: 4 }, height: 110, title: 'noise record (replay = new world, same statistics)' });
  const psd = new Plot(paneB, { x: { min: 0, max: 0.5, label: 'normalized frequency' }, y: { min: 0, max: 5 }, height: 170, title: 'PSD estimate' });
  const info = readout();
  root.appendChild(info.el);

  function rng(s: number) {
    let state = s >>> 0 || 1;
    return () => {
      state ^= state << 13; state >>>= 0;
      state ^= state >> 17;
      state ^= state << 5; state >>>= 0;
      return state / 4294967296;
    };
  }
  function gauss(r: () => number) {
    return () => {
      const u = Math.max(1e-12, r()), v = r();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
  }
  const NTOT = 4096;
  function makeNoise(): Float64Array {
    const g = gauss(rng(seed * 2654435761));
    const x = new Float64Array(NTOT);
    for (let i = 0; i < NTOT; i++) x[i] = g();
    if (filtered) {
      // one-pole low-pass y[n] = 0.9y[n-1] + x[n] — colors the spectrum by |H|²
      for (let i = 1; i < NTOT; i++) x[i] = 0.9 * x[i - 1] + 0.3 * x[i];
    }
    return x;
  }
  function periodogram(x: Float64Array, n0: number, len: number): Float64Array {
    const re = new Float64Array(len), im = new Float64Array(len);
    for (let i = 0; i < len; i++) {
      const wnd = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (len - 1)); // Hann
      re[i] = x[n0 + i] * wnd;
    }
    fft(re, im);
    const out = new Float64Array(len / 2);
    const U = 0.375 * len; // Hann window power normalization
    for (let i = 0; i < len / 2; i++) out[i] = (re[i] ** 2 + im[i] ** 2) / U;
    return out;
  }

  function draw() {
    const p = palette();
    const x = makeNoise();
    time.begin();
    time.trace(Array.from({ length: 256 }, (_, i) => i), Array.from(x.slice(0, 256)), { color: p.traces[0], width: 1 });
    // single periodogram over full record
    const single = periodogram(x, 0, 1024);
    // Welch: average `segs` segments of 512 with 50% overlap
    const segLen = 512;
    const welch = new Float64Array(segLen / 2);
    let count = 0;
    for (let s = 0; s + segLen <= NTOT && count < segs; s += segLen / 2, count++) {
      const pg = periodogram(x, s, segLen);
      for (let i = 0; i < segLen / 2; i++) welch[i] += pg[i];
    }
    for (let i = 0; i < segLen / 2; i++) welch[i] /= count;
    psd.setYRange(0, filtered ? 8 : 5);
    psd.begin();
    psd.trace(Array.from({ length: single.length }, (_, i) => (0.5 * i) / single.length), Array.from(single), { color: p.traces[0], width: 1, alpha: 0.45 });
    psd.trace(Array.from({ length: welch.length }, (_, i) => (0.5 * i) / welch.length), Array.from(welch), { color: p.traces[2], width: 2 });
    if (!filtered) psd.hline(1, { color: p.traces[1], dash: [5, 4], label: 'true PSD (flat = "white")' });
    info.set(`thin trace: ONE periodogram (1024 pts) — jagged. thick: Welch average of ${count} segments — ` +
      `flatness error ∝ 1/√${count} ≈ ${(100 / Math.sqrt(count)).toFixed(0)}%. ${filtered ? 'Filtered: the estimate hugs |H|² — filtering shapes POWER, phase is irrelevant to PSD.' : ''}`);
  }
  const ctl = controls();
  const segCtl = slider('Welch segments', 1, 15, 1, segs, (v) => { segs = Math.round(v); draw(); }, (v) => String(Math.round(v)));
  const replay = button('replay (new world, same statistics)', () => { seed++; draw(); });
  const filt = button('color it (one-pole filter)', () => { filtered = !filtered; filt.textContent = filtered ? 'back to white' : 'color it (one-pole filter)'; draw(); });
  ctl.append(segCtl.el, buttonRow(replay, filt));
  root.appendChild(ctl);
  draw();
  return {
    setParams() { draw(); },
    resume() { draw(); }, destroy() { time.destroy(); psd.destroy(); },
    getState() { return { segs, filtered }; },
  };
});

// ---------------------------------------------------------------- HilbertDemo
defineWidget('HilbertDemo', (root, params) => {
  let f0 = params.f0 ?? 8, df = params.df ?? 1;
  root.appendChild(annotation(
    'Two close tones beat. The <b>envelope</b> — the slow outline your ear tracks — has no meaning for a real signal ' +
    'until you build the analytic signal z(t) = x + jx̂ (x̂ = every component phase-shifted −90°). Then envelope = |z(t)|, exactly. ' +
    'Ledger check: envelope is 2|cos(Δω·t/2)|, but the <b>audible beat rate is Δω</b> — the |·| halves the period.'));
  const paneA = document.createElement('div');
  root.appendChild(paneA);
  const plot = new Plot(paneA, { x: { min: 0, max: 4, label: 't' }, y: { min: -2.4, max: 2.4 }, height: 190 });
  const info = readout();
  root.appendChild(info.el);

  function draw() {
    const p = palette();
    const N = 4096;
    const dur = 4;
    const re = new Float64Array(N), im = new Float64Array(N);
    const x = (t: number) => Math.cos(2 * Math.PI * f0 * t) + Math.cos(2 * Math.PI * (f0 + df) * t);
    for (let i = 0; i < N; i++) re[i] = x((dur * i) / N);
    // analytic signal via FFT: zero negative bins, double positive
    fft(re, im);
    for (let i = 1; i < N / 2; i++) { re[i] *= 2; im[i] *= 2; }
    for (let i = N / 2 + 1; i < N; i++) { re[i] = 0; im[i] = 0; }
    fft(re, im, true);
    const ts = Array.from({ length: N }, (_, i) => (dur * i) / N);
    const env = Array.from({ length: N }, (_, i) => Math.hypot(re[i], im[i]));
    plot.begin();
    plot.trace(ts, ts.map(x), { color: p.traces[0], width: 1.1 });
    plot.trace(ts, env, { color: p.traces[1], width: 2.2 });
    plot.trace(ts, env.map((v) => -v), { color: p.traces[1], width: 2.2 });
    info.set(`Δf = ${df.toFixed(2)} Hz → envelope 2|cos(2πΔf·t/2)|; the ear hears <b>${df.toFixed(2)} beats per second</b> ` +
      `(NOT Δf/2 — |·| folds the negative lobes up, halving the period). Instantaneous frequency is disabled here: ` +
      `for a multicomponent signal dφ/dt spikes and even goes negative at envelope nulls — it only means something for single-component signals.`);
  }
  const ctl = controls();
  const dfCtl = slider('Δf (tone spacing)', 0.25, 3, 0.05, df, (v) => { df = v; draw(); }, (v) => v.toFixed(2) + ' Hz');
  ctl.append(dfCtl.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (typeof p.df === 'number') { df = p.df; dfCtl.set(p.df); } draw(); },
    resume() { draw(); }, destroy() { plot.destroy(); },
    getState() { return { f0, df }; },
  };
});

// ---------------------------------------------------------------- WalshMixer
defineWidget('WalshMixer', (root, params) => {
  let target: 'square' | 'sine' = params.target || 'square';
  let kept = params.kept ?? 3;
  root.appendChild(annotation(
    'Fourier is not sacred — it is one orthogonal basis among many. The <b>Walsh functions</b> are ±1 rectangles, ' +
    'mutually orthogonal, ordered by <i>sequency</i> (sign changes). Blocky signals compress into a few Walsh terms ' +
    'while needing many Fourier terms — and a smooth sine flips the contest.'));
  // Walsh-Hadamard basis, N=32, sequency ordered
  const NW = 32;
  function hadamard(n: number): number[][] {
    if (n === 1) return [[1]];
    const H = hadamard(n / 2);
    const out: number[][] = [];
    for (const row of H) out.push([...row, ...row]);
    for (const row of H) out.push([...row, ...row.map((v) => -v)]);
    return out;
  }
  const H = hadamard(NW);
  const seqOrder = H.map((row, i) => ({ i, changes: row.reduce((a, v, j) => a + (j > 0 && v !== row[j - 1] ? 1 : 0), 0) }))
    .sort((a, b) => a.changes - b.changes).map((x) => H[x.i]);

  const paneA = document.createElement('div');
  const paneB = document.createElement('div');
  root.append(paneA, paneB);
  const time = new Plot(paneA, { x: { min: 0, max: 1, label: 't/T' }, y: { min: -1.6, max: 1.6 }, height: 150, title: 'target vs reconstruction (k largest terms kept)' });
  const err = new Plot(paneB, { x: { min: 1, max: 16, label: 'terms kept' }, y: { min: 0, max: 0.8 }, height: 130, title: 'reconstruction error: Walsh vs Fourier — who compresses this signal better?' });
  const info = readout();
  root.appendChild(info.el);

  function draw() {
    const p = palette();
    const tgt = new Float64Array(NW);
    for (let i = 0; i < NW; i++) {
      const t = (i + 0.5) / NW;
      tgt[i] = target === 'square' ? (t < 0.5 ? 1 : -1) : Math.sin(2 * Math.PI * t);
    }
    // WH coefficients (projections onto ±1 rows)
    const wc = seqOrder.map((row) => row.reduce((a, v, i) => a + v * tgt[i], 0) / NW);
    // Fourier (real DFT-ish) coefficients
    const fc: Array<{ mag: number; rec: (t: number) => number }> = [];
    for (let k = 0; k <= 16; k++) {
      let ac = 0, bs = 0;
      for (let i = 0; i < NW; i++) {
        const t = (i + 0.5) / NW;
        ac += tgt[i] * Math.cos(2 * Math.PI * k * t) * (k === 0 ? 1 : 2) / NW;
        bs += tgt[i] * Math.sin(2 * Math.PI * k * t) * 2 / NW;
      }
      fc.push({ mag: Math.hypot(ac, k === 0 ? 0 : bs), rec: (t) => ac * Math.cos(2 * Math.PI * k * t) + (k === 0 ? 0 : bs * Math.sin(2 * Math.PI * k * t)) });
    }
    // reconstruction with `kept` largest WH terms
    const order = wc.map((v, i) => ({ i, a: Math.abs(v) })).sort((a, b) => b.a - a.a);
    const recW = new Float64Array(NW);
    for (let j = 0; j < Math.min(kept, order.length); j++) {
      const { i } = order[j];
      for (let n = 0; n < NW; n++) recW[n] += wc[i] * seqOrder[i][n];
    }
    time.begin();
    const ts = Array.from({ length: NW }, (_, i) => (i + 0.5) / NW);
    time.trace(ts, Array.from(tgt), { color: p.axis, width: 1.2, dash: [4, 3] });
    // staircase render of Walsh reconstruction
    const fineT: number[] = [], fineY: number[] = [];
    for (let i = 0; i < NW; i++) { fineT.push(i / NW, (i + 1) / NW); fineY.push(recW[i], recW[i]); }
    time.trace(fineT, fineY, { color: p.traces[0], width: 2 });
    // error curves
    const errW: number[] = [], errF: number[] = [];
    for (let k = 1; k <= 16; k++) {
      const rw = new Float64Array(NW);
      for (let j = 0; j < k; j++) for (let n = 0; n < NW; n++) rw[n] += wc[order[j].i] * seqOrder[order[j].i][n];
      errW.push(Math.sqrt(rw.reduce((a, v, n) => a + (v - tgt[n]) ** 2, 0) / NW));
      const fOrder = fc.map((c, i) => ({ i, a: c.mag })).sort((a, b) => b.a - a.a).slice(0, k);
      let e2 = 0;
      for (let n = 0; n < NW; n++) {
        const t = (n + 0.5) / NW;
        let v = 0;
        for (const { i } of fOrder) v += fc[i].rec(t);
        e2 += (v - tgt[n]) ** 2;
      }
      errF.push(Math.sqrt(e2 / NW));
    }
    err.begin();
    err.trace(Array.from({ length: 16 }, (_, i) => i + 1), errW, { color: p.traces[0], width: 2 });
    err.trace(Array.from({ length: 16 }, (_, i) => i + 1), errF, { color: p.traces[1], width: 2, dash: [5, 3] });
    err.label(15.8, 0.72, 'Walsh —, Fourier ---', { align: 'right' });
    const winner = errW[kept - 1] < errF[kept - 1] ? 'Walsh' : 'Fourier';
    info.set(`${kept} terms kept: Walsh error ${errW[kept - 1].toFixed(3)}, Fourier error ${errF[kept - 1].toFixed(3)} → <b>${winner} wins for this signal</b>. The right basis matches the signal family.`);
  }
  const ctl = controls();
  const tSel = select('target', [['square', 'square (blocky)'], ['sine', 'sine (smooth)']], target, (v) => { target = v as any; draw(); });
  const kCtl = slider('terms kept', 1, 16, 1, kept, (v) => { kept = Math.round(v); draw(); }, (v) => String(Math.round(v)));
  ctl.append(tSel.el, kCtl.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.target) { target = p.target; tSel.set(p.target); } draw(); },
    resume() { draw(); }, destroy() { time.destroy(); err.destroy(); },
    getState() { return { target, kept }; },
  };
});

// ---------------------------------------------------------------- FreqResponseProbe
defineWidget('FreqResponseProbe', (root, params) => {
  let plant: 'rc' | 'msd' = params.plant || 'rc';
  let wIn = params.w ?? 0.5;
  const measured: Array<{ w: number; g: number; ph: number }> = [];
  root.appendChild(annotation(
    'How a lab measures |H(jω)|: feed one sinusoid, wait for steady state, read the amplitude ratio and the lag. ' +
    'Sinusoid in ⇒ <b>same-frequency</b> sinusoid out (the defining privilege of LTI: e^{jωt} are eigenfunctions). ' +
    'Sweep ω and the dots you measure <i>trace out</i> the frequency response — it is not given, it is discovered.'));
  const paneA = document.createElement('div');
  const paneB = document.createElement('div');
  root.append(paneA, paneB);
  const time = new Plot(paneA, { x: { min: 0, max: 20, label: 't' }, y: { min: -1.6, max: 1.6 }, height: 140, title: 'input (blue) vs steady-state output (green)' });
  const mag = new Plot(paneB, { x: { min: 0.1, max: 10, log: true, label: 'ω (log)' }, y: { min: 0, max: 1.4 }, height: 140, title: '|H(jω)| — the dots are YOUR measurements' });
  const info = readout();
  root.appendChild(info.el);

  const H = (w: number): { g: number; ph: number } => {
    if (plant === 'rc') {
      const g = 1 / Math.hypot(1, w);
      return { g, ph: -Math.atan(w) };
    }
    // mass-spring-damper ωₙ=2, ζ=0.15
    const wn = 2, z = 0.15;
    const denRe = wn * wn - w * w, denIm = 2 * z * wn * w;
    const d = Math.hypot(denRe, denIm);
    return { g: (wn * wn) / d, ph: -Math.atan2(denIm, denRe) };
  };

  function draw() {
    const p = palette();
    const { g, ph } = H(wIn);
    time.begin();
    const ts = Array.from({ length: 1200 }, (_, i) => (20 * i) / 1199);
    time.trace(ts, ts.map((t) => Math.sin(wIn * t)), { color: p.traces[0], width: 1.5 });
    time.trace(ts, ts.map((t) => g * Math.sin(wIn * t + ph)), { color: p.traces[2], width: 2 });
    const peak = plant === 'msd' ? H(2 * Math.sqrt(1 - 2 * 0.15 ** 2)).g : 1;
    mag.setYRange(0, Math.max(1.4, peak * 1.15));
    mag.begin();
    const ws = Array.from({ length: 300 }, (_, i) => 0.1 * Math.pow(100, i / 299));
    mag.trace(ws, ws.map((w) => H(w).g), { color: 'rgba(0,0,0,.2)', width: 1.2, dash: [4, 4] });
    for (const m of measured) mag.marker(m.w, m.g, { shape: 'dot', color: p.traces[2], size: 4 });
    mag.marker(wIn, g, { shape: 'o', color: p.traces[1], size: 6 });
    info.set(`ω = ${wIn.toFixed(2)}: gain = ${g.toFixed(3)} (amplitude ratio), phase = ${(ph * 180 / Math.PI).toFixed(0)}° (lag read from the zero-crossing offset). ` +
      (plant === 'msd' && Math.abs(wIn - 2) < 0.4 ? '<b>Resonance:</b> near ωₙ the output EXCEEDS the input.' : ''));
  }
  const ctl = controls();
  const pSel = select('plant', [['rc', 'RC low-pass (corner at ω=1)'], ['msd', 'mass-spring-damper (ωₙ=2, ζ=0.15)']], plant, (v) => { plant = v as any; measured.length = 0; draw(); });
  const wCtl = slider('input ω', 0.1, 10, 0.05, wIn, (v) => { wIn = v; draw(); });
  const measureBtn = button('log this measurement', () => { const { g, ph } = H(wIn); measured.push({ w: wIn, g, ph }); draw(); });
  ctl.append(pSel.el, wCtl.el, buttonRow(measureBtn));
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.plant) { plant = p.plant; pSel.set(p.plant); } draw(); },
    resume() { draw(); }, destroy() { time.destroy(); mag.destroy(); },
    getState() { return { plant, w: wIn, measurements: measured.length }; },
  };
});
