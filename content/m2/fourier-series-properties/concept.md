---
id: m2/fourier-series-properties
title: "Fourier series properties: operations in time, echoes in the spectrum"
short: FS properties
module: 2
tier: core
outcomes: [CO2]
prereqs: [m2/fourier-series]
aliases: ["FS properties", "time shift property", "parseval power", "differentiation property"]
exam: { minor1: high, major: medium, marks: "4–8", styles: [compute, conceptual] }
crosslinks:
  - { target: m2/ft-properties, relation: "the same property table, graduated to aperiodic signals" }
  - { target: m1/signal-operations, relation: "each time-domain operation you learned there now has a spectral shadow" }
---

## @intuition

You already computed coefficients the hard way. The property table is the *lazy* way: if a new signal is an old signal shifted, scaled, or differentiated, its coefficients follow from the old ones by one-line rules — no new integrals. Properties are not a table to memorize; each one is a symmetry of the analysis formula, and each earns real marks when it replaces a page of integration.

---
@viz props-builder {"target":"square","n":9}
Drag the time-shift slider. The waveform slides; the magnitude stems stand perfectly still while the phases tilt — linearly in $k$, steeper for higher harmonics (they have farther to rotate per second of delay). **Shift ⇒ phase ramp $e^{-jk\omega_0 t_0}$, magnitude untouched.** This one picture explains why "magnitude spectrum" is the shift-proof fingerprint of a waveform.

---
Differentiate the signal and each $c_k$ gets multiplied by $jk\omega_0$: high harmonics amplified in proportion to $k$ — differentiation is a treble boost, which is why differentiating noisy data is dangerous. Integrate: divide by $jk\omega_0$ — a bass boost (legal only when $c_0 = 0$; a DC offset integrates into a ramp, which is no longer periodic). One caution flag from the correctness ledger: the differentiation rule applies cleanly to *continuous* periodic signals — differentiating a square wave produces impulse trains, a distributional story.

---
And time reversal: $x(-t) \leftrightarrow c_{-k}$ — the spectrum indexes reverse. For *real* signals $c_{-k} = c_k^*$, so reversal looks like conjugation — but quote the general rule first: the conjugation shortcut silently assumes realness, and papers notice.

## @definition

Let $x \leftrightarrow c_k$ (period $T_0$ fixed). Then:

| Operation | Coefficients |
|---|---|
| $Ax + By$ | $Ac_k + Bd_k$ (linearity) |
| $x(t - t_0)$ | $c_k\,e^{-jk\omega_0 t_0}$ (phase ramp; $|c_k|$ invariant) |
| $x(-t)$ | $c_{-k}$ (= $c_k^*$ only for real $x$) |
| $x^*(t)$ | $c_{-k}^*$ |
| $\frac{dx}{dt}$ (x continuous) | $jk\omega_0\,c_k$ |
| $\int x\,dt$ (needs $c_0 = 0$) | $c_k/(jk\omega_0)$ |
| $x(t)e^{jM\omega_0 t}$ | $c_{k-M}$ (spectrum shifts by $M$ slots) |
| **Parseval (power)** | $P = \frac{1}{T_0}\int_{T_0}|x|^2 = \sum_k |c_k|^2$ |

Time scaling $x(at)$ changes the *period* (to $T_0/a$) but keeps the same $c_k$ attached to the new fundamental — the recipe survives, the tempo changes.

## @derivation

### Step: Shift property in two lines
?why: Substitute τ = t − t₀ in the analysis integral; the exponential factors.
$\frac{1}{T_0}\int x(t{-}t_0)e^{-jk\omega_0 t}dt = e^{-jk\omega_0 t_0}\cdot\frac{1}{T_0}\int x(\tau)e^{-jk\omega_0\tau}d\tau = c_k e^{-jk\omega_0 t_0}$. The delay factored out as a unit-magnitude complex number — that is the whole theorem.

### Step: Differentiation by termwise differentiating the synthesis
?why: For continuous x the series converges well enough to differentiate term by term.
$\frac{d}{dt}\sum c_k e^{jk\omega_0 t} = \sum (jk\omega_0 c_k)e^{jk\omega_0 t}$ — read off the new coefficients. The $k$ multiplier is the treble boost; and it is why one derivative of smoothness costs exactly one factor of $1/k$ in decay (this property and the decay law are the same fact).

### Step: Parseval (power form), honestly
?why: Orthogonality kills every cross term in |x|².
$\frac{1}{T_0}\int|x|^2 = \frac{1}{T_0}\int\left(\sum_k c_k e^{jk\omega_0 t}\right)\left(\sum_m c_m^* e^{-jm\omega_0 t}\right)dt = \sum_k |c_k|^2$ — only the $k{=}m$ diagonal survives. Power adds across harmonics because harmonics are orthogonal: no tone can hide power in another's account.

## @examples

**Worked (property replaces integral):** the triangle wave is the integral of the square wave (scaled). From square's $b_k = 4/\pi k$ (odd $k$), integration divides by $k\omega_0$: triangle coefficients $\propto 1/k^2$ — obtained with zero integration, matching the direct computation. Cite "integration property" and collect the marks.

**Worked (Parseval budget):** the square wave has $P = 1$ (it is ±1 everywhere). Its fundamental alone carries $|c_1|^2 + |c_{-1}|^2 = 2(2/\pi)^2 \approx 0.81$ — 81% of the power in one harmonic. First three terms: ≈ 95%. This is why "just the fundamental" is often a usable approximation of a square drive.

**Worked (modulation slot-shift):** multiply a signal by $e^{j2\omega_0 t}$: every stem moves up two slots ($c_k \to c_{k-2}$) — the DC lands at $k = 2$. Multiplying by $\cos(2\omega_0 t)$ splits it half-and-half into $\pm 2$ slots — modulation as spectrum surgery, previewing AM in the FT world.

## @misconceptions
- wrong: "Delaying a signal changes its magnitude spectrum."
  tempting: "The waveform looks different, so the spectrum should too."
  correction: "Delay tilts PHASES only: |cₖ| is shift-proof. That invariance is what makes magnitude spectra reliable signatures for repeating waveforms."
- wrong: "x(−t) ↔ cₖ* — reversal conjugates, done."
  tempting: "It works on every real example you try."
  correction: "The general law is cₖ → c₋ₖ. It EQUALS conjugation only because your examples were real (c₋ₖ = cₖ*). On a complex signal the shortcut fails — and stating the general law is what the mark scheme prints."
- wrong: "You can integrate any periodic signal termwise."
  tempting: "The rule cₖ/(jkω₀) looks universal."
  correction: "k = 0 divides by zero: a nonzero DC integrates into a growing ramp — not periodic, no series. The rule needs c₀ = 0; check it first."

## @exam

4–8 marks: given the FS of a base wave, produce coefficients of shifted/reversed/differentiated/modulated versions — the mark is for NAMING the property and applying its factor, not re-deriving. Parseval power computations (sum $|c_k|^2$, remember both $\pm k$) appear on both Minors. Traps: the $c_0 = 0$ requirement for integration; time-scaling changing the fundamental (not the $c_k$); phase ramps applied with the wrong sign of $t_0$.

## @summary

- Shift: $\times\,e^{-jk\omega_0 t_0}$ (phase ramp; $|c_k|$ fixed). Reverse: $c_k \to c_{-k}$ ($= c_k^*$ iff real).
- Differentiate: $\times\,jk\omega_0$ (treble boost; continuous signals). Integrate: $\div\,jk\omega_0$ (needs $c_0=0$).
- Modulate by $e^{jM\omega_0 t}$: slot shift $c_{k-M}$; by cos: half into each of $\pm M$.
- **Parseval:** $P = \sum|c_k|^2$ (both signs of $k$!). Time-scale: same $c_k$, new fundamental.
- Properties are symmetries of the analysis integral — cite them by name to skip integrals legally.
