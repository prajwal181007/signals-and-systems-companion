// Module 5 widget suite: PhasePortrait (+controllability mode), BodeWorkbench,
// NyquistVoyage.
import { defineWidget, controls, slider, select, annotation, readout, button, buttonRow } from './framework';
import { Plot, palette, attachDrag } from '../sigplot/plot';
import { ZPK, freqResponse, unwrapPhase, logGrid, stepModes, evalModes, feedback } from '../math/zpk';
import { C, c, cabs, carg, csub, cmul, cdiv, cexp, cscale } from '../math/complex';

// ---------------------------------------------------------------- PhasePortrait
defineWidget('PhasePortrait', (root, params) => {
  let A = [[params.a11 ?? 0, params.a12 ?? 1], [params.a21 ?? -2, params.a22 ?? -0.6]];
  let mode: 'free' | 'control' = params.mode || 'free';
  let B = [0, 1];
  let trajectories: Array<Array<[number, number]>> = [];

  root.appendChild(annotation(
    'The phase plane shows <b>all possible histories at once</b>: every arrow says where the state goes next. ' +
    'Click to drop a marble and watch its trajectory. Eigenvectors are the invariant rails; eigenvalues are the ' +
    'poles wearing matrix clothing. In <b>control mode</b>, drag the green B-arrow: when it collapses onto an ' +
    'eigenvector, rank[B AB] drops to 1 and a whole direction of the plane becomes unreachable.'));
  const paneA = document.createElement('div');
  root.appendChild(paneA);
  const pp = new Plot(paneA, { x: { min: -3, max: 3, label: 'x₁' }, y: { min: -3, max: 3, label: 'x₂' }, height: 260 });
  const info = readout();
  root.appendChild(info.el);

  function eig(): { l1: C; l2: C; v1: [number, number] | null; v2: [number, number] | null } {
    const tr = A[0][0] + A[1][1];
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const disc = tr * tr - 4 * det;
    if (disc >= 0) {
      const l1 = c((tr + Math.sqrt(disc)) / 2), l2 = c((tr - Math.sqrt(disc)) / 2);
      const vec = (l: number): [number, number] | null => {
        if (Math.abs(A[0][1]) > 1e-9) return [A[0][1], l - A[0][0]];
        if (Math.abs(A[1][0]) > 1e-9) return [l - A[1][1], A[1][0]];
        return null;
      };
      return { l1, l2, v1: vec(l1.re), v2: vec(l2.re) };
    }
    return { l1: c(tr / 2, Math.sqrt(-disc) / 2), l2: c(tr / 2, -Math.sqrt(-disc) / 2), v1: null, v2: null };
  }

  function classify(): string {
    const { l1, l2 } = eig();
    if (Math.abs(l1.im) > 1e-9) {
      if (Math.abs(l1.re) < 1e-3) return 'CENTER — pure orbits, marginal (poles on the axis)';
      return l1.re < 0 ? 'STABLE SPIRAL — decaying oscillation' : 'UNSTABLE SPIRAL — growing oscillation';
    }
    if (l1.re < 0 && l2.re < 0) return 'STABLE NODE — all roads lead home (slow eigenvector dominates)';
    if (l1.re > 0 && l2.re > 0) return 'UNSTABLE NODE';
    return 'SADDLE — stable in one eigendirection, explosive in the other';
  }

  function step(x: [number, number], dt: number, u = 0): [number, number] {
    // RK4 (linear system, small step — effectively exact at this display scale)
    const f = (s: [number, number]): [number, number] => [
      A[0][0] * s[0] + A[0][1] * s[1] + B[0] * u,
      A[1][0] * s[0] + A[1][1] * s[1] + B[1] * u,
    ];
    const k1 = f(x);
    const k2 = f([x[0] + dt / 2 * k1[0], x[1] + dt / 2 * k1[1]]);
    const k3 = f([x[0] + dt / 2 * k2[0], x[1] + dt / 2 * k2[1]]);
    const k4 = f([x[0] + dt * k3[0], x[1] + dt * k3[1]]);
    return [x[0] + dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), x[1] + dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])];
  }

  function draw() {
    const p = palette();
    pp.begin();
    // vector field
    for (let i = -3; i <= 3; i += 0.6) {
      for (let j = -3; j <= 3; j += 0.6) {
        const vx = A[0][0] * i + A[0][1] * j, vy = A[1][0] * i + A[1][1] * j;
        const m = Math.hypot(vx, vy) || 1;
        const s = 0.22;
        const ctx2 = pp.ctx;
        ctx2.strokeStyle = p.grid === 'rgba(255,255,255,.07)' ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.18)';
        ctx2.beginPath();
        ctx2.moveTo(pp.toX(i), pp.toY(j));
        ctx2.lineTo(pp.toX(i + s * vx / m), pp.toY(j + s * vy / m));
        ctx2.stroke();
      }
    }
    // eigen rails
    const { l1, l2, v1, v2 } = eig();
    for (const [v, l] of [[v1, l1], [v2, l2]] as const) {
      if (!v) continue;
      const m = Math.hypot(v[0], v[1]) || 1;
      pp.trace([-3 * v[0] / m, 3 * v[0] / m], [-3 * v[1] / m, 3 * v[1] / m], { color: l.re < 0 ? p.good : p.bad, width: 1.4, dash: [6, 4] });
    }
    // trajectories
    for (const tr of trajectories) {
      pp.trace(tr.map((q) => q[0]), tr.map((q) => q[1]), { color: p.traces[0], width: 1.8 });
      const last = tr[tr.length - 1];
      pp.marker(tr[0][0], tr[0][1], { shape: 'o', color: p.traces[0], size: 3 });
    }
    // control mode: B arrow + reachability
    if (mode === 'control') {
      const ctx2 = pp.ctx;
      ctx2.strokeStyle = ctx2.fillStyle = p.traces[2];
      ctx2.lineWidth = 2.5;
      ctx2.beginPath();
      ctx2.moveTo(pp.toX(0), pp.toY(0));
      ctx2.lineTo(pp.toX(B[0]), pp.toY(B[1]));
      ctx2.stroke();
      pp.marker(B[0], B[1], { shape: 'dot', color: p.traces[2], size: 5, label: 'B (drag me)' });
      const AB = [A[0][0] * B[0] + A[0][1] * B[1], A[1][0] * B[0] + A[1][1] * B[1]];
      pp.marker(AB[0], AB[1], { shape: 'o', color: p.traces[1], size: 5, label: 'A·B (the dynamics carry the push)' });
      const det = B[0] * AB[1] - B[1] * AB[0];
      const rank = Math.abs(det) > 0.05 ? 2 : 1;
      info.set(`${classify()} · eigenvalues λ = ${fmtC(l1)}, ${fmtC(l2)} · <b>rank[B AB] = ${rank}</b> — det = ${det.toFixed(2)}. ` +
        (rank === 2
          ? 'B and A·B point differently: their span is the whole plane. Every state is reachable.'
          : '<b>B is (nearly) an eigenvector: A·B is parallel to B.</b> Pushing only excites one mode — everything off that line is unreachable, and no amount of time will help.'));
    } else {
      info.set(`${classify()} · eigenvalues λ = ${fmtC(l1)}, ${fmtC(l2)} · trace=${(A[0][0] + A[1][1]).toFixed(2)}, det=${(A[0][0] * A[1][1] - A[0][1] * A[1][0]).toFixed(2)} · dashed rails: eigenvectors (green stable, red unstable). Click anywhere to launch a state.`);
    }
  }
  const fmtC = (l: C) => Math.abs(l.im) < 1e-9 ? l.re.toFixed(2) : `${l.re.toFixed(2)}±j${Math.abs(l.im).toFixed(2)}`;

  pp.canvas.addEventListener('pointerdown', (e) => {
    if (mode === 'control') return; // drag handles B
    const r = pp.canvas.getBoundingClientRect();
    let x: [number, number] = [pp.fromX(e.clientX - r.left), pp.fromY(e.clientY - r.top)];
    const tr: Array<[number, number]> = [x];
    for (let i = 0; i < 600; i++) {
      x = step(x, 0.02);
      if (Math.hypot(x[0], x[1]) > 40) break;
      tr.push(x);
    }
    trajectories.push(tr);
    if (trajectories.length > 7) trajectories.shift();
    draw();
  });
  attachDrag(pp,
    (x, y) => (mode === 'control' && Math.hypot(x - B[0], y - B[1]) < 0.4 ? 'B' : null),
    (_, x, y) => { B = [x, y]; draw(); });

  const ctl = controls();
  const sliders = [
    slider('a₁₁', -2, 2, 0.1, A[0][0], (v) => { A[0][0] = v; trajectories = []; draw(); }),
    slider('a₁₂', -2, 2, 0.1, A[0][1], (v) => { A[0][1] = v; trajectories = []; draw(); }),
    slider('a₂₁', -3, 3, 0.1, A[1][0], (v) => { A[1][0] = v; trajectories = []; draw(); }),
    slider('a₂₂', -2, 2, 0.1, A[1][1], (v) => { A[1][1] = v; trajectories = []; draw(); }),
  ];
  const mSel = select('mode', [['free', 'explore trajectories'], ['control', 'controllability (drag B)']], mode, (v) => { mode = v as any; trajectories = []; draw(); });
  ctl.append(...sliders.map((s) => s.el), mSel.el);
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) {
      if (typeof p.a11 === 'number') { A = [[p.a11, p.a12 ?? A[0][1]], [p.a21 ?? A[1][0], p.a22 ?? A[1][1]]]; }
      if (p.mode) { mode = p.mode; mSel.set(p.mode); }
      trajectories = [];
      draw();
    },
    resume() { draw(); }, destroy() { pp.destroy(); },
    getState() {
      const AB = [A[0][0] * B[0] + A[0][1] * B[1], A[1][0] * B[0] + A[1][1] * B[1]];
      return { a: A, mode, rankBA: Math.abs(B[0] * AB[1] - B[1] * AB[0]) > 0.05 ? 2 : 1 };
    },
  };
});

// ---------------------------------------------------------------- BodeWorkbench
const BODE_PRESETS: Record<string, { sys: ZPK; note: string }> = {
  motor: { sys: { zeros: [], poles: [c(0), c(-2)], k: 4 }, note: 'motor loop K/(s(s+2)): type-1, the classic margins exercise' },
  resonant: { sys: { zeros: [], poles: [c(0), c(-0.4, 3), c(-0.4, -3)], k: 12 }, note: 'resonant plant: the peak eats phase margin' },
  lag: { sys: { zeros: [c(-0.5)], poles: [c(0), c(-0.05), c(-4)], k: 1.5 }, note: 'lag-compensated loop' },
  rhpz: { sys: { zeros: [c(1.5)], poles: [c(0), c(-2)], k: -2 }, note: 'non-minimum-phase: |H| identical to its mirror, phase sags EXTRA — same magnitude, worse phase' },
};

defineWidget('BodeWorkbench', (root, params) => {
  let preset = params.preset && BODE_PRESETS[params.preset] ? params.preset : 'motor';
  let K = params.k ?? 1;
  let asymptotes = true;
  root.appendChild(annotation(
    'Bode\'s gift: on log axes, pole/zero factors <b>ADD</b> — a 6th-order response becomes sketchable by hand ' +
    '(−20 dB/dec per pole from its corner; phase −90° smeared over ±1 decade). GM and PM are <b>distances to disaster</b>: ' +
    'crank K and watch the closed-loop step ring exactly as PM → 0 — the oscillation lands at the crossover frequency.'));
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const colL = document.createElement('div');
  const colR = document.createElement('div');
  colL.style.cssText = 'flex:1.3;min-width:17rem';
  colR.style.cssText = 'flex:1;min-width:14rem';
  row.append(colL, colR);
  root.appendChild(row);
  const mag = new Plot(colL, { x: { min: 0.05, max: 50, log: true, label: 'ω (log)' }, y: { min: -60, max: 40, label: 'dB' }, height: 150, title: '|L(jω)| dB' });
  const ph = new Plot(colL, { x: { min: 0.05, max: 50, log: true, label: 'ω (log)' }, y: { min: -280, max: -40, label: 'deg' }, height: 140, title: '∠L(jω)' });
  const stepP = new Plot(colR, { x: { min: 0, max: 15, label: 't' }, y: { min: -0.4, max: 2.4 }, height: 200, title: 'closed-loop step (unity feedback)' });
  const info = readout();
  root.appendChild(info.el);

  function sys(): ZPK { const g = BODE_PRESETS[preset].sys; return { ...g, k: g.k * K }; }

  function draw() {
    const p = palette();
    const S = sys();
    const ws = logGrid(0.05, 50, S, 128);
    const sPts = ws.map((w) => c(0, w));
    const { mag: m, phase: phRaw } = freqResponse(S, sPts);
    const phU = unwrapPhase(phRaw);
    const db = Array.from(m, (v) => 20 * Math.log10(Math.max(v, 1e-8)));
    const deg = Array.from(phU, (v) => (v * 180) / Math.PI);
    mag.begin();
    mag.hline(0, { color: p.axis, label: '0 dB' });
    mag.trace(ws, db, { color: p.traces[0], width: 2 });
    if (asymptotes) {
      // straight-line asymptotes: initial slope from poles at origin, corner at each |pole|/|zero|
      const corners: Array<{ w: number; slope: number }> = [];
      let originPoles = 0;
      for (const pl of S.poles) { if (cabs(pl) < 1e-6) originPoles++; else corners.push({ w: cabs(pl), slope: -20 * (Math.abs(pl.im) > 1e-6 ? 1 : 1) }); }
      for (const z of S.zeros) if (cabs(z) > 1e-6) corners.push({ w: cabs(z), slope: 20 });
      corners.sort((a, b) => a.w - b.w);
      // dedupe conjugates: a pair contributes -40; approximate by counting each of the pair as -20 (they share |p|)
      const asymX: number[] = [], asymY: number[] = [];
      let slope = -20 * originPoles;
      // gain at w=0.05
      let dbAt = 20 * Math.log10(Math.abs(S.k) || 1e-9);
      for (const pl of S.poles) if (cabs(pl) > 1e-6) dbAt -= 20 * Math.log10(cabs(pl));
      for (const z of S.zeros) if (cabs(z) > 1e-6) dbAt += 20 * Math.log10(cabs(z));
      dbAt += slope * Math.log10(0.05);
      let wPrev = 0.05;
      asymX.push(wPrev); asymY.push(dbAt);
      for (const cnr of corners) {
        if (cnr.w > 50) break;
        dbAt += slope * (Math.log10(cnr.w) - Math.log10(wPrev));
        asymX.push(cnr.w); asymY.push(dbAt);
        slope += cnr.slope;
        wPrev = cnr.w;
      }
      dbAt += slope * (Math.log10(50) - Math.log10(wPrev));
      asymX.push(50); asymY.push(dbAt);
      mag.trace(asymX, asymY, { color: p.traces[1], width: 1.4, dash: [6, 4] });
    }
    // crossovers & margins
    let wgc: number | null = null, wpc: number | null = null;
    for (let i = 1; i < ws.length; i++) {
      if (wgc == null && db[i - 1] > 0 && db[i] <= 0) wgc = ws[i];
      if (wpc == null && deg[i - 1] > -180 && deg[i] <= -180) wpc = ws[i];
    }
    let pm: number | null = null, gm: number | null = null;
    if (wgc) {
      const i = ws.findIndex((w) => w >= wgc!);
      pm = deg[i] + 180;
      mag.vline(wgc, { color: p.traces[2], dash: [3, 3], label: 'gain crossover' });
    }
    if (wpc) {
      const i = ws.findIndex((w) => w >= wpc!);
      gm = -db[i];
      mag.vline(wpc, { color: p.bad, dash: [3, 3], label: 'phase crossover' });
    }
    ph.begin();
    ph.hline(-180, { color: p.bad, dash: [4, 4], label: '−180°' });
    ph.trace(ws, deg, { color: p.traces[0], width: 2 });
    if (wgc) ph.vline(wgc, { color: p.traces[2], dash: [3, 3] });
    // closed-loop step
    const cl = feedback(S, { zeros: [], poles: [], k: 1 });
    const unstable = cl.poles.some((pl) => pl.re > 1e-6);
    stepP.begin();
    const ts = new Float64Array(500);
    for (let i = 0; i < 500; i++) ts[i] = (15 * i) / 499;
    const y = evalModes(stepModes(cl).modes, ts);
    stepP.trace(Array.from(ts), Array.from(y), { color: unstable ? p.bad : p.traces[2], width: 2, clipY: 6 });
    info.set(`PM = ${pm != null ? pm.toFixed(0) + '°' : '—'} (at gain crossover ${wgc?.toFixed(2) ?? '—'} rad/s) · GM = ${gm != null ? gm.toFixed(1) + ' dB' : '∞ (phase never hits −180°)'}${wpc ? ` (at ${wpc.toFixed(2)} rad/s)` : ''} · ` +
      (unstable ? '<b>closed loop UNSTABLE — you spent the margins</b>' : pm != null && pm < 25 ? `PM thin: overshoot is already ${'ringing hard — the ring frequency ≈ crossover'}` : 'healthy margins') +
      ` · K×2 = +6 dB slides the whole |L| up — watch both margins shrink. ${BODE_PRESETS[preset].note}.`);
  }
  const ctl = controls();
  const pSel = select('loop preset', Object.entries(BODE_PRESETS).map(([k2]) => [k2, k2]), preset, (v) => { preset = v; draw(); });
  const kCtl = slider('extra gain K', 0.1, 20, 0.05, K, (v) => { K = v; draw(); });
  const aBtn = button('toggle asymptotes', () => { asymptotes = !asymptotes; draw(); });
  ctl.append(pSel.el, kCtl.el, buttonRow(aBtn));
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.preset && BODE_PRESETS[p.preset]) { preset = p.preset; pSel.set(p.preset); } if (typeof p.k === 'number') { K = p.k; kCtl.set(p.k); } draw(); },
    resume() { draw(); }, destroy() { mag.destroy(); ph.destroy(); stepP.destroy(); },
    getState() {
      const cl = feedback(sys(), { zeros: [], poles: [], k: 1 });
      return { preset, k: K, closedLoopStable: cl.poles.every((pl) => pl.re < -1e-6) };
    },
  };
});

// ---------------------------------------------------------------- NyquistVoyage
const NYQ_PRESETS: Record<string, { sys: ZPK; P: number; note: string }> = {
  stable2: { sys: { zeros: [], poles: [c(-1), c(-2)], k: 8 }, P: 0, note: 'stable open loop (P=0): stability ⇔ NO net encirclement of −1' },
  integrator: { sys: { zeros: [], poles: [c(0), c(-1)], k: 3 }, P: 0, note: 'pole AT the origin: the ε-indentation throws a giant arc — strictly-RHP poles only count in P (axis poles are handled by the detour)' },
  unstable1: { sys: { zeros: [], poles: [c(0.5), c(-2)], k: 6 }, P: 1, note: 'OPEN-LOOP UNSTABLE (P=1): the loop must encircle −1 once COUNTER-clockwise to be closed-loop stable — the case Bode margins cannot certify. Nyquist\'s raison d\'être' },
};

defineWidget('NyquistVoyage', (root, params) => {
  let preset = params.preset && NYQ_PRESETS[params.preset] ? params.preset : 'stable2';
  let K = params.k ?? 1;
  let progress = 1; // fraction of the contour marched
  let revealed = false;

  root.appendChild(annotation(
    'March a point up the jω axis (with an ε-detour around any axis pole) and watch its image trace the Nyquist plot ' +
    '<b>synchronously</b> — every loop of the curve is CAUSED by passing near a pole. Convention pinned: N = clockwise ' +
    'encirclements of −1, P = strictly-RHP open-loop poles, and closed-loop RHP poles <b>Z = N + P</b>. ' +
    'Count the encirclements YOURSELF before pressing reveal.'));
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap';
  const paneS = document.createElement('div');
  const paneN = document.createElement('div');
  paneS.style.cssText = 'flex:1;min-width:14rem';
  paneN.style.cssText = 'flex:1.2;min-width:16rem';
  row.append(paneS, paneN);
  root.appendChild(row);
  const sp = new Plot(paneS, { x: { min: -3, max: 3, label: 'σ' }, y: { min: -8, max: 8, label: 'jω' }, height: 210, title: 's-plane: the D-contour' });
  const np = new Plot(paneN, { x: { min: -4, max: 3, label: 'Re L(s)' }, y: { min: -3.5, max: 3.5, label: 'Im' }, height: 210, title: 'image: L(s) along the contour (log-compressed radially)' });
  const info = readout();
  root.appendChild(info.el);

  function contour(): C[] {
    // up the jω axis −W..W with ε-detours around axis poles; big-R arc omitted
    // (image of the arc for strictly proper L is the origin — annotated).
    const S = NYQ_PRESETS[preset].sys;
    const axisPoles = S.poles.filter((pl) => Math.abs(pl.re) < 1e-9).map((pl) => pl.im).sort((a, b) => a - b);
    const pts: C[] = [];
    const W = 60;
    const push = (re: number, im: number) => pts.push(c(re, im));
    const eps = 0.15;
    let w = -W;
    const stepsPerUnit = 14;
    while (w < W) {
      const nearPole = axisPoles.find((pw) => Math.abs(w - pw) < eps);
      if (nearPole != null && w < nearPole) {
        // detour: half circle to the RIGHT of the pole
        for (let th = -Math.PI / 2; th <= Math.PI / 2; th += Math.PI / 24) {
          push(eps * Math.cos(th), nearPole + eps * Math.sin(th));
        }
        w = nearPole + eps + 1e-6;
      } else {
        push(0, w);
        const speed = Math.max(0.02, Math.abs(w) / stepsPerUnit);
        w += speed;
      }
    }
    push(0, W);
    return pts;
  }

  const compress = (v: C): C => {
    const r = cabs(v);
    const rc = Math.log(1 + r);
    if (r < 1e-12) return c(0);
    return cscale(v, rc / r);
  };

  function draw() {
    const p = palette();
    const S = { ...NYQ_PRESETS[preset].sys, k: NYQ_PRESETS[preset].sys.k * K };
    const pts = contour();
    const upto = Math.max(2, Math.floor(pts.length * progress));
    sp.begin();
    sp.regionX(-3, 0, p.grid);
    for (const pl of S.poles) sp.marker(pl.re, pl.im, { shape: 'x', color: pl.re > 1e-9 ? p.bad : p.traces[0], size: 6 });
    for (const z of S.zeros) sp.marker(z.re, z.im, { shape: 'o', color: p.traces[2], size: 6 });
    sp.trace(pts.slice(0, upto).map((q) => q.re), pts.slice(0, upto).map((q) => Math.max(-8, Math.min(8, q.im))), { color: p.traces[1], width: 1.8 });
    const cur = pts[upto - 1];
    sp.marker(cur.re, Math.max(-8, Math.min(8, cur.im)), { shape: 'dot', color: p.traces[1], size: 5 });
    // image
    const img: C[] = [];
    for (let i = 0; i < upto; i++) {
      let v = c(S.k >= 0 ? Math.abs(S.k) : S.k);
      let acc = c(S.k);
      // L(s) = k Π(s−z)/Π(s−p)
      let num = c(1);
      for (const z of S.zeros) num = cmul(num, csub(pts[i], z));
      let den = c(1);
      for (const pl of S.poles) den = cmul(den, csub(pts[i], pl));
      img.push(compress(cscale(cdiv(num, den), S.k)));
    }
    np.begin();
    const m1 = compress(c(-1));
    np.marker(m1.re, 0, { shape: 'o', color: p.bad, size: 6, label: '−1 (log-compressed)' });
    np.trace(img.map((q) => q.re), img.map((q) => q.im), { color: p.traces[0], width: 1.8 });
    const last = img[img.length - 1];
    np.marker(last.re, last.im, { shape: 'dot', color: p.traces[1], size: 5 });
    // encirclement count via winding of (image − (−1))
    let winding = 0;
    const m1raw = c(-1);
    let prevAng: number | null = null;
    for (let i = 0; i < upto; i++) {
      // recompute uncompressed for the winding number
      let num = c(1);
      for (const z of S.zeros) num = cmul(num, csub(pts[i], z));
      let den = c(1);
      for (const pl of S.poles) den = cmul(den, csub(pts[i], pl));
      const v = cscale(cdiv(num, den), S.k);
      const ang = carg(csub(v, m1raw));
      if (prevAng != null) {
        let d = ang - prevAng;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        winding += d;
      }
      prevAng = ang;
    }
    const N = -Math.round(winding / (2 * Math.PI)); // clockwise = positive N
    const P = NYQ_PRESETS[preset].P;
    if (revealed && progress >= 1) {
      const Z = N + P;
      info.set(`ledger: N (clockwise encirclements of −1) = <b>${N}</b>, P (strictly-RHP open-loop poles) = <b>${P}</b> → ` +
        `Z = N + P = <b>${Z}</b> closed-loop RHP pole${Z === 1 ? '' : 's'} → closed loop is <b>${Z === 0 ? 'STABLE' : 'UNSTABLE'}</b>. ` +
        `${NYQ_PRESETS[preset].note}. Cross-check: the same verdict falls out of computing the closed-loop poles directly.`);
    } else {
      info.set(`Scrub the march. Count the clockwise encirclements of −1 with your eyes, commit, then reveal. ` +
        `(Radial view is log-compressed so the detour's giant arc fits; the true −1 sits at the marked ring.) ${NYQ_PRESETS[preset].note}.`);
    }
  }
  const ctl = controls();
  const pSel = select('loop preset', Object.entries(NYQ_PRESETS).map(([k2]) => [k2, k2]), preset, (v) => { preset = v; revealed = false; draw(); });
  const kCtl = slider('gain K', 0.2, 4, 0.05, K, (v) => { K = v; draw(); });
  const marchCtl = slider('march progress', 0.02, 1, 0.01, 1, (v) => { progress = v; draw(); });
  const revealBtn = button('reveal the count', () => { revealed = true; draw(); });
  ctl.append(pSel.el, kCtl.el, marchCtl.el, buttonRow(revealBtn));
  root.appendChild(ctl);
  draw();
  return {
    setParams(p: any) { if (p.preset && NYQ_PRESETS[p.preset]) { preset = p.preset; pSel.set(p.preset); revealed = false; } if (typeof p.k === 'number') { K = p.k; kCtl.set(p.k); } draw(); },
    resume() { draw(); }, destroy() { sp.destroy(); np.destroy(); },
    getState() { return { preset, k: K }; },
  };
});
