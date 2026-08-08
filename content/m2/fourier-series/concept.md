---
id: m2/fourier-series
title: "The Fourier series: every repeating signal is a chord"
short: Fourier series
module: 2
tier: core
hero: true
outcomes: [CO2]
prereqs: [m2/orthogonality, m1/periodicity]
aliases: ["fourier coefficients", "harmonics", "trigonometric series", "exponential fourier series", "spectrum"]
exam: { minor1: high, major: high, marks: "8–12", styles: [derive, compute, sketch] }
crosslinks:
  - { target: m2/fourier-transform, relation: "stretch the period to infinity and the series becomes the transform" }
  - { target: m2/gibbs, relation: "what truncating the series does at a jump — the famous 9% that never dies" }
  - { target: m1/even-and-odd, relation: "symmetry kills coefficient families before you integrate" }
---

## @intuition

Press a piano chord: one pressure wave reaches your ear — a single wiggly function of time. Yet you *hear* three distinct notes. Your cochlea performs, mechanically, the claim this concept makes mathematically: **any repeating signal is a sum of pure tones** — a fundamental plus its harmonics — and there is exactly one recipe of amplitudes and phases that builds it. The signal and its recipe are the same information in two languages.

---
@viz builder {"target":"square","n":1}
Start with one sine at the square wave's fundamental — a lumpy first draft. Add the 3rd harmonic (there is no 2nd — symmetry forbids it): the shoulders square up. Each added term is a *projection* being restored: the coefficient $b_k$ is not a trick formula, it is the inner product $\langle x, \sin k\omega_0 t\rangle$ from the orthogonality concept — how much of that pure tone the signal contains.

---
Crank $N$ upward and watch two stories at once. The waveform story: convergence everywhere except a stubborn ringing at the jumps (that's Gibbs — next concept). The spectrum story: click the stems — a square wave needs only odd harmonics, falling off as $1/k$. Switch to the triangle: $1/k^2$. **Smoothness ⇔ decay rate** is the deepest law on this screen: jumps cost you slow $1/k$ tails; each extra degree of smoothness buys another factor of $1/k$.

---
Shift the wave in time: the magnitude spectrum does not move — only phases tilt. Magnitude says *which ingredients*; phase says *how they line up*. Two signals with identical $|c_k|$ and scrambled phases can look wildly different in time — the ear barely notices, the oscilloscope certainly does.

## @definition

For $x(t)$ periodic with fundamental $\omega_0 = 2\pi/T_0$ (Dirichlet conditions: finitely many maxima/minima and discontinuities per period, absolutely integrable — every engineering signal qualifies):

**Exponential form** (the course workhorse):
$$x(t) = \sum_{k=-\infty}^{\infty} c_k\,e^{jk\omega_0 t}, \qquad c_k = \frac{1}{T_0}\int_{T_0} x(t)\,e^{-jk\omega_0 t}\,dt$$

**Trigonometric form:** $x = a_0 + \sum_{k\ge1} a_k\cos k\omega_0 t + b_k \sin k\omega_0 t$, with $a_0 = c_0$ (the average/DC), $a_k = 2\,\mathrm{Re}\,c_k$, $b_k = -2\,\mathrm{Im}\,c_k$. For real $x$: $c_{-k} = c_k^*$ (conjugate symmetry — the negative-frequency half carries no new information).

**Symmetry shortcuts:** even $x$ ⇒ $b_k = 0$ (cosines only); odd ⇒ $a_k = 0$ (sines only, no DC); half-wave symmetry $x(t - T_0/2) = -x(t)$ ⇒ even harmonics vanish.

At a jump, the series converges to the **midpoint** of the two limits.

## @derivation

### Step: The analysis formula is a projection, not a trick
?why: The exponentials are orthogonal over one period; inner-product with one basis vector isolates its coefficient.
$\int_{T_0} e^{jk\omega_0 t}e^{-jm\omega_0 t}dt = T_0$ if $k = m$, else $0$ (a full number of turns of a rotating phasor integrates to zero). So multiplying $x = \sum c_k e^{jk\omega_0 t}$ by $e^{-jm\omega_0 t}$ and integrating annihilates every term but the $m$-th: $c_m = \frac{1}{T_0}\int x\,e^{-jm\omega_0 t}dt$. This is the 2D dot-product picture from orthogonality, verbatim.

### Step: Worked from scratch — the square wave (the exam derivation)
?why: This exact computation, from the definition, appears on papers year after year.
$x = 1$ on $[0, T_0/2)$, $-1$ on $[T_0/2, T_0)$. Odd + half-wave symmetric ⇒ only odd-$k$ sines survive; declare this first (it halves the work and earns its own mark). For odd $k$:
$$b_k = \frac{2}{T_0}\int_0^{T_0} x\sin(k\omega_0 t)\,dt = \frac{4}{T_0}\int_0^{T_0/2}\sin(k\omega_0 t)\,dt = \frac{4}{k\omega_0 T_0}\left[1 - \cos(k\pi)\right] = \frac{4}{\pi k}$$
So $x(t) = \frac{4}{\pi}\left[\sin\omega_0 t + \tfrac13\sin 3\omega_0 t + \tfrac15\sin 5\omega_0 t + \cdots\right]$ — the most famous series in engineering.

### Step: Why smoothness controls decay
?why: Integration by parts trades one derivative of x for one factor of 1/k.
$c_k = \frac{1}{T_0}\int x\,e^{-jk\omega_0 t}dt = \frac{1}{jk\omega_0}\cdot\frac{1}{T_0}\int x'\,e^{-jk\omega_0 t}dt$ (boundary terms cancel by periodicity — if $x$ is continuous). Each legal integration by parts costs one derivative and buys one $1/k$. Jumps stop the first trade ⇒ $1/k$; continuous-with-corner allows one ⇒ $1/k^2$; and so on. The spectrum's tail is a smoothness meter.

## @examples

**Worked (exam pattern — half-rectified sine):** $x = \sin(\omega_0 t)$ for the positive half-cycle, 0 for the negative. No symmetry ⇒ both families can appear. Computing (pattern-3 integrals from the toolkit): $c_0 = 1/\pi$, $b_1 = 1/2$, even cosines $a_k = \frac{-2}{\pi(k^2-1)}$ for even $k$, all odd harmonics beyond $k{=}1$ vanish. The DC term $1/\pi$ is why this circuit (a half-wave rectifier) converts AC toward DC — the series explains the power supply.

**Worked (spectrum sketch):** for the $4/\pi k$ square-wave series, sketch $|c_k|$: stems at $\pm\omega_0, \pm3\omega_0, \ldots$ of height $2/\pi k$ (halved: each real sine splits across $\pm k$). Exams ask for labeled stems — height AND position, both marked.

**Reading a spectrum backwards:** a spectrum with stems at $k = 0, \pm 2, \pm 4$ only ⇒ the time signal has period $T_0/2$ disguised as $T_0$ — spotting "the fundamental is missing" saves whole sub-questions.

## @misconceptions
- wrong: "The Fourier series is an approximation of the signal."
  tempting: "You always plot partial sums, which visibly miss."
  correction: "The INFINITE series equals the signal (at continuity points; midpoint at jumps). Only truncations approximate. 'Equals' is what makes coefficient-matching arguments legal on exams."
- wrong: "Negative frequencies are physical nonsense."
  tempting: "What would a −50 Hz wave even be?"
  correction: "For real signals, c₋ₖ = cₖ* — the negative half mirrors the positive: bookkeeping that lets exponentials replace sin/cos pairs. Nothing spins backwards; two conjugate phasors sum to one real cosine."
- wrong: "Time reversal conjugates the coefficients."
  tempting: "Reversal 'flips' things, conjugation 'flips' complex numbers."
  correction: "x(−t) ↔ c₋ₖ in general; ONLY for real signals does c₋ₖ equal cₖ*. Quote the general rule first, the real-signal corollary second — papers dock the shortcut."
- wrong: "More terms fix the overshoot at a jump."
  tempting: "Convergence should mean everything improves."
  correction: "The Gibbs overshoot narrows but its HEIGHT (~9%) never shrinks. Full story next concept — for now: convergence at a point ≠ uniform convergence near a jump."

## @exam

The single most reliable Minor I long question (8–12 marks): derive the FS of a square/sawtooth/half-rectified wave *from the definition*. Full-marks ritual: (1) sketch the signal, state $T_0, \omega_0$; (2) DECLARE the symmetry and which families die (marks live here); (3) set up the coefficient integral with explicit limits; (4) execute (toolkit patterns); (5) write the final series with three explicit terms + general term; (6) state midpoint convergence if there are jumps. Also common: Parseval power computations from given $c_k$ (power form $P = \sum|c_k|^2$), and spectrum sketching. Trap: forgetting the $\frac{1}{T_0}$ in the analysis formula, and mixing up $a_k \leftrightarrow 2\mathrm{Re}\,c_k$ conversions.

## @summary

$$c_k = \frac{1}{T_0}\int_{T_0} x\,e^{-jk\omega_0 t}dt \qquad x = \sum_k c_k e^{jk\omega_0 t} \qquad P = \sum_k |c_k|^2$$

- Real $x$: $c_{-k} = c_k^*$; trig form: $a_k = 2\mathrm{Re}\,c_k$, $b_k = -2\mathrm{Im}\,c_k$, $a_0 = c_0$ = average.
- Symmetry: even ⇒ cosines; odd ⇒ sines; half-wave ⇒ odd harmonics only. Declare before integrating.
- Square wave: $\frac{4}{\pi}\sum_{k \text{ odd}}\frac{\sin k\omega_0 t}{k}$. Jumps ⇒ $1/k$ decay; corners ⇒ $1/k^2$; smoothness ⇔ decay.
- Jumps converge to midpoints; time shift tilts phases only; $|c_k|$ is shift-invariant.
- Dirichlet conditions: every lab signal qualifies — cite them, don't fear them.
