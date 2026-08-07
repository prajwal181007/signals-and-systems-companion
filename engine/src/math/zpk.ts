// ZPK-first rational systems: zeros/poles/gain are the system of record —
// never expanded coefficients (root positions of expanded polynomials are
// violently ill-conditioned; jittering poles would teach a false intuition).
import { C, c, cadd, cmul, csub, cdiv, cabs, carg, cexp, cscale, cconj } from './complex';

export interface ZPK { zeros: C[]; poles: C[]; k: number }

// ---------------- polynomial helpers (low order only) ----------------
export function polyFromRoots(roots: C[]): C[] {
  let coeffs: C[] = [c(1)];
  for (const r of roots) {
    const next: C[] = new Array(coeffs.length + 1).fill(0).map(() => c(0));
    for (let i = 0; i < coeffs.length; i++) {
      next[i] = cadd(next[i], coeffs[i]);
      next[i + 1] = csub(next[i + 1], cmul(coeffs[i], r));
    }
    coeffs = next;
  }
  return coeffs; // descending powers
}

export function polyEval(coeffs: C[], s: C): C {
  let acc = c(0);
  for (const co of coeffs) acc = cadd(cmul(acc, s), co);
  return acc;
}

// Durand–Kerner simultaneous root finding, Newton-polished. Degree capped at
// 10 upstream (typed-coefficient drawers warn beyond that).
export function polyRoots(coeffsIn: number[]): C[] {
  // strip leading/trailing zeros (typed polynomials produce them)
  let coeffs = coeffsIn.slice();
  while (coeffs.length && Math.abs(coeffs[0]) < 1e-300) coeffs.shift();
  let zeroRoots = 0;
  while (coeffs.length && Math.abs(coeffs[coeffs.length - 1]) < 1e-300) { coeffs.pop(); zeroRoots++; }
  const n = coeffs.length - 1;
  const roots: C[] = [];
  for (let i = 0; i < zeroRoots; i++) roots.push(c(0));
  if (n < 1) return roots;
  const a0 = coeffs[0];
  const norm = coeffs.map((x) => x / a0);
  const cc: C[] = norm.map((x) => c(x));
  // initial guesses on a slightly irrational spiral
  let guesses: C[] = [];
  const radius = 1 + Math.max(...norm.slice(1).map(Math.abs));
  for (let i = 0; i < n; i++) {
    const th = (2 * Math.PI * i) / n + 0.4;
    guesses.push(c(radius * 0.6 * Math.cos(th), radius * 0.6 * Math.sin(th)));
  }
  for (let iter = 0; iter < 200; iter++) {
    let maxMove = 0;
    for (let i = 0; i < n; i++) {
      const p = polyEval(cc, guesses[i]);
      let denom = c(1);
      for (let j = 0; j < n; j++) if (j !== i) denom = cmul(denom, csub(guesses[i], guesses[j]));
      const delta = cdiv(p, denom);
      guesses[i] = csub(guesses[i], delta);
      maxMove = Math.max(maxMove, cabs(delta));
    }
    if (maxMove < 1e-13) break;
  }
  // Newton polish on the original polynomial
  const dcoeffs: C[] = [];
  for (let i = 0; i < n; i++) dcoeffs.push(c(norm[i] * (n - i)));
  for (let i = 0; i < n; i++) {
    for (let it = 0; it < 3; it++) {
      const f = polyEval(cc, guesses[i]);
      const df = polyEval(dcoeffs, guesses[i]);
      if (cabs(df) < 1e-300) break;
      guesses[i] = csub(guesses[i], cdiv(f, df));
    }
    // snap tiny imaginary parts (real-coefficient input)
    if (Math.abs(guesses[i].im) < 1e-9 * Math.max(1, Math.abs(guesses[i].re))) guesses[i] = c(guesses[i].re);
  }
  return roots.concat(guesses);
}

// ---------------- frequency response ----------------
// Evaluate H at s = jω (or z = e^{jΩ}) as Π(s−zᵢ)/Π(s−pⱼ), accumulating
// log-magnitude and phase separately — never form the product then log.
export function freqResponse(sys: ZPK, sPoints: C[]): { mag: Float64Array; phase: Float64Array } {
  const n = sPoints.length;
  const mag = new Float64Array(n);
  const phase = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const s = sPoints[i];
    let logMag = Math.log(Math.abs(sys.k) || 1e-140);
    let ph = sys.k < 0 ? Math.PI : 0;
    for (const z of sys.zeros) {
      const v = csub(s, z);
      logMag += Math.log(Math.max(cabs(v), 1e-140));
      ph += carg(v);
    }
    for (const p of sys.poles) {
      const v = csub(s, p);
      logMag -= Math.log(Math.max(cabs(v), 1e-140));
      ph -= carg(v);
    }
    mag[i] = Math.exp(logMag);
    phase[i] = ph;
  }
  return { mag, phase };
}

// Sequential phase unwrap (2π-jump correction). Genuine π-jumps at on-axis
// zeros are the caller's business to annotate — the grid must be refined near
// axis-adjacent singularities before unwrapping (see logGrid refinement).
export function unwrapPhase(phase: Float64Array): Float64Array {
  const out = new Float64Array(phase.length);
  out[0] = phase[0];
  for (let i = 1; i < phase.length; i++) {
    let d = phase[i] - phase[i - 1];
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    out[i] = out[i - 1] + d;
  }
  return out;
}

// Log-frequency grid, refined near resonances (poles/zeros close to the axis).
export function logGrid(w0: number, w1: number, sys: ZPK | null, base = 96): number[] {
  const out: number[] = [];
  const decades = Math.log10(w1 / w0);
  const n = Math.max(64, Math.round(base * decades));
  for (let i = 0; i <= n; i++) out.push(w0 * Math.pow(10, (decades * i) / n));
  if (sys) {
    for (const r of [...sys.poles, ...sys.zeros]) {
      const wc = Math.abs(r.im) || Math.abs(r.re);
      const dist = Math.abs(r.re);
      if (wc > w0 && wc < w1 && dist < wc * 0.5) {
        const span = Math.max(dist, wc * 0.01);
        for (let i = -12; i <= 12; i++) out.push(wc + (span * i) / 8);
      }
    }
    out.sort((a, b) => a - b);
  }
  return out.filter((w, i, a) => w > 0 && (i === 0 || w > a[i - 1] * 1.0001));
}

// ---------------- impulse response (closed form — never numerically integrate) ----------------
// Partial fractions over ZPK → sum of residues·e^{pt}; near-coincident poles
// merge into confluent (t·e^{pt}) terms via clustering, so dragging two poles
// together morphs smoothly instead of flashing garbage.
export interface Mode { pole: C; coef: C; power: number } // coef · t^power · e^{pole·t}

export function impulseModes(sys: ZPK): { modes: Mode[]; direct: number } {
  const { zeros, poles, k } = sys;
  if (poles.length === 0) return { modes: [], direct: k * (zeros.length === 0 ? 1 : NaN) };
  // cluster poles (relative tolerance)
  const clusters: Array<{ pole: C; mult: number }> = [];
  const scale = Math.max(1, ...poles.map(cabs));
  for (const p of poles) {
    const hit = clusters.find((cl) => cabs(csub(cl.pole, p)) < 1e-6 * scale);
    if (hit) { hit.mult++; hit.pole = cscale(cadd(cscale(hit.pole, hit.mult - 1), p), 1 / hit.mult); }
    else clusters.push({ pole: p, mult: 1 });
  }
  const modes: Mode[] = [];
  const numPoly = polyFromRoots(zeros);
  for (const cl of clusters) {
    if (cl.mult === 1) {
      // residue = k·N(p)/Π(p−p_j) over other clusters (with multiplicity)
      let denom = c(1);
      for (const other of clusters) {
        if (other === cl) continue;
        let d = csub(cl.pole, other.pole);
        for (let m = 0; m < other.mult; m++) denom = cmul(denom, d);
      }
      const num = polyEval(numPoly, cl.pole);
      modes.push({ pole: cl.pole, coef: cscale(cdiv(num, denom), k), power: 0 });
    } else {
      // repeated pole: numerical differentiation of (s-p)^m H(s) — orders ≤ 3 in practice
      const m = cl.mult;
      const g = (s: C): C => {
        let v = cscale(polyEval(numPoly, s), k);
        for (const other of clusters) {
          if (other === cl) continue;
          let d = csub(s, other.pole);
          for (let q = 0; q < other.mult; q++) v = cdiv(v, d);
        }
        return v;
      };
      const h = 1e-4 * scale;
      for (let j = 0; j < m; j++) {
        // H(s) ⊃ A_j/(s−p)^{m−j} with A_j = g^{(j)}(p)/j!  ⇒  time-domain term
        // A_j · t^{m−1−j} e^{pt}/(m−1−j)!
        const deriv = numDeriv(g, cl.pole, j, h);
        modes.push({ pole: cl.pole, coef: cscale(deriv, 1 / (factorial(j) * factorial(m - 1 - j))), power: m - 1 - j });
      }
    }
  }
  return { modes, direct: 0 };
}

function factorial(n: number): number { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }

// j-th derivative by central differences (j ≤ 3) — adequate for display use.
function numDeriv(g: (s: C) => C, p: C, j: number, h: number): C {
  if (j === 0) return g(p);
  const gp = (s: C) => numDeriv(g, s, j - 1, h);
  const fwd = gp(cadd(p, c(h)));
  const bwd = gp(csub(p, c(h)));
  return cscale(csub(fwd, bwd), 1 / (2 * h));
}

// Evaluate h(t) on a grid from modes; real signals: conjugate pairs collapse to
// 2·Re — always take the real part and warn if imaginary residue survives.
export function evalModes(modes: Mode[], t: Float64Array): Float64Array {
  const y = new Float64Array(t.length);
  for (const m of modes) {
    for (let i = 0; i < t.length; i++) {
      const ti = t[i];
      if (ti < 0) continue;
      const e = cexp(cscale(m.pole, ti));
      const tp = m.power === 0 ? 1 : Math.pow(ti, m.power);
      y[i] += (m.coef.re * e.re - m.coef.im * e.im) * tp;
    }
  }
  return y;
}

// Per-mode contribution (conjugate pairs merged) for the mode-decomposition
// pane: each entry is a real trace + a label.
export function modeTraces(modes: Mode[], t: Float64Array): Array<{ label: string; y: Float64Array }> {
  const used = new Set<number>();
  const out: Array<{ label: string; y: Float64Array }> = [];
  for (let i = 0; i < modes.length; i++) {
    if (used.has(i)) continue;
    const m = modes[i];
    let partner = -1;
    if (Math.abs(m.pole.im) > 1e-9) {
      partner = modes.findIndex((o, j) => j !== i && !used.has(j) && o.power === m.power &&
        Math.abs(o.pole.re - m.pole.re) < 1e-9 && Math.abs(o.pole.im + m.pole.im) < 1e-9);
    }
    const group = partner >= 0 ? [m, modes[partner]] : [m];
    if (partner >= 0) used.add(partner);
    used.add(i);
    const y = evalModes(group, t);
    const label = Math.abs(m.pole.im) > 1e-9
      ? `e^{${fmt(m.pole.re)}t}·cos(${fmt(Math.abs(m.pole.im))}t+φ)${m.power ? '·t^' + m.power : ''}`
      : `${m.power ? 't^' + m.power + '·' : ''}e^{${fmt(m.pole.re)}t}`;
    out.push({ label, y });
  }
  return out;
}
const fmt = (x: number) => (Math.abs(x) < 1e-9 ? '0' : x.toFixed(2).replace(/\.?0+$/, ''));

// Step response = ∫h: add a pole at s=0 (i.e. H(s)/s) and evaluate.
export function stepModes(sys: ZPK): { modes: Mode[] } {
  return { modes: impulseModes({ ...sys, poles: [...sys.poles, c(0)] }).modes };
}

// ---------------- interconnection algebra (ZPK-only) ----------------
export function cascade(a: ZPK, b: ZPK): ZPK {
  return { zeros: [...a.zeros, ...b.zeros], poles: [...a.poles, ...b.poles], k: a.k * b.k };
}
// parallel & feedback re-root the (low order) combined numerator only.
export function parallel(a: ZPK, b: ZPK): ZPK {
  const na = polyFromRoots(a.zeros).map((x) => x.re * a.k);
  const nb = polyFromRoots(b.zeros).map((x) => x.re * b.k);
  const da = polyFromRoots(a.poles).map((x) => x.re);
  const db = polyFromRoots(b.poles).map((x) => x.re);
  const num = polyAdd(polyMulR(na, db), polyMulR(nb, da));
  const k = num[0] ?? 0;
  return { zeros: polyRoots(num), poles: [...a.poles, ...b.poles], k };
}
export function feedback(g: ZPK, h: ZPK, sign = -1): ZPK {
  // closed loop = G/(1 − sign·G·H); poles = roots of D_g·D_h − sign·N_g·N_h
  const ng = polyFromRoots(g.zeros).map((x) => x.re * g.k);
  const dg = polyFromRoots(g.poles).map((x) => x.re);
  const nh = polyFromRoots(h.zeros).map((x) => x.re * h.k);
  const dh = polyFromRoots(h.poles).map((x) => x.re);
  const den = polyAdd(polyMulR(dg, dh), polyMulR(ng, nh).map((x) => -sign * x));
  return { zeros: [...g.zeros, ...h.poles], poles: polyRoots(den), k: g.k };
}
function polyMulR(a: number[], b: number[]): number[] {
  const out = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) out[i + j] += a[i] * b[j];
  return out;
}
function polyAdd(a: number[], b: number[]): number[] {
  const n = Math.max(a.length, b.length);
  const out = new Array(n).fill(0);
  for (let i = 0; i < a.length; i++) out[n - a.length + i] += a[i];
  for (let i = 0; i < b.length; i++) out[n - b.length + i] += b[i];
  return out;
}
export { polyMulR, polyAdd };
