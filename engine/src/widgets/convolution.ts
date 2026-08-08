// ★ HERO: Convolution Machine — two views of one computation.
// View 1 (flip & slide): x(τ) fixed, h(t−τ) sliding; product area shaded; y(t)
// traced with integration-limit annotations per overlap regime.
// View 2 (echoes): x chopped into impulses, each launching a scaled copy of h;
// their sum converges to y — WHY convolution is the answer, not just how.
// CT and DT modes share the machine.
import { defineWidget, controls, slider, select, playControls, annotation, readout, buttonRow, button } from './framework';
import { Plot, palette, scheduler } from '../sigplot/plot';
import { convCT, convDT, sample, Sampled } from '../math/conv';

interface Sig { name: string; f: (t: number) => number; support: [number, number]; label: string }

const SIGNALS: Record<string, Sig> = {
  rect1: { name: 'rect1', f: (t) => (t >= 0 && t <= 1 ? 1 : 0), support: [0, 1], label: 'rect (width 1)' },
  rect2: { name: 'rect2', f: (t) => (t >= 0 && t <= 2 ? 1 : 0), support: [0, 2], label: 'rect (width 2)' },
  exp: { name: 'exp', f: (t) => (t >= 0 ? Math.exp(-1.5 * t) : 0), support: [0, 4], label: 'e^(−1.5t)·u(t)' },
  tri: { name: 'tri', f: (t) => (t >= 0 && t <= 2 ? 1 - Math.abs(t - 1) : 0), support: [0, 2], label: 'triangle' },
  impulsePair: { name: 'impulsePair', f: () => 0, support: [0, 3], label: 'δ(t) + ½δ(t−3)  (echoes!)' },
  halfsin: { name: 'halfsin', f: (t) => (t >= 0 && t <= 2 ? Math.sin((Math.PI * t) / 2) : 0), support: [0, 2], label: 'half-sine burst' },
};

const N = 1200; // fine grid per plan: piecewise shapes must look ideal

defineWidget('ConvolutionMachine', (root, params, ctx) => {
  let xName = params.x || 'rect1';
  let hName = params.h || 'rect1';
  let mode: 'slide' | 'echo' = params.view || 'slide';
  let dt = false; // DT mode
  let density = 12;
  let paused = false;

  root.appendChild(annotation(
    'One idea, two views. <b>Flip & slide</b> is the bookkeeping; <b>echoes</b> is the reason it works. ' +
    'Colors are fixed app-wide: <span style="color:#2451cc">x lives in blue</span>, ' +
    '<span style="color:#9a6700">the flipped, sliding h(t−τ) in amber</span>, and the result in green.'));

  // ---------- panes ----------
  const paneTop = document.createElement('div');
  const paneBot = document.createElement('div');
  root.append(paneTop, paneBot);
  const T0 = -1, T1 = 7;
  const top = new Plot(paneTop, { x: { min: T0, max: T1, label: 'τ' }, y: { min: -0.6, max: 1.6 }, height: 170 });
  const bot = new Plot(paneBot, { x: { min: T0, max: T1, label: 't' }, y: { min: -0.6, max: 2.2 }, height: 150, title: 'y(t) = (x ∗ h)(t)' });
  const info = readout();
  root.appendChild(info.el);

  // ---------- signals & result ----------
  let xS!: Sampled, hS!: Sampled, yS!: Sampled;
  let dtX: number[] = [1, 1, 1, 1], dtH: number[] = [0.5, 1, 0.5];

  function computeCT() {
    const X = SIGNALS[xName], H = SIGNALS[hName];
    if (xName === 'impulsePair' || hName === 'impulsePair') {
      // impulse pair handled analytically: (δ(t)+½δ(t−3)) ∗ g = g(t) + ½g(t−3)
      const other = SIGNALS[xName === 'impulsePair' ? hName : xName];
      xS = sample(other.f, T0, T1, N);
      hS = xS;
      const y = new Float64Array(N);
      const dtg = (T1 - T0) / (N - 1);
      for (let i = 0; i < N; i++) {
        const t = T0 + i * dtg;
        y[i] = other.f(t) + 0.5 * other.f(t - 3);
      }
      yS = { t0: T0, dt: dtg, y };
      return;
    }
    xS = sample(X.f, T0, T1, N);
    hS = sample(H.f, T0, T1, N);
    // Shared exact grid step: sample each signal over its own support with the
    // SAME dt (span adjusted to a whole number of steps) — convCT requires it.
    const DT = 0.004;
    const trim = (S: Sig): Sampled => {
      const n = Math.max(2, Math.round((S.support[1] - S.support[0]) / DT) + 1);
      return sample(S.f, S.support[0], S.support[0] + (n - 1) * DT, n);
    };
    yS = convCT(trim(X), trim(H));
  }

  function yMaxCT(): number {
    let m = 0;
    for (let i = 0; i < yS.y.length; i++) m = Math.max(m, Math.abs(yS.y[i]));
    return m || 1;
  }

  // ---------- draw: flip & slide ----------
  function drawSlide(t: number) {
    const p = palette();
    const X = SIGNALS[xName], H = SIGNALS[hName];
    top.begin();
    // x(τ) in blue
    const taus = Array.from({ length: N }, (_, i) => T0 + ((T1 - T0) * i) / (N - 1));
    top.trace(taus, taus.map(X.f), { color: p.traces[0], width: 2 });
    // h(t−τ) in amber
    top.trace(taus, taus.map((tau) => H.f(t - tau)), { color: p.traces[1], width: 2 });
    // product shaded
    const prod = taus.map((tau) => X.f(tau) * H.f(t - tau));
    top.areaUnder(taus, prod, p.fillWarm);
    top.trace(taus, prod, { color: p.traces[2], width: 1.4, dash: [3, 3] });
    top.vline(t, { color: p.traces[1], dash: [4, 3], label: `t = ${t.toFixed(2)}` });

    // overlap limits annotation (finite supports)
    const lo = Math.max(X.support[0], t - H.support[1]);
    const hi = Math.min(X.support[1], t - H.support[0]);
    let area = 0;
    const dtg = (T1 - T0) / (N - 1);
    for (let i = 0; i < N; i++) area += prod[i] * dtg;
    if (hi > lo) {
      info.set(`overlap: τ ∈ [${lo.toFixed(2)}, ${hi.toFixed(2)}]  →  y(${t.toFixed(2)}) = ∫ x(τ)·h(t−τ) dτ = <b>${area.toFixed(3)}</b>`);
    } else {
      info.set(`no overlap at t = ${t.toFixed(2)} — the flipped h hasn’t reached x (or has passed it): y = 0`);
    }

    bot.setYRange(-0.2, yMaxCT() * 1.25);
    bot.begin();
    const nShown = Math.max(2, Math.min(yS.y.length, Math.round(((t - yS.t0) / yS.dt))));
    const ts = Array.from({ length: yS.y.length }, (_, i) => yS.t0 + i * yS.dt);
    top.canvas.style.cursor = 'crosshair';
    bot.trace(ts, yS.y, { color: 'rgba(0,0,0,.18)', width: 1.2 });
    bot.trace(ts.slice(0, nShown), Array.from(yS.y.slice(0, nShown)), { color: p.traces[2], width: 2.2 });
    const yNow = yS.y[Math.min(yS.y.length - 1, Math.max(0, nShown - 1))] || 0;
    bot.marker(t, yNow, { shape: 'dot', color: p.traces[2], label: yNow.toFixed(2) });
  }

  // ---------- draw: echoes ----------
  function drawEcho(t: number) {
    const p = palette();
    const X = SIGNALS[xName], H = SIGNALS[hName];
    top.begin();
    const taus = Array.from({ length: N }, (_, i) => T0 + ((T1 - T0) * i) / (N - 1));
    top.trace(taus, taus.map(X.f), { color: p.traces[0], width: 1.2, alpha: 0.5 });
    // impulse comb approximation of x
    const K = density;
    const [x0, x1] = X.support;
    const dTau = (x1 - x0) / K;
    const sum = new Float64Array(N);
    for (let k = 0; k < K; k++) {
      const tau = x0 + (k + 0.5) * dTau;
      const wt = X.f(tau) * dTau;
      if (Math.abs(wt) < 1e-9) continue;
      top.stems([tau], [X.f(tau)], { color: p.traces[0], alpha: 0.8, radius: 2 });
      // each pulse launches wt·h(t−tau): show a few echoes
      const echo = taus.map((tt) => wt * H.f(tt - tau));
      top.trace(taus, echo, { color: p.traces[1], width: 1, alpha: 0.35 });
      for (let i = 0; i < N; i++) sum[i] += echo[i];
    }
    top.trace(taus, Array.from(sum), { color: p.traces[2], width: 2.2 });
    info.set(`x sliced into <b>${K}</b> impulses; each launches a scaled copy of h; the green sum IS the convolution. ` +
      `Crank density and watch it converge to the exact y(t) below.`);

    bot.setYRange(-0.2, yMaxCT() * 1.25);
    bot.begin();
    const ts = Array.from({ length: yS.y.length }, (_, i) => yS.t0 + i * yS.dt);
    bot.trace(ts, yS.y, { color: p.traces[2], width: 2 });
    bot.label(T1 - 0.2, yMaxCT() * 1.1, 'exact y(t)', { align: 'right' });
  }

  // ---------- draw: DT ----------
  function drawDT(nCursor: number) {
    const p = palette();
    top.begin();
    const nn = Math.round(nCursor);
    top.stems(dtX.map((_, i) => i), dtX, { color: p.traces[0] });
    top.stems(dtH.map((_, i) => nn - i), dtH, { color: p.traces[1], alpha: 0.8 });
    const y = convDT(dtX, dtH);
    // MAC readout at n
    let acc = 0;
    const terms: string[] = [];
    for (let k = 0; k < dtX.length; k++) {
      const j = nn - k;
      if (j >= 0 && j < dtH.length) {
        acc += dtX[k] * dtH[j];
        terms.push(`x[${k}]·h[${nn}−${k}]`);
      }
    }
    info.set(terms.length
      ? `y[${nn}] = ${terms.join(' + ')} = <b>${acc.toFixed(2)}</b>   (output length = ${dtX.length}+${dtH.length}−1 = ${y.length})`
      : `no overlap at n = ${nn}: y[${nn}] = 0`);
    bot.setYRange(-0.2, Math.max(...y) * 1.3 + 0.1);
    bot.begin();
    bot.stems(Array.from(y, (_, i) => i), Array.from(y), { color: p.traces[2] });
    bot.marker(nn, y[nn] ?? 0, { shape: 'o', color: p.traces[2] });
  }

  // ---------- controls ----------
  const redraw = () => {
    if (dt) drawDT(pc.get());
    else if (mode === 'slide') drawSlide(pc.get());
    else drawEcho(pc.get());
  };
  const pc = playControls({ min: T0, max: T1, step: 0.02, value: params.t ?? 0.8, onScrub: () => redraw(), speed: 1.1 });

  const ctl = controls();
  const xSel = select('x (input)', Object.entries(SIGNALS).map(([k, s]) => [k, s.label]), xName, (v) => { xName = v; computeCT(); redraw(); });
  const hSel = select('h (system)', Object.entries(SIGNALS).map(([k, s]) => [k, s.label]), hName, (v) => { hName = v; computeCT(); redraw(); });
  const viewSel = select('view', [['slide', 'flip & slide'], ['echo', 'superposition of echoes']], mode, (v) => {
    mode = v as any;
    densityCtl.el.style.display = mode === 'echo' ? '' : 'none';
    redraw();
  });
  const densityCtl = slider('echo density', 3, 60, 1, density, (v) => { density = Math.round(v); redraw(); }, (v) => String(Math.round(v)));
  densityCtl.el.style.display = mode === 'echo' ? '' : 'none';
  const swapBtn = button('swap x ↔ h (commutativity)', () => {
    [xName, hName] = [hName, xName];
    computeCT();
    redraw();
  });
  const dtBtn = button('DT mode', () => {
    dt = !dt;
    dtBtn.textContent = dt ? 'CT mode' : 'DT mode';
    viewSel.el.style.display = dt ? 'none' : '';
    densityCtl.el.style.display = !dt && mode === 'echo' ? '' : 'none';
    redraw();
  });
  ctl.append(xSel.el, hSel.el, viewSel.el, densityCtl.el, buttonRow(swapBtn, dtBtn));
  root.appendChild(ctl);
  root.appendChild(pc.el);

  computeCT();
  redraw();
  const tickKey = {};
  scheduler.add(tickKey, (dtMs) => { if (!paused) pc.tick(dtMs); });

  return {
    setParams(p: any) {
      if (p.x) { xName = p.x; xSel.set(p.x); }
      if (p.h) { hName = p.h; hSel.set(p.h); }
      if (p.view) {
        mode = p.view;
        viewSel.set(p.view);
        densityCtl.el.style.display = mode === 'echo' && !dt ? '' : 'none';
      }
      if (typeof p.t === 'number') pc.set(p.t);
      computeCT();
      redraw();
    },
    pause() { paused = true; pc.stop(); },
    resume() { paused = false; redraw(); },
    destroy() { scheduler.remove(tickKey); top.destroy(); bot.destroy(); },
    getState() {
      return { t: pc.get(), x: xName, h: hName, view: mode, dt };
    },
  };
});
