// SystemTester — the black-box lab. A mystery system from a pool; the student
// runs structured probe experiments (linearity rig, TI rig, causality, memory,
// stability) and reads residuals. Properties are falsifiable by one
// counterexample but never PROVED by finitely many tests — the scoreboard says
// "consistent with", and the reveal shows the formula + the real argument.
import { defineWidget, controls, annotation, readout, button, buttonRow, select } from './framework';
import { Plot, palette } from '../sigplot/plot';

interface Sys {
  label: string; formula: string;
  apply: (x: (t: number) => number) => (t: number) => number;
  truth: { L: boolean; TI: boolean; C: boolean; M: boolean; S: boolean };
  lesson: string;
}
const POOL: Record<string, Sys> = {
  gain: { label: 'A', formula: 'y = 2x(t)', apply: (x) => (t) => 2 * x(t), truth: { L: true, TI: true, C: true, M: false, S: true }, lesson: 'the friendly baseline: linear, TI, causal, memoryless, stable' },
  square: { label: 'B', formula: 'y = x²(t)', apply: (x) => (t) => x(t) ** 2, truth: { L: false, TI: true, C: true, M: false, S: true }, lesson: 'nonlinear but perfectly time-invariant — the two properties are independent' },
  tmul: { label: 'C', formula: 'y = t·x(t)', apply: (x) => (t) => t * x(t), truth: { L: true, TI: false, C: true, M: false, S: false }, lesson: 'the classic trap: LINEAR (scaling/adding inputs works) but time-VARYING — the coefficient changes with the clock. Also unstable: bounded x, unbounded t·x' },
  delay: { label: 'D', formula: 'y = x(t−1)', apply: (x) => (t) => x(t - 1), truth: { L: true, TI: true, C: true, M: true, S: true }, lesson: 'a pure delay: memory without any distortion' },
  compress: { label: 'E', formula: 'y = x(2t)', apply: (x) => (t) => x(2 * t), truth: { L: true, TI: false, C: false, M: true, S: true }, lesson: 'time-scaling is NOT time-invariant, and it is non-causal: y(1) needs x(2) — the future' },
  integrator: { label: 'F', formula: 'y = ∫₋∞ᵗ x(τ)dτ', apply: (x) => (t) => { let a = 0; for (let s = -2; s < t; s += 0.01) a += x(s) * 0.01; return a; }, truth: { L: true, TI: true, C: true, M: true, S: false }, lesson: 'passes every casual stability spot-check — until you feed it u(t) and it ramps forever. BIBO needs the WORST bounded input, not a random one' },
  limiter: { label: 'G', formula: 'y = clip(x, ±0.5)', apply: (x) => (t) => Math.max(-0.5, Math.min(0.5, x(t))), truth: { L: false, TI: true, C: true, M: false, S: true }, lesson: 'saturation: stable and TI, but emphatically nonlinear — double the input, not double the output' },
};
const PROBES: Record<string, { label: string; f: (t: number) => number }> = {
  pulse: { label: 'pulse', f: (t) => (t >= 0 && t <= 1 ? 1 : 0) },
  sin: { label: 'sin(3t)', f: (t) => Math.sin(3 * t) },
  step: { label: 'u(t)', f: (t) => (t >= 0 ? 1 : 0) },
  late: { label: 'pulse at t=2', f: (t) => (t >= 2 && t <= 3 ? 1 : 0) },
};

defineWidget('SystemTester', (root, params) => {
  const keys = Object.keys(POOL);
  let mysteryKey = keys[Math.floor((params.seed ?? 2) % keys.length)];
  let probeKey = 'pulse';
  const found: Record<string, string> = {};

  root.appendChild(annotation(
    'A mystery system is in the box. <b>Design experiments</b> to classify it. One failing test settles a property ' +
    'forever; passing tests only say "consistent with" — that asymmetry IS the logic of system properties.'));

  const scoreboard = document.createElement('div');
  scoreboard.style.cssText = 'display:flex;gap:.5rem;flex-wrap:wrap;margin:.4rem 0';
  root.appendChild(scoreboard);
  const paneA = document.createElement('div');
  root.appendChild(paneA);
  const plot = new Plot(paneA, { x: { min: -1, max: 6, label: 't' }, y: { min: -2.5, max: 2.5 }, height: 170 });
  const info = readout();
  root.appendChild(info.el);

  const T0 = -1, T1 = 6, N = 700;
  const ts = Array.from({ length: N }, (_, i) => T0 + ((T1 - T0) * i) / (N - 1));
  const maxAbs = (arr: number[]) => Math.max(...arr.map(Math.abs));

  function renderBoard() {
    scoreboard.innerHTML = '';
    for (const [k, label] of [['L', 'linear'], ['TI', 'time-inv'], ['C', 'causal'], ['M', 'memory…less?'], ['S', 'BIBO stable']] as const) {
      const chip = document.createElement('span');
      chip.className = 'chip';
      const v = found[k];
      chip.textContent = `${label}: ${v || '?'}`;
      chip.style.cssText = `font-size:.78rem;padding:.15rem .6rem;background:${v ? (v.startsWith('NO') ? 'var(--bad-soft)' : 'var(--good-soft)') : 'var(--bg-inset)'};color:${v ? (v.startsWith('NO') ? 'var(--bad)' : 'var(--good)') : 'var(--ink-faint)'}`;
      scoreboard.appendChild(chip);
    }
  }

  function run(test: 'L' | 'TI' | 'C' | 'M' | 'S') {
    const p = palette();
    const sys = POOL[mysteryKey];
    const x = PROBES[probeKey].f;
    plot.begin();
    if (test === 'L') {
      const x2 = PROBES.sin.f;
      const yСomb = ts.map(sys.apply((t) => 2 * x(t) + 0.5 * x2(t)));
      const combY = ts.map((t, i) => 2 * sys.apply(x)(t) + 0.5 * sys.apply(x2)(t));
      const resid = ts.map((_, i) => yСomb[i] - combY[i]);
      plot.trace(ts, yСomb, { color: p.traces[0], width: 2 });
      plot.trace(ts, combY, { color: p.traces[2], width: 2, dash: [5, 4] });
      plot.trace(ts, resid, { color: p.bad, width: 1.4 });
      const fail = maxAbs(resid) > 0.02;
      found.L = fail ? 'NO — counterexample found' : 'consistent ✓';
      info.set(fail
        ? `System(2x₁+½x₂) ≠ 2·System(x₁)+½·System(x₂): the red residual is nonzero. ONE counterexample — linearity is dead.`
        : `Solid line: system acting on 2x₁+½x₂. Dashed: 2·y₁+½·y₂. They coincide (red residual ≈ 0) — consistent with linear, for THIS test.`);
    } else if (test === 'TI') {
      const d = 1.5;
      const shiftThen = ts.map(sys.apply((t) => x(t - d)));
      const thenShift = ts.map((t) => sys.apply(x)(t - d));
      const resid = ts.map((_, i) => shiftThen[i] - thenShift[i]);
      plot.trace(ts, shiftThen, { color: p.traces[0], width: 2 });
      plot.trace(ts, thenShift, { color: p.traces[2], width: 2, dash: [5, 4] });
      plot.trace(ts, resid, { color: p.bad, width: 1.4 });
      const fail = maxAbs(resid) > 0.02;
      found.TI = fail ? 'NO — counterexample found' : 'consistent ✓';
      info.set(fail ? 'Shift-then-system ≠ system-then-shift: the machine treats different clock times differently. Time-varying.'
        : 'Delay the input, the response just delays. Consistent with time-invariant.');
    } else if (test === 'C') {
      const xl = PROBES.late.f;
      const y = ts.map(sys.apply(xl));
      plot.trace(ts, ts.map(xl), { color: p.traces[0], width: 1.4, dash: [3, 3] });
      plot.trace(ts, y, { color: p.traces[2], width: 2 });
      plot.vline(2, { color: p.axis, dash: [4, 4], label: 'input starts here' });
      const pre = ts.filter((t) => t < 1.99).map((t, i) => y[ts.indexOf(t)] ?? 0);
      const fail = maxAbs(y.filter((_, i) => ts[i] < 1.99)) > 0.02;
      found.C = fail ? 'NO — output moved before the input' : 'consistent ✓';
      info.set(fail ? 'The output twitched BEFORE t=2 — it used the future. Non-causal.' : 'Input silent until t=2, output silent too. Consistent with causal.');
    } else if (test === 'M') {
      // two inputs equal at t*=1.5 but different before
      const xa = (t: number) => (t >= 0 && t <= 1 ? 1 : 0) + (t >= 1.4 && t <= 1.6 ? 0.8 : 0);
      const xb = (t: number) => (t >= 1.4 && t <= 1.6 ? 0.8 : 0);
      const ya = sys.apply(xa)(1.5), yb = sys.apply(xb)(1.5);
      plot.trace(ts, ts.map(xa), { color: p.traces[0], width: 1.4 });
      plot.trace(ts, ts.map(xb), { color: p.traces[1], width: 1.4, dash: [4, 3] });
      plot.marker(1.5, ya, { shape: 'o', color: p.traces[2], label: `y_A(1.5)=${ya.toFixed(2)}` });
      plot.marker(1.5, yb, { shape: 'x', color: p.bad, size: 5, label: `y_B(1.5)=${yb.toFixed(2)}` });
      const fail = Math.abs(ya - yb) > 0.02;
      found.M = fail ? 'NO — has memory' : 'consistent ✓ (memoryless so far)';
      info.set(fail
        ? `Same input value at t=1.5, different outputs (${ya.toFixed(2)} vs ${yb.toFixed(2)}): the box remembers the past. It has memory.`
        : 'Identical present ⇒ identical output, despite different pasts. Consistent with memoryless.');
    } else {
      const y = ts.map(sys.apply(x));
      plot.trace(ts, ts.map(x), { color: p.traces[0], width: 1.2, dash: [3, 3] });
      plot.trace(ts, y, { color: p.traces[2], width: 2, clipY: 100 });
      const fail = maxAbs(y) > 4.9;
      if (fail) found.S = 'NO — bounded in, unbounded out';
      else if (found.S?.startsWith('NO')) { /* keep the kill */ }
      else found.S = 'consistent ✓ (try u(t)!)';
      info.set(fail
        ? 'A bounded input produced an output racing off the chart. BIBO stability is dead — one worst-case input suffices.'
        : `Bounded in, bounded out for THIS input. Stability can only be disproved by tests — try the step u(t), the integrator-killer.`);
    }
    renderBoard();
  }

  const ctl = controls();
  const probeSel = select('probe input', Object.entries(PROBES).map(([k, s]) => [k, s.label]), probeKey, (v) => { probeKey = v; });
  ctl.append(probeSel.el,
    buttonRow(
      button('linearity rig', () => run('L')),
      button('TI rig', () => run('TI')),
      button('causality rig', () => run('C')),
      button('memory rig', () => run('M')),
      button('stability rig', () => run('S')),
    ));
  root.appendChild(ctl);
  const revealRow = buttonRow(
    button('new mystery', () => {
      mysteryKey = keys[(keys.indexOf(mysteryKey) + 1 + Math.floor(Math.random() * (keys.length - 1))) % keys.length];
      for (const k of Object.keys(found)) delete found[k];
      info.set('New box installed. Probe away.');
      renderBoard();
      plot.begin();
    }),
    button('reveal', () => {
      const s = POOL[mysteryKey];
      const t = s.truth;
      info.set(`<b>${s.formula}</b> — truth: ${t.L ? 'linear' : 'NONlinear'}, ${t.TI ? 'TI' : 'time-varying'}, ${t.C ? 'causal' : 'NON-causal'}, ${t.M ? 'has memory' : 'memoryless'}, ${t.S ? 'BIBO stable' : 'UNSTABLE'}. ${s.lesson}. Tests falsify; only the formula + a general argument can PROVE.`);
    }),
  );
  root.appendChild(revealRow);
  renderBoard();
  plot.begin();
  info.set('Pick a probe and run a rig. Solid vs dashed traces should coincide when a property holds; red = residual.');

  return {
    setParams() {},
    resume() {},
    destroy() { plot.destroy(); },
    getState() { return { mystery: POOL[mysteryKey].formula, found }; },
  };
});
