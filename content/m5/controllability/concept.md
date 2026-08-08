---
id: m5/controllability
title: "Controllability & observability: can you steer it, can you see it?"
short: Controllability
module: 5
tier: core
hero: true
outcomes: [CO5]
prereqs: [m5/state-space]
aliases: ["kalman rank test", "controllable", "observable", "controllability matrix", "observability matrix", "duality"]
exam: { major: high, marks: "6–10", styles: [compute, conceptual] }
crosslinks:
  - { target: m4/interconnections, relation: "the cancellation hazard was a hidden mode — here is its true name" }
  - { target: m3/transfer-function, relation: "H(s) shows only the controllable AND observable part of the system" }
---

## @intuition

Two questions decide whether control engineering is even possible for a given system. **Controllability:** can my actuator, pushing only in its direction $B$, drive the state *anywhere*? **Observability:** can my sensor, reading only its combination $C\mathbf{x}$, eventually figure out *everything* inside? Both feel like questions about effort or patience. Both are actually **rank conditions you compute in four multiplications** — and both can fail in ways the transfer function will never show you.

---
@viz steering {"a11":0,"a12":1,"a21":-2,"a22":-0.6,"mode":"control"}
Drag the green $B$-arrow. The input pushes only along $B$ — how could the state ever reach directions perpendicular to it? Because the *dynamics rotate the push*: a moment after you shove along $B$, the drift $A$ has carried that shove to a new direction, $AB$. If $B$ and $AB$ point differently, their span is the whole plane — everything reachable. Now snap $B$ onto an eigenvector: $AB$ stays *parallel* to $B$ (that's what eigenvectors are — the directions $A$ refuses to rotate), the span collapses to a line, and the rest of the plane becomes permanently unreachable. **No amount of time or cleverness helps** — the readout's rank drops to 1 and the steering game is lost before it starts.

---
That is the entire **Kalman rank test**: controllable ⇔ $\mathrm{rank}[B \;\; AB \;\; \cdots \;\; A^{n-1}B] = n$. The columns are "your push, and every direction the dynamics will ever carry it." Observability is the perfect mirror: the sensor reads $C\mathbf{x}$ now, $CA\mathbf{x}$ through the drift a moment later, $CA^2\mathbf{x}$ after that — if $[C; CA; \ldots]$ has full rank, the readings pin down the state; if not, two different internal worlds produce **identical sensor output forever** (the widget can show you the two ghost trajectories). Swap $(A,B) \leftrightarrow (A^T, C^T)$ and each theorem becomes the other: **duality**.

---
And the payoff connection: when a mode is uncontrollable or unobservable, it *cancels out* of $H(s) = C(sI{-}A)^{-1}B$ — a pole-zero cancellation. Module 4's hazard demo (the internal signal that quietly diverged while the output looked fine) was exactly this: a hidden mode. The transfer function shows the controllable-and-observable part *only*; state-space exists because of what $H$ hides.

## @definition

For $\dot{\mathbf{x}} = A\mathbf{x} + Bu$, $y = C\mathbf{x}$ ($n$ states):

- **Controllability matrix:** $\mathcal{C} = [B \;\; AB \;\; A^2B \;\cdots\; A^{n-1}B]$. **Controllable ⇔ $\mathrm{rank}\,\mathcal{C} = n$.** ($n{=}2$: $\det[B\;AB] \ne 0$.)
- **Observability matrix:** $\mathcal{O} = \begin{bmatrix} C \\ CA \\ \vdots \\ CA^{n-1}\end{bmatrix}$. **Observable ⇔ $\mathrm{rank}\,\mathcal{O} = n$.** ($n{=}2$: $\det\begin{bmatrix}C\\CA\end{bmatrix} \ne 0$.)
- **Duality:** $(A, B)$ controllable ⇔ $(A^T, B^T)$ observable.
- Uncontrollable/unobservable mode ⇒ pole–zero cancellation in $H(s)$; the cancelled (hidden) mode still evolves internally — catastrophic if unstable.
- Controllable ⇒ poles placeable anywhere by state feedback; observable ⇒ state reconstructible from output (observers) — the licenses modern control runs on.

## @derivation

### Step: Why powers of A — where the test comes from
?why: The solution's convolution smears B through e^{At}, whose series is powers of A.
Reachable states are $\int_0^t e^{A(t-\tau)}Bu(\tau)d\tau$ — combinations of $e^{A\sigma}B = (I + A\sigma + \tfrac{A^2\sigma^2}{2!} + \cdots)B$: everything lives in $\mathrm{span}\{B, AB, A^2B, \ldots\}$. Cayley–Hamilton caps the powers at $A^{n-1}$ (higher powers are combinations of lower ones) — hence exactly $n$ blocks in $\mathcal{C}$, and the span of those columns IS the reachable set.

### Step: The eigenvector failure mode
?why: If B lies in an A-invariant subspace, the push can never leave it.
$B = \mathbf{v}$ with $A\mathbf{v} = \lambda\mathbf{v}$: then $AB = \lambda B$, $A^2B = \lambda^2 B$ — every column of $\mathcal{C}$ is parallel. Rank 1. The input excites exactly one mode; the orthogonal mode never hears the actuator. Physically: pushing a two-mass system exactly at one mass's natural mode node.

### Step: Observability as the mirror, and the ghost worlds
?why: Unobservable ⇔ some x₀ ≠ 0 gives y(t) ≡ 0 — add it to any trajectory and the sensor can't tell.
If $\mathcal{O}\mathbf{x}_0 = 0$ then $y = Ce^{At}\mathbf{x}_0 = 0$ for all $t$ (same power-series argument). Two initial states differing by $\mathbf{x}_0$ produce identical outputs forever — the sensor lives in a house with a room it cannot see into. Duality: transpose everything and this is the controllability proof read backwards.

## @examples

**Worked (the exam computation, 2×2):** $A = \begin{bmatrix}0&1\\-2&-3\end{bmatrix}$, $B = \begin{bmatrix}0\\1\end{bmatrix}$: $AB = \begin{bmatrix}1\\-3\end{bmatrix}$, $\mathcal{C} = \begin{bmatrix}0&1\\1&-3\end{bmatrix}$, $\det = -1 \ne 0$ ⇒ **controllable**. Show $B$, $AB$, the matrix, the determinant, the verdict — five lines, five marks.

**Worked (an uncontrollable pair):** $A = \begin{bmatrix}-1&0\\0&-2\end{bmatrix}$, $B = \begin{bmatrix}1\\0\end{bmatrix}$: $AB = \begin{bmatrix}-1\\0\end{bmatrix}$ — parallel to $B$ ($B$ is an eigenvector). $\det = 0$, rank 1: the $x_2$ mode never hears the input. Note $H(s) = C(sI-A)^{-1}B$ with $C = [1\;1]$ comes out first-order — the $(s+2)$ mode *cancelled*: hidden, exactly as promised.

**Worked (3×3 flavor):** for $n = 3$ the test needs $[B\;AB\;A^2B]$ and a $3\times3$ rank (row-reduce; the linear-algebra primer's ritual). Papers escalate to 3×3 precisely to check you know the test *scales by powers*, not by repetition of $AB$.

**Worked (observability mirror):** same diagonal $A$, $C = [1\;\;0]$: $CA = [-1\;\;0]$, $\mathcal{O}$ rank 1 — the sensor reads only $x_1$; $x_2$ is a ghost room. Duality check: $(A^T, C^T)$ is exactly the uncontrollable pair above. One computation, two theorems.

## @misconceptions
- wrong: "Given enough time, any system can be steered anywhere."
  tempting: "Patience feels like power."
  correction: "Reachability is a SUBSPACE property: if rank C < n, the unreachable directions stay unreachable forever — time never enlarges span{B, AB, …}. The steering game is unwinnable, not merely hard."
- wrong: "Controllability depends on how strong the input is."
  tempting: "A bigger actuator should reach more."
  correction: "Rank doesn't scale: 10B spans the same line as B. Controllability is about DIRECTIONS (geometry), not effort (magnitude). Gain buys speed, never new directions."
- wrong: "If H(s) is stable, the system is fine."
  tempting: "The input-output behavior looks perfect."
  correction: "H shows only the controllable-and-observable part. A cancelled unstable mode still evolves inside — charging toward the rails while the output smiles (Module 4's hazard). Internal stability requires checking A's eigenvalues, not H's poles."
- wrong: "The observability test uses B."
  tempting: "Symmetry pattern-matching."
  correction: "Observability stacks C with powers of A: [C; CA; …] — B is irrelevant to what the sensor can infer. (Duality swaps the roles PROPERLY: transpose A and trade B ↔ Cᵀ.)"

## @exam

6–10 marks on the Major, formulaic and gift-like if drilled: (a) compute $\mathcal{C} = [B\;AB]$ (or $3{\times}3$ with $A^2B$), show the determinant/rank, verdict; (b) same for $\mathcal{O}$; (c) conceptual: why powers of $A$ (dynamics carry the push), the eigenvector failure, duality statement; (d) the hidden-mode connection: uncontrollable/unobservable ⇒ pole-zero cancellation ⇒ $H$ lies about internal stability. Ritual: write each block ($B$, then $AB$ computed explicitly), assemble, determinant, VERDICT in words. Traps: using $[B\;\;AB]$ rows/columns transposed; testing observability with $B$; rank claimed without the determinant shown; forgetting that gain never fixes rank.

## @summary

- **Controllable ⇔ $\mathrm{rank}[B\;AB\;\cdots\;A^{n-1}B] = n$** (2×2: $\det[B\;AB] \ne 0$). Columns = your push + every direction the drift carries it.
- Fails when $B$ hits an $A$-invariant direction (eigenvector): $AB \parallel B$, span collapses, forever.
- **Observable ⇔ $\mathrm{rank}[C; CA; \cdots] = n$**; unobservable ⇒ ghost states with identical output. **Duality:** $(A,B) \leftrightarrow (A^T, C^T)$.
- Hidden (uncontrollable/unobservable) modes = pole-zero cancellations in $H(s)$ — possibly unstable and invisible. Internal stability = eig(A), not poles of H.
- Time and gain never create rank. Controllable ⇒ pole placement; observable ⇒ observers.
