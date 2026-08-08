// Module 4 widget suite: SamplingLab (flagship), DTFTExplorer,
// BlockDiagramSandbox, FeedbackExplorer.
import { defineWidget, controls, slider, select, annotation, readout, button, buttonRow } from './framework';
import { Plot, palette } from '../sigplot/plot';
import { ZPK, cascade, feedback, freqResponse, impulseModes, evalModes, stepModes, polyRoots } from '../math/zpk';
import { C, c, cabs } from '../math/complex';

const sinc = (x: number) => (x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x));

// ---------------------------------------------------------------- SamplingLab
defineWidget('SamplingLab', (root, params, ctx) => {
  let f = params.f ?? 3;          // signal frequency, Hz
  let fs = params.fs ?? 10;       // sample rate, Hz
  let recon: 'ideal' | 'zoh' = params.recon || 'ideal';
  let audioCtx: AudioContext | null = null;

  root.appendChild(annotation(
    '<b>The flagship demo of Module 4.</b> Slide the sample rate f_s across the Nyquist line 2f. Above it, the ' +
    'reconstruction recovers the signal exactly. Below it, a clean, confident, <b>wrong</b> lower-frequency sinusoid ' +
    'threads the very same samples — aliasing is identity theft, and after it happens no filter can un-mix. ' +
    'In the spectrum pane, sampling replicates the spectrum at every multiple of f_s: Nyquist just says "keep the replicas from touching."'));

  const paneT = document.createElement('div');
  const paneF = document.createElement('div');
  root.append(paneT, paneF);
  const tp = new Plot(paneT, { x: { min: 0, max: 2, label: 't (s)' }, y: { min: -1.5, max: 1.5 }, height: 170, title: 'truth (thin), samples (dots), reconstruction (thick)' });
  const fp = new Plot(paneF, { x: { min: -25, max: 25, label: 'f (Hz)' }, y: { min: 0, max: 1.3 }, height: 150, title: 'spectrum: original (blue) + replicas at k·f_s (amber); dashed box = reconstruction filter' });
  const info = readout();
  root.appendChild(info.el);

  function aliasFreq(): number {
    // alias of f under sampling at fs: fold into [0, fs/2]
    let fa = Math.abs(f % fs);
    if (fa > fs / 2) fa = fs - fa;
    return fa;
  }

  function draw() {
    const p = palette();
    const T = 2;
    tp.begin();
    const N = 3000; // ≥ 8 px/sample of the truth trace — the truth must never itself alias on screen
    const ts = Array.from({ length: N }, (_, i) => (T * i) / (N - 1));
    tp.trace(ts, ts.map((t) => Math.sin(2 * Math.PI * f * t)), { color: p.traces[0], width: 1 });
    // samples
    const nSamp = Math.floor(T * fs);
    const sn = Array.from({ length: nSamp + 1 }, (_, i) => i / fs);
    const sv = sn.map((t) => Math.sin(2 * Math.PI * f * t));
    tp.stems(sn, sv, { color: p.traces[1], radius: 2.5 });
    // reconstruction
    if (recon === 'ideal') {
      const fa = aliasFreq();
      // ideal LPF at fs/2 reconstructs the ALIAS if f > fs/2 — the confident wrong sinusoid
      // sign/phase of the folded component:
      const k = Math.round(f / fs);
      const folded = f - k * fs; // in [-fs/2, fs/2]
      tp.trace(ts, ts.map((t) => Math.sin(2 * Math.PI * folded * t)), { color: p.traces[2], width: 2.4 });
    } else {
      const stair: number[] = [], stv: number[] = [];
      for (let i = 0; i < nSamp; i++) { stair.push(sn[i], sn[i + 1]); stv.push(sv[i], sv[i]); }
      tp.trace(stair, stv, { color: p.traces[2], width: 2 });
    }
    // spectrum with replicas
    fp.begin();
    const drawPair = (fc: number, color: string, alpha: number) => {
      for (const s of [fc, -fc]) {
        if (Math.abs(s) < 25) {
          fp.stems([s], [1], { color, alpha, radius: 2.5 });
        }
      }
    };
    drawPair(f, p.traces[0], 1);
    for (let k = 1; k <= 4; k++) {
      drawPair(Math.abs(k * fs - f), p.traces[1], 0.55);
      drawPair(k * fs + f, p.traces[1], 0.55);
    }
    // reconstruction filter box
    const ctx2 = fp.ctx;
    ctx2.save();
    ctx2.strokeStyle = p.traces[2];
    ctx2.setLineDash([5, 4]);
    ctx2.strokeRect(fp.toX(-fs / 2), fp.toY(1.15), fp.toX(fs / 2) - fp.toX(-fs / 2), fp.toY(0) - fp.toY(1.15));
    ctx2.restore();
    const nyq = fs >= 2 * f;
    info.set(nyq
      ? `f_s = ${fs.toFixed(1)} ≥ 2f = ${2 * f}: replicas keep their distance; the filter box isolates the original. Perfect reconstruction.`
      : `<b>ALIASED:</b> f_s = ${fs.toFixed(1)} < 2f = ${2 * f}. A replica has invaded the filter box: the reconstruction is a flawless ${aliasFreq().toFixed(2)} Hz sinusoid — |f − k·f_s| = ${aliasFreq().toFixed(2)} — and no later processing can ever tell it from a real one.`);
  }

  // Audio A/B (explicit gesture — AudioContexts start suspended by policy)
  const play = (freq: number) => {
    try {
      audioCtx = audioCtx || new AudioContext();
      audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      g.gain.value = 0.12;
      // generate the PREDICTED tone arithmetically — never trust the browser resampler to alias "correctly"
      osc.frequency.value = 110 * freq;
      osc.connect(g).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    } catch {}
  };

  const ctl = controls();
  const fCtl = slider('signal f (Hz)', 1, 12, 0.5, f, (v) => { f = v; draw(); });
  const fsCtl = slider('sample rate f_s', 2, 30, 0.5, fs, (v) => { fs = v; draw(); });
  const rSel = select('reconstruction', [['ideal', 'ideal low-pass (sum of sincs)'], ['zoh', 'zero-order hold (staircase)']], recon, (v) => { recon = v as any; draw(); });
  const hear = button('🔊 hear original', () => play(f));
  const hearR = button('🔊 hear reconstruction', () => play(recon === 'ideal' ? aliasFreq() : f));
  ctl.append(fCtl.el, fsCtl.el, rSel.el, buttonRow(hear, hearR));
  root.appendChild(ctl);
  root.appendChild(annotation('Audio plays only on the buttons (browsers suspend audio until a click). Original vs reconstruction is pitched at 110×f Hz — set f=3, f_s=5 and the "3" comes back as a "2".'));
  draw();
  return {
    setParams(p: any) { if (typeof p.f === 'number') { f = p.f; fCtl.set(p.f); } if (typeof p.fs === 'number') { fs = p.fs; fsCtl.set(p.fs); } if (p.recon) { recon = p.recon; rSel.set(p.recon); } draw(); },
    resume() { draw(); },
    destroy() { tp.destroy(); fp.destroy(); try { audioCtx?.close(); } catch {} },
    getState() { return { f, fs, aliased: fs < 2 * f, aliasFreq: aliasFreq() }; },
  };
});

// ---------------------------------------------------------------- DTFTExplorer
defineWidget('DTFTExplorer', (root, params) => {
  let seq: 'pulse' | 'expn' | 'coswin' = params.seq || 'expn';
  let a = params.a ?? 0.8, len = params.len ?? 8;
  root.appendChild(annotation(
    'DT frequency lives on a <b>circle</b>: X(e^{jΩ}) is always 2π-periodic (scroll the ribbon — it never ends), and ' +
    'Ω = π is the fastest possible wiggle (alternation). For the windowed cosine, stretch the window and watch the ' +
    'mainlobe narrow: <b>resolution costs samples</b>.'));
  const paneA = document.createElement('div');
  const paneB = document.createElement('div');
  root.append(paneA, paneB);
  const tp = new Plot(paneA, { x: { min: -2, max: 20, label: 'n' }, y: { min: -1.3, max: 1.3 }, height: 120, title: 'x[n]' });
  const fp = new Plot(paneB, { x: { min: -8, max: 8, label: 'Ω (rad/sample)' }, y: { min: 0, max: 6 }, height: 160, title: '|X(e^{jΩ})| — one period highlighted, replicas ad infinitum' });
  const info = readout();
  root.appendChild(info.el);

  const xOf = (n: number): number => {
    if (seq === 'pulse') return n >= 0 && n < 5 ? 1 : 0;
    if (seq === 'expn') return n >= 0 ? Math.pow(a, n) : 0;
    return n >= 0 && n < len ? Math.cos(1.2 * n) : 0;
  };
  function Xmag(W: number): number {
    let re = 0, im = 0;
    for (let n = 0; n < 40; n++) {
      const v = xOf(n);
      re += v * Math.cos(W * n);
      im -= v * Math.sin(W * n);
    }
    return Math.hypot(re, im);
  }
  function draw() {
    const p = palette();
    tp.begin();
    const ns = Array.from({ length: 23 }, (_, i) => i - 2);
    tp.stems(ns, ns.map(xOf), { color: p.traces[0] });
    const peak = Math.max(...Array.from({ length: 200 }, (_, i) => Xmag(-Math.PI + (2 * Math.PI * i) / 199)));
    fp.setYRange(0, peak * 1.15);
    fp.begin();
    fp.regionX(-Math.PI, Math.PI, p.fill);
    const ws = Array.from({ length: 1200 }, (_, i) => -8 + (16 * i) / 1199);
    fp.trace(ws, ws.map((W) => Xmag(((W + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI)), { color: p.traces[2], width: 1.8 });
    fp.vline(Math.PI, { color: p.traces[1], dash: [4, 3], label: 'Ω=π (alternation)' });
    fp.vline(-Math.PI, { color: p.traces[1], dash: [4, 3] });
    info.set(seq === 'coswin'
      ? `window length N=${len}: mainlobe width ≈ 4π/N = ${(4 * Math.PI / len).toFixed(2)} rad — double N, halve the lobe. The DTFT is the unit-circle slice of the z-transform.`
      : seq === 'expn'
        ? `aⁿu[n] with a=${a.toFixed(2)}: the DT one-pole shape — compare the CT 1/(1+jω) with the axis wrapped into a circle. Exists because ROC |z|>${a.toFixed(2)} contains the unit circle.`
        : 'finite pulse → periodic sinc-like spectrum. Shaded band = one period [−π, π]: everything outside is the same information again.');
  }
  const ctl = controls();
  const sSel = select('sequence', [['expn', 'aⁿu[n]'], ['pulse', '5-point pulse'], ['coswin', 'windowed cos(1.2n)']], seq, (v) => { seq = v as any; aCtl.el.style.display = seq === 'expn' ? '' : 'none'; lenCtl.el.style.display = seq === 'coswin' ? '' : 'none'; draw(); });
  const aCtl = slider('a', 0.3, 0.95, 0.01, a, (v) => { a = v; draw(); });
  const lenCtl = slider('window N', 4, 32, 1, len, (v) => { len = Math.round(v); draw(); }, (v) => String(Math.round(v)));
  lenCtl.el.style.display = seq === 'coswin' ? '' : 'none';
  aCtl.el.style.display = seq === 'expn' ? '' : 'none';
  ctl.append(sSel.el, aCtl.el, lenCtl.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.seq) { seq = p.seq; sSel.set(p.seq); } draw(); },
    resume() { draw(); }, destroy() { tp.destroy(); fp.destroy(); },
    getState() { return { seq, a, len }; },
  };
});

// ---------------------------------------------------------------- BlockDiagramSandbox
defineWidget('BlockDiagramSandbox', (root, params) => {
  let topology: 'cascade' | 'parallel' | 'feedback' | 'feedforward' | 'cancelhazard' = params.topology || 'cascade';
  root.appendChild(annotation(
    'Interconnection algebra is ONE skill: track what happens to poles and zeros. Cascade: they pool. ' +
    'Parallel: a common denominator — and <b>new zeros appear</b> where the branches interfere. Feedback: the poles ' +
    '<b>move</b>. The hazard preset: cancelling a right-half-plane pole with a zero looks stable on paper — ' +
    'the internal signal quietly diverges anyway.'));
  const diagram = document.createElement('div');
  diagram.style.cssText = 'font-family:var(--mono);font-size:.85rem;text-align:center;padding:.4rem;color:var(--ink-soft)';
  root.appendChild(diagram);
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const paneZ = document.createElement('div');
  const paneS = document.createElement('div');
  paneZ.style.cssText = 'flex:1;min-width:13rem';
  paneS.style.cssText = 'flex:1.4;min-width:16rem';
  row.append(paneZ, paneS);
  root.appendChild(row);
  const zpl = new Plot(paneZ, { x: { min: -3, max: 2, label: 'σ' }, y: { min: -3, max: 3, label: 'jω' }, height: 180, title: 'composite poles ×, zeros ○' });
  const sp = new Plot(paneS, { x: { min: 0, max: 10, label: 't' }, y: { min: -1, max: 2.5 }, height: 180, title: 'step response (green: output; red: INTERNAL signal in the hazard)' });
  const info = readout();
  root.appendChild(info.el);

  const G1: ZPK = { zeros: [], poles: [c(-1)], k: 1 };          // 1/(s+1)
  const G2: ZPK = { zeros: [], poles: [c(-2)], k: 2 };          // 2/(s+2)
  const unstable: ZPK = { zeros: [], poles: [c(0.5)], k: 1 };   // 1/(s−0.5)  RHP pole
  const canceller: ZPK = { zeros: [c(0.5)], poles: [c(-2)], k: 1 }; // (s−0.5)/(s+2)

  function compose(): { sys: ZPK; label: string; internal?: ZPK } {
    switch (topology) {
      case 'cascade': return { sys: cascade(G1, G2), label: 'x → [1/(s+1)] → [2/(s+2)] → y     H = H₁H₂ — poles pool at −1 and −2' };
      case 'parallel': {
        // 1/(s+1) + 2/(s+2) = (3s+4)/((s+1)(s+2)) — a NEW zero at −4/3
        const num = [3, 4];
        return { sys: { zeros: polyRoots(num), poles: [c(-1), c(-2)], k: 3 }, label: 'x → [H₁] ↘ (+) → y  ∥  [H₂] ↗     H = H₁+H₂ — a new zero appears at s = −4/3' };
      }
      case 'feedback': return { sys: feedback(G1, { zeros: [], poles: [], k: 1.5 }), label: 'x →(+)→ [1/(s+1)] → y, fed back with k=1.5     H = G/(1+kG) — the pole MOVED from −1 to −2.5' };
      case 'feedforward': {
        // y = x + delay-ish path: G1 + direct: (1 + 1/(s+1)) = (s+2)/(s+1) — zero placement
        return { sys: { zeros: [c(-2)], poles: [c(-1)], k: 1 }, label: 'x → [1] ↘ (+) → y  ∥  [1/(s+1)] ↗     feed-forward PLACES a zero (here at −2) — used to cancel disturbances' };
      }
      case 'cancelhazard': {
        const composite = cascade(unstable, canceller); // (s−0.5)/((s−0.5)(s+2)) "=" 1/(s+2)
        return { sys: { zeros: [], poles: [c(-2)], k: 1 }, label: 'x → [1/(s−0.5)] → w → [(s−0.5)/(s+2)] → y     algebra cancels to 1/(s+2)… but watch w', internal: unstable };
      }
    }
  }

  function draw() {
    const p = palette();
    const { sys, label, internal } = compose();
    diagram.textContent = label;
    zpl.begin();
    zpl.regionX(-3, 0, p.grid);
    for (const z of sys.zeros) zpl.marker(z.re, z.im, { shape: 'o', color: p.traces[2], size: 6 });
    for (const pl of sys.poles) zpl.marker(pl.re, pl.im, { shape: 'x', color: p.traces[0], size: 6 });
    if (topology === 'cancelhazard') zpl.marker(0.5, 0, { shape: 'x', color: p.bad, size: 6, label: 'hidden pole (cancelled "exactly")' });
    sp.begin();
    const ts = new Float64Array(500);
    for (let i = 0; i < 500; i++) ts[i] = (10 * i) / 499;
    const y = evalModes(stepModes(sys).modes, ts);
    sp.trace(Array.from(ts), Array.from(y), { color: p.traces[2], width: 2.2, clipY: 10 });
    if (internal) {
      const w = evalModes(stepModes(internal).modes, ts);
      sp.trace(Array.from(ts), Array.from(w), { color: p.bad, width: 2, dash: [5, 3], clipY: 10 });
      info.set('<b>The output (green) looks perfectly stable — the algebra "cancelled" the RHP pole.</b> But the internal wire w (red) is the unstable plant\'s own output: it diverges. Never cancel RHP poles with zeros; hide a mode and it stays in the building. (This is also what uncontrollable/unobservable modes look like from the outside — Module 5 closes this loop.)');
    } else {
      info.set(topology === 'parallel'
        ? 'Parallel branches interfere: the composite has a zero neither branch had. Zeros are where branch outputs cancel.'
        : topology === 'feedback'
          ? 'Feedback moved the pole without touching the plant: −1 → −(1+k). That relocation is the entire point of feedback (Module 4/5).'
          : topology === 'feedforward'
            ? 'Feed-forward adds a parallel direct path — it cannot move poles (no loop!), but it PLACES zeros, which is how you cancel a disturbance you can measure.'
            : 'Cascade: transfer functions multiply; poles and zeros simply pool. Order never matters for LTI blocks.');
    }
  }
  const ctl = controls();
  const tSel = select('topology', [['cascade', 'cascade'], ['parallel', 'parallel'], ['feedback', 'feedback'], ['feedforward', 'feed-forward'], ['cancelhazard', '⚠ cancellation hazard']], topology, (v) => { topology = v as any; draw(); });
  ctl.append(tSel.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.topology) { topology = p.topology; tSel.set(p.topology); } draw(); },
    resume() { draw(); }, destroy() { zpl.destroy(); sp.destroy(); },
    getState() { return { topology }; },
  };
});

// ---------------------------------------------------------------- FeedbackExplorer
defineWidget('FeedbackExplorer', (root, params) => {
  let plant: 'motor' | 'integrator' | 'double' | 'resonant' | 'rhpzero' = params.plant || 'motor';
  let K = params.k ?? 1;
  const trails: Array<{ k: number; poles: C[] }> = [];
  root.appendChild(annotation(
    '<b>Feedback relocates poles</b> — its superpower and its danger. Sweep K and watch the closed-loop poles migrate ' +
    '(their trails ARE the root locus, discovered before it is named). Watch the step response react in the same instant. ' +
    'The RHP-zero preset shows the cruel case: more gain pulls a pole TOWARD the zero — into instability.'));
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const paneS = document.createElement('div');
  const paneT = document.createElement('div');
  paneS.style.cssText = 'flex:1;min-width:15rem';
  paneT.style.cssText = 'flex:1;min-width:15rem';
  row.append(paneS, paneT);
  root.appendChild(row);
  const sp = new Plot(paneS, { x: { min: -5, max: 2, label: 'σ' }, y: { min: -4, max: 4, label: 'jω' }, height: 200, title: 'closed-loop poles (dots) + trails as K sweeps; ghosts = open-loop' });
  const tp = new Plot(paneT, { x: { min: 0, max: 12, label: 't' }, y: { min: -0.5, max: 2.2 }, height: 200, title: 'closed-loop step response' });
  const info = readout();
  root.appendChild(info.el);

  const plants: Record<string, { sys: ZPK; note: string }> = {
    motor: { sys: { zeros: [], poles: [c(0), c(-2)], k: 1 }, note: 'motor 1/(s(s+2)): type-1 — zero steady-state error to a step, overshoot grows with K' },
    integrator: { sys: { zeros: [], poles: [c(0)], k: 1 }, note: 'integrator 1/s: closed loop = first-order, stable for every K > 0 — feedback tames it completely' },
    double: { sys: { zeros: [], poles: [c(0), c(0)], k: 1 }, note: 'double integrator 1/s²: poles pinned to the axis for ALL K — pure oscillation; no gain can damp it (you need a zero: PD control)' },
    resonant: { sys: { zeros: [], poles: [c(-0.2, 2), c(-0.2, -2)], k: 4 }, note: 'lightly damped plant: modest K helps; large K rams the poles axis-ward' },
    rhpzero: { sys: { zeros: [c(1)], poles: [c(-1), c(-3)], k: -3 }, note: 'non-minimum-phase (zero at +1): the locus is PULLED TOWARD the RHP zero — raising K destabilizes. Also note the step response dips the WRONG way first' },
  };

  function closedLoop(k: number): ZPK {
    const g = plants[plant].sys;
    return feedback({ ...g, k: g.k * k }, { zeros: [], poles: [], k: 1 });
  }

  function draw() {
    const p = palette();
    const g = plants[plant].sys;
    const cl = closedLoop(K);
    sp.begin();
    sp.regionX(-5, 0, p.grid);
    for (const pl of g.poles) sp.marker(pl.re, pl.im, { shape: 'x', color: p.axis, size: 5 });
    for (const z of g.zeros) sp.marker(z.re, z.im, { shape: 'o', color: p.axis, size: 5 });
    // trails
    for (const tr of trails) for (const pl of tr.poles) sp.marker(pl.re, pl.im, { shape: 'dot', color: p.traces[1], size: 1.5 });
    let unstable = false;
    for (const pl of cl.poles) {
      if (pl.re > 1e-6) unstable = true;
      sp.marker(pl.re, pl.im, { shape: 'dot', color: pl.re > 1e-6 ? p.bad : p.traces[0], size: 5 });
    }
    tp.begin();
    const ts = new Float64Array(500);
    for (let i = 0; i < 500; i++) ts[i] = (12 * i) / 499;
    const y = evalModes(stepModes(cl).modes, ts);
    let yMax = Math.min(4, Math.max(1.2, ...Array.from(y).filter(isFinite).map(Math.abs)));
    tp.setYRange(plant === 'rhpzero' ? -yMax : -0.5, yMax * 1.15);
    tp.trace(Array.from(ts), Array.from(y), { color: unstable ? p.bad : p.traces[2], width: 2.2, clipY: 8 });
    const ssErr = plant === 'motor' || plant === 'integrator' || plant === 'double' ? 0 : 1 / (1 + K * Math.abs(plants[plant].sys.k) / (plant === 'resonant' ? 4 : 1));
    info.set(`K = ${K.toFixed(2)} — ${unstable ? '<b>UNSTABLE: a closed-loop pole crossed the axis</b>' : 'stable'}. ${plants[plant].note}.`);
  }
  const ctl = controls();
  const pSel = select('plant G(s)', Object.entries(plants).map(([k2, v]) => [k2, k2]), plant, (v) => { plant = v as any; trails.length = 0; draw(); });
  const kCtl = slider('gain K', 0.05, 12, 0.05, K, (v) => {
    K = v;
    trails.push({ k: v, poles: closedLoop(v).poles });
    if (trails.length > 220) trails.shift();
    draw();
  });
  ctl.append(pSel.el, kCtl.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.plant) { plant = p.plant; pSel.set(p.plant); trails.length = 0; } if (typeof p.k === 'number') { K = p.k; kCtl.set(p.k); } draw(); },
    resume() { draw(); }, destroy() { sp.destroy(); tp.destroy(); },
    getState() { const cl = closedLoop(K); return { plant, k: K, stable: cl.poles.every((pl) => pl.re < -1e-6) }; },
  };
});
