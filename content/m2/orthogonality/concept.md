---
id: m2/orthogonality
title: "Orthogonality: giving signals coordinates — projections, recipes, and amounts that never change"
short: Orthogonality
module: 2
tier: core
hero: false
outcomes: [CO2]
prereqs: [primers/complex-numbers]
aliases: ["inner product", "projection", "orthogonal functions", "orthonormal set", "basis functions", "best approximation", "generalized fourier series", "signal space"]
exam: { minor1: medium, major: medium, marks: "4–8", styles: [compute, derive, conceptual] }
crosslinks:
  - { target: m2/fourier-series, relation: "every Fourier coefficient formula is exactly this projection recipe applied to the harmonic family" }
  - { target: m2/walsh-hadamard, relation: "the same recipe with ±1 switch patterns in place of sinusoids" }
  - { target: m1/even-and-odd, relation: "even and odd parts are orthogonal components — their energies add cleanly" }
  - { target: m1/energy-and-power, relation: "the squared length of a signal in this geometry is precisely its energy" }
---

## @intuition

A weather buoy records a wobbly pressure waveform and must radio it to shore over a link that can afford only a handful of numbers per second. The fix every engineer reaches for: agree in advance on a kit of standard waveforms, and transmit just the *amounts* — "3.0 of the first, −1.2 of the second, 0.4 of the third." Two questions decide whether this scheme works. How do you measure each amount honestly? And if you later upgrade to a bigger kit, must all the old amounts be recomputed?

---

You already know the answer in two dimensions. Any arrow is described by two numbers — its east amount and its north amount — and you find each by dropping a shadow onto that axis: a **projection**. The magic is independence: because east and north are perpendicular, the east shadow does not care how much north the arrow contains. Tilt the axes so they are no longer perpendicular and this breaks — the two amounts become entangled, and adding a third axis forces you to re-solve for all of them at once.

---

Now the bridge. A signal is a vector with a component at every instant: instead of two entries (east, north) it has the value $x(t)$ for a continuum of times $t$. Every vector operation survives the upgrade if you replace "sum over components" with "integral over time." The dot product $\sum_i x_i y_i$ becomes the **inner product** $\langle x, y\rangle = \int x(t)\,y(t)\,dt$; squared length becomes $\int x^2\,dt$ — which you already know by another name: **energy**.

---

Can two functions that overlap everywhere really be "perpendicular"? Yes — orthogonality is a statement about *signed area*, not about staying out of each other's way. Multiply $\sin t$ by $\cos t$ and integrate over a full period: every patch of positive area is cancelled by a matching negative patch — total zero. Same for $\sin t$ against $\sin 2t$. The harmonic family is a set of mutually perpendicular axes living inside function space, and it is far from the only such kit.

---

Everything else falls out of the geometry. The honest amount of $\varphi$ inside $x$ is the shadow formula $c = \langle x,\varphi\rangle / \langle \varphi,\varphi\rangle$ — and this choice makes the leftover error *perpendicular to every axis you used*, which is exactly what "best possible approximation" means in the energy sense. Independence comes free: since perpendicular axes don't lean on each other, each amount is computed once and is final. Upgrading the kit from 3 waveforms to 300 never touches the first three coefficients.

## @definition

For real signals on an interval $[t_1, t_2]$, the **inner product** is

$$\langle x, y\rangle = \int_{t_1}^{t_2} x(t)\,y(t)\,dt$$

For complex-valued signals the second signal is conjugated,

$$\langle x, y\rangle = \int_{t_1}^{t_2} x(t)\,y^*(t)\,dt,$$

so that $\langle x,x\rangle = \int_{t_1}^{t_2} |x(t)|^2 dt$ — the signal's **energy** on the interval — is always real and non-negative. We write $\lVert x\rVert^2 = \langle x,x\rangle$ for this squared length.

A set of signals $\{\varphi_1, \varphi_2, \dots\}$ is **orthogonal on $[t_1,t_2]$** if $\langle \varphi_m, \varphi_n\rangle = 0$ whenever $m \neq n$, and **orthonormal** if additionally every $\lVert\varphi_n\rVert^2 = 1$.

**Projection coefficients.** Approximating $x \approx \hat{x} = \sum_{n=1}^{N} c_n \varphi_n$ with minimum error energy requires

$$c_n = \frac{\langle x, \varphi_n\rangle}{\langle \varphi_n, \varphi_n\rangle} = \frac{\int_{t_1}^{t_2} x(t)\,\varphi_n^*(t)\,dt}{\int_{t_1}^{t_2} |\varphi_n(t)|^2\,dt}$$

and the minimum error energy is $E_N = \lVert x\rVert^2 - \sum_{n=1}^N |c_n|^2 \lVert \varphi_n\rVert^2$.

**Reading the symbols:** $\langle x, \varphi_n\rangle$ measures agreement — how much signed area $x$ shares with $\varphi_n$. The divisor $\langle\varphi_n,\varphi_n\rangle$ is a units-fixer: it converts "raw agreement" into "how many copies of $\varphi_n$," and equals 1 only for orthonormal sets. The conjugate $(\cdot)^*$ does nothing for real signals but is mandatory for complex ones — it is what makes self-agreement come out as energy.

**Exam conventions:** orthogonality is a property of the pair *and the interval* — always state the interval. Mahindra problems mostly use real signals on one period; the conjugate becomes load-bearing the moment $e^{jk\omega_0 t}$ enters (next concepts).

## @derivation

The whole concept is one optimization problem, solved with 10+2 algebra: a parabola's vertex.

### Step: Pose the best-approximation problem
?why: "Best" needs a yardstick — we measure mismatch by error energy, the natural squared distance in signal space.
Approximate $x$ by $c\,\varphi$ (one real basis signal, one unknown amount). The error energy as a function of $c$:
$$E(c) = \int_{t_1}^{t_2} \big(x(t) - c\,\varphi(t)\big)^2\,dt$$

### Step: Expand — error energy is a parabola in c
?why: the inner product distributes over sums exactly like the dot product it generalizes.
$$E(c) = \lVert x\rVert^2 - 2c\,\langle x,\varphi\rangle + c^2 \lVert\varphi\rVert^2$$
An upward-opening parabola in $c$: there is exactly one best amount.

### Step: Minimize at the vertex
?why: the vertex of ac² + bc + d sits at c = −b/(2a) — no calculus required.
$$c^\star = \frac{\langle x, \varphi\rangle}{\lVert \varphi\rVert^2}, \qquad E_{\min} = \lVert x\rVert^2 - \frac{\langle x,\varphi\rangle^2}{\lVert\varphi\rVert^2}$$
The best amount of $\varphi$ inside $x$ is the projection formula. (For complex signals, minimizing $\int |x - c\varphi|^2$ gives the same formula with the conjugated inner product.)

### Step: The error is orthogonal to the axis
?why: substitute c★ and watch the agreement cancel — the geometric picture is the foot of a perpendicular.
$$\langle x - c^\star\varphi,\ \varphi\rangle = \langle x,\varphi\rangle - c^\star\lVert\varphi\rVert^2 = 0$$
The residue has *nothing left in common* with $\varphi$ — if it did, you could improve the fit, so you weren't at the minimum. "Best approximation" and "error ⊥ approximation" are the same statement.

### Step: Many axes — orthogonality decouples the fit
?why: expanding the N-term error energy, every cross term ⟨φₘ,φₙ⟩ with m ≠ n dies by orthogonality.
$$E(c_1,\dots,c_N) = \lVert x\rVert^2 + \sum_{k=1}^{N}\Big(c_k^2\lVert\varphi_k\rVert^2 - 2c_k\langle x,\varphi_k\rangle\Big)$$
The joint problem splits into $N$ independent one-variable parabolas — each $c_k$ solves its own, giving the same formula as before. Two consequences: **adding axes never changes earlier coefficients**, and substituting the optima gives $E_N = \lVert x\rVert^2 - \sum_k |c_k|^2\lVert\varphi_k\rVert^2$, so each new orthogonal term can only reduce the error.

### Step: Notice what was NOT assumed
?why: this is why the recipe becomes Fourier series, Walsh transforms, and half of communications theory.
Nothing said the $\varphi_k$ are sinusoids. Any orthogonal family works: harmonics (Fourier, two concepts ahead), ±1 switch patterns (Walsh, next), and many others. And if the family is *not* orthogonal, the cross terms survive: the coefficients couple into simultaneous equations and every added term re-opens the whole fit. Orthogonality is the entry ticket to independent, final, one-at-a-time coefficients.

## @examples

**Worked, exam style: project $x(t)=t$ onto sines on $[-\pi,\pi]$.** Kit: $\varphi_1 = \sin t$, $\varphi_2 = \sin 2t$.

1. *Orthogonality check (the ritual):* product-to-sum, then integrate over the stated interval:
$$\langle \varphi_1,\varphi_2\rangle = \int_{-\pi}^{\pi} \sin t \sin 2t \,dt = \tfrac12\int_{-\pi}^{\pi} (\cos t - \cos 3t)\,dt = 0$$
2. *Norms:* $\lVert\sin t\rVert^2 = \int_{-\pi}^{\pi} \tfrac{1-\cos 2t}{2} dt = \pi$, and likewise $\lVert\sin 2t\rVert^2 = \pi$.
3. *Coefficients (integration by parts):* $\int_{-\pi}^{\pi} t\sin t\,dt = 2\pi \Rightarrow c_1 = 2\pi/\pi = 2$; $\int_{-\pi}^{\pi} t\sin 2t\,dt = -\pi \Rightarrow c_2 = -1$.
4. *Best two-term fit:* $\hat{x}(t) = 2\sin t - \sin 2t$. Error energy: $\lVert t\rVert^2 = 2\pi^3/3 \approx 20.7$; after one term $20.7 - 4\pi \approx 8.1$; after two, $\approx 5.0$. Note $c_1$ did not move when $\varphi_2$ joined — and these are *exactly* the first two Fourier series terms of the sawtooth you will meet two concepts from now. Nothing there will be new.

**Worked: two signals share one wire (correlator receiver).** Transmitter A sends $3\sin t$, transmitter B sends $-2\sin 2t$, simultaneously, on the same wire: the receiver sees only the sum $r(t) = 3\sin t - 2\sin 2t$ on $[-\pi,\pi]$. Receiver A computes $\langle r, \sin t\rangle/\pi = 3$; receiver B computes $\langle r, \sin 2t\rangle/\pi = -2$. Each number recovered exactly, zero crosstalk, no time-sharing — orthogonality is the multiplexer. This is the germ of CDMA; the next concept makes it digital.

**Worked: even ⊥ odd — energy Pythagoras.** Take $x(t) = 1 + t$ on $[-1,1]$: even part $x_e = 1$, odd part $x_o = t$. Their inner product $\int_{-1}^{1} t\,dt = 0$ — automatic, because (even)×(odd) is odd and the interval is symmetric. So the energies must add like perpendicular legs: $E = \int_{-1}^{1}(1+t)^2 dt = \tfrac83$, and indeed $E_e + E_o = 2 + \tfrac23 = \tfrac83$. The even/odd split from Module 1 was your first orthogonal decomposition — you just didn't have the word yet.

## @misconceptions
- wrong: "To find N coefficients you must solve N simultaneous equations, and they all change when N grows."
  tempting: "Fitting several unknowns at once usually couples them — that is how ordinary curve fitting behaves."
  correction: "With an orthogonal kit the cross terms vanish and the fit splits into N independent one-variable problems: each coefficient is ⟨x,φₖ⟩/⟨φₖ,φₖ⟩, computed once, final forever. Coupled equations are the signature of a NON-orthogonal family."
  probe: q-independent
- wrong: "Orthogonal functions must avoid each other — where one is nonzero the other is zero."
  tempting: "Perpendicular streets don't share pavement, so perpendicular signals shouldn't share time."
  correction: "sin t and sin 2t overlap at almost every instant yet are orthogonal: what cancels is the signed area of their product. Disjoint support is one (rare) way to be orthogonal; cancellation is the common one."
  probe: q-meaning
- wrong: "The coefficient is just cₙ = ∫ x φₙ dt."
  tempting: "Most textbook examples quietly use orthoNORMAL sets, where the divisor is 1 and invisible."
  correction: "Divide by ⟨φₙ,φₙ⟩. For sin kω₀t over one period that divisor is T/2 — the very factor that will become the famous 2/T in the Fourier coefficient formulas. Forgetting it scales every answer."
- wrong: "For complex signals ⟨x,y⟩ = ∫ x y dt works fine."
  tempting: "Why complicate a working formula with a conjugate?"
  correction: "Without the conjugate, x(t) = e^{jt} has ⟨x,x⟩ = ∫e^{2jt}dt = 0 over a period — a nonzero signal with zero length, and the whole geometry collapses. The conjugate makes ⟨x,x⟩ = ∫|x|² = energy. It is also exactly where the minus sign in e^{−jkω₀t} of Fourier analysis comes from."

## @exam

**Where it appears:** Minor I directly (short derivations and computations, 4–8 marks), and silently inside *every* Fourier series question on Minor I and the Major — the coefficient formulas are graded as applications of this recipe.

**Typical asks:** (a) verify that a given pair/set is orthogonal on a given interval; (b) find the best coefficients approximating a given $x$ and write the approximation; (c) compute the error energy $E_N$; (d) one conceptual line: "why do the coefficients not change when more terms are added?"

**The method that earns full marks:** (1) write the inner product with the *stated interval* as explicit limits; (2) convert products of sinusoids by product-to-sum identities before integrating; (3) integrate and show the cancellation, don't just assert it; (4) divide by the norm $\lVert\varphi\rVert^2$ — compute it, don't guess it; (5) for error energy, use $E_N = \lVert x\rVert^2 - \sum |c_k|^2\lVert\varphi_k\rVert^2$ rather than re-integrating the residual.

**Traps that cost marks:** orthogonality claimed without the interval (sin t and sin 2t are orthogonal on a full period but $\int_0^{\pi/2}\sin t\sin 2t\,dt = \tfrac23 \neq 0$); the missing norm divisor; treating "orthogonal" as "product is zero everywhere"; dropping the conjugate once signals go complex; quoting $E_N$ with a plus sign.

## @interview

Interviewers use this as a geometry probe: "Why does anyone care about orthogonal bases? — coefficients decouple: each one is a projection, computed independently, final under refinement." "What is a Fourier coefficient, geometrically? — the shadow of the signal on one harmonic axis." "Why the conjugate in the complex inner product? — so self-inner-product is energy: real, non-negative." "What characterizes the best L² approximation? — the error is orthogonal to everything you used; best fit and perpendicular residual are one fact." If you can draw the 2-D foot-of-perpendicular picture and say "now let the arrows be functions," you own the question.

## @summary

$$\langle x,y\rangle = \int_{t_1}^{t_2} x\,y^*\,dt \qquad \lVert x\rVert^2 = \langle x,x\rangle = \text{energy on } [t_1,t_2]$$

$$c_n = \frac{\langle x,\varphi_n\rangle}{\langle\varphi_n,\varphi_n\rangle} \qquad E_N = \lVert x\rVert^2 - \sum_{n=1}^{N}|c_n|^2\lVert\varphi_n\rVert^2$$

- **Orthogonal set:** $\langle\varphi_m,\varphi_n\rangle = 0$ for $m\neq n$ — a property of the pair *and the interval*.
- **Orthogonality = signed-area cancellation**, not disjoint support.
- **Best fit = projection**; error ⊥ every used axis; each added orthogonal term can only lower $E_N$.
- **Coefficients are final:** enlarging an orthogonal kit never changes earlier coefficients.
- **Norms worth memorizing (one period $T$):** $\lVert\sin k\omega_0 t\rVert^2 = \lVert\cos k\omega_0 t\rVert^2 = T/2$; $\lVert 1\rVert^2 = T$; $\langle e^{jk\omega_0 t}, e^{jm\omega_0 t}\rangle = T$ if $k=m$, else $0$.
- **Even ⊥ odd** on symmetric intervals: $E = E_e + E_o$ — Pythagoras for signals.
