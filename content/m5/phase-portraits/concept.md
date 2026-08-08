---
id: m5/phase-portraits
title: "Phase portraits: all possible histories in one picture"
short: Phase portraits
module: 5
tier: core
outcomes: [CO5]
prereqs: [m5/state-space]
aliases: ["phase plane", "node", "saddle", "spiral", "center", "eigenvector", "trajectory"]
exam: { major: medium, marks: "4–8", styles: [sketch, conceptual] }
crosslinks:
  - { target: m3/s-plane, relation: "eigenvalues classify portraits exactly as pole positions classified waveforms" }
  - { target: m5/controllability, relation: "the portrait is the stage on which steering (controllability) plays out" }
---

## @intuition

A time plot shows *one* history of a system. A **phase portrait** shows *all of them at once*: axes are the state variables ($x_1, x_2$), each point is a possible "now", and the arrow at each point says where that now drifts next. One picture answers every "what if it started here?" question simultaneously — the closest engineering gets to seeing a system's soul.

---
@viz explorer {"a11":0,"a12":1,"a21":-2,"a22":-0.6}
Click around and drop marbles. With complex eigenvalues and negative real part, every trajectory **spirals home** — the portrait's spiral pitch *is* the damping, its winding rate the frequency: $\zeta$ and $\omega_n$ turned into geometry. Drag $a_{22}$ toward zero: the spiral opens into closed **orbits** (a center — poles on the axis, the marginal case), then unwinds outward (unstable spiral). The s-plane atlas and this portrait are the same classification drawn in different rooms.

---
Real eigenvalues change the choreography. The dashed lines are **eigenvectors** — the invariant rails: a state starting exactly on one stays on it forever, moving at its eigenvalue's pace. Generic trajectories bend toward the *slow* rail (the smaller $|\lambda|$ dominates the long run) — that visible funneling is why "dominant pole" analysis works. And a **saddle** (eigenvalues of opposite sign) has one stable rail in an ocean of escape: almost every start diverges, and the exceptional set is exactly the stable eigenline — measure zero, like balancing a pencil.

---
Reading portraits is a classification skill with a two-number cheat code: for $2{\times}2$ systems, the **trace** and **determinant** of $A$ decide everything — $\det < 0$: saddle; $\det > 0$ with $\mathrm{tr}^2 \ge 4\det$: node (stable iff $\mathrm{tr}<0$); $\mathrm{tr}^2 < 4\det$: spiral (center iff $\mathrm{tr} = 0$). No eigen-computation needed for the classification itself.

## @definition

For $\dot{\mathbf{x}} = A\mathbf{x}$ ($2\times2$, eigenvalues $\lambda_{1,2}$):

| Eigenvalues | Portrait | Stability |
|---|---|---|
| real, both $<0$ | **stable node** (funnels along slow eigenvector) | asymptotically stable |
| real, both $>0$ | unstable node | unstable |
| real, opposite signs | **saddle** (one stable rail, else escape) | unstable |
| complex, $\mathrm{Re}<0$ | **stable spiral** (decaying oscillation) | asymptotically stable |
| complex, $\mathrm{Re}>0$ | unstable spiral | unstable |
| pure imaginary | **center** (closed orbits) | marginally stable |

**Trace–determinant shortcut:** $\lambda^2 - \mathrm{tr}(A)\lambda + \det(A) = 0$. $\det<0$ ⇒ saddle; else spiral vs node by $\mathrm{tr}^2 \lessgtr 4\det$; stability by sign of $\mathrm{tr}$.
Eigenvectors = invariant lines (real case); trajectories never cross each other (uniqueness of solutions).

## @derivation

### Step: Why eigenvectors are rails
?why: On an eigenvector, Ax points along x itself — drift never leaves the line.
If $\mathbf{x} = c\mathbf{v}$ with $A\mathbf{v} = \lambda\mathbf{v}$: $\dot{\mathbf{x}} = \lambda c \mathbf{v}$ — motion along $\mathbf{v}$, scaling as $e^{\lambda t}$. The rails are the directions the dynamics cannot rotate, and the general solution $c_1e^{\lambda_1 t}\mathbf{v}_1 + c_2e^{\lambda_2 t}\mathbf{v}_2$ is just "two rail-motions superposed."

### Step: Why the slow eigenvalue wins the long run
?why: The ratio of the fast mode to the slow mode dies exponentially.
With $\lambda_1 = -1, \lambda_2 = -5$: $\mathbf{x}(t) = c_1e^{-t}\mathbf{v}_1 + c_2e^{-5t}\mathbf{v}_2$ — after a short transient the second term is negligible and every trajectory hugs $\mathbf{v}_1$. Dominant-pole approximations, settling-time estimates, "the system is basically first-order after a while": all this funneling, said politely.

### Step: The trace–determinant classification
?why: tr = λ₁+λ₂ and det = λ₁λ₂ encode the eigenvalue configuration without solving.
$\det < 0$ ⇔ real, opposite signs (saddle). $\det > 0$: same-sign real or complex pair — split by the discriminant $\mathrm{tr}^2 - 4\det$; and $\mathrm{tr} = \lambda_1 + \lambda_2$ carries the stability sign. Two arithmetic operations classify the portrait — the exam's favorite shortcut.

## @examples

**Worked (classification, exam pattern):** $A = \begin{bmatrix}0&1\\-2&-3\end{bmatrix}$: $\mathrm{tr} = -3$, $\det = 2$, $\mathrm{tr}^2 - 4\det = 1 > 0$ ⇒ stable node ($\lambda = -1, -2$). Eigenvectors $[1,-1]^T$ (slow) and $[1,-2]^T$ (fast): sketch the rails, funnel trajectories toward the slow one, arrows inward. That sketch — rails + funneling + arrows — is the full-marks answer.

**Worked (spiral numbers):** $A = \begin{bmatrix}0&1\\-4&-0.8\end{bmatrix}$: $\lambda = -0.4 \pm j1.96$: stable spiral, ring frequency ≈ 1.96 rad/s, envelope $e^{-0.4t}$ — the portrait's winding and shrink-rate, quantified. Compare $\omega_n = 2$, $\zeta = 0.2$: same numbers wearing control-theory clothes.

**Worked (saddle honesty):** $A = \begin{bmatrix}1&0\\0&-2\end{bmatrix}$: rails are the axes; only starts *exactly* on the $x_2$-axis survive. Any real perturbation ⇒ escape along $x_1$: why "balanced" unstable equilibria (inverted pendulum) need active feedback — a portrait is worth a lecture here.

## @misconceptions
- wrong: "Trajectories can cross where the field looks tangled."
  tempting: "Dense pictures look intersecting."
  correction: "Through every point passes exactly ONE trajectory (uniqueness of ODE solutions). Apparent crossings are either the equilibrium itself or drawing artifacts. If your sketch crosses lines, it's wrong."
- wrong: "A center (closed orbits) is stable like a spiral is."
  tempting: "Orbits stay bounded forever — sounds stable."
  correction: "MARGINAL: orbits neither approach nor leave the origin — energy circulates undamped (poles on the axis). Any damping perturbation tips it into a spiral (either way!). Bounded ≠ asymptotically stable — say 'marginally' and earn the mark."
- wrong: "A saddle is stable if you start on the stable eigenline."
  tempting: "There IS a converging direction."
  correction: "That set has measure zero — a knife's edge. Practically (noise exists), a saddle is unstable, full stop; the stable rail explains only why the escape has a preferred geometry."

## @exam

4–8 marks: (a) classify a given 2×2 $A$ via trace/det (show both numbers and the discriminant); (b) sketch the portrait: eigen-rails with directions, funneling toward the slow rail, arrowheads; (c) match portraits ↔ pole positions ↔ step responses (the three-way matching question); (d) one-liner on marginal centers. Traps: crossing trajectories in sketches; "center = stable"; forgetting arrowheads (direction is half the picture); mislabeling which rail is slow.

## @summary

- Portrait = all histories at once; arrows = $A\mathbf{x}$; trajectories never cross; equilibrium at the origin.
- Eigenvectors = invariant rails; slow $|\lambda|$ dominates the long run (funneling ⇒ dominant-pole thinking).
- Classification by $\mathrm{tr}, \det$: $\det<0$ saddle; $\mathrm{tr}^2 \gtrless 4\det$ node/spiral; $\mathrm{tr}$ sign = stability; $\mathrm{tr}=0, \det>0$ center (MARGINAL).
- Spiral pitch = damping, winding rate = frequency: $\zeta, \omega_n$ as geometry; portraits ↔ s-plane ↔ step responses, one classification.
- Saddle: one stable rail, measure zero — practically unstable (inverted pendulum needs feedback).
