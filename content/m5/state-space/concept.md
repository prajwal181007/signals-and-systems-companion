---
id: m5/state-space
title: "State-space: the system's minimal memory, written as a matrix"
short: State-space
module: 5
tier: core
outcomes: [CO5]
prereqs: [primers/linear-algebra, m3/transfer-function]
aliases: ["state variables", "state equations", "A B C D matrices", "state transition matrix", "e^At"]
exam: { major: high, marks: "8–12", styles: [derive, compute] }
crosslinks:
  - { target: m5/phase-portraits, relation: "the geometry of these equations: all possible histories drawn at once" }
  - { target: m5/controllability, relation: "what the matrices reveal that the transfer function hides" }
---

## @intuition

Freeze a pendulum mid-swing and photograph it. Can you predict its future? Not from the photo alone — two pendulums at the same *position* but different *velocities* have utterly different futures. Position + velocity together, though, determine everything ahead. That minimal set of numbers — the least you must know *now* to predict *forever* (given future inputs) — is the **state**, and it is the deepest idea in this module: dynamics = the drift of a memory vector.

---
@viz portrait {"a11":0,"a12":1,"a21":-2,"a22":-0.6}
Bundle the state into a vector $\mathbf{x} = [x_1, x_2]^T$ and every linear system becomes one sentence: $\dot{\mathbf{x}} = A\mathbf{x} + B u$. The matrix $A$ says how the memory drifts on its own; $B$ says where the input pushes. The portrait draws $A$'s drift field — click to drop a state and watch its whole future unroll. Second-order ODE, RLC circuit, two coupled tanks: all the *same object* once written this way.

---
Why bother, when $H(s)$ already worked? Three honest answers. **Interior visibility:** $H$ relates input to output only; state-space watches every internal variable (capacitor voltages, velocities) — and Module 5's punchline is that $H$ can literally *hide* modes (controllability). **Many inputs/outputs:** matrices scale; ratios of polynomials don't. **Computation:** every simulator (MATLAB, SPICE, your phone's sensor fusion) integrates $\dot{\mathbf{x}} = A\mathbf{x} + Bu$, not transfer functions.

---
And the solution has a closed form worth meeting by name: $\mathbf{x}(t) = e^{At}\mathbf{x}(0) + \int_0^t e^{A(t-\tau)}Bu(\tau)d\tau$ — the scalar $e^{at}$ answer with the exponential promoted to a **matrix**. The **state-transition matrix** $e^{At}$ is computed by hand via $\mathcal{L}^{-1}\{(sI-A)^{-1}\}$ — an inversion + partial fractions exercise you already own.

## @definition

**State equations:**
$$\dot{\mathbf{x}} = A\mathbf{x} + B u \qquad y = C\mathbf{x} + D u$$
$\mathbf{x} \in \mathbb{R}^n$ (state), $A$ ($n{\times}n$ dynamics), $B$ (input map), $C$ (output map), $D$ (feedthrough).

- **Solution:** $\mathbf{x}(t) = e^{At}\mathbf{x}(0) + \int_0^t e^{A(t-\tau)}Bu(\tau)\,d\tau$ (zero-input + zero-state).
- **State-transition matrix:** $\Phi(t) = e^{At} = \mathcal{L}^{-1}\{(sI - A)^{-1}\}$; $\Phi(0) = I$, $\dot\Phi = A\Phi$, $\Phi(t_1{+}t_2) = \Phi(t_1)\Phi(t_2)$.
- **Poles = eigenvalues of $A$** (up to hidden-mode cancellations — next concepts): $\det(sI - A) = 0$ is both the characteristic equation and the pole polynomial.
- **Standard conversions:** an $n$-th order ODE takes states $x_1 = y, x_2 = \dot y, \ldots$ (phase variables); an RLC takes capacitor voltages and inductor currents (the energy-storing variables — one state per storage element).

## @derivation

### Step: From a 2nd-order ODE to (A, B, C) — the mechanical ritual
?why: Choosing derivatives as states turns one n-th order equation into n first-order ones.
$\ddot y + 3\dot y + 2y = u$: let $x_1 = y$, $x_2 = \dot y$. Then $\dot x_1 = x_2$ and $\dot x_2 = -2x_1 - 3x_2 + u$:
$$A = \begin{bmatrix}0 & 1\\ -2 & -3\end{bmatrix},\; B = \begin{bmatrix}0\\1\end{bmatrix},\; C = [1\;\; 0],\; D = 0$$
Check: $\det(sI - A) = s^2 + 3s + 2$ — the ODE's characteristic polynomial reappears as promised.

### Step: The state-transition matrix by hand (the exam computation)
?why: Transform the state equation; (sI − A)⁻¹ is a 2×2 inversion + partial fractions.
For the $A$ above: $(sI - A)^{-1} = \frac{1}{s^2+3s+2}\begin{bmatrix}s+3 & 1\\ -2 & s\end{bmatrix}$. Partial-fraction each entry over $(s{+}1)(s{+}2)$ and invert:
$$e^{At} = \begin{bmatrix} 2e^{-t} - e^{-2t} & e^{-t} - e^{-2t} \\ -2e^{-t} + 2e^{-2t} & -e^{-t} + 2e^{-2t} \end{bmatrix}$$
Audit: at $t=0$ this is $I$ ✓; every entry is a mix of the modes $e^{-t}, e^{-2t}$ (the eigenvalues) ✓. This exact computation — $(sI-A)^{-1}$, expand, invert, check $\Phi(0)=I$ — is the Major's reliable long question.

### Step: Why the solution formula is convolution wearing matrices
?why: e^{A(t−τ)}B is the impulse-response of the state; the integral is x's zero-state convolution.
The zero-state part $\int_0^t e^{A(t-\tau)}Bu\,d\tau$ is exactly $h * u$ with $h(t) = e^{At}B$: Module 1's superposition-of-echoes, promoted to vectors. Nothing new was invented — the state framework *reorganizes* the same LTI theory around memory.

## @examples

**Worked (RLC to state-space):** series RLC ($R, L, C$), input voltage $u$, states $x_1 = v_C$, $x_2 = i_L$: $\dot x_1 = x_2/C$, $\dot x_2 = (u - x_1 - Rx_2)/L$. One state per energy-storage element — the physical recipe that never fails, and the reason $n$ = number of independent storage elements.

**Worked (eigen-check):** for the $A$ above, eigenvalues from $\text{tr} = -3$, $\det = 2$: $\lambda^2 + 3\lambda + 2 = 0 \Rightarrow -1, -2$ — matching the ODE's roots and the poles of $H(s) = \frac{1}{s^2+3s+2}$. Poles = eigenvalues: the bridge between Modules 3 and 5, and the first thing to verify in any conversion.

**Worked (zero-input response):** same system, $\mathbf{x}(0) = [1, 0]^T$, $u = 0$: $\mathbf{x}(t) = e^{At}\mathbf{x}(0) = [2e^{-t} - e^{-2t},\; -2e^{-t}+2e^{-2t}]^T$ — read directly off $\Phi$'s first column. Stored energy draining through the modes.

## @misconceptions
- wrong: "The state is whatever variables you fancy."
  tempting: "It's 'just a choice of coordinates'."
  correction: "The state must be a MINIMAL SUFFICIENT memory: given x(t₀) and future u, the future is determined. Position alone fails for a pendulum (two futures, one photo). Coordinates can be changed (any invertible transform), but the dimension — the number of independent memories — cannot."
- wrong: "e^{At} is the matrix of elementwise exponentials e^{a_{ij}t}."
  tempting: "It looks like a notational shortcut."
  correction: "e^{At} = I + At + A²t²/2! + … — a genuinely matrix-valued series. Compute it via (sI−A)⁻¹, never elementwise (elementwise fails the Φ(0)=I check immediately unless A is diagonal)."
- wrong: "State-space and transfer functions contain the same information."
  tempting: "They describe the same physical system."
  correction: "H(s) = C(sI−A)⁻¹B + D can CANCEL a pole with a zero — hiding an internal mode that the state description still carries (and that may be unstable!). State-space ⊇ transfer function; the gap is precisely un-controllable/unobservable dynamics — the next two concepts."

## @exam

The Major's dependable long question (8–12 marks): (a) convert an ODE or RLC to $(A, B, C, D)$; (b) compute $e^{At}$ via $(sI-A)^{-1}$ with partial fractions, audit $\Phi(0) = I$; (c) zero-input response from ICs; (d) verify poles = eigenvalues. Ritual: state your state variables FIRST (with the physical reason), write both matrix equations, keep the $\frac{1}{\det}$ adjugate arithmetic tidy, and always run the two audits ($\Phi(0)=I$; char. poly = pole poly). Traps: elementwise $e^{At}$; sign slips in the companion-form bottom row; forgetting $D$.

## @summary

- $\dot{\mathbf{x}} = A\mathbf{x} + Bu$, $y = C\mathbf{x} + Du$: state = minimal memory (one per energy-storage element / derivative).
- Solution: $\mathbf{x} = e^{At}\mathbf{x}(0) + \int_0^t e^{A(t-\tau)}Bu\,d\tau$; **$e^{At} = \mathcal{L}^{-1}\{(sI-A)^{-1}\}$**, audit $\Phi(0) = I$.
- Poles = eigenvalues of $A$ ($\det(sI - A)$ = characteristic = pole polynomial) — modulo hidden-mode cancellations.
- Companion form for ODEs (0/1 top row, −coefficients bottom); physical states for circuits ($v_C, i_L$).
- $H = C(sI-A)^{-1}B + D$ can hide modes; the state cannot — why this module exists.
