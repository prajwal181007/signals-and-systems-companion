---
id: m5/ss-tf
title: "State-space ⇄ transfer function: two descriptions, one system"
short: SS ⇄ TF
module: 5
tier: core
outcomes: [CO5]
prereqs: [m5/controllability]
aliases: ["C(sI-A)^-1 B", "realization", "canonical form", "controllable canonical"]
exam: { major: high, marks: "6–10", styles: [compute, derive] }
crosslinks:
  - { target: m3/transfer-function, relation: "the same H(s), now derived from matrices" }
  - { target: m5/controllability, relation: "when the conversion loses modes — and why" }
---

## @intuition

You now own two languages for the same LTI system: the transfer function $H(s)$ (input–output, Module 3) and the state matrices $(A, B, C, D)$ (internal, Module 5). Exams — and practice — constantly demand fluent translation both ways. One direction is a formula you evaluate; the other is a *construction* with real freedom in it (many state descriptions share one $H$ — "realizations" — and one particular choice is so convenient it earns the name **canonical**).

---
**State → transfer:** transform $\dot{\mathbf{x}} = A\mathbf{x} + Bu$ with zero ICs: $sX = AX + BU \Rightarrow X = (sI - A)^{-1}BU$, so
$$H(s) = C(sI - A)^{-1}B + D$$
For $2\times2$: invert by adjugate-over-determinant — the determinant $\det(sI - A)$ lands in the denominator, which is *why poles = eigenvalues*. The whole computation is one matrix inversion plus a row-times-column sandwich.

---
**Transfer → state:** read the ODE off $H$ and use phase variables — the **controllable canonical form**: for $H = \frac{b_1 s + b_0}{s^2 + a_1 s + a_0}$,
$$A = \begin{bmatrix}0 & 1\\ -a_0 & -a_1\end{bmatrix},\quad B = \begin{bmatrix}0\\1\end{bmatrix},\quad C = [\,b_0 \;\; b_1\,],\quad D = 0$$
— denominator coefficients negated along the bottom row, numerator coefficients laid into $C$. It is an *integrator chain*: each state is the integral of the next, the feedback taps set the poles, the output taps pick off the zeros. Buildable by inspection, always controllable by construction (hence the name).

---
The freedom and the fine print: any invertible change of coordinates $\mathbf{z} = T\mathbf{x}$ gives another realization of the *same* $H$ — realizations are a family, not a fact. And the conversion loses information exactly when Module 5 said it would: if a pole cancels a zero, $H$ comes out *lower order* than $A$ — the hidden (uncontrollable/unobservable) mode drops out of the input–output story while still living in the state. Same-order round trip ⇔ the realization is **minimal** ⇔ controllable *and* observable.

## @definition

- **SS → TF:** $H(s) = C(sI - A)^{-1}B + D$; for $n{=}2$, $(sI-A)^{-1} = \frac{\mathrm{adj}(sI-A)}{\det(sI-A)}$. Poles ⊆ eigenvalues of $A$ (equality iff minimal).
- **TF → SS (controllable canonical), order n:** for $H = \frac{b_{n-1}s^{n-1} + \cdots + b_0}{s^n + a_{n-1}s^{n-1} + \cdots + a_0}$: $A$ = companion matrix (superdiagonal 1's, last row $-a_0 \cdots -a_{n-1}$), $B = [0 \cdots 0\; 1]^T$, $C = [b_0 \cdots b_{n-1}]$, $D = 0$. (Improper $H$: long-divide first; the quotient becomes $D$.)
- **Realization:** any $(A,B,C,D)$ with that $H$; related by similarity $A' = TAT^{-1}, B' = TB, C' = CT^{-1}$. **Minimal** ⇔ controllable + observable ⇔ order of $H$ = size of $A$.

## @derivation

### Step: SS → TF, executed on the standard example
?why: The adjugate inversion is the whole computation; watch the determinant become the denominator.
$A = \begin{bmatrix}0&1\\-2&-3\end{bmatrix}, B = \begin{bmatrix}0\\1\end{bmatrix}, C = [1\;\,0]$:
$$(sI-A)^{-1} = \frac{1}{s^2+3s+2}\begin{bmatrix}s+3 & 1\\ -2 & s\end{bmatrix} \Rightarrow H = \frac{[1\;\,0]\begin{bmatrix}s+3&1\\-2&s\end{bmatrix}\begin{bmatrix}0\\1\end{bmatrix}}{s^2+3s+2} = \frac{1}{s^2+3s+2}$$
Sandwich order matters: row $C$, then the adjugate, then column $B$ — top-right entry survives here. The exam's most common slip is multiplying in the wrong order.

### Step: Why the canonical form works
?why: Phase variables turn H's ODE into the chain ẋᵢ = xᵢ₊₁ with feedback taps.
$H$'s ODE: $y^{(n)} + a_{n-1}y^{(n-1)} + \cdots = $ (numerator acting on $u$). With an auxiliary variable and states = its derivatives, the last row of $A$ implements the feedback $-a_i$, and $C$'s taps $b_i$ assemble the numerator. Poles = feedback taps, zeros = output taps — the block diagram *is* the algebra, and it wires itself by inspection.

### Step: When the round trip shrinks
?why: A shared factor in C·adj(sI−A)·B and det(sI−A) cancels — the hidden mode.
If $B$ (or $C$) is blind to a mode, that mode's factor divides the numerator sandwich too, and $H$ drops order. Try $C = [2\;\,1]$ on the diagonal $A = \mathrm{diag}(-1,-2)$, $B = [1\;\,0]^T$: the $(s{+}2)$ never appears — uncontrollable, cancelled, hidden. Minimality is not pedantry; it is the difference between "the model" and "what the terminals can see."

## @examples

**Worked (TF → SS by inspection, exam gift):** $H = \frac{3s + 5}{s^2 + 4s + 6}$: $A = \begin{bmatrix}0&1\\-6&-4\end{bmatrix}$, $B = \begin{bmatrix}0\\1\end{bmatrix}$, $C = [5\;\;3]$, $D = 0$. Verify one thing: $\det(sI-A) = s^2+4s+6$ ✓. Thirty seconds, full marks — IF the negation and the coefficient order ($b_0$ first in $C$) are right.

**Worked (with feedthrough):** $H = \frac{s^2 + 3s + 4}{s^2 + 3s + 2}$ is not strictly proper: divide → $1 + \frac{2}{s^2+3s+2}$: $D = 1$, and the canonical machinery applies to the remainder. Improper-without-division is the same trap as in partial fractions.

**Worked (round-trip audit):** convert the canonical form above back via $C(sI-A)^{-1}B$: the numerator sandwich reproduces $3s+5$. The two-way audit (denominator = $\det$, numerator = sandwich) certifies both conversions at once — always run it.

## @misconceptions
- wrong: "Each H(s) has THE state-space representation."
  tempting: "One system, one description."
  correction: "Infinitely many realizations (any similarity transform T). Canonical forms are CONVENTIONS chosen for buildability — controllable canonical wires by inspection. 'The' realization is meaningless; 'a minimal realization' is the meaningful phrase."
- wrong: "The bottom row of the companion A is the coefficients as-is."
  tempting: "Copying is easier than negating."
  correction: "NEGATED: −a₀, −a₁, … (they implement feedback). Un-negated coefficients flip every pole into the RHP — the single most common canonical-form error, and it announces itself if you audit det(sI−A)."
- wrong: "Order of H always equals the size of A."
  tempting: "They describe the same system."
  correction: "Only for MINIMAL realizations. Cancellations (uncontrollable/unobservable modes) shrink H below the state dimension — and the missing dynamics still run internally. The order gap IS the hidden-mode alarm."

## @exam

6–10 marks, both directions, on the Major: (a) compute $H = C(sI-A)^{-1}B + D$ for a given 2×2 (adjugate, determinant, sandwich — show the order); (b) write the controllable canonical form for a given $H$ by inspection (negated bottom row, $b$'s into $C$, divide first if improper); (c) audit both by $\det(sI-A)$ = denominator; (d) conceptual: why realizations are non-unique; what an order drop reveals. Traps: sandwich order, missing negation, improper $H$ without division, claiming uniqueness.

## @summary

- **SS → TF:** $H = C(sI-A)^{-1}B + D$; 2×2 by adjugate/det — determinant becomes the denominator (poles = eigenvalues, iff minimal).
- **TF → SS:** controllable canonical by inspection — companion $A$ (NEGATED coefficients, bottom row), $B = e_n$, $C = [b_0 \cdots b_{n-1}]$; improper ⇒ divide, quotient = $D$.
- Realizations: a similarity-transform family, never unique; minimal ⇔ controllable + observable ⇔ no order drop.
- Audits: $\det(sI-A) \overset{!}{=}$ denominator; sandwich $\overset{!}{=}$ numerator; order gap ⇒ hidden mode.
- The canonical form is an integrator chain: feedback taps = poles, output taps = zeros.
