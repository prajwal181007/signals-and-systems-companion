---
id: primers/linear-algebra
title: "Just-enough linear algebra: reading what a matrix does to the plane"
short: Linear Algebra
module: 0
tier: supplementary
hero: false
outcomes: [CO5]
prereqs: []
aliases: ["matrix", "eigenvalue", "eigenvector", "determinant", "rank", "characteristic polynomial", "row reduction", "matrix vector product", "linear independence"]
exam: { minor1: low, major: high, marks: "4–6 embedded in Module 5 questions", styles: [compute, conceptual] }
crosslinks:
  - { target: m5/state-space, relation: "the eigenvalues of A are the system's modes — stability of a whole circuit reduces to the signs of two numbers computed here" }
  - { target: m5/controllability, relation: "the Kalman test is rank[B AB] — this primer's rank ritual, verbatim" }
  - { target: m5/phase-portraits, relation: "eigenvectors are the straight-line trajectories every phase portrait is organized around" }
---

## @intuition

A quadcopter tilts in a gust. Its flight computer tracks the tilt angle and the tilt rate, bundled into one arrow — the **state**. Physics moves that arrow every millisecond, and the whole question of flight is: does the arrow spiral back to "level and still", or run away? Module 5 answers with matrices. A matrix is the rule that moves the arrow; its hidden preferred directions decide recovery versus crash; a rank check decides whether the motors can steer at all. This primer is just enough matrix fluency to read those answers.

---
Forget "a grid of numbers with rules to memorize". A 2×2 matrix is a machine: arrow in, arrow out. And it is completely pinned down by two experiments — feed in the unit arrow pointing east, then the one pointing north. The outputs are exactly the matrix's first and second **columns**. Every other arrow is a mix of those two, so its output is the same mix of the columns. Reading columns as "where the basic arrows land" turns matrix arithmetic into geometry you can sketch.

---
Push every point of a unit square through the machine: it comes out as a tilted parallelogram. The **determinant** is that parallelogram's area — the machine's area-scaling factor. det = 5 means areas grow fivefold. The interesting reading is det = 0: the square is crushed flat onto a line. Different inputs now land on the same output, information is destroyed, and no inverse machine can exist. Hold onto this picture — it is about to *define* eigenvalues.

---
Most arrows get stretched **and** swung to a new direction. But almost every matrix hides special directions it refuses to rotate: arrows there come out merely scaled — stretched, shrunk, or flipped. Those directions are **eigenvectors**; the scale factors are **eigenvalues**. Why care? Along an eigen-direction, applying the matrix over and over is just multiplying by a number over and over: two-dimensional complexity collapses to one-dimensional arithmetic. Module 5's "modes" — each state motion decaying like its own exponential — are exactly this collapse.

---
**Rank** asks: how many genuinely different directions do a matrix's columns actually cover? Columns can lie. The pair [3,2] and [6,4] poses as two directions, but the second is the first in disguise. Row-reduction is the interrogation that exposes disguises; the count of surviving nonzero rows is the rank. Module 5's controllability test is precisely this: stack the directions your input can push the state, check the rank. Full rank — you can steer anywhere. Deficient — a whole line of states is forever out of reach.

## @definition

**Matrix × vector = mix of columns.** For $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$ and $v = \begin{bmatrix} v_1 \\ v_2 \end{bmatrix}$:

$$Av \;=\; v_1\begin{bmatrix} a \\ c \end{bmatrix} + v_2\begin{bmatrix} b \\ d \end{bmatrix} \;=\; \begin{bmatrix} a v_1 + b v_2 \\ c v_1 + d v_2 \end{bmatrix}$$

**Determinant (2×2):** $\det A = ad - bc$ — the signed area-scale factor. $\det A \neq 0 \iff A$ is invertible.

**Eigenvalue / eigenvector:** a number $\lambda$ and a **nonzero** vector $v$ with

$$Av = \lambda v, \qquad v \neq 0$$

found from the **characteristic equation** $\det(A - \lambda I) = 0$, which for any 2×2 expands to the shortcut

$$\lambda^2 - \mathrm{tr}(A)\,\lambda + \det(A) = 0, \qquad \mathrm{tr}(A) = a + d$$

**Rank:** the number of linearly independent columns (equivalently rows) — computed by row-reducing with the three legal operations (swap rows, scale a row by a nonzero constant, add a multiple of one row to another) and counting nonzero rows at the end.

**Reading the symbols:** $I$ is the do-nothing matrix (ones on the diagonal); $A - \lambda I$ means "subtract $\lambda$ down the diagonal only." In $Av = \lambda v$, the left side is the full two-dimensional machine, the right side is plain scalar multiplication — the equation announces a direction where the machine behaves like a number. The ban $v \neq 0$ matters: $A\,0 = \lambda\,0$ holds for every $\lambda$, so the zero vector certifies nothing.

**Exam conventions:** eigenvectors are accepted at *any* nonzero scaling — pick small integers. Write the characteristic polynomial in $\lambda$, factor, then solve $(A-\lambda I)v = 0$ using **one row** (the rows agree when $\det = 0$). Rank claims must show the row operations.

## @derivation

The eigenvalue recipe is not a ritual handed down — it falls out of the determinant-as-area picture in three moves. Then one more move explains why rank tests work.

### Step: An eigenvector is a direction that A − λI sends to zero
?why: Subtracting λv from both sides of Av = λv costs nothing and gathers everything on one side.
$$Av = \lambda v \iff (A - \lambda I)\,v = 0, \qquad v \neq 0$$
So the hunt for special directions becomes: for which $\lambda$ does the matrix $A - \lambda I$ **kill** some nonzero arrow?

### Step: A matrix can kill a nonzero arrow only by flattening the plane
?why: An invertible machine can be run backwards — and running 0 backwards can only ever return 0.
If $A - \lambda I$ had an inverse, then $v = (A-\lambda I)^{-1} 0 = 0$, contradicting $v \neq 0$. So $A - \lambda I$ must be non-invertible — it collapses area:
$$\det(A - \lambda I) = 0$$
The geometric picture did real work here: "kills a direction" $\iff$ "area scale zero". This single line converts a two-unknown vector problem into one polynomial equation.

### Step: Expand the determinant — the trace/det shortcut appears
?why: Just the 2×2 determinant formula, with λ subtracted on the diagonal.
$$\det\begin{bmatrix} a-\lambda & b \\ c & d-\lambda \end{bmatrix} = (a-\lambda)(d-\lambda) - bc = \lambda^2 - (a+d)\lambda + (ad - bc)$$
$$\boxed{\;\lambda^2 - \mathrm{tr}(A)\,\lambda + \det(A) = 0\;}$$
Two matrix invariants you can read off in seconds hand you the polynomial with no expansion at all.

### Step: Each eigenvector comes from ONE row of A − λI
?why: det = 0 forces the two rows to demand the same thing — the second row is a multiple of the first.
Take the first row: $(a - \lambda)v_1 + b\,v_2 = 0$. Any nonzero solution works, e.g. $v = \begin{bmatrix} b \\ \lambda - a \end{bmatrix}$ (when it's not the zero vector). Using both rows is wasted ink; exams reward the one-row habit because it is also the error-proof one.

### Step: Why rank tests work
?why: Rank counts the dimensions your columns can actually reach; row operations reshuffle the bookkeeping without changing that count.
A combination of columns $v_1 c_1 + v_2 c_2 + \dots$ can reach exactly the space the columns span. If the span is the full plane (rank 2), *every* target is reachable; if the columns hide a dependency (rank 1), all combinations live on a single line and everything off it is unreachable — no cleverness with the coefficients can escape. Row-reduction merely rewrites the system in triangular form where dependencies become visibly zero rows. That is the entire logic of Module 5's controllability test: the columns of $[B \;\; AB]$ are the directions the input can push the state; full rank means "push anywhere."

### Step: Notice what was NOT assumed
?why: The recipe never promised real answers — and the complex case is a feature, not a failure.
Nothing required symmetry, and nothing guaranteed real roots. $A = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$ gives $\lambda^2 + 1 = 0$: $\lambda = \pm j$. Geometrically obvious in hindsight — a pure rotation leaves **no** real direction unturned. A complex eigenvalue pair is the matrix telling you it rotates; in Module 5 that mode *oscillates*, and the real part of $\lambda$ decides whether the oscillation decays or explodes.

## @examples

**Worked (the Module-5 rehearsal): eigenvalues and eigenvectors of $A = \begin{bmatrix} 0 & 1 \\ -2 & -3 \end{bmatrix}$.**

1. *Shortcut polynomial:* $\mathrm{tr}(A) = 0 + (-3) = -3$; $\det(A) = (0)(-3) - (1)(-2) = 2$. So $\lambda^2 + 3\lambda + 2 = 0$.
2. *Factor:* $(\lambda + 1)(\lambda + 2) = 0 \Rightarrow \lambda_1 = -1,\; \lambda_2 = -2$.
3. *Eigenvector for $\lambda_1 = -1$:* $A + I = \begin{bmatrix} 1 & 1 \\ -2 & -2 \end{bmatrix}$. One row: $v_1 + v_2 = 0 \Rightarrow v^{(1)} = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$.
4. *Eigenvector for $\lambda_2 = -2$:* $A + 2I = \begin{bmatrix} 2 & 1 \\ -2 & -1 \end{bmatrix}$. One row: $2v_1 + v_2 = 0 \Rightarrow v^{(2)} = \begin{bmatrix} 1 \\ -2 \end{bmatrix}$.
5. *Verify once (cheap insurance):* $Av^{(1)} = \begin{bmatrix} -1 \\ -2+3 \end{bmatrix} = \begin{bmatrix} -1 \\ 1 \end{bmatrix} = -1 \cdot v^{(1)}$. ✓

Both eigenvalues negative ⇒ both modes decay like $e^{-t}$ and $e^{-2t}$. This is no random matrix: it is the state matrix of $y'' + 3y' + 2y = 0$, the exact system you will meet again in m5/state-space — where these two numbers *are* the stability verdict.

**Worked (engineering skin): can one torque steer both states?** Same $A$, input direction $B = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$ — a torque enters the rate equation only, never the angle directly. Kalman test by hand: $AB = \begin{bmatrix} 1 \\ -3 \end{bmatrix}$, so

$$[B \;\; AB] = \begin{bmatrix} 0 & 1 \\ 1 & -3 \end{bmatrix}, \qquad \det = 0\cdot(-3) - 1\cdot 1 = -1 \neq 0 \;\Rightarrow\; \text{rank } 2$$

Yes: the dynamics smear a rate-push into an angle-change one instant later, and the two push-directions span the plane. Now the cautionary flip: choose instead $B = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$ — an *eigenvector*. Then $AB = -B$: the echo lands on the same line, $[B \;\; AB]$ has parallel columns, rank 1. Pushing along an eigen-direction only ever moves you along that line — uncontrollable, no matter how hard you push. Eigenvectors and rank meet in one sentence.

**Worked (the rank ritual): rank of $M = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 1 & 1 & 1 \end{bmatrix}$.**

$$R_2 \leftarrow R_2 - 2R_1: \begin{bmatrix} 1 & 2 & 3 \\ 0 & 0 & 0 \\ 1 & 1 & 1 \end{bmatrix} \qquad R_3 \leftarrow R_3 - R_1: \begin{bmatrix} 1 & 2 & 3 \\ 0 & 0 & 0 \\ 0 & -1 & -2 \end{bmatrix}$$

Swap $R_2 \leftrightarrow R_3$ for tidiness: two nonzero rows ⇒ **rank 2**. Three visibly nonzero rows at the start, yet rank 2 — the middle row was the first one doubled, carrying no new information. Write the operation beside each arrow exactly as above; that annotation is where the marks sit.

## @misconceptions
- wrong: "A big determinant means big matrix entries — and det 0 means the matrix is nearly zero."
  tempting: "det is computed from the entries, so its size should track their size."
  correction: "det measures area scaling, which cares about the independence of the columns, not their magnitude. [[3,6],[2,4]] has healthy entries and det exactly 0 — its columns are parallel, so the whole plane collapses onto a line."
  probe: q-det-meaning
- wrong: "Each eigenvalue has exactly one eigenvector."
  tempting: "The textbook prints a single v next to each λ, which looks like uniqueness."
  correction: "If Av = λv then A(5v) = λ(5v) — any nonzero multiple works. Eigenvectors come as whole directions (lines through the origin). Exams accept any scaling; pick small integers and keep the arithmetic clean."
  probe: q-eigvec
- wrong: "A real 2×2 matrix always has two real eigenvalues."
  tempting: "Real entries in, real answers out — quadratics from physics usually cooperate."
  correction: "The characteristic polynomial is a quadratic, and quadratics may have a complex pair: [[0,1],[−1,0]] gives λ²+1 = 0, λ = ±j. A rotation leaves no real direction unturned. Complex pair = rotating/oscillating mode — Module 5 depends on reading it that way, not as an error."
  probe: q-complex-mode
- wrong: "Rank is the number of nonzero rows of the matrix as written."
  tempting: "Row-reduction ends by counting nonzero rows — why not count them before reducing?"
  correction: "Rows can repeat information without being visibly zero. [[1,2,3],[2,4,6],[1,1,1]] has three nonzero rows but rank 2: the second row is the first, doubled. Reduce first; count after."
  probe: q-rank

## @exam

**Where it appears:** never as a standalone question — always embedded inside Module 5 problems on the **Major**: (a) find the eigenvalues of a 2×2 state matrix to classify stability (2–3 marks inside an 8–12 mark question); (b) find eigenvectors for a phase portrait or a mode decomposition; (c) the Kalman rank tests $\mathrm{rank}[B \;\; AB] = 2$ and $\mathrm{rank}\begin{bmatrix} C \\ CA \end{bmatrix} = 2$ computed by hand; (d) a determinant to certify invertibility.

**The method that earns full marks:** (1) write $A - \lambda I$ explicitly — λ subtracted on the diagonal only; (2) invoke $\lambda^2 - \mathrm{tr}(A)\lambda + \det(A) = 0$ (compute tr and det on the side, in the open); (3) factor or use the quadratic formula, state both roots; (4) for each λ, write $A - \lambda I$ with numbers in it and solve **one row** for $v$; (5) verify one $Av = \lambda v$ by direct multiplication — ten seconds that catches most sign slips. For rank: annotate every row operation ($R_2 \leftarrow R_2 - 2R_1$), reduce to triangular form, count. For 2-state systems the controllability matrix is just $[B \;\; AB]$ — a 2×2 whose determinant settles the rank instantly.

**Traps that cost marks:** adding λ on the diagonal instead of subtracting; $\det = ad + bc$ (the minus sign on $bc$ is the most-lost half-mark in Module 5); dropping the $(-1)(-2)$ double negative in matrices like the worked example; claiming a rank "by inspection" with no row operations shown; normalizing eigenvectors into surds for no reason and then miscopying them; presenting $v = 0$ as an eigenvector (it never is).

## @interview

Interviewers probe whether the machinery means anything to you. One-liners worth owning: "What is a determinant, really? — the factor by which the matrix scales area; zero means it destroys a dimension, so no inverse." "Why do eigenvalues decide stability? — each eigen-direction evolves like $e^{\lambda t}$, so the state is a mix of exponentials whose exponents are the eigenvalues; one positive real part poisons the mix." "Why does the rank test work? — the columns of $[B \;\; AB]$ are the directions the input can push the state; full rank means those pushes span everything." "What does a complex eigenvalue pair mean? — the matrix rotates; the mode oscillates; the real part sets growth or decay."

## @history

"Eigen" is German for "own/characteristic" — an eigenvector is a matrix's *own* direction. The idea predates matrices themselves: Euler found the principal axes of a spinning rigid body (1750s) and Lagrange the fundamental frequencies of a vibrating string of masses — both are eigenvector computations done a century before the word existed. The problems that gave birth to eigenvalues were mode-finding problems in dynamics, which is exactly the use Module 5 puts them to. The determinant is older still, and the trace/det shortcut you will use in exams is a two-century-old piece of professional folklore.

## @summary

$$Av = v_1 \cdot \mathrm{col}_1 + v_2 \cdot \mathrm{col}_2 \qquad \det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc \qquad \lambda^2 - \mathrm{tr}(A)\lambda + \det(A) = 0$$

- **Matrix = machine:** columns are where the unit arrows land; every output is a mix of columns.
- **det = area scale.** det = 0 ⇔ plane collapses ⇔ not invertible ⇔ some nonzero vector is killed.
- **Eigen ritual:** $A - \lambda I$ → trace/det shortcut → factor → one row of $(A-\lambda I)v = 0$ per λ → verify one product.
- **Eigenvector scaling is free** — any nonzero multiple; small integers win.
- **Complex pair λ = σ ± jω:** rotation/oscillation; sign of σ = decay or growth (Module 5's stability read).
- **Rank ritual:** row-reduce with annotated operations, count nonzero rows after. Never before.
- **Kalman test (2-state):** $\mathrm{rank}[B \;\; AB] = 2$ ⇔ steerable everywhere; det of that 2×2 decides it.
- **Worked anchor:** $\begin{bmatrix} 0 & 1 \\ -2 & -3 \end{bmatrix}$: λ = −1, −2; v = [1,−1], [1,−2]; both modes decay.
