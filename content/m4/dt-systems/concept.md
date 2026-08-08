---
id: m4/dt-systems
title: "Discrete-time LTI systems: convolution with a counter"
short: DT systems
module: 4
tier: core
outcomes: [CO4]
prereqs: [m1/convolution, m3/difference-equations]
aliases: ["convolution sum", "dt convolution", "moving average", "h[n]", "digital filter"]
exam: { minor2: high, major: high, marks: "6–10", styles: [compute] }
crosslinks:
  - { target: m4/dtft, relation: "the frequency face of these systems lives on the unit circle" }
  - { target: m1/convolution-properties, relation: "every algebraic law carries over with Σ replacing ∫" }
---

## @intuition

Everything Module 1 built for continuous systems has a discrete twin, and the twin is *friendlier*: integrals become finite sums you can compute in a table, by hand, without limits or regimes. A DT LTI system is completely described by $h[n]$ — its response to the unit sample $\delta[n]$ — and the output is the **convolution sum**: every input sample launches a scaled, shifted copy of $h$, and copies add. Same story, now with a counter instead of a continuum.

---
@viz dt-conv {"x":"rect1","h":"exp","view":"slide","t":2}
The machine in DT mode shows the sliding dot-product: flip $h$, slide it to position $n$, multiply aligned samples, add. The readout spells each term: $y[2] = x[0]h[2] + x[1]h[1] + x[2]h[0]$ — a table row, not an integral. Support arithmetic is exact and finite: length-$N$ input ∗ length-$M$ response ⇒ length $N{+}M{-}1$ output.

---
Meet the two workhorse filters, each three coefficients of wisdom. The **moving average** $h = \{\tfrac13,\tfrac13,\tfrac13\}$: replaces each sample by a local average — smooths noise, blurs edges (a low-pass, by construction). The **first difference** $h = \{1, -1\}$: outputs changes only — kills constants, amplifies jumps (a high-pass; the DT derivative). Every giant DSP system decomposes into stacks of ideas this small.

---
@viz crank {"a1":0.8,"a2":0,"b0":1}
And the bridge to Module 3: a difference equation with feedback *is* a DT LTI system whose $h[n]$ the crank reveals — $y[n] = 0.8y[n-1] + x[n]$ echoes $\delta$ into $h[n] = (0.8)^n u[n]$: three multiplies, infinite memory (IIR). Stability by summability: $\sum|h| = \frac{1}{1-0.8} = 5 < \infty$ ✓ — or equivalently, pole at 0.8, inside the unit circle. Two languages, one criterion, both examined.

## @definition

$$y[n] = (x * h)[n] = \sum_{k=-\infty}^{\infty} x[k]\,h[n-k] = \sum_k h[k]\,x[n-k]$$

- **Properties** (all carried from CT): commutative, associative (cascade ⇒ $h_1 * h_2$), distributive (parallel ⇒ $h_1 + h_2$); identity $\delta[n]$; shift $x * \delta[n - n_0] = x[n - n_0]$; lengths: $N + M - 1$; start indices add.
- **Dictionary:** memoryless ⇔ $h = k\delta[n]$; causal ⇔ $h[n] = 0$ for $n < 0$; **BIBO ⇔ $\sum_n |h[n]| < \infty$** ⇔ (causal, rational) poles inside the unit circle.
- **Step response:** $s[n] = \sum_{k \le n} h[k]$ (running sum); $h[n] = s[n] - s[n-1]$ (first difference).
- Canonical FIRs: moving average (low-pass, smooths), first difference (high-pass, edges), echo $\delta[n] + \alpha\delta[n - D]$.

## @derivation

### Step: The convolution sum from LTI axioms (the DT derivation is 3 lines)
?why: Sifting is a finite statement in DT: x[n] = Σ x[k]δ[n−k], no limits needed.
$x[n] = \sum_k x[k]\delta[n-k]$ (each sample sits on its own shifted unit sample — trivially true). Linearity: push each term through; time-invariance: $\delta[n-k] \mapsto h[n-k]$. Sum: $y = \sum_k x[k]h[n-k]$ ∎. The CT derivation's limit machinery evaporates; this version is fully rigorous as written.

### Step: The tabular method (how exams want it computed)
?why: The sliding dot-product organizes as one table; each output is one anti-diagonal sum.
Write $x[k]$ across, $h[k]$ down; fill the product grid $x[k]h[m]$; then $y[n]$ = sum of the anti-diagonal $k + m = n$. Equivalent flip-and-slide, zero sign errors, self-auditing (row and column sums bound the total). Worked in full below.

### Step: Stability, both languages
?why: The bound argument is Module 1's, verbatim with Σ; the pole version comes from geometric summability.
$|y[n]| \le \sum|h[k]||x[n-k]| \le M\sum|h|$: summable $h$ tames every bounded input. For $h = a^nu[n]$: $\sum|a|^n = \frac{1}{1-|a|}$ finite iff $|a| < 1$ — the pole-in-the-disk criterion is geometric-series convergence wearing z-plane clothes.

## @examples

**Worked (the exam table):** $x = \{1, 2, 1\}$ (starting at $n{=}0$), $h = \{1, 1, 1\}$. Products grid and anti-diagonals: $y = \{1, 3, 4, 3, 1\}$ — length $3 + 3 - 1 = 5$ ✓, sum $= (\sum x)(\sum h) = 4\cdot3 = 12$ ✓ (the sum-check audits the table). This layout, with both checks shown, is the full-marks presentation.

**Worked (moving average smooths a noisy step):** noisy $u[n]$ through $h = \{\tfrac13,\tfrac13,\tfrac13\}$: output rises over 3 samples (edge blurred) with noise variance cut by 3 — the smoothing/sharpness trade in miniature, and the reason every sensor pipeline starts with an averager.

**Worked (echo cancellation flavor):** channel $h = \delta[n] + \tfrac12\delta[n-3]$; find $g$ with $h * g = \delta$. In z: $G = \frac{1}{1 + \tfrac12 z^{-3}}$ — an IIR canceller for an FIR echo. Inverting FIR generally needs IIR: a two-line insight interviewers love.

## @misconceptions
- wrong: "DT convolution needs the same regime analysis as CT."
  tempting: "CT convolution's case-work was the hard part; surely it transfers."
  correction: "Finite sequences ⇒ finite table; the anti-diagonal method replaces ALL regime reasoning. Save the case-work for infinite sequences (aⁿu[n] types), where partial sums of geometric series do the work."
- wrong: "Output length = max(N, M)."
  tempting: "The output should fit the longer input."
  correction: "N + M − 1: the tails overlap-and-extend. {1,2,1}∗{1,1,1} has FIVE samples. The −1: both first samples land on the same output index."
- wrong: "Stability of y[n] = a·y[n−1] + x[n] depends on the input."
  tempting: "Blow-ups appear when you feed it big inputs."
  correction: "h = aⁿu[n]: Σ|h| = 1/(1−|a|) — finite iff |a| < 1, independent of any input. System property, checked on h (or the pole), never on test signals."

## @exam

6–10 marks: (a) tabular convolution of two short sequences — show the grid, the length check, and the sum check (all three earn); (b) $h$ from a difference equation by cranking, then classify causality/stability via $\sum|h|$ or poles; (c) properties used to shortcut (echo shifts, cascades); (d) moving-average/first-difference behavior questions. Traps: length $N{+}M$ (off by one), start-index bookkeeping (starts add), stability claimed from a decaying-looking $h$ without the sum.

## @summary

- $y[n] = \sum_k x[k]h[n-k]$ — sliding dot-product; tabular method: product grid + anti-diagonal sums.
- Checks: length $N{+}M{-}1$; total $\sum y = \sum x \cdot \sum h$; starts add.
- Dictionary: causal ⇔ $h$ zero for $n<0$; **BIBO ⇔ $\sum|h| < \infty$** ⇔ poles in the unit disk (causal).
- $s[n] = $ running sum of $h$; $h = $ first difference of $s$. MA smooths (LP); first difference sharpens (HP).
- Difference equations ARE these systems: crank for $h$, poles for destiny.
