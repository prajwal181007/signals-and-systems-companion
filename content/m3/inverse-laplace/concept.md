---
id: m3/inverse-laplace
title: "Inverse Laplace: partial fractions turn any transform into a shopping list of modes"
short: Inverse Laplace
module: 3
tier: core
hero: false
outcomes: [CO3]
prereqs: [primers/partial-fractions, m3/roc]
aliases: ["partial fraction expansion", "Heaviside cover-up", "cover-up method", "residues", "table lookup", "inversion", "repeated poles", "long division", "L inverse"]
exam: { minor2: high, major: high, marks: "6–10", styles: [compute] }
crosslinks:
  - { target: m3/transfer-function, relation: "the residues you compute here become the mode weights of h(t)" }
  - { target: m3/solving-odes, relation: "inversion is the last step of every Laplace ODE solution" }
  - { target: m3/inverse-z, relation: "the same partial-fraction ritual, with the table swapped for z-pairs" }
  - { target: primers/partial-fractions, relation: "the algebra engine this concept runs on" }
---

## @intuition

Your Laplace analysis of a switched circuit ends in triumph — and in a fraction of two polynomials. But the deliverable is a waveform: what the oscilloscope will draw after the switch closes. There *is* an official inversion formula; it is a contour integral in the complex plane that no engineer computes at a desk and no exam ever asks for. The working route home is different: shatter the fraction into standard pieces, recognize each piece on a small table, write down the answer. Ten lines of algebra replace a course in complex analysis.

---
@viz modes {"preset":"overdamped","k":1}
The payoff is more than a technique — it is a worldview. Every rational transform is secretly a short shopping list: one exponential "mode" per pole, each purchased in a definite amount. The system beside you has two real poles, so its response is exactly two decaying exponentials, nothing else. Partial fractions is the itemized receipt; the numbers it produces — the **residues** — are the quantities of each mode.

---
@viz modes {"preset":"resonator","k":1}
Drag a pole and watch its mode change shape in real time: further left, faster decay. Now look at a *complex pair* of poles: together they buy one damped cosine — a decaying oscillation whose frequency is the pole's height and whose decay is the pole's distance into the left half plane. Two bookkeeping routes reach it (real quadratic, or complex residues); both must land on the same real waveform.

---
What if two poles collide? Slide them together in your head: the receipt says "so much of $e^{p_1 t}$, minus almost the same amount of $e^{p_2 t}$" — two huge, nearly cancelling terms. Their difference quotient survives the collision, and out comes $t\,e^{pt}$: not a new species, just the limit of two exponentials merging. That is the whole mystery of repeated poles.

---
One gatekeeper before any of this: the table only lists fractions whose numerator degree is *below* the denominator's. If yours isn't, part of the signal is impulse-like — long division peels that part off first, and only the remainder goes to partial fractions. Degree check first, always.

## @definition

**The inversion strategy** (this course, exams included): for rational $F(s)$, expand into partial fractions and invert term-by-term with the table. Linearity makes this legal: $\mathcal{L}^{-1}$ of a sum is the sum of the inverses.

**The table** (right-sided/causal forms — the exam default):

$$\frac{1}{s+a} \leftrightarrow e^{-at}u(t) \qquad \frac{1}{(s+a)^2} \leftrightarrow t\,e^{-at}u(t) \qquad \frac{n!}{(s+a)^{n+1}} \leftrightarrow t^n e^{-at}u(t)$$

$$\frac{s+a}{(s+a)^2+\omega^2} \leftrightarrow e^{-at}\cos(\omega t)\,u(t) \qquad \frac{\omega}{(s+a)^2+\omega^2} \leftrightarrow e^{-at}\sin(\omega t)\,u(t) \qquad 1 \leftrightarrow \delta(t)$$

**Distinct real poles.** If $F(s) = N(s)/\prod_i (s-p_i)$ is strictly proper with distinct $p_i$, then $F(s) = \sum_i A_i/(s-p_i)$ with residues by the **cover-up method**:

$$A_i = \left[(s-p_i)\,F(s)\right]_{s=p_i}$$

— cover the factor $(s-p_i)$ with a finger and evaluate what remains at $s = p_i$.

**Repeated pole of order 2.** $F$ contains $\dfrac{B_1}{s-p} + \dfrac{B_2}{(s-p)^2}$; cover-up at full order gives $B_2 = [(s-p)^2 F(s)]_{s=p}$, but $B_1$ needs the derivative $B_1 = \frac{d}{ds}[(s-p)^2 F(s)]_{s=p}$ or coefficient matching.

**Complex pair, two routes.** Route A (real arithmetic): keep the irreducible quadratic, complete the square, split the numerator to match the $\cos$/$\sin$ rows. Route B (complex residues): treat the poles $p = -a \pm j\omega$ like distinct poles; the residues come out conjugate, $A$ and $A^*$, and the pair recombines as $2|A|\,e^{-at}\cos(\omega t + \angle A)\,u(t)$.

**Improper $F$** ($\deg N \ge \deg D$): long-divide first. The polynomial part inverts to impulses ($1 \leftrightarrow \delta(t)$, $s \leftrightarrow \delta'(t)$); only the strictly proper remainder is partial-fractioned.

**Reading the symbols:** $p_i$ are the poles — *where* the denominator dies, hence which modes exist; $A_i$ are the residues — *how much* of each mode; $u(t)$ appears on every table row because we chose the ROC to the right of the rightmost pole. That last point is a convention, not a law: exams use the unilateral transform, so signals are right-sided and $u(t)$ is automatic — but the same $F(s)$ with a left-sided ROC inverts to $-e^{-at}u(-t)$ forms. State the ROC (or the causality assumption) and the ambiguity vanishes.

## @derivation

The method rests on three small facts: partial fractions exist, cover-up computes them, and colliding poles create $t\,e^{pt}$.

### Step: Every strictly proper rational F splits into simple terms
?why: Polynomial algebra (the partial-fractions primer) — no transform theory needed.
For distinct poles,
$$F(s) = \frac{N(s)}{(s-p_1)(s-p_2)\cdots(s-p_n)} = \frac{A_1}{s-p_1} + \frac{A_2}{s-p_2} + \cdots + \frac{A_n}{s-p_n}$$
This identity holds for *all* $s$ — which is exactly what the next step exploits.

### Step: Cover-up falls out by multiplying and taking a limit
?why: Multiplying an identity by (s−p₁) preserves it; evaluating at s = p₁ kills every other term.
Multiply both sides by $(s-p_1)$:
$$(s-p_1)F(s) = A_1 + (s-p_1)\left[\frac{A_2}{s-p_2} + \cdots\right]$$
Let $s \to p_1$: the bracket's factor $(s-p_1)$ vanishes, leaving $A_1 = [(s-p_1)F(s)]_{s=p_1}$. "Cover the factor, plug in the pole" is this limit performed by hand.

### Step: Each simple term is one table row
?why: Direct computation of the forward transform, valid in the ROC Re{s} > Re{p}.
$$\mathcal{L}\{e^{pt}u(t)\} = \int_{0^-}^{\infty} e^{pt}e^{-st}\,dt = \frac{1}{s-p}$$
So $A_i/(s-p_i) \leftrightarrow A_i\,e^{p_i t}u(t)$, and by linearity $f(t) = \sum_i A_i e^{p_i t}\,u(t)$: modes weighted by residues.

### Step: Complex pairs recombine into one real cosine
?why: Real F(s) forces conjugate poles to carry conjugate residues; conjugate terms sum to twice the real part.
With $p = -a + j\omega$, residue $A$, the pair contributes
$$A e^{pt} + A^* e^{p^* t} = 2\,\mathrm{Re}\{A e^{(-a+j\omega)t}\} = 2|A|\,e^{-at}\cos(\omega t + \angle A)$$
Route A (completing the square) is the same result reached without touching complex numbers — use whichever is faster for you, they cannot disagree.

### Step: Collide two poles and watch t·e^{pt} appear
?why: The repeated-pole table row is the limit of the distinct-pole formula, not a separate axiom.
$$\frac{1}{(s-p)(s-p-\epsilon)} = \frac{1}{\epsilon}\left[\frac{1}{s-p-\epsilon} - \frac{1}{s-p}\right] \;\leftrightarrow\; \frac{e^{(p+\epsilon)t} - e^{pt}}{\epsilon} = e^{pt}\,\frac{e^{\epsilon t}-1}{\epsilon} \;\xrightarrow{\epsilon \to 0}\; t\,e^{pt}$$
Two nearly identical exponentials, weighted huge and opposite, leave behind their difference quotient — the derivative with respect to the pole location. That is why $t^n$ factors accompany repeated poles.

### Step: Notice what was NOT assumed
?why: The ROC — not the algebra — decides which time function you write.
Nothing above forced right-sidedness. $\frac{1}{s+1}$ with ROC $\mathrm{Re}\{s\} > -1$ is $e^{-t}u(t)$; the *same expression* with ROC $\mathrm{Re}\{s\} < -1$ is $-e^{-t}u(-t)$. Exams sidestep this by working unilaterally (right-sided by construction) — but when a problem states an ROC, honor it.

## @examples

**Worked (exam standard): distinct real poles.** Invert $F(s) = \dfrac{s+3}{s^2+3s+2}$.

1. *Degree check:* $1 < 2$, strictly proper — no division needed.
2. *Factor:* $s^2+3s+2 = (s+1)(s+2)$; poles $-1, -2$.
3. *Cover-up:* $A = \left[\dfrac{s+3}{s+2}\right]_{s=-1} = \dfrac{2}{1} = 2$; $\quad B = \left[\dfrac{s+3}{s+1}\right]_{s=-2} = \dfrac{1}{-1} = -1$.
4. *Table:* $F(s) = \dfrac{2}{s+1} - \dfrac{1}{s+2} \;\Rightarrow\; f(t) = \left(2e^{-t} - e^{-2t}\right)u(t)$.
5. *Check:* $f(0^+) = 2 - 1 = 1$, and $\lim_{s\to\infty} sF(s) = 1$ — endpoints agree (that is the IVT, coming two concepts from now).

**Worked (engineering skin): a ringing RLC — complex pair, both routes.** A series RLC measurement gives $F(s) = \dfrac{s+3}{s^2+2s+5}$. Poles: $s = -1 \pm 2j$ — the circuit rings at $2$ rad/s while decaying like $e^{-t}$.

*Route A — real quadratic.* Complete the square: $s^2+2s+5 = (s+1)^2 + 2^2$. Rewrite the numerator around $(s+1)$: $s + 3 = (s+1) + 2$. Then
$$F(s) = \frac{s+1}{(s+1)^2+2^2} + \frac{2}{(s+1)^2+2^2} \;\Rightarrow\; f(t) = e^{-t}\left(\cos 2t + \sin 2t\right)u(t)$$

*Route B — complex residues.* Cover-up at $p = -1+2j$:
$$A = \left[\frac{s+3}{s-(-1-2j)}\right]_{s=-1+2j} = \frac{2+2j}{4j} = \frac{1-j}{2}, \qquad |A| = \tfrac{1}{\sqrt{2}},\; \angle A = -\tfrac{\pi}{4}$$
$$f(t) = 2|A|\,e^{-t}\cos(2t + \angle A)\,u(t) = \sqrt{2}\,e^{-t}\cos\!\left(2t - \tfrac{\pi}{4}\right)u(t)$$
The two answers are the same waveform ($\cos 2t + \sin 2t = \sqrt{2}\cos(2t - \pi/4)$) — a free error check when you have time, and a choice of weapon when you don't. Route A avoids complex arithmetic entirely; Route B generalizes to any number of pairs.

**Worked (full ritual): improper + repeated pole.** Invert $F(s) = \dfrac{s^3+3s^2+3s+2}{s(s+1)^2}$.

1. *Degree check:* $3 = 3$ — improper. Long-divide by $s^3+2s^2+s$: quotient $1$, remainder $s^2+2s+2$:
$$F(s) = 1 + \frac{s^2+2s+2}{s(s+1)^2}$$
2. *Expand the remainder:* $\dfrac{s^2+2s+2}{s(s+1)^2} = \dfrac{A}{s} + \dfrac{B_1}{s+1} + \dfrac{B_2}{(s+1)^2}$.
3. *Cover-up where it works:* $A = \left[\dfrac{s^2+2s+2}{(s+1)^2}\right]_{s=0} = 2$; $\quad B_2 = \left[\dfrac{s^2+2s+2}{s}\right]_{s=-1} = \dfrac{1-2+2}{-1} = -1$.
4. *The remaining coefficient by matching:* $s^2$ coefficients of $s^2+2s+2 = A(s+1)^2 + B_1 s(s+1) + B_2 s$ give $1 = A + B_1 \Rightarrow B_1 = -1$. (Or the derivative rule: $\frac{d}{ds}\big[\frac{s^2+2s+2}{s}\big]_{s=-1} = \big[1 - \frac{2}{s^2}\big]_{s=-1} = -1$ — same.)
5. *Table:* $f(t) = \delta(t) + \left(2 - e^{-t} - t\,e^{-t}\right)u(t)$.
The quotient $1$ became an impulse; the double pole delivered its $t\,e^{-t}$; cover-up did most of the work, but *only* the top-order coefficient of the repeated pole — that is where marks are routinely lost.

## @misconceptions
- wrong: "Since s-domain multiplication is time-domain convolution, 1/((s+1)(s+2)) inverts to the product e^{-t}·e^{-2t}."
  tempting: "The factored form looks like two transforms multiplied, so the answer should be the two time functions multiplied."
  correction: "Multiplication in s IS convolution in t — which is exactly why you don't invert factor-by-factor. Partial fractions converts the product into a SUM, and sums invert term-by-term: e^{-t} − e^{-2t}, not e^{-3t}."
  probe: q-conv-bridge
- wrong: "Cover-up gives every coefficient, even at a repeated pole."
  tempting: "It worked for every distinct pole, and (s+1)² is right there to cover."
  correction: "Covering (s+1)² yields only the HIGHEST-order coefficient B₂. The lower one, B₁, needs the derivative formula or coefficient matching — cover-up at first order would divide by zero if you tried it honestly."
- wrong: "Partial fractions can be applied to any rational F(s) directly."
  tempting: "The expansion machinery never visibly complains — you just get equations for the coefficients."
  correction: "The expansion theorem requires STRICTLY proper F. If deg N ≥ deg D, divide first; the quotient inverts to δ(t) (and derivatives), and skipping the division silently corrupts every residue. Degree check is step zero."
  probe: q-firstmove
- wrong: "Complex residues mean I made an arithmetic mistake — answers must be real."
  tempting: "A physical waveform can't be complex, so complex numbers midway feel like a wrong turn."
  correction: "Conjugate poles always carry conjugate residues, and the pair recombines into the real signal 2|A|e^{-at}cos(ωt+∠A). Complex numbers in the middle, real waveform at the end — every time, if F(s) has real coefficients."

## @exam

**Where it appears:** Minor II and the Major, essentially guaranteed — either standalone ("find $f(t)$ for the following $F(s)$", 6–10 marks) or as the closing step of every ODE/circuit problem in this module. Variants: distinct real, one complex pair, one repeated pole, occasionally improper.

**The method that earns full marks:** (1) degree check — divide if improper, and say so; (2) factor the denominator completely, list poles; (3) cover-up every distinct real pole and the top order of each repeated pole; (4) remaining repeated-pole coefficients by matching or derivative; (5) complex pairs by completing the square (fastest by hand) or conjugate residues; (6) table lookup, $u(t)$ on every term; (7) sanity check $f(0^+)$ against $\lim_{s\to\infty} sF(s)$.

**Traps that cost marks:** forgetting long division (corrupts *all* residues); cover-up applied to the first-order coefficient of a repeated pole; sign slips in $e^{-at}$ (a pole at $s=-2$ gives $e^{-2t}$, not $e^{2t}$); dropping $u(t)$ (loses the causality mark); in Route B, quoting $\angle A$ in the wrong quadrant — compute it from the real/imaginary parts, not blindly from $\tan^{-1}$; writing the $\sin$ row's numerator without matching $\omega$ (a numerator $2$ over $(s+1)^2+4$ is $1\cdot$the $\sin 2t$ row, because the row needs $\omega = 2$ upstairs).

## @interview

One-liners worth owning: "Inversion in practice is partial fractions plus a six-row table — the Bromwich contour integral is the definition, not the method." "Poles say *which* modes exist; residues say *how much* of each — inversion is reading the system's recipe." "Repeated poles give $t\,e^{pt}$ because two colliding exponentials leave their difference quotient behind." "The same $F(s)$ can invert to a right-sided or a left-sided signal — the ROC, not the formula, decides." That last one separates candidates who memorized a table from those who understand it.

## @history

The cover-up method is Oliver Heaviside's — the same self-taught engineer whose operational calculus scandalized Cambridge mathematicians in the 1890s. He treated $d/dt$ as an algebraic symbol $p$, solved telegraph-cable problems decades before the theory was made rigorous, and answered critics with "Shall I refuse my dinner because I do not fully understand the process of digestion?" The rigorous justification via the Laplace integral came a generation later; the shortcut he left behind is still the fastest tool in the exam room.

## @summary

**Ritual:** degree check (divide if improper) → factor → cover-up residues → table → $u(t)$ → check $f(0^+)$.

$$\frac{1}{s+a} \to e^{-at}u(t) \qquad \frac{1}{(s+a)^2} \to t e^{-at}u(t) \qquad 1 \to \delta(t)$$
$$\frac{s+a}{(s+a)^2+\omega^2} \to e^{-at}\cos\omega t\,u(t) \qquad \frac{\omega}{(s+a)^2+\omega^2} \to e^{-at}\sin\omega t\,u(t)$$

- **Cover-up:** $A_i = [(s-p_i)F(s)]_{s=p_i}$ — distinct poles and *top order* of repeated poles only.
- **Repeated pole, lower coefficient:** derivative $\frac{d}{ds}[(s-p)^2F]_{s=p}$ or match coefficients.
- **Complex pair:** complete the square (Route A) or residues $\to 2|A|e^{-at}\cos(\omega t + \angle A)$ (Route B) — identical answers.
- **Improper:** long division first; quotient $\to$ impulses.
- **ROC decides sidedness:** exam default (unilateral) = right-sided = $u(t)$ everywhere.
