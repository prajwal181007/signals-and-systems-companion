---
id: m5/nyquist
title: "The Nyquist criterion: counting with a map"
short: Nyquist
module: 5
tier: core
hero: true
outcomes: [CO5]
prereqs: [m5/stability-margins]
aliases: ["nyquist plot", "encirclement", "Z = N + P", "D contour", "minus one point"]
exam: { major: high, marks: "8–12", styles: [sketch, compute, conceptual] }
crosslinks:
  - { target: m5/stability-margins, relation: "GM and PM reappear as distances of the curve from −1" }
  - { target: m3/roc, relation: "the criterion certifies closed-loop poles out of the RHP — the ROC stability story, closed-loop edition" }
---

## @intuition

Bode margins answer "how close to trouble?" — but they *assume* the open loop was stable to begin with. What if your plant is open-loop **unstable** (a rocket, a maglev, an inverted pendulum)? You cannot sweep it safely, and margin rules mislead. Nyquist's 1932 idea is the course's most elegant: **walk the boundary of the entire right half-plane, watch what the loop function does to that walk, and *count*.** The count reveals exactly how many closed-loop poles hide in the RHP — even when you couldn't afford to look directly.

---
@viz voyage {"preset":"stable2"}
The **D-contour**: up the jω-axis, around an infinite arc, back — a fence around every possible RHP pole. The widget marches a point along it while the right pane traces the image $L(s)$ *synchronously*: every loop and bulge of the Nyquist curve is *caused* by the marching point passing near a pole or zero — watch the causation, not just the result. The stakes concentrate at one location: the point **−1** (where $1 + L = 0$, the closed-loop pole condition).

---
The ledger: **$Z = N + P$**. $P$ = open-loop poles *strictly inside* the RHP (poles on the axis are excluded — the contour detours around them with a small semicircle, whose image becomes the plot's giant arcs). $N$ = **clockwise** encirclements of $-1$ by the image. $Z$ = closed-loop RHP poles — what you actually care about. **Stable ⇔ $Z = 0 \Leftrightarrow N = -P$**: an open-loop-stable plant needs *no net* encirclement; an open-loop-unstable plant with $P = 1$ needs exactly **one counter-clockwise** loop around −1 — the encirclement doesn't merely tolerate the unstable plant, it is the *signature of taming it*. Count the loops yourself before pressing reveal; the counting *is* the skill.

---
And your old friends live here too: the curve's crossing of the negative real axis at $-1/\mathrm{GM}$-distance, its crossing of the unit circle at PM degrees from the axis — margins are literally *how far the curve stays from −1*. One degenerate case worth naming: a trace passing exactly *through* −1 means a closed-loop pole exactly on the axis — marginal, the count undefined, the K of sustained oscillation.

## @definition

For loop function $L(s)$, closed loop $\frac{G}{1+L}$-shaped:

- **D-contour:** $j\omega$ from $-j\infty$ to $+j\infty$ + the infinite right arc; small right-semicircle detours around any $j\omega$-axis poles of $L$. For strictly proper $L$, the infinite arc maps to the origin.
- **Nyquist plot:** the image $L(s)$ along the contour. The $\omega < 0$ half is the mirror image (conjugate symmetry) — draw the top half, reflect.
- **Criterion:** $\;Z = N + P\;$ with $N$ = clockwise encirclements of $-1$, $P$ = strictly-RHP poles of $L$, $Z$ = RHP closed-loop poles. **Stable ⇔ Z = 0.**
- Gain scaling: $K$ inflates the whole plot radially — encirclements of $-1$ change exactly when the curve crosses $-1$: the marginal $K$'s.
- Margins on the plot: negative-real-axis crossing at distance $d$ from origin ⇒ GM $= 1/d$; unit-circle crossing at angle $\phi$ past $-180°$ ⇒ PM $= \phi$.

## @derivation

### Step: Why encirclements count zeros minus poles (the argument principle, engineer's edition)
?why: Each zero of 1+L inside the contour spins the image of 1+L once around 0; each pole spins it backwards.
Write $1 + L = \frac{\prod(s - z_i)}{\prod(s - p_j)}$: as $s$ walks a closed loop containing $z_i$, the factor $(s - z_i)$'s angle accumulates $360°$ (a vector from an interior point to a moving boundary point winds once); exterior roots contribute net zero. Total winding of $1{+}L$ around $0$ = (zeros inside) − (poles inside) = $Z - P$. But winding of $1{+}L$ about $0$ *is* winding of $L$ about $-1$, and the D-contour is clockwise ⇒ $N = Z - P$. Rearranged: $\boxed{Z = N + P}$. The zeros of $1{+}L$ are the closed-loop poles — the things being counted.

### Step: The conventions, pinned once
?why: Sign chaos is the #1 Nyquist error; fix the dictionary and never renegotiate.
This course: D-contour traversed CLOCKWISE (up the axis, right arc); $N > 0$ = clockwise encirclements of $-1$; $P$ counts *strictly* RHP open-loop poles (axis poles are OUTSIDE the contour thanks to the detours). Counter-clockwise loops count as negative $N$. With this dictionary, stable ⇔ $N = -P$, and the $P = 1$ rocket needs one CCW loop.

### Step: Axis poles and the giant arcs
?why: The detour's tiny semicircle maps through 1/s-like behavior into an enormous arc.
An integrator ($L \sim k/s$ near $0$): the contour's small right-detour $s = \epsilon e^{j\theta}$, $\theta: -90° \to +90°$, maps to $\frac{k}{\epsilon}e^{-j\theta}$ — a huge arc sweeping $+90° \to -90°$ **clockwise through the right half**. Each origin pole contributes one such $180°$ giant arc. Drawing the arc on the correct side is where axis-pole problems are won or lost (the widget's log-compressed view keeps it on screen).

## @examples

**Worked (P = 0, the typical case):** $L = \frac{8}{(s+1)(s+2)}$: starts at $L(0) = 4$ on the positive real axis, curls through the fourth quadrant, approaches the origin from $-180°$... The curve never reaches the negative real axis beyond $-1$ (max phase $-180°$ only asymptotically): $N = 0$, $P = 0$, $Z = 0$ — stable for this $K$, and indeed for all $K$ (GM = ∞, matching Bode).

**Worked (the raison d'être, P = 1):** $L = \frac{K}{(s-1)(s+2)}$, open-loop unstable. Sketch: for small $K$ the curve sits right of $-1$: $N = 0 \Rightarrow Z = 1$ — closed loop UNSTABLE (the plant's instability survives). For $K > 2$: $L(0) = -K/2 < -1$, and the curve wraps $-1$ once counter-clockwise: $N = -1 \Rightarrow Z = -1 + 1 = 0$ — **stable**. The encirclement is the cure, not the disease; and no Bode-margin reading could have told you. This example — including the threshold $K = 2$ from $|L(0)| = 1$ — is the classic Major question.

**Worked (margins on the plot):** a curve crossing the negative real axis at $-0.4$: GM $= 1/0.4 = 2.5$ (≈ 8 dB). Crossing the unit circle at $200°$ total phase: PM $= 20°$. Same numbers as Bode, new geometry: distance from $-1$ *is* robustness.

## @misconceptions
- wrong: "Encircling −1 is always bad."
  tempting: "−1 is the instability point, so stay away."
  correction: "For P = 0, yes: any net encirclement kills. For P ≠ 0, the loop MUST encircle −1 counter-clockwise exactly P times to be stable — the wrap is the signature of taming an unstable plant. Z = N + P first; folklore second."
- wrong: "P counts every pole with Re ≥ 0, including the axis."
  tempting: "The axis feels 'right-half-ish'."
  correction: "P = STRICTLY RHP only. Axis poles are excluded by the contour's detours (whose images are the giant arcs). Counting an integrator's pole into P wrecks the ledger by one — the most common Nyquist error in existence."
- wrong: "A trace through −1 rounds to stable or unstable, whichever is closer."
  tempting: "The count must come out an integer somehow."
  correction: "Through −1 = closed-loop pole ON the axis: MARGINAL, count undefined, sustained oscillation at that frequency and gain. Name it as the marginal K — that's the mark."
- wrong: "The ω < 0 half of the plot needs separate computation."
  tempting: "The contour runs the whole axis."
  correction: "Conjugate symmetry: L(−jω) = L*(jω) — the bottom half is the mirror image. Compute the top, reflect, THEN count encirclements on the closed curve (counting on the half-curve undercounts)."

## @exam

The Major's discriminator question (8–12 marks): (a) sketch the Nyquist plot of a given L (start/end points, axis crossings, giant arcs for origin poles, mirror the bottom); (b) apply $Z = N + P$ with the conventions stated, verdict in words; (c) the $P = 1$ variant with the threshold K (the classic); (d) read GM/PM off the plot; (e) the through-−1 marginal case. Ritual: compute $L(0^+)$ and $L(\infty)$, find the negative-real-axis crossing (set $\mathrm{Im}\,L = 0$), draw, mirror, count — **stating N, P, Z separately** — then verdict. Traps: axis poles counted into P; counting on the unmirrored half-curve; giant arcs on the wrong side; verdicts without the ledger shown.

## @summary

- **$Z = N + P$**: N = clockwise encirclements of $-1$ (CCW negative), P = *strictly*-RHP open-loop poles, Z = closed-loop RHP poles. **Stable ⇔ Z = 0 ⇔ N = −P.**
- P = 0: no net encirclement allowed. P = 1: exactly one CCW wrap REQUIRED — Nyquist certifies loops Bode can't.
- Axis poles: detoured, not counted; each origin pole ⇒ a 180° giant arc (right side). Bottom half = mirror; count on the CLOSED curve.
- Through −1 ⇒ marginal (pole on axis): the K of sustained oscillation. K scales the plot radially; crossings of −1 = marginal K's.
- Margins as geometry: axis crossing at $d$ ⇒ GM = $1/d$; unit-circle crossing ⇒ PM. Distance from −1 = robustness.
