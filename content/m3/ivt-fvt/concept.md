---
id: m3/ivt-fvt
title: "Initial and final value theorems: limits without inverting"
short: IVT & FVT
module: 3
tier: core
outcomes: [CO3]
prereqs: [m3/laplace-properties]
aliases: ["initial value theorem", "final value theorem", "steady state value", "sF(s)"]
exam: { minor2: high, major: medium, marks: "3–6", styles: [compute, conceptual] }
crosslinks:
  - { target: m3/solving-odes, relation: "sanity-check any solved response's endpoints in two lines" }
  - { target: m4/feedback, relation: "steady-state error calculations in control are FVT applications" }
---

## @intuition

You've computed some $X(s)$ and you want just two numbers: where does $x(t)$ *start*, and where does it *settle*? Inverting the whole transform for two numbers is wasteful. The value theorems read both endpoints straight off the algebra: **IVT** looks at $sX(s)$ as $s \to \infty$ (large $s$ probes small $t$), **FVT** as $s \to 0$ (small $s$ probes the long run). Two limits, no partial fractions.

---
But the FVT ships with a loaded trap, and papers fire it every year. The theorem asks $sX(s)$ where the answer *should* be — at the settled value. If the signal **never settles** — an oscillator, anything growing — the limit of $sX(s)$ still *computes a number*, cheerfully, and that number is garbage. **Validity condition: all poles of $sX(s)$ must lie strictly in the left half-plane.** Check the poles first, always; the theorem answers only when the signal actually has a final value.

---
The mental model: $s \to \infty$ compresses the transform's view onto the first instants (fast phenomena live at large $s$); $s \to 0$ is the DC end (slow/settled phenomena). The theorems are the two ends of the s-plane atlas being read as limits.

## @definition

For causal $x$ with rational $X(s)$:

**IVT:** $x(0^+) = \lim_{s\to\infty} s\,X(s)$ — valid when $X$ is strictly proper (deg num < deg den). If $X$ is not strictly proper, $x$ contains impulses at the origin and the limit diverges/misleads.

**FVT:** $\lim_{t\to\infty} x(t) = \lim_{s\to 0} s\,X(s)$ — **valid only when all poles of $sX(s)$ are in the open left half-plane** (i.e., $X$ has no RHP poles and no jω-axis poles except possibly a single one at $s=0$). Otherwise $x(t)$ has no limit and the formula's number is meaningless.

Note IVT gives $x(0^+)$ — after any jump — complementing the $x(0^-)$ that ICs use.

## @derivation

### Step: IVT from the derivative rule
?why: Transform x' and push s → ∞; the integral term dies, the boundary terms remain.
$sX(s) - x(0^-) = \int_{0^-}^\infty x'e^{-st}dt$. As $s\to\infty$ the integrand is killed everywhere except the origin, where any jump contributes $x(0^+) - x(0^-)$. So $\lim sX = x(0^+)$. Large $s$ = a microscope on $t = 0^+$.

### Step: FVT and where the condition comes from
?why: Push s → 0 in the same identity; the integral converges to the total change ONLY if x settles.
$\lim_{s\to0}[sX - x(0^-)] = \int_{0^-}^\infty x'\,dt = \lim_{t\to\infty}x(t) - x(0^-)$ — *if* that improper integral converges, i.e., if $x$ actually approaches a limit. Poles of $sX$ in the RHP or on the axis (oscillation) make $x$ wander forever; the integral diverges; the interchange is illegal. The condition is not fine print — it is the theorem's load-bearing wall.

### Step: The illegal application, executed in public
?why: Seeing the failure once inoculates better than any warning.
$X(s) = \frac{\omega_0}{s^2+\omega_0^2}$ ($x = \sin\omega_0 t$ — never settles). FVT formula: $\lim_{s\to0} \frac{s\,\omega_0}{s^2+\omega_0^2} = 0$. A clean, confident **0** — and wrong: $\sin\omega_0 t$ has no final value at all. The poles of $sX$ sit ON the axis at $\pm j\omega_0$: condition violated, answer void. The formula never warns you; the pole check is the warning.

## @examples

**Worked (both theorems, legal):** $X(s) = \frac{10(s+2)}{s(s+5)}$. Poles of $sX = \frac{10(s+2)}{s+5}$: at $-5$ only — LHP ✓. FVT: $\lim_{s\to0} \frac{10(s+2)}{s+5} = \frac{20}{5} = 4$ — the settled value. IVT: $\lim_{s\to\infty} \frac{10(s+2)}{s+5} = 10$ — the starting value. Interpretation: a response starting at 10, settling to 4 — endpoints known without a single partial fraction.

**Worked (steady-state error preview):** unity-feedback loop, error transform $E(s) = \frac{1}{1+G(s)}\cdot\frac{1}{s}$ for a step input. FVT (after the pole check) gives $e_{ss} = \lim_{s\to0}\frac{1}{1+G(s)}$ — Module 4/5's steady-state error formulas are this theorem, industrialized.

**Legality drill:** $X = \frac{1}{s-1}$: $sX$ has a pole at $+1$ (RHP) — FVT illegal; the signal $e^{t}$ runs away. $X = \frac{1}{s(s+1)}$: $sX = \frac{1}{s+1}$ — legal, FVT $= 1$. The check takes five seconds; skipping it costs the whole mark.

## @misconceptions
- wrong: "If the FVT limit computes cleanly, the answer is valid."
  tempting: "The formula produced a definite number."
  correction: "The formula ALWAYS produces a number — even for oscillators (sin ω₀t → '0') and unstable signals. Validity is decided by the poles of sX(s) (all strictly LHP), never by the computation's smoothness. Check first, compute second."
- wrong: "IVT gives x(0⁻)."
  tempting: "The derivative rule uses 0⁻, so the theorem should too."
  correction: "IVT gives x(0⁺) — the value just AFTER any jump. The pair (0⁻ from ICs, 0⁺ from IVT) brackets the discontinuity; confusing them shifts every switched-circuit answer."
- wrong: "A pole at s = 0 in X(s) breaks the FVT."
  tempting: "Axis poles are forbidden, and s = 0 is on the axis."
  correction: "The condition applies to sX(s): the s multiplication CANCELS a single pole at the origin (that pole is just the settled DC). u(t) ↔ 1/s: sX = 1, FVT = 1 ✓. Double pole at 0 (a ramp) does break it."

## @exam

Short and lucrative (3–6 marks): compute initial/final values of a given $X(s)$ — with the mark scheme explicitly rewarding the **stated pole check** for FVT; and at least one paper per year plants an oscillator or RHP pole to catch the unchecked. Ritual: (1) form $sX$; (2) list its poles and declare LHP-ness; (3) take the limit; (4) for IVT confirm strict properness. Write the check even when legal — it is the mark.

## @summary

- **IVT:** $x(0^+) = \lim_{s\to\infty} sX(s)$ (X strictly proper). **FVT:** $x(\infty) = \lim_{s\to0} sX(s)$ — *only if all poles of $sX$ are strictly LHP*.
- The FVT computes a number even when invalid (sin → "0") — the pole check is the theorem.
- Single pole at $s=0$ is fine (cancelled by the $s$); axis/RHP poles of $sX$ void it.
- Large $s$ ↔ small $t$; small $s$ ↔ long run. Steady-state error formulas = FVT.
- Two limits replace a full inversion when only endpoints are asked.
