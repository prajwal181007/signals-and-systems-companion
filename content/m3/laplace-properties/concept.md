---
id: m3/laplace-properties
title: "Laplace properties: the rules that turn calculus into algebra"
short: LT properties
module: 3
tier: core
outcomes: [CO3]
prereqs: [m3/laplace-transform]
aliases: ["differentiation property", "s-shift", "time shift laplace", "convolution laplace", "laplace table"]
exam: { minor2: high, major: high, marks: "6–10", styles: [compute] }
crosslinks:
  - { target: m3/solving-odes, relation: "the differentiation rule sX − x(0⁻) is the entire ODE-solving method" }
  - { target: m3/ivt-fvt, relation: "two more properties — with a validity trap worth its own concept" }
---

## @intuition

One property pays for the whole Laplace enterprise: $\mathcal{L}\{x'\} = sX(s) - x(0^-)$. Differentiation — the operation that makes ODEs hard — becomes *multiplication by $s$*, and the initial condition walks in by itself, uninvited but exactly where you need it. Every circuit exam you will ever sit is an application of this one line. The rest of the property table is the supporting cast: shifts, scalings, s-shifts, convolution — each one a symmetry of $\int x e^{-st}dt$, each replacing an integral with an algebra step.

---
Two shifts, forever confused, worth separating on day one. **Time shift** (delay): $x(t-t_0)u(t-t_0) \leftrightarrow e^{-st_0}X(s)$ — a *transcendental factor*, the fingerprint of pure delay (it never changes the poles!). **s-shift** (damping): $e^{-at}x(t) \leftrightarrow X(s+a)$ — the whole pole-zero constellation *slides left by $a$*. Delay multiplies by an exponential; damping relocates the poles. Different physics, adjacent table rows.

---
And convolution ⇔ multiplication survives the trip from Fourier: $x*h \leftrightarrow XH$, ROCs intersecting. This is why "transfer function" will be a *product* story: cascade = multiply. With the derivative rule injecting ICs and convolution handling zero-state response, the full input/output/initial-condition problem becomes rational-function arithmetic — which the partial-fractions primer already taught you to invert.

## @definition

Unilateral (exam) forms; $x \leftrightarrow X$:

| Time | s-domain |
|---|---|
| $ax + by$ | $aX + bY$ |
| $x'(t)$ | $sX(s) - x(0^-)$ |
| $x''(t)$ | $s^2X - s\,x(0^-) - x'(0^-)$ |
| $\int_{0^-}^t x\,d\tau$ | $X(s)/s$ |
| $x(t-t_0)u(t-t_0)$, $t_0>0$ | $e^{-st_0}X(s)$ |
| $e^{-at}x(t)$ | $X(s+a)$ |
| $x(at)$, $a>0$ | $\tfrac1a X(s/a)$ |
| $t\,x(t)$ | $-\dfrac{dX}{ds}$ |
| $x * h$ (causal) | $X(s)H(s)$ |

ROC bookkeeping: shifts preserve it; s-shift slides it by $-a$; scaling stretches it; products intersect.

## @derivation

### Step: The differentiation rule — six lines that run Module 3
?why: Integrate by parts once; the boundary term IS the initial condition.
$$\mathcal{L}\{x'\} = \int_{0^-}^\infty x'e^{-st}dt = \left[x e^{-st}\right]_{0^-}^{\infty} + s\int_{0^-}^{\infty} x e^{-st}dt = -x(0^-) + sX(s)$$
(the upper boundary dies inside the ROC). The IC was not added by convention — integration by parts *manufactures* it. Apply twice for $x''$: each derivative peels one $s$ and one initial value, in strict order: $s^2X - sx(0^-) - x'(0^-)$.

### Step: Time shift vs s-shift, from the definition
?why: One substitution each; watch where the exponential lands.
Delay: $\int x(t-t_0)e^{-st}dt \xrightarrow{\tau = t-t_0} e^{-st_0}X(s)$ — the factor is OUTSIDE the algebra: poles untouched, pure phase-like delay fingerprint. Damping: $\int e^{-at}x\,e^{-st}dt = X(s+a)$ — the exponent merged INTO $s$: every pole/zero shifts left by $a$. Memorize by consequence: delay ⇒ $e^{-st_0}$ factor; damping ⇒ pole slide.

### Step: t-multiplication as s-differentiation
?why: Differentiate the definition under the integral with respect to s.
$\frac{dX}{ds} = \int (-t)x e^{-st}dt \Rightarrow t\,x(t) \leftrightarrow -X'(s)$. Instant re-derivation of $t e^{-at}u \leftrightarrow \frac{1}{(s+a)^2}$ from the basic pair — and of the whole $t^n$ family by repetition. The table compresses to seeds + this rule.

## @examples

**Worked (assembling a transform, exam pattern):** $\mathcal{L}\{e^{-3t}\cos(2t)u(t)\}$: start from $\cos 2t\,u \leftrightarrow \frac{s}{s^2+4}$, apply s-shift $s \to s+3$: $\frac{s+3}{(s+3)^2+4}$. Name the property, substitute, done — no integral.

**Worked (delayed pulse):** $x = u(t-2) - u(t-5)$: $X = \frac{e^{-2s} - e^{-5s}}{s}$. The $e^{-st_0}$ factors are the delays; the $\frac1s$ is the step. Any piecewise-constant signal transforms by inspection this way.

**Worked (derivative rule as a checksum):** $x = e^{-at}u(t)$: $x' = -a e^{-at}u(t) + \delta(t)$ (the jump at 0 contributes the impulse!). LHS transform: $\frac{-a}{s+a} + 1 = \frac{s}{s+a}$. RHS via the rule: $sX - x(0^-) = \frac{s}{s+a} - 0$ ✓ — note $x(0^-) = 0$, not 1: the $0^-$ convention just earned its keep.

## @misconceptions
- wrong: "x(0⁻) and x(0⁺) are interchangeable in the derivative rule."
  tempting: "They differ only 'at an instant'."
  correction: "For signals that JUMP at t = 0 (i.e., every switched circuit), they differ by the whole jump. The rule uses 0⁻ — the pre-switch stored value — and the 0⁻ convention is exactly what makes δ-at-origin bookkeeping consistent."
- wrong: "Delay shifts the poles."
  tempting: "'Shift' sounds like it moves things in the s-plane."
  correction: "TIME shift multiplies by e^{−st₀} — poles frozen (delay changes when, not what). It's the S-shift (damping e^{−at}) that slides poles. The two rows are the most-swapped pair in the table."
- wrong: "L{x'} = sX. Full stop."
  tempting: "The clean version is easier to remember."
  correction: "Minus x(0⁻)! Dropping the IC term gives the zero-state answer only — and circuits exams exist to test nonzero ICs. The boundary term is the whole point of the unilateral transform."

## @exam

6–10 marks, always: (a) build transforms via named properties from table seeds (s-shift and t-multiplication dominate); (b) transform pulse/staircase signals with delay factors; (c) verify/derive one property from the definition (differentiation and time-shift are the perennials — both ≤ 6 lines). The derivative rule with ICs is *implicitly* tested in every ODE question. Traps: swapped shift rows; dropped $-x(0^-)$; the order of IC terms in $s^2X - sx(0^-) - x'(0^-)$; forgetting $u(t-t_0)$ must accompany a delayed signal in the unilateral world.

## @summary

- **$\mathcal{L}\{x'\} = sX - x(0^-)$**; $x'' \to s^2X - sx(0^-) - x'(0^-)$; $\int_0^t \to X/s$. The ODE engine.
- Delay: $\times e^{-st_0}$ (poles frozen). Damping $e^{-at}$: $X(s+a)$ (poles slide left by a). Never swap.
- $t\,x \leftrightarrow -X'(s)$ — regenerates the $t^n$ family. $x*h \leftrightarrow XH$ (cascade = multiply).
- Scaling: $\frac1a X(s/a)$. ROCs: shift-invariant, s-shifted by −a, intersected under sums/products.
- $0^-$ convention: pre-jump values; the δ-at-origin bookkeeping depends on it.
