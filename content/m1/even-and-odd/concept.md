---
id: m1/even-and-odd
title: "Even and odd parts: every signal splits in two"
short: Even & odd
module: 1
tier: core
outcomes: [CO1]
prereqs: [m1/what-is-a-signal]
aliases: ["even symmetry", "odd symmetry", "signal decomposition", "symmetric part", "antisymmetric"]
exam: { minor1: medium, major: low, marks: "3–6", styles: [compute, sketch] }
crosslinks:
  - { target: m2/fourier-series, relation: "even signals need only cosines, odd only sines — symmetry kills half the coefficients before you compute" }
  - { target: m2/orthogonality, relation: "the even and odd parts are orthogonal — the first decomposition-into-orthogonal-pieces you meet" }
---

## @intuition

Fold a photograph along its vertical center line. Some images land exactly on themselves (a face, roughly); some land on their own negative (a checkerboard's borders). Most images do neither — but here is the surprise: **every** image is exactly the sum of one perfectly fold-symmetric picture and one perfectly fold-antisymmetric picture. Signals fold about $t = 0$ the same way, and the split is unique, lossless, and free to compute.

---
@viz decomposer {"signal":"expu"}
Take $e^{-t}u(t)$ — all of it lives on the right, no symmetry in sight. The machine computes $x_e = \tfrac12[x(t)+x(-t)]$ and $x_o = \tfrac12[x(t)-x(-t)]$: a symmetric tent and an antisymmetric S-shape. Add the panes back: the left halves cancel *exactly*, the right halves reinforce into the original. The one-sided signal was secretly hiding $\tfrac12 e^{-|t|}$ (that's $\cosh$-flavored) plus $\tfrac12\,\mathrm{sgn}(t)e^{-|t|}$ ($\sinh$-flavored) all along.

---
Why care? Three reasons that pay off later. **Speed:** symmetric integrands over symmetric limits — odd ones vanish, even ones double: $\int_{-a}^{a}(\text{odd}) = 0$. **Fourier previews:** an even signal will need only cosines, an odd one only sines — half the coefficients die before any integral is computed. **Structure:** the two parts share no energy (they are orthogonal — check the $\int x_e x_o\,dt = 0$ readout), so energy splits cleanly: $E = E_e + E_o$.

## @definition

$$x_e(t) = \frac{x(t) + x(-t)}{2} \qquad x_o(t) = \frac{x(t) - x(-t)}{2} \qquad x = x_e + x_o$$

- **Even:** $x(-t) = x(t)$ (mirror about the vertical axis). **Odd:** $x(-t) = -x(t)$ (180° rotation about the origin); an odd signal must have $x(0) = 0$.
- The decomposition is **unique**: no other even/odd pair sums to $x$.
- Products: even·even = even, odd·odd = even, even·odd = odd. Integrals over $[-a, a]$: odd integrand → 0; even → twice the half-range.
- DT identically: $x_e[n] = \tfrac12(x[n] + x[-n])$, etc.

**Reading the symbols:** $x(-t)$ is the time-reversed signal — the fold. Averaging with the fold keeps what survives folding; differencing keeps what flips sign.

## @derivation

### Step: Construct the split and verify it works
?why: Adding the two candidate formulas telescopes back to x(t).
$x_e + x_o = \tfrac12[x(t)+x(-t)] + \tfrac12[x(t)-x(-t)] = x(t)$. And $x_e(-t) = \tfrac12[x(-t)+x(t)] = x_e(t)$ (even ✓), $x_o(-t) = -x_o(t)$ (odd ✓).

### Step: Uniqueness
?why: Suppose two splits exist; subtract them.
If $x = e_1 + o_1 = e_2 + o_2$ then $e_1 - e_2 = o_2 - o_1$: the left side is even, the right odd, and the only signal that is both is 0 (it must equal both its fold and its negated fold). Hence $e_1 = e_2$, $o_1 = o_2$.

### Step: Orthogonality — the parts share no energy
?why: The product of an even and an odd function is odd, and odd integrands over symmetric limits vanish.
$\int_{-\infty}^{\infty} x_e\,x_o\,dt = 0$, so $E = \int (x_e + x_o)^2 = E_e + E_o$ — the cross term dies. This is the first sighting of a theme Module 2 industrializes: decompose into orthogonal pieces and energies simply add.

## @examples

**Worked (the classic):** $x(t) = e^{-t}u(t)$. For $t > 0$: $x_e = \tfrac12 e^{-t}$, $x_o = \tfrac12 e^{-t}$. For $t < 0$: $x_e = \tfrac12 e^{t}$, $x_o = -\tfrac12 e^{t}$. Compactly: $x_e = \tfrac12 e^{-|t|}$, $x_o = \tfrac12\,\mathrm{sgn}(t)\,e^{-|t|}$. Sketch both — exams ask for the sketches, and the odd part's jump-through-zero at the origin is the detail markers look for.

**Worked (step function):** $u(t) = \tfrac12 + \tfrac12\,\mathrm{sgn}(t)$: even part a constant $\tfrac12$, odd part half the signum. This one-line split is used repeatedly when computing transforms of $u(t)$.

**Speed trick:** $\int_{-3}^{3} t^3\cos(t)\,dt$: odd × even = odd ⇒ integral = 0. Zero computation. Exams plant these.

## @misconceptions
- wrong: "A causal signal (zero for t<0) has no even part on the left."
  tempting: "The original is zero there, so the parts should be too."
  correction: "Both parts are nonzero for t<0 — they must CANCEL there, not vanish. x_e(−2) = x_o(−2)·(−1) ≠ 0 for e^{−t}u(t). The decomposition spreads the signal across both half-lines."
- wrong: "sin is even because its graph looks symmetric."
  tempting: "The waveform has a visual symmetry about its peaks."
  correction: "Symmetry is measured about t = 0, not about a peak: sin(−t) = −sin(t) ⇒ odd. cos is even. Check the DEFINITION at the axis, not the vibe of the plot."
- wrong: "x_e and x_o can share energy."
  tempting: "They overlap in time, so their energies should interact."
  correction: "Their cross-energy integral is an odd function integrated symmetrically: exactly zero. E = E_e + E_o always."

## @exam

Short 3–6 mark items in Minor I: compute and *sketch* $x_e, x_o$ for a one-sided exponential, a shifted pulse, or $u(t)$. Ritual: write both formulas, evaluate piecewise for $t>0$ and $t<0$ separately, then sketch with the origin behavior explicit ($x_o(0) = 0$ always). Speed marks: spotting odd-integrand-symmetric-limits zeros. Trap: forgetting the $\tfrac12$ factors (the parts reconstruct $x$, not $2x$).

## @summary

$$x_e = \tfrac12[x(t) + x(-t)],\quad x_o = \tfrac12[x(t) - x(-t)],\quad x = x_e + x_o \text{ (unique)}$$

- Even: $x(-t)=x(t)$ (cosine-like). Odd: $x(-t)=-x(t)$, forces $x_o(0)=0$ (sine-like).
- $e^{-t}u(t) \Rightarrow \tfrac12 e^{-|t|} + \tfrac12\mathrm{sgn}(t)e^{-|t|}$;  $u(t) = \tfrac12 + \tfrac12\mathrm{sgn}(t)$.
- $\int_{-a}^{a}$ odd $= 0$; even·odd = odd; parts are orthogonal ⇒ $E = E_e + E_o$.
- Foreshadow: even ⇒ cosine-only Fourier series; odd ⇒ sine-only.
