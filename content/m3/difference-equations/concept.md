---
id: m3/difference-equations
title: "Difference equations: programs that the z-transform turns into algebra"
short: Difference equations
module: 3
tier: core
outcomes: [CO3]
prereqs: [m3/z-transform, m3/inverse-z]
aliases: ["recursion", "IIR", "FIR", "unilateral z transform", "initial conditions z"]
exam: { minor2: high, major: high, marks: "8–12", styles: [compute, derive] }
crosslinks:
  - { target: m3/solving-odes, relation: "the DT mirror of the Laplace ODE ritual — same shape, delays instead of derivatives" }
  - { target: m4/dt-systems, relation: "every DT filter you'll meet is one of these recursions running in real time" }
---

## @intuition

A difference equation is not "discrete calculus" — it is a **program**: `y[n] = a₁·y[n−1] + a₂·y[n−2] + b₀·x[n]`. Three multiplies, two adds, per tick. Your phone's audio path executes millions of these per second. You can always run the program by hand (and should, for the first few samples — it grounds everything), but hand-cranking can't answer "what happens at n = 10⁶?" or "is this stable?" For that, the z-transform turns the program into algebra.

---
@viz machine {"a1":1.0,"a2":-0.5,"b0":1}
Crank the tape one tick at a time and watch the recursion compute. Then look right: the poles — roots of the characteristic polynomial — *predict everything the crank will ever produce*. Poles inside the unit circle: the response dies. Push $a_2$ until a pole crosses the circle and crank again: the tape blows up in slow motion, exactly as promised. Try the Fibonacci preset: $y[n] = y[n-1] + y[n-2]$ has a pole at the **golden ratio** $\varphi \approx 1.618$ — the growth rate of the rabbits is a pole location.

---
The transform ritual mirrors Laplace's exactly, with delays in place of derivatives: $z^{-1}$ *is* "delay by one". Transform each term ($y[n-1] \to z^{-1}Y$ plus IC baggage), collect $Y(z)$, invert. And the initial conditions enter through the **unilateral shift property**: $\mathcal{Z}\{y[n-1]\} = z^{-1}Y(z) + y[-1]$ — the pre-start sample walks in by itself, exactly as $x(0^-)$ did in the s-domain. The exam form of this topic is precisely "solve $y[n] - 0.5y[n-1] = u[n]$ with $y[-1] = 2$" — and the $y[-1]$ term is where the marks (and the errors) live.

## @definition

**General LTI difference equation:** $\sum_{k=0}^{N} a_k\,y[n-k] = \sum_{k=0}^{M} b_k\,x[n-k]$ ($a_0 = 1$ normalized).

- **Transfer function** (zero ICs): $H(z) = \frac{Y}{X} = \frac{\sum b_k z^{-k}}{\sum a_k z^{-k}}$ — read the coefficients straight off the equation.
- **FIR** (no feedback, all $a_{k\ge1} = 0$): $h[n]$ = the $b_k$ list, finite. **IIR** (feedback): finite coefficients, infinite $h$ — the recursion echoes forever.
- **Unilateral shift properties (the IC carriers):**
$$\mathcal{Z}\{y[n-1]\} = z^{-1}Y(z) + y[-1] \qquad \mathcal{Z}\{y[n-2]\} = z^{-2}Y(z) + z^{-1}y[-1] + y[-2]$$
- Stability (causal): all roots of the characteristic polynomial $\sum a_k z^{N-k}$ strictly inside the unit circle.
- Solution structure: $y = y_{zi} + y_{zs}$ (zero-input: ICs with $x = 0$; zero-state: input with zero ICs).

## @derivation

### Step: From recursion to H(z) in two lines
?why: Transform termwise with zero ICs; every delay is a z^{-1} factor.
$y[n] - \tfrac12 y[n-1] = x[n] \Rightarrow Y - \tfrac12 z^{-1}Y = X \Rightarrow H = \frac{1}{1 - \tfrac12 z^{-1}} = \frac{z}{z - \tfrac12}$. Pole at $\tfrac12$; $h[n] = (\tfrac12)^n u[n]$. The program's echo IS the pole's mode.

### Step: The IC-carrying solve, worked in full (the exam pattern)
?why: The unilateral shift property injects y[−1] exactly where integration by parts injected x(0⁻).
Solve $y[n] - \tfrac12 y[n-1] = u[n]$, $y[-1] = 2$:
$$Y - \tfrac12\left(z^{-1}Y + y[-1]\right) = \frac{z}{z-1} \;\Rightarrow\; Y\,\frac{z-\tfrac12}{z} = \frac{z}{z-1} + 1 = \frac{2z-1}{z-1} \;\Rightarrow\; Y = \frac{z(2z-1)}{(z-\tfrac12)(z-1)}$$
Partial fractions via $\frac{Y}{z} = \frac{2z-1}{(z-\tfrac12)(z-1)}$, cover-up: at $z{=}1$: $\frac{1}{1/2} = 2$; at $z{=}\tfrac12$: $\frac{0}{-1/2} = 0$. So $Y = \frac{2z}{z-1}$ and $y[n] = 2u[n]$ exactly — the transient coefficient vanished because $y[-1] = 2$ started the system already at its steady state (a deliberately clean example; most ICs leave a $(\tfrac12)^n$ transient). Crank the recursion two ticks to confirm: $y[0] = \tfrac12(2)+1 = 2$ ✓, $y[1] = \tfrac12(2)+1 = 2$ ✓. **The audit crank is part of the ritual** — two ticks catch nearly every algebra slip.

### Step: Why finite coefficients can make infinite responses
?why: Feedback re-feeds the output; one impulse echoes round the loop forever.
FIR: $h$ = the coefficient list, length $M{+}1$, always stable. IIR: the loop $y[n] = a\,y[n-1] + x[n]$ turns one impulse into the endless geometric echo $a^n$. Infinite memory from three multiplies — the engineering bargain that makes IIR filters cheap, and their stability a real question.

## @examples

**Worked (zero-state vs zero-input):** $y[n] - 0.9y[n-1] = x[n]$, $x = \delta[n]$, $y[-1] = 5$. Zero-input: $y_{zi} = 5(0.9)^{n+1}u[n]$-flavored decay of the stored value; zero-state: $h[n] = (0.9)^n u[n]$. Total = sum. The decomposition mirrors the s-domain exactly and is asked in the same breath.

**Worked (stability by poles):** $y[n] = 1.9y[n-1] - 0.9y[n-2] + x[n]$: characteristic $z^2 - 1.9z + 0.9 = 0$ ⇒ roots $1, 0.9$. A pole ON the circle: marginal — step input makes it ramp. The crank shows it; the poles predicted it.

**Worked (from H back to the program):** given $H(z) = \frac{1 + z^{-1}}{1 - 0.5z^{-1}}$, write the recursion: $y[n] = 0.5y[n-1] + x[n] + x[n-1]$. Transfer function ↔ program is a two-way street crossed by inspection.

## @misconceptions
- wrong: "The unilateral shift is just z⁻¹Y — ICs come later somehow."
  tempting: "The bilateral rule really is a bare z⁻¹."
  correction: "Unilateral: Z{y[n−1]} = z⁻¹Y + y[−1]. The pre-start sample rides in WITH the shift — drop it and every IC problem collapses to the zero-state answer. This is THE mark-bearing line of the topic."
- wrong: "Finite equation ⇒ finite impulse response."
  tempting: "Three coefficients, surely three samples of h."
  correction: "Only without feedback (FIR). One feedback tap makes h infinite (IIR): aⁿ echoes forever. Feedback is memory."
- wrong: "Stability requires the input to be bounded."
  tempting: "Blow-ups in the tape look input-driven."
  correction: "Stability is a property of the SYSTEM's poles (inside the unit circle), independent of any particular input. A stable recursion tames every bounded input; an unstable one is doomed by its own echo."

## @exam

The big Minor II / Major computation (8–12 marks): solve a first- or second-order difference equation with given ICs and a step/impulse/geometric input, via the unilateral z-transform. Full ritual: (1) transform each term WITH IC baggage; (2) collect $Y(z)$; (3) $Y/z$ partial fractions; (4) invert with the causal branch; (5) **audit: crank the recursion two ticks and compare**. Also: recursion ↔ H(z) conversions by inspection; FIR/IIR classification; stability by characteristic roots. Traps: dropped $y[-1]$ terms, the $z^{-1}y[-1]$ vs $y[-2]$ ordering in second-order shifts, forgetting the audit that would have caught both.

## @summary

- Difference equation = program; $z^{-1}$ = delay. $H(z) = \frac{\sum b_k z^{-k}}{\sum a_k z^{-k}}$ by inspection, both directions.
- **Unilateral shifts carry ICs:** $y[n-1] \to z^{-1}Y + y[-1]$; $y[n-2] \to z^{-2}Y + z^{-1}y[-1] + y[-2]$.
- FIR: no feedback, $h$ = coefficients, always stable. IIR: feedback ⇒ infinite $h$; stability ⇔ characteristic roots inside the unit circle.
- $y = y_{zi} + y_{zs}$; solve ritual ends with a two-tick hand-crank audit.
- Fibonacci's pole is the golden ratio — growth rates are pole locations.
