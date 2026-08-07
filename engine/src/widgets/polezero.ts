// ★ HERO: Pole-Zero ↔ Impulse Response ↔ Frequency Response Triple-Link.
// Drag poles (×) and zeros (○) on the s-plane; three synchronized consequences:
// h(t) with its per-mode decomposition (partial fractions made visible),
// |H(jω)| and ∠H(jω) with a geometric-evaluation overlay (click a frequency:
// vectors from every pole/zero to jω*, |H| = Π|zero vecs| / Π|pole vecs|).
// The workhorse of Modules 3–5: Bode, Nyquist and feedback all mount this.
import { defineWidget, controls, slider, select, annotation, readout, button, buttonRow } from './framework';
import { Plot, palette, attachDrag } from '../sigplot/plot';
import { ZPK, freqResponse, unwrapPhase, impulseModes, evalModes, modeTraces } from '../math/zpk';
import { C, c, cabs, csub } from '../math/complex';

const PRESETS: Record<string, { label: string; sys: ZPK; note: string }> = {
  lp1: { label: '1st-order low-pass', sys: { zeros: [], poles: [c(-1)], k: 1 }, note: 'one real pole: pure exponential memory, gentle −20 dB/dec rolloff' },
  resonator: { label: '2nd-order resonator', sys: { zeros: [], poles: [c(-0.35, 2), c(-0.35, -2)], k: 4.1 }, note: 'a conjugate pole pair: ringing in time = a peak in frequency — one cause, two views' },
  overdamped: { label: 'overdamped 2nd-order', sys: { zeros: [], poles: [c(-0.5), c(-2.5)], k: 1.25 }, note: 'two real poles: no ringing; the slow pole dominates' },
  notch: { label: 'notch', sys: { zeros: [c(0, 1.5), c(0, -1.5)], poles: [c(-0.8, 1.4), c(-0.8, -1.4)], k: 1 }, note: 'zeros ON the jω axis kill exactly that frequency — the pole-vector product stays finite while a zero vector hits length 0' },
  allpass: { label: 'all-pass', sys: { zeros: [c(0.6, 1.2), c(0.6, -1.2)], poles: [c(-0.6, 1.2), c(-0.6, -1.2)], k: 1 }, note: 'zeros mirror poles across the axis: |H| flat (vector lengths match at every ω) but phase very much not — same magnitude ≠ same system' },
  unstable: { label: 'unstable pair', sys: { zeros: [], poles: [c(0.25, 1.8), c(0.25, -1.8)], k: 1 }, note: 'poles in the right half-plane: h(t) grows without bound — the frequency response no longer even converges' },
};

defineWidget('PoleZeroExplorer', (root, params, ctx) => {
  let sys: ZPK = clone(params.preset && PRESETS[params.preset] ? PRESETS[params.preset].sys : PRESETS.resonator.sys);
  let K = params.k ?? sys.k;
  let probe: number | null = null; // clicked frequency for geometric evaluation
  let showModes = true;

  root.appendChild(annotation(
    '<b>Drag the ×’s (poles) and ○’s (zeros).</b> Poles are the system’s natural notes; zeros decide which notes the ' +
    'input can reach. One drag, three synchronized consequences — that is the whole point of the transform domain. ' +
    'Click the magnitude plot to see |H| computed geometrically from vector lengths.'));

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const paneS = document.createElement('div');
  paneS.style.cssText = 'flex:1;min-width:15rem';
  const paneH = document.createElement('div');
  paneH.style.cssText = 'flex:1;min-width:15rem';
  row.append(paneS, paneH);
  const row2 = document.createElement('div');
  row2.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const paneMag = document.createElement('div');
  const panePh = document.createElement('div');
  paneMag.style.cssText = panePh.style.cssText = 'flex:1;min-width:15rem';
  row2.append(paneMag, panePh);
  root.append(row, row2);

  const SLIM = 3.2;
  const sPlane = new Plot(paneS, { x: { min: -SLIM, max: SLIM, label: 'σ' }, y: { min: -SLIM, max: SLIM, label: 'jω' }, height: 230, title: 's-plane' });
  const hPlot = new Plot(paneH, { x: { min: 0, max: 8, label: 't' }, y: { min: -1.5, max: 1.5 }, height: 230, title: 'h(t) — impulse response' });
  const magPlot = new Plot(paneMag, { x: { min: 0, max: 4, label: 'ω' }, y: { min: 0, max: 3 }, height: 160, title: '|H(jω)|' });
  const phPlot = new Plot(panePh, { x: { min: 0, max: 4, label: 'ω' }, y: { min: -3.4, max: 3.4 }, height: 160, title: '∠H(jω)  (rad)' });
  const info = readout();
  root.appendChild(info.el);

  const stabLamp = document.createElement('div');
  stabLamp.style.cssText = 'font-size:.8rem;font-weight:650;margin:.2rem 0';
  root.appendChild(stabLamp);

  function currentSys(): ZPK { return { ...sys, k: K }; }

  function draw() {
    const p = palette();
    const S = currentSys();
    // ---- s-plane ----
    sPlane.begin();
    sPlane.regionX(-SLIM, 0, p.grid); // stable half shaded subtly
    for (const z of S.zeros) sPlane.marker(z.re, z.im, { shape: 'o', color: p.traces[2], size: 6 });
    for (const pl of S.poles) sPlane.marker(pl.re, pl.im, { shape: 'x', color: p.traces[0], size: 6 });
    // geometric evaluation vectors
    if (probe != null) {
      const target = c(0, probe);
      const ctx2 = sPlane.ctx;
      ctx2.save();
      let num = 1, den = 1;
      for (const z of S.zeros) {
        drawVec(sPlane, z, target, p.traces[2]);
        num *= cabs(csub(target, z));
      }
      for (const pl of S.poles) {
        drawVec(sPlane, pl, target, p.traces[0]);
        den *= cabs(csub(target, pl));
      }
      ctx2.restore();
      sPlane.marker(0, probe, { shape: 'dot', color: p.traces[1], size: 4, label: `jω = j${probe.toFixed(2)}` });
      info.set(`|H(j${probe.toFixed(2)})| = |K| · Π|zero vectors| / Π|pole vectors| = ${Math.abs(K).toFixed(2)} × ${num.toFixed(2)} / ${den.toFixed(2)} = <b>${((Math.abs(K) * num) / den).toFixed(3)}</b> — short pole vector ⇒ big response. That is resonance.`);
    }
    // ζ/ωₙ readout for a dominant conjugate pair
    const pair = S.poles.find((pl) => pl.im > 1e-6);
    if (pair) {
      const wn = cabs(pair);
      const zeta = wn > 0 ? -pair.re / wn : 0;
      sPlane.label(-SLIM + 0.15, -SLIM + 0.35, `ωₙ=${wn.toFixed(2)}  ζ=${zeta.toFixed(2)}`);
    }

    // ---- h(t) with mode decomposition ----
    const { modes } = impulseModes(S);
    const M = 700;
    const ts = new Float64Array(M);
    for (let i = 0; i < M; i++) ts[i] = (8 * i) / (M - 1);
    const h = evalModes(modes, ts);
    let hMax = 0.1;
    for (let i = 0; i < M; i++) if (isFinite(h[i])) hMax = Math.max(hMax, Math.abs(h[i]));
    hMax = Math.min(hMax, 50);
    hPlot.setYRange(-hMax * 1.15, hMax * 1.15);
    hPlot.begin();
    if (showModes && modes.length > 1) {
      for (let mi = 0; mi < Math.min(4, modeTraces(modes, ts).length); mi++) {
        const tr = modeTraces(modes, ts)[mi];
        hPlot.trace(Array.from(ts), Array.from(tr.y), { color: p.traces[(mi + 3) % 6], width: 1.1, alpha: 0.55, clipY: hMax * 2 });
      }
    }
    hPlot.trace(Array.from(ts), Array.from(h), { color: p.traces[0], width: 2.2, clipY: hMax * 2 });
    if (modes.length > 1 && showModes) hPlot.label(7.9, hMax, 'thin traces: the modes (partial fractions, live)', { align: 'right' });

    // ---- frequency response ----
    const unstable = S.poles.some((pl) => pl.re > 1e-9);
    const W = 400;
    const ws: C[] = [];
    const wArr: number[] = [];
    for (let i = 0; i < W; i++) { const w = (4 * i) / (W - 1); ws.push(c(0, w)); wArr.push(w); }
    const { mag, phase } = freqResponse(S, ws);
    const magMax = Math.min(20, Math.max(...mag) * 1.1 || 1);
    magPlot.setYRange(0, magMax);
    magPlot.begin();
    if (unstable) {
      magPlot.label(2, magMax / 2, '⚠ pole in the right half-plane — H(jω) is formal only: the integral defining it diverges', { align: 'center', color: p.bad });
    }
    magPlot.trace(wArr, Array.from(mag), { color: p.traces[0], width: 2, alpha: unstable ? 0.35 : 1 });
    if (probe != null) magPlot.vline(probe, { color: p.traces[1], dash: [3, 3] });
    phPlot.begin();
    phPlot.trace(wArr, Array.from(unwrapPhase(phase)), { color: p.traces[0], width: 2, alpha: unstable ? 0.35 : 1 });
    if (probe != null) phPlot.vline(probe, { color: p.traces[1], dash: [3, 3] });

    stabLamp.textContent = unstable
      ? '● UNSTABLE — a pole crossed into the right half-plane: h(t) grows without bound'
      : S.poles.some((pl) => Math.abs(pl.re) < 1e-3)
        ? '● MARGINAL — pole on the jω axis: h(t) oscillates forever, neither dying nor growing'
        : '● stable — all poles in the left half-plane: every mode dies out';
    stabLamp.style.color = unstable ? 'var(--bad)' : S.poles.some((pl) => Math.abs(pl.re) < 1e-3) ? 'var(--warn)' : 'var(--good)';
  }

  function drawVec(plot: Plot, from: C, to: C, color: string) {
    const ctx2 = plot.ctx;
    ctx2.strokeStyle = color;
    ctx2.lineWidth = 1.2;
    ctx2.setLineDash([4, 3]);
    ctx2.beginPath();
    ctx2.moveTo(plot.toX(from.re), plot.toY(from.im));
    ctx2.lineTo(plot.toX(to.re), plot.toY(to.im));
    ctx2.stroke();
    ctx2.setLineDash([]);
  }

  // ---- dragging poles/zeros (conjugate pairs move together) ----
  attachDrag(sPlane,
    (x, y) => {
      const all = [...sys.poles.map((p, i) => ({ kind: 'p', i, pt: p })), ...sys.zeros.map((z, i) => ({ kind: 'z', i, pt: z }))];
      let best: any = null, bestD = 0.35;
      for (const a of all) {
        const d = Math.hypot(a.pt.re - x, a.pt.im - y);
        if (d < bestD) { bestD = d; best = a; }
      }
      return best ? `${best.kind}${best.i}` : null;
    },
    (id, x, y) => {
      const kind = id[0], i = parseInt(id.slice(1));
      const arr = kind === 'p' ? sys.poles : sys.zeros;
      const old = arr[i];
      // snap near the real axis; keep conjugate partner mirrored
      const im = Math.abs(y) < 0.12 ? 0 : y;
      arr[i] = c(Math.max(-SLIM, Math.min(SLIM, x)), im);
      const partner = arr.findIndex((q, j) => j !== i && Math.abs(q.re - old.re) < 1e-9 && Math.abs(q.im + old.im) < 1e-9);
      if (partner >= 0) arr[partner] = c(arr[i].re, -arr[i].im);
      draw();
    });

  // ---- probe click on the magnitude plot ----
  magPlot.canvas.addEventListener('pointerdown', (e) => {
    const r = magPlot.canvas.getBoundingClientRect();
    const w = magPlot.fromX(e.clientX - r.left);
    probe = w >= 0 && w <= 4 ? w : null;
    draw();
  });

  // ---- controls ----
  const ctl = controls();
  const presetSel = select('preset', Object.entries(PRESETS).map(([k, v]) => [k, v.label]), params.preset || 'resonator', (v) => {
    sys = clone(PRESETS[v].sys);
    K = PRESETS[v].k ?? PRESETS[v].sys.k;
    kCtl.set(K);
    probe = null;
    note.innerHTML = PRESETS[v].note;
    draw();
  });
  const kCtl = slider('gain K', 0.1, 8, 0.05, K, (v) => { K = v; draw(); });
  const modesBtn = button('toggle mode traces', () => { showModes = !showModes; draw(); });
  const addPole = button('+ pole pair', () => {
    if (sys.poles.length >= 6) return;
    sys.poles.push(c(-1.2, 1.2), c(-1.2, -1.2));
    draw();
  });
  const addZero = button('+ zero pair', () => {
    if (sys.zeros.length >= 6) return;
    sys.zeros.push(c(-0.4, 0.8), c(-0.4, -0.8));
    draw();
  });
  const clearBtn = button('remove extras', () => {
    sys.poles = sys.poles.slice(0, 2);
    sys.zeros = sys.zeros.slice(0, 2);
    draw();
  });
  ctl.append(presetSel.el, kCtl.el, buttonRow(modesBtn, addPole, addZero, clearBtn));
  root.appendChild(ctl);
  const note = document.createElement('div');
  note.className = 'muted';
  note.style.cssText = 'font-size:.83rem;margin:.3rem 0';
  note.innerHTML = PRESETS[params.preset]?.note || PRESETS.resonator.note;
  root.appendChild(note);

  draw();

  return {
    setParams(p: any) {
      if (p.preset && PRESETS[p.preset]) {
        sys = clone(PRESETS[p.preset].sys);
        K = PRESETS[p.preset].sys.k;
        presetSel.set(p.preset);
        kCtl.set(K);
      }
      if (typeof p.k === 'number') { K = p.k; kCtl.set(p.k); }
      draw();
    },
    pause() {},
    resume() { draw(); },
    destroy() { sPlane.destroy(); hPlot.destroy(); magPlot.destroy(); phPlot.destroy(); },
    getState() {
      const S = currentSys();
      const pair = S.poles.find((pl) => pl.im > 1e-6);
      const wn = pair ? cabs(pair) : null;
      return {
        polesReMax: Math.max(...S.poles.map((pl) => pl.re)),
        nPoles: S.poles.length, nZeros: S.zeros.length,
        zeta: pair && wn ? -pair.re / wn : null, wn,
        k: K,
        stable: S.poles.every((pl) => pl.re < -1e-9),
      };
    },
  };
});

function clone(z: ZPK): ZPK {
  return { zeros: z.zeros.map((q) => ({ ...q })), poles: z.poles.map((q) => ({ ...q })), k: z.k };
}
