// Parameterized drill generators — unlimited practice volume from seeded
// parameters, so authored items can stay reserved for misconception traps.
// Each generator returns a quiz-runner-compatible item.

let seedState = 12345;
export function seedDrills(s: number) { seedState = s >>> 0 || 1; }
function rnd(): number {
  seedState ^= seedState << 13; seedState >>>= 0;
  seedState ^= seedState >> 17;
  seedState ^= seedState << 5; seedState >>>= 0;
  return seedState / 4294967296;
}
const pick = <T,>(a: T[]): T => a[Math.floor(rnd() * a.length)];
const ri = (lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));

export interface Drill { id: string; kind: string; promptHtml: string; choices?: string[]; answer: any; tolerance?: number; explanationHtml: string; vars?: string[] }

// ---- convolution: regime-by-regime for two rects (the exam pattern) ----
export function drillConvRect(): Drill {
  const w1 = ri(1, 3), w2 = ri(w1, 4), h1 = ri(1, 3), h2 = ri(1, 2);
  const which = pick(['support', 'flattop', 'peakpos']);
  const supEnd = w1 + w2;
  if (which === 'support') {
    return {
      id: `d-conv-sup-${w1}${w2}`, kind: 'numeric',
      promptHtml: `<p>x(t) = ${h1}·[u(t) − u(t−${w1})] and h(t) = ${h2}·[u(t) − u(t−${w2})]. On what interval is y = x∗h nonzero? Enter the <b>right endpoint</b>.</p>`,
      answer: supEnd, tolerance: 0,
      explanationHtml: `<p>Supports add: [0+0, ${w1}+${w2}] = [0, ${supEnd}]. Write this down before any integration — it is a free sanity check on everything after.</p>`,
    };
  }
  if (which === 'flattop') {
    const flat = h1 * h2 * Math.min(w1, w2);
    return {
      id: `d-conv-flat-${w1}${w2}${h1}${h2}`, kind: 'numeric',
      promptHtml: `<p>x(t) = ${h1}·[u(t) − u(t−${w1})], h(t) = ${h2}·[u(t) − u(t−${w2})]${w1 === w2 ? ' (equal widths!)' : ''}. What is the ${w1 === w2 ? '<b>peak</b> value of the triangle' : 'value of y on its <b>flat top</b>'}?</p>`,
      answer: flat, tolerance: 0.001,
      explanationHtml: `<p>While the shorter pulse (width ${Math.min(w1, w2)}) sits fully inside the longer one, the overlap integral is ${h1}·${h2}·${Math.min(w1, w2)} = <b>${flat}</b>. Equal widths kill the plateau — the trapezoid degenerates to a triangle.</p>`,
    };
  }
  return {
    id: `d-conv-reg-${w1}${w2}`, kind: 'mcq',
    promptHtml: `<p>For the same pair (widths ${w1} and ${w2}), which integral computes y(t) in the <b>final</b> overlap regime ${w2} ≤ t < ${supEnd}?</p>`,
    choices: [
      `∫ from 0 to t`,
      `∫ from t−${w2} to ${w1}`,
      `∫ from 0 to ${w1}`,
      `∫ from t−${w2} to t`,
    ],
    answer: 1,
    explanationHtml: `<p>In the last regime the flipped pulse's left edge t−${w2} has entered [0, ${w1}] while x's right edge ${w1} caps the top: limits [t−${w2}, ${w1}]. Regime boundaries happen where edges cross — list them first.</p>`,
  };
}

// ---- ROC classification ----
export function drillRoc(): Drill {
  const a = ri(1, 4);
  const kind = pick(['right', 'left', 'two', 'ft']);
  if (kind === 'right') {
    return {
      id: `d-roc-r-${a}`, kind: 'mcq',
      promptHtml: `<p>x(t) = e^{−${a}t}u(t). The ROC of X(s) is:</p>`,
      choices: [`Re(s) > −${a}`, `Re(s) < −${a}`, `−${a} < Re(s) < ${a}`, `all s`],
      answer: 0,
      explanationHtml: `<p>Right-sided ⇒ ROC is right of the rightmost pole (−${a}). The taming weight e^{−σt} must beat the tail as t → +∞.</p>`,
    };
  }
  if (kind === 'left') {
    return {
      id: `d-roc-l-${a}`, kind: 'mcq',
      promptHtml: `<p>x(t) = −e^{−${a}t}u(−t). Its transform is X(s) = 1/(s+${a}) — the SAME algebra as e^{−${a}t}u(t). What distinguishes them?</p>`,
      choices: [
        `Nothing — they are the same signal`,
        `The ROC: Re(s) < −${a} here, Re(s) > −${a} for the right-sided one`,
        `The gain constant`,
        `The pole location`,
      ],
      answer: 1,
      explanationHtml: `<p>The algebraic X(s) is identical; only the ROC separates a decaying right-sided signal from a growing left-sided one. The ROC is half the transform.</p>`,
    };
  }
  if (kind === 'two') {
    return {
      id: `d-roc-2-${a}`, kind: 'mcq',
      promptHtml: `<p>x(t) = e^{−${a}|t|} (two-sided). The ROC is:</p>`,
      choices: [`Re(s) > ${a}`, `Re(s) < −${a}`, `−${a} < Re(s) < ${a}`, `empty`],
      answer: 2,
      explanationHtml: `<p>Two-sided ⇒ a strip: σ > −${a} handles the right tail, σ < ${a} the left tail. Both at once ⇒ −${a} < Re(s) < ${a}.</p>`,
    };
  }
  return {
    id: `d-roc-ft-${a}`, kind: 'mcq',
    promptHtml: `<p>X(s) = 1/(s−${a}) with ROC Re(s) > ${a}. Does the ordinary Fourier transform of x(t) exist?</p>`,
    choices: [`Yes — substitute s = jω`, `No — the ROC does not contain the jω axis`, `Yes, but only for ω > ${a}`, `Only if x is periodic`],
    answer: 1,
    explanationHtml: `<p>The ordinary FT is the jω-axis slice of the Laplace transform — legal only when the axis lies inside the ROC. Here the ROC starts at Re(s)=${a} > 0: e^{${a}t}u(t) grows, no ordinary FT. (Distributional pairs like u(t) are a separately defined extension.)</p>`,
    };
}

// ---- Bode numeric reading ----
export function drillBode(): Drill {
  const wc = pick([1, 2, 10]);
  const kind = pick(['slope', 'gain', 'type']);
  if (kind === 'slope') {
    const nOrigin = ri(0, 2);
    return {
      id: `d-bode-s-${nOrigin}`, kind: 'numeric',
      promptHtml: `<p>L(s) = K/(s${nOrigin === 0 ? '' : nOrigin === 1 ? '' : '²'}${nOrigin > 0 ? '·' : ''}(s+${wc})). ${nOrigin === 0 ? `With no pole at the origin, ` : `With ${nOrigin} pole${nOrigin > 1 ? 's' : ''} at the origin, `}what is the <b>initial slope</b> of the Bode magnitude in dB/decade (at ω far below ${wc})?</p>`,
      answer: -20 * nOrigin, tolerance: 0,
      explanationHtml: `<p>Each origin pole contributes −20 dB/dec from ω = 0; finite-corner poles only engage above their corners. Initial slope = −20 × (system type) = ${-20 * nOrigin} dB/dec.</p>`,
    };
  }
  if (kind === 'gain') {
    const decades = ri(1, 2);
    return {
      id: `d-bode-g-${wc}${decades}`, kind: 'numeric',
      promptHtml: `<p>A magnitude plot passes 0 dB at ω = ${wc} falling at −20 dB/dec. Reading the asymptote, what is |L| in dB at ω = ${wc * Math.pow(10, decades)}?</p>`,
      answer: -20 * decades, tolerance: 0,
      explanationHtml: `<p>${decades} decade${decades > 1 ? 's' : ''} above the crossover at −20 dB/dec: 0 − 20×${decades} = ${-20 * decades} dB. Asymptote arithmetic is exactly this mechanical — that is the point of log axes.</p>`,
    };
  }
  return {
    id: `d-bode-pm`, kind: 'numeric',
    promptHtml: `<p>At the gain crossover, the phase reads −155°. What is the phase margin in degrees?</p>`,
    answer: 25, tolerance: 0,
    explanationHtml: `<p>PM = 180° + ∠L(jω_gc) = 180 − 155 = <b>25°</b> — how much extra phase lag the loop can absorb before sustained oscillation.</p>`,
  };
}

// ---- Kalman rank (controllability by hand) ----
export function drillRank(): Drill {
  // random 2×2 with controllable/uncontrollable cases
  const uncontrollable = rnd() < 0.4;
  let a11 = ri(-2, 2), a12 = ri(-2, 2), a21 = ri(-2, 2), a22 = ri(-2, 2);
  let b1: number, b2: number;
  if (uncontrollable) {
    // pick B as eigenvector of a diagonal-ish A
    a12 = 0; a21 = 0;
    b1 = 1; b2 = 0;
    if (a11 === a22) a22 = a11 + 1;
  } else {
    b1 = ri(0, 1); b2 = 1;
    if (a12 === 0 && b1 === 0) a12 = 1;
  }
  const Ab1 = a11 * b1 + a12 * b2, Ab2 = a21 * b1 + a22 * b2;
  const det = b1 * Ab2 - b2 * Ab1;
  return {
    id: `d-rank-${a11}${a12}${a21}${a22}${b1}${b2}`, kind: 'numeric',
    promptHtml: `<p>A = [[${a11}, ${a12}], [${a21}, ${a22}]], B = [${b1}, ${b2}]ᵀ. Compute AB, form the controllability matrix [B AB], and enter its <b>rank</b>.</p>`,
    answer: Math.abs(det) > 1e-9 ? 2 : 1, tolerance: 0,
    explanationHtml: `<p>AB = [${Ab1}, ${Ab2}]ᵀ, so [B AB] = [[${b1}, ${Ab1}], [${b2}, ${Ab2}]], det = ${b1}·${Ab2} − ${b2}·${Ab1} = ${det}. ${Math.abs(det) > 1e-9 ? 'Nonzero det ⇒ rank 2 ⇒ controllable: the push and its dynamically-rotated copy span the plane.' : 'Zero det ⇒ rank 1 ⇒ UNcontrollable: A·B stayed parallel to B (B sits on an eigenvector) — one whole direction is unreachable, and more time will not help.'}</p>`,
  };
}

export const DRILL_FAMILIES: Record<string, { label: string; gen: () => Drill; modules: number[] }> = {
  conv: { label: 'Convolution regimes (rect × rect)', gen: drillConvRect, modules: [1] },
  roc: { label: 'ROC classification', gen: drillRoc, modules: [3] },
  bode: { label: 'Bode numeric reading', gen: drillBode, modules: [5] },
  rank: { label: 'Controllability rank tests', gen: drillRank, modules: [5] },
};
