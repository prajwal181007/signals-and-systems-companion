---
id: m3/solving-odes
title: "Solving ODEs with Laplace: initial conditions walk in the front door"
short: Solving ODEs
module: 3
tier: core
hero: false
outcomes: [CO3]
prereqs: [m3/laplace-properties, m3/inverse-laplace]
aliases: ["initial conditions", "zero-input response", "zero-state response", "complete response", "natural response", "forced response", "unilateral Laplace", "0 minus", "transient analysis", "RLC transient", "mass spring damper", "ODE by Laplace", "circuit switching"]
exam: { minor2: high, major: high, marks: "8–12", styles: [compute, derive] }
crosslinks:
  - { target: m3/transfer-function, relation: "the zero-state piece is always H(s)X(s); initial conditions add the zero-input piece" }
  - { target: m3/inverse-laplace, relation: "the inversion ritual is the closing act of every solution here" }
  - { target: m3/ivt-fvt, relation: "two-line endpoint checks that catch algebra slips before and after inverting" }
  - { target: m3/difference-equations, relation: "the same play in discrete time — the unilateral z-transform carries y[−1], y[−2]" }
---

## @intuition

A capacitor sits charged to five volts. At $t=0$ a switch connects it to a source through a coil, and you must predict the voltage the oscilloscope will draw. The classical recipe is a three-act play: guess the homogeneous solution's form, hunt for a particular solution, and only at the end solve simultaneous equations for the unknown constants — after first converting the pre-switch state into "just-after" values by physical argument. Every act has its own sign traps. The Laplace route replaces the whole play with one pass of algebra, in which the stored energy enters on line one.

---

The trick is built into the transform itself. Passing a derivative into the $s$-domain works like a turnstile that charges a toll: each crossing deposits the signal's starting value into the equation. Transform the entire ODE and something remarkable happens — the differential equation becomes an ordinary algebraic equation in which the initial conditions already sit as known numbers on the right-hand side. Nothing to append later, nothing to forget.

---

Solve that algebra for the output transform and the answer arrives pre-sorted into two fractions over the same denominator. One carries the input's transform — the response of a system starting from rest: the **zero-state response**. The other is built purely from the initial conditions — what the stored energy does with the input switched off: the **zero-input response**. Superposition is not a theorem you invoke at the end; it is visible in the algebra from the second line.

---

One convention carries the whole method: initial conditions are taken at $0^-$ — the instant *before* the switch closes — because that is the state a problem actually gives you. If the input kicks the system with an impulse at $t=0$, values jump between $0^-$ and $0^+$; the transform computes that jump for you. You never need to reason about "what happens just after" — that reasoning is exactly what the machinery automates.

## @definition

**The tool** is the unilateral Laplace transform, $Y(s) = \int_{0^-}^{\infty} y(t)e^{-st}dt$, and its derivative rules — the toll-gate equations:

$$\mathcal{L}\{y'(t)\} = sY(s) - y(0^-) \qquad \mathcal{L}\{y''(t)\} = s^2Y(s) - s\,y(0^-) - y'(0^-)$$

**The master template.** For $a_2 y'' + a_1 y' + a_0 y = b_1 x' + b_0 x$ with a causal input (so $x(0^-)=0$ and input derivatives deposit nothing):

$$\left(a_2 s^2 + a_1 s + a_0\right) Y(s) = (b_1 s + b_0)\,X(s) + \underbrace{a_2\!\left[s\,y(0^-) + y'(0^-)\right] + a_1\,y(0^-)}_{P_{\mathrm{IC}}(s)\ \text{— where the ICs live}}$$

$$Y(s) = \underbrace{H(s)\,X(s)}_{\text{zero-state}} \;+\; \underbrace{\frac{P_{\mathrm{IC}}(s)}{a_2 s^2 + a_1 s + a_0}}_{\text{zero-input}}$$

**Zero-input response:** output with the input off ($x=0$), driven only by stored energy. **Zero-state response:** output with the system initially at rest (all ICs zero), driven only by the input. The complete response is their sum — exactly.

**A different, older cut:** the **natural response** collects every characteristic-mode term ($e^{p_i t}$ shapes) in the final answer; the **forced response** is the input-shaped remainder. This is a split by *shape*; zero-input/zero-state is a split by *cause*. They are not the same decomposition (the derivation shows why).

**Reading the symbols:** the polynomial multiplying $Y$ is the ODE's characteristic polynomial $A(s)$ — untouched by ICs or input. $P_{\mathrm{IC}}(s)$ is a polynomial of degree $n-1$ built from the IC deposits: it can shift and reweight modes but never create new poles. **Exam conventions:** ICs at $0^-$ always; every inverted term wears $u(t)$; if the right side contains $x'$, say "input causal $\Rightarrow x(0^-)=0$" and move on.

## @derivation

### Step: One integration by parts builds the toll gate
?why: Integration by parts on the defining integral — pure calculus, no new axioms.
$$\int_{0^-}^{\infty} y'(t)\,e^{-st}\,dt = \Big[y(t)\,e^{-st}\Big]_{0^-}^{\infty} + s\int_{0^-}^{\infty} y(t)\,e^{-st}\,dt = sY(s) - y(0^-)$$
(the boundary term at $\infty$ dies for $s$ inside the ROC). Differentiation in time = multiplication by $s$ *plus a deposit of the starting value*.

### Step: Stack the rule for higher derivatives
?why: y'' is the first derivative of y' — apply the same rule twice.
$$\mathcal{L}\{y''\} = s\,\mathcal{L}\{y'\} - y'(0^-) = s^2 Y(s) - s\,y(0^-) - y'(0^-)$$
Pattern: the highest power of $s$ multiplies the *value*, the bare deposit is the *slope*. Getting these two swapped is the module's most common two-mark loss.

### Step: Transform the whole ODE — calculus becomes algebra
?why: Linearity of the transform lets each term cross the turnstile separately.
$$a_2\left[s^2Y - s\,y(0^-) - y'(0^-)\right] + a_1\left[sY - y(0^-)\right] + a_0 Y = (b_1 s + b_0)X(s)$$
Collect $Y$ on the left, move the deposits right:
$$A(s)\,Y(s) = (b_1 s + b_0)\,X(s) + P_{\mathrm{IC}}(s), \qquad A(s) = a_2s^2 + a_1s + a_0$$
The input side deposits nothing because a causal input has $x(0^-) = 0$.

### Step: Divide — and the answer arrives pre-split
?why: One division by A(s); each numerator term keeps its own identity.
$$Y(s) = H(s)X(s) + \frac{P_{\mathrm{IC}}(s)}{A(s)}$$
Set the ICs to zero: only $H(s)X(s)$ survives — the transfer-function story. Set $X = 0$: only the IC term survives. The two responses never mix in the algebra, which is what makes the decomposition exact rather than approximate.

### Step: Zero-input + zero-state is NOT natural + forced
?why: Partial fractions of H(s)X(s) exposes poles of BOTH H and X.
Expanding the zero-state piece $H(s)X(s)$ produces terms at the *system's* poles as well as at the *input's* poles. So the zero-state response contains characteristic modes — even with every IC equal to zero. "Natural" (all $e^{p_i t}$ terms, from both pieces) and "forced" (the input-shaped rest) cut the same total differently. Exams ask for both cuts; keep the vocabulary straight.

### Step: Notice what was NOT assumed
?why: The method never guessed a solution form — the algebra manufactures the modes.
Nowhere did we posit $y = Ae^{\lambda t}$ and hope. The characteristic polynomial appeared by itself, its roots become the poles, and partial fractions delivers every constant without simultaneous equations. And nowhere did we convert $0^-$ data to $0^+$ data — the method is impulse-proof by construction, which the classical route is not.

## @examples

**Worked (exam standard, the full ritual):** solve $y'' + 3y' + 2y = 4u(t)$, $\;y(0^-) = 1$, $\;y'(0^-) = 0$.

1. *Transform, depositing ICs:* $\left[s^2Y - s(1) - 0\right] + 3\left[sY - 1\right] + 2Y = \dfrac{4}{s}$.
2. *Collect:* $(s^2+3s+2)\,Y = \dfrac{4}{s} + s + 3$.
3. *Split before expanding* (the exam asks for this by name):
$$Y(s) = \underbrace{\frac{s+3}{(s+1)(s+2)}}_{\text{zero-input}} + \underbrace{\frac{4}{s(s+1)(s+2)}}_{\text{zero-state}}$$
4. *Invert each by cover-up.* Zero-input: residues $2$ at $-1$, $-1$ at $-2$ → $y_{zi} = \left(2e^{-t} - e^{-2t}\right)u(t)$. Zero-state: residues $2$ at $0$, $-4$ at $-1$, $2$ at $-2$ → $y_{zs} = \left(2 - 4e^{-t} + 2e^{-2t}\right)u(t)$.
5. *Total:* $y(t) = \left(2 - 2e^{-t} + e^{-2t}\right)u(t)$.
6. *Checks:* $y(0^+) = 2 - 2 + 1 = 1 = y(0^-)$ ✓ (no impulse in the input, so no jump); $y(\infty) = 2 = H(0)\cdot 4 = \tfrac12\cdot 4$ ✓.

Look at $y_{zs}$: the system was at rest, yet $e^{-t}$ and $e^{-2t}$ appear — the zero-state response carries characteristic modes. The natural part of the *total* answer is $-2e^{-t} + e^{-2t}$; the zero-input part is $+2e^{-t} - e^{-2t}$. Same modes, different numbers: proof the two decompositions are genuinely different cuts.

**Worked (side by side): the same problem, classical route.**

| | Classical | Laplace |
|---|---|---|
| Modes | guess $y_h = Ae^{-t} + Be^{-2t}$ from the characteristic equation | appear by themselves as poles of $Y(s)$ |
| Forced part | guess a constant, substitute: $2y_p = 4 \Rightarrow y_p = 2$ | falls out of partial fractions (residue at $s=0$) |
| Constants | solve $A+B+2 = 1$, $-A-2B = 0$ simultaneously → $A=-2, B=1$ | none to solve — residues are read off by cover-up |
| ICs | applied LAST, and they must be $0^+$ values — here equal to the $0^-$ data *only because* the input has no impulse (a physical argument you must supply) | enter on line one, at $0^-$, as given |
| Impulse inputs | need a separate jump analysis before you can even start | handled automatically by the $0^-$ convention |

Both routes give $y = 2 - 2e^{-t} + e^{-2t}$. The mathematics agrees; the *bookkeeping* does not — Laplace has no simultaneous equations, no $0^+$ conversion, no separate impulse case. On a 12-mark problem that difference is ten minutes and two traps.

**Worked (engineering skin): switched series RLC.** $R = 3\,\Omega$, $L = 1$ H, $C = 0.5$ F; source $v_s(t) = 10\,u(t)$ V; capacitor pre-charged to $v_C(0^-) = 5$ V, inductor relaxed, $i_L(0^-) = 0$.

1. *Model:* KVL + $i = C\,v_C'$ give $LC\,v_C'' + RC\,v_C' + v_C = v_s$, i.e. $0.5v_C'' + 1.5v_C' + v_C = v_s$, i.e. $v_C'' + 3v_C' + 2v_C = 2v_s$. ICs: $v_C(0^-) = 5$; $v_C'(0^-) = i_L(0^-)/C = 0$.
2. *Transform:* $(s^2+3s+2)V = \dfrac{20}{s} + 5s + 15$.
3. *Split and invert* (cover-up throughout):
$$V(s) = \frac{5(s+3)}{(s+1)(s+2)} + \frac{20}{s(s+1)(s+2)} \;\Rightarrow\; v_C(t) = \left(10 - 10e^{-t} + 5e^{-2t}\right)u(t)\ \text{V}$$
   (zero-input $= 10e^{-t} - 5e^{-2t}$: the stored 5 V draining through the modes; zero-state $= 10 - 20e^{-t} + 10e^{-2t}$: the source charging a resting circuit.)
4. *Checks:* $v_C(0^+) = 5$ ✓ (capacitor voltage cannot jump under finite current); $v_C(\infty) = 10$ ✓ (capacitor charges to the source; at DC it is an open circuit). Physical story and algebra agree line by line.

## @misconceptions
- wrong: "Initial conditions are applied at the end, after finding the general solution."
  tempting: "That is exactly the classical ritual drilled in the math course — solve first, fit constants last."
  correction: "In the Laplace route the ICs enter on the FIRST line, inside sY − y(0⁻). By the time you invert, they are already baked into the residues. Imposing them again at the end double-counts them — if your inverted answer fails to match y(0⁻), the error is upstream, not a missing constant."
- wrong: "Zero-state response = forced response, and zero-input = natural response."
  tempting: "Each pair has one 'system-ish' and one 'input-ish' member, so they look like the same split wearing two names."
  correction: "Different cuts. Zero-state H(s)X(s) has poles from BOTH the system and the input, so it contains decaying characteristic modes even from rest (the −4e⁻ᵗ + 2e⁻²ᵗ in the worked example). ZI/ZS splits by CAUSE; natural/forced splits by SHAPE."
  probe: q-split
- wrong: "Use the 0⁺ values in the derivative rules."
  tempting: "0⁺ is when the solution actually starts, so it feels like the right time stamp for 'initial'."
  correction: "The exam transform is defined from 0⁻ and its rules deposit 0⁻ values — the state BEFORE the switch or impulse, which is what problems state. When the input contains δ(t), 0⁺ ≠ 0⁻, and plugging 0⁺ values in double-counts the kick. The transform computes the jump itself."
  probe: q-zerominus
- wrong: "Y(s) = H(s)X(s) is the complete answer whenever H and the input are known."
  tempting: "The transfer function is 'the whole system in one ratio' — surely it answers everything."
  correction: "H assumes zero initial state — that is written into its definition. Nonzero ICs add the zero-input term P_IC(s)/A(s). Dropping it loses every mark tied to the initial conditions, which is usually a third of the problem."

## @exam

**Where it appears:** the centerpiece computation of Minor II and a guaranteed Major fixture — 8–12 marks, typically structured (a) transform and solve, (b) identify zero-input and zero-state parts, (c) verify the initial/final values. Circuit or mass–spring skins are common; the mathematics is identical.

**The method that earns full marks:** (1) write the derivative rules with deposits explicitly — the line "$\mathcal{L}\{y''\} = s^2Y - s\,y(0^-) - y'(0^-)$" itself carries marks; (2) collect into $A(s)Y = (\text{input terms}) + P_{\mathrm{IC}}(s)$; (3) name the split *before* expanding: zero-state $= H X$, zero-input $= P_{\mathrm{IC}}/A$; (4) partial fractions by cover-up, invert with the table, $u(t)$ on every term; (5) check $y(0^+)$ against the given ICs and (for stable cases with steps) the final value against $H(0)\times$ step height.

**Traps that cost marks:** forgetting the $a_1 y(0^-)$ deposit from the first-derivative term (the classic — the $y''$ deposits are remembered, the $y'$ one is not); swapping value and slope in $s\,y(0^-) + y'(0^-)$; using $0^+$ data; re-imposing ICs after inversion; answering only $H(s)X(s)$ when ICs are nonzero; forgetting that a causal input makes $x(0^-) = 0$ when the RHS contains $x'$ (no deposit — but say so); dropping $u(t)$.

## @interview

One-liners worth owning: "Why $0^-$? Because that is the state you actually *know* before the switch closes — and the transform computes any jump across $t=0$ for you." "Zero-input versus zero-state is a split by cause; natural versus forced is a split by shape — the zero-state response contains natural modes, so the cuts differ." "The transfer function is the zero-state story only; initial conditions ride in on a separate numerator over the same characteristic polynomial." "Laplace doesn't make the ODE easier — it makes the *bookkeeping* mechanical: no guessed forms, no simultaneous equations, no impulse special-cases."

## @history

Before computers, this ritual *was* the software. Gardner and Barnes' *Transients in Linear Systems* (1942) — essentially a giant transform table with worked rituals — sat on every circuit designer's desk through the radar and telephone era; engineers "solved" ODEs by lookup exactly as this concept teaches. The $0^-$ convention itself was a genuine controversy: textbooks fought for decades over $0^+$ versus $0^-$ transforms, until the impulse-input case settled the argument in favor of $0^-$ — the version that never needs a special case.

## @summary

$$\mathcal{L}\{y'\} = sY - y(0^-) \qquad \mathcal{L}\{y''\} = s^2Y - s\,y(0^-) - y'(0^-)$$

$$Y(s) = \underbrace{H(s)X(s)}_{\text{zero-state}} + \underbrace{\frac{P_{\mathrm{IC}}(s)}{A(s)}}_{\text{zero-input}}$$

- **Ritual:** transform with deposits → collect → name the split → partial fractions → invert with $u(t)$ → check $y(0^+)$ and (if stable) $y(\infty)$.
- **ICs live** in $P_{\mathrm{IC}}(s) = a_2[s\,y(0^-) + y'(0^-)] + a_1 y(0^-)$ — numerator only; poles never move.
- **ZI/ZS** (by cause) $\ne$ **natural/forced** (by shape): zero-state contains characteristic modes too.
- **$0^-$ always:** given data goes straight in; impulse inputs need no special handling.
- **Causal input** $\Rightarrow x(0^-) = 0$: RHS derivatives deposit nothing.
- **Classical route** agrees but pays extra: guessed forms, simultaneous equations, $0^+$ conversion — Laplace wins on bookkeeping.
