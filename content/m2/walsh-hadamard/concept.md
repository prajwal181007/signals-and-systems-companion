---
id: m2/walsh-hadamard
title: "Walsh–Hadamard: the ±1 orthogonal kit — square axes for a digital world"
short: Walsh–Hadamard
module: 2
tier: core
hero: false
outcomes: [CO2]
prereqs: [m2/orthogonality]
aliases: ["walsh functions", "hadamard matrix", "sequency", "walsh transform", "hadamard transform", "WHT", "walsh hadamard transform", "spreading codes"]
exam: { minor1: high, major: medium, marks: "4–8", styles: [compute, conceptual] }
crosslinks:
  - { target: m2/orthogonality, relation: "the projection recipe applied verbatim — only the kit changed from sinusoids to ±1 patterns" }
  - { target: m2/fourier-series, relation: "the rival basis: same geometry, different waveforms — the signal family decides the winner" }
  - { target: m1/energy-and-power, relation: "the energy check Σx² = NΣc² is Pythagoras in the Walsh coordinate system" }
---

## @intuition

A battery-powered sensor node must compress its readings before transmitting, because radio time is the battery's biggest expense. Computing Fourier coefficients means multiplying every sample by long decimal cosine values — thousands of multiplications, and hardware multipliers are power hogs. Here is the engineer's question: could the reference waveforms take only the values **+1 and −1**, so that every multiplication collapses into an add-or-subtract? And would such a crude-looking kit still be rich enough to represent anything?

---

The previous concept quietly promised this could work: the projection recipe never asked for sinusoids. *Any* orthogonal family gives independent, final, one-at-a-time coefficients. The **Walsh functions** are exactly such a family — square-jawed switching patterns that jump between +1 and −1, mutually orthogonal, forming a complete set of perpendicular axes for signals. Same geometry as Fourier analysis; different axes.

---
@viz mixer {"target":"square","kept":3}
Watch the kit at work. The mixer projects a target signal onto Walsh axes, keeps the few largest coefficients, and rebuilds. The reconstruction is a staircase — because the axes themselves are staircases. The lower pane races Walsh against Fourier: error after keeping 1, 2, 3… terms. For this blocky target, Walsh collapses it almost immediately.

---

One puzzle: sinusoids come pre-sorted by frequency, but a ±1 pattern has no single frequency. The fix is **sequency** — count how many times the pattern flips sign across the interval. Zero flips is the "DC" of the kit; more flips means faster switching. Sequency ordering plays the role frequency ordering plays for Fourier: slow patterns first, busy patterns last.

---

Where does the kit come from? A copy machine. Given any orthogonal ±1 kit of size $N$, write each pattern twice side-by-side (copy–copy), and also once followed by its negative (copy–negate). That doubling is the **Hadamard recursion** — three lines of copying that build kits of size 2, 4, 8, … from the single seed pattern "+1". No trigonometry anywhere.

---
@viz mixer {"target":"sine","kept":5}
When does Walsh actually beat Fourier? Switch the target to a smooth sine and the contest flips: now Fourier nails it with one term while Walsh grinds through many. The moral is the deepest one in this module: **no basis is sacred**. Match the kit to the signal family — blocky telemetry, logic waveforms, bar-code scans love Walsh; smooth vibrations love Fourier.

## @definition

The **Hadamard matrices** are built by the recursion

$$H_1 = \begin{bmatrix} 1 \end{bmatrix}, \qquad H_{2N} = \begin{bmatrix} H_N & H_N \\ H_N & -H_N \end{bmatrix}$$

so that

$$H_2 = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}, \qquad H_4 = \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & -1 & 1 & -1 \\ 1 & 1 & -1 & -1 \\ 1 & -1 & -1 & 1 \end{bmatrix}$$

Every entry is $\pm 1$, and the rows are mutually orthogonal: $H_N H_N^{\mathsf T} = N\, I_N$. The **Walsh functions** $w_k[n]$ are these rows, conventionally re-indexed by **sequency** — the number of sign changes along the row. (As continuous-time objects they are ±1 step waveforms on $[0,1)$; exam problems use the sampled $N$-point form.)

**Analysis and synthesis** for an $N$-point signal $x[n]$:

$$c_k = \frac{1}{N}\sum_{n=0}^{N-1} x[n]\,w_k[n] \qquad\qquad x[n] = \sum_{k=0}^{N-1} c_k\,w_k[n]$$

with the energy check $\sum_n x[n]^2 = N\sum_k c_k^2$.

**Reading the symbols:** $c_k$ is the projection recipe from the previous concept, verbatim: $\langle x, w_k\rangle / \langle w_k, w_k\rangle$. The numerator $\sum x[n]w_k[n]$ is pure adds and subtracts (that was the whole sales pitch), and the divisor is $\lVert w_k\rVert^2 = N$ because each row has $N$ entries of squared value 1.

**Exam conventions:** state which ordering you are using — **natural (Hadamard) order** is what the recursion produces; **sequency order** sorts rows by sign-change count. For $N=4$ the natural rows have sequencies $0, 3, 1, 2$. Exam problems usually say "using the Hadamard matrix," which means natural order unless sequency is explicitly requested.

## @derivation

The whole transform is 10+2 arithmetic — no calculus appears anywhere. That absence is the point.

### Step: Double the kit without breaking orthogonality
?why: block inner products reduce to inner products of the old rows, which we already trust.
Let $r, s$ be rows of an orthogonal $\pm1$ kit $H_N$. The recursion creates rows of two kinds: $[r\ \ r]$ (top half) and $[r\ \ {-r}]$ (bottom half). Check every pairing:
$$\langle [r\ r], [s\ s]\rangle = 2\langle r,s\rangle, \qquad \langle [r\ {-r}], [s\ {-s}]\rangle = 2\langle r,s\rangle, \qquad \langle [r\ r], [s\ {-s}]\rangle = \langle r,s\rangle - \langle r,s\rangle = 0$$
The first two vanish for $r \neq s$ by the old kit's orthogonality; the third vanishes *always* — even when $r = s$, which is why a top-half row is orthogonal to its own bottom-half twin. Starting from $H_1 = [1]$, induction hands us orthogonal kits of every size $2^n$.

### Step: Every axis has squared length N
?why: each entry is ±1, so each squared entry is 1, and there are N of them.
$$\lVert w_k\rVert^2 = \sum_{n=0}^{N-1} w_k[n]^2 = N$$
This is the norm divisor the projection recipe demands. It is the same bookkeeping that produced $T/2$ for sinusoids — different kit, same rule.

### Step: Coefficients are projections — computed multiplier-free
?why: the general recipe c = ⟨x,φ⟩/⟨φ,φ⟩ from the previous concept, with nothing modified.
$$c_k = \frac{\langle x, w_k\rangle}{\lVert w_k\rVert^2} = \frac{1}{N}\sum_{n=0}^{N-1} x[n]\,w_k[n]$$
Since $w_k[n] = \pm 1$, the sum is literally "add the samples where the pattern is $+1$, subtract where it is $-1$." A processor with no multiplier computes this at full speed.

### Step: Orthogonality gives the energy ledger
?why: cross terms ⟨w_k, w_m⟩ die for k ≠ m — Pythagoras again.
Expanding $\sum_n x[n]^2 = \langle \sum_k c_k w_k, \sum_m c_m w_m\rangle$, only the $k = m$ terms survive:
$$\sum_{n=0}^{N-1} x[n]^2 = \sum_{k=0}^{N-1} c_k^2\,\lVert w_k\rVert^2 = N\sum_{k=0}^{N-1} c_k^2$$
Consequence for compression: keeping the largest $|c_k|$ discards the least energy — the best possible reconstruction for that number of kept terms, exactly as in the general theory.

### Step: Order the axes by sequency
?why: sign changes are the basis-independent notion of "how fast this axis wiggles."
Count sign changes along each natural-order row of $H_4$: $[1,1,1,1] \to 0$, $[1,-1,1,-1] \to 3$, $[1,1,-1,-1] \to 1$, $[1,-1,-1,1] \to 2$. Sequency order is therefore rows $1, 3, 4, 2$ of the natural matrix. The recursion builds cheaply; sequency ordering is a relabeling done afterwards by counting.

### Step: Notice what was NOT assumed
?why: this is the concept's punchline — basis choice is an engineering decision, not a law.
Nothing required smoothness, calculus, or any relationship to sinusoids. The Walsh kit is a complete, exact, orthogonal coordinate system in its own right — not an approximation to Fourier. Which kit *compresses better* depends entirely on the signal family: a signal that looks like the axes needs few coefficients. Blocky signals look like Walsh axes; smooth oscillations look like Fourier axes.

## @examples

**Worked, the exam question: 4-point Walsh–Hadamard coefficients.** Given $x = [4,\ 2,\ -2,\ 0]$, find the WH coefficients, then verify.

1. *Build the matrix by recursion* (write the blocks, negate only the bottom-right):
$$H_4 = \begin{bmatrix} H_2 & H_2 \\ H_2 & -H_2 \end{bmatrix} = \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & -1 & 1 & -1 \\ 1 & 1 & -1 & -1 \\ 1 & -1 & -1 & 1 \end{bmatrix}$$
2. *Project onto each row, divisor $N = 4$* — write every sum explicitly, signs first:
$$c_0 = \tfrac14(4+2-2+0) = 1 \qquad c_1 = \tfrac14(4-2-2-0) = 0$$
$$c_2 = \tfrac14(4+2+2-0) = 2 \qquad c_3 = \tfrac14(4-2+2+0) = 1$$
3. *Verify by reconstruction:* $x[n] = \sum_k c_k w_k[n] = 1\cdot[1,1,1,1] + 2\cdot[1,1,-1,-1] + 1\cdot[1,-1,-1,1] = [4,2,-2,0]$ ✓
4. *Verify by energy:* $\sum x^2 = 16+4+4+0 = 24$ and $N\sum c_k^2 = 4(1+0+4+1) = 24$ ✓
5. *If sequency order is requested:* sequencies of rows are $0,3,1,2$, so the sequency-ordered coefficients are $(c_0, c_2, c_3, c_1) = (1, 2, 1, 0)$.

Both checks cost seconds and catch nearly every sign slip — do at least one, every time.

**Worked: two transmitters, one wire (the germ of CDMA).** User A is assigned code $w_2 = [1,1,-1,-1]$, user B code $w_3 = [1,-1,-1,1]$. A transmits amplitude $+3$, B transmits $-2$, *simultaneously*: the channel carries $3w_2 - 2w_3 = [1,\ 5,\ -1,\ -5]$. Receiver A projects: $\tfrac14(1+5+1+5) = 3$. Receiver B projects: $\tfrac14(1-5+1-5) = -2$. Each message recovered exactly, zero crosstalk, no time-sharing — orthogonal codes let users share the medium. Real spread-spectrum systems (CDMA) use exactly such Walsh codes.

**Worked: why blocky signals love this kit.** A ±1 square wave that flips once mid-interval *is* the sequency-1 Walsh function: one coefficient equals 1, every other coefficient is 0, reconstruction error exactly zero after one term. Fourier, for the same target, needs the infinite series $\tfrac{4}{\pi}(\sin t + \tfrac13\sin 3t + \cdots)$ and still rings at the edges. Now hand both kits a smooth sine: Fourier stores it in one coefficient while Walsh needs many staircase terms to fake a curve. Set the mixer above to each target and watch the error race change winners — the basis should look like the signal.

## @misconceptions
- wrong: "The recursion's natural (Hadamard) order lists the Walsh functions by sequency."
  tempting: "Fourier harmonics arrive sorted by frequency, so the kit surely arrives sorted too."
  correction: "Natural order for N = 4 has sequencies 0, 3, 1, 2 — the busiest row is second, not last. Sequency order is a relabeling you perform by counting sign changes. State which order you are using; exams dock the mark otherwise."
  probe: q-order
- wrong: "Sequency is just frequency with a new name."
  tempting: "Both count wiggles per interval and both order the basis from slow to fast."
  correction: "Sequency counts sign changes of a ±1 pattern. A single Walsh function is NOT a single frequency — pushed through Fourier analysis it contains a whole family of harmonics. The two notions play the same organizing role but are different mathematics."
- wrong: "The coefficient is cₖ = Σ x[n] wₖ[n], full stop."
  tempting: "The rows look 'normalized' — every entry is already just ±1."
  correction: "Entries of size 1 do not make the norm 1: each row has squared length N. Divide by N or every coefficient is N times too big — the reconstruction check x̂ = Σcₖwₖ catches this instantly, which is why you always run it."
- wrong: "Fourier is the true spectrum; Walsh is a cheap approximation to it."
  tempting: "Fourier came first and dominates the course, so other bases feel like knock-offs."
  correction: "Both are complete orthogonal kits; both represent any N-point signal exactly. Neither approximates the other. The only question is compression efficiency — which kit's axes resemble your signal family. Blocky ⇒ Walsh wins; smooth ⇒ Fourier wins."
  probe: q-basis

## @exam

**Where it appears:** Minor I as a guaranteed short-compute question (4–8 marks), occasionally resurfacing in the Major: build $H_4$ (sometimes $H_8$) by recursion, compute the WH coefficients of a given 4-point signal, verify, and/or state the sequency ordering. The ledger is explicit: *exams ask exactly the 4-point coefficient computation.*

**The method that earns full marks:** (1) write the recursion $H_{2N} = \big[\begin{smallmatrix} H_N & H_N \\ H_N & -H_N\end{smallmatrix}\big]$ and build $H_4$ block by block — negate **only the bottom-right block**; (2) compute each $c_k = \tfrac{1}{N}(\pm x[0] \pm x[1] \pm \cdots)$ with the sign pattern copied from row $k$, written out explicitly; (3) verify — reconstruction $\sum c_k w_k$ or the energy check $\sum x^2 = N\sum c_k^2$; (4) if sequency order is asked, count sign changes per row (for $N{=}4$: $0,3,1,2$) and relabel.

**Traps that cost marks:** a sign slip inside the $-H_N$ block (the single most common error — it corrupts $c_2$ and $c_3$ silently); forgetting the $\tfrac1N$; presenting natural-order coefficients when sequency order was requested (or vice versa); skipping verification and losing the "check" marks; and writing $H_8$ by pattern-guessing instead of one more turn of the recursion.

## @interview

One-liners worth owning: "Why a ±1 basis? — multiplications become adds and subtracts; there is even a fast transform doing $N\log N$ additions." "What is sequency? — the sign-change count, the Walsh world's stand-in for frequency." "Why is $HH^{\mathsf T} = NI$ the whole story? — it certifies the rows as orthogonal axes, so coefficients are independent projections." "Where is this used? — Walsh spreading codes in CDMA let users share one channel with zero crosstalk, and Hadamard codes hardened deep-space image links." And the conceptual kicker: "Fourier is one basis among many — the signal family picks the basis, not tradition."

## @history

Joseph Walsh published his ±1 function system in 1923, but the matrices are older — Jacques Hadamard studied them in 1893 as the extremal solutions of a determinant problem. The kit earned its engineering stripes in space: NASA's Mariner missions of the 1960s–70s protected photographs of Mars with Hadamard-based codes, chosen precisely because encoding and decoding needed only additions — precious little for a spacecraft's electronics. The same multiplier-free virtue later made Walsh codes the channel-sharing workhorse of CDMA cellular networks.

## @summary

$$H_1 = [1], \qquad H_{2N} = \begin{bmatrix} H_N & H_N \\ H_N & -H_N \end{bmatrix}, \qquad H_N H_N^{\mathsf T} = N I_N$$

$$c_k = \frac{1}{N}\sum_{n=0}^{N-1} x[n]\,w_k[n] \qquad x[n] = \sum_k c_k w_k[n] \qquad \sum_n x[n]^2 = N \sum_k c_k^2$$

- **Kit:** rows of $H_N$ — ±1 patterns, mutually orthogonal, $\lVert w_k\rVert^2 = N$.
- **Sequency** = number of sign changes; natural order of $H_4$ has sequencies $0, 3, 1, 2$ — reorder by counting when asked.
- **Compute ritual:** recursion → signed sums with $\tfrac1N$ → verify (reconstruction or energy).
- **Hardware win:** coefficients need only add/subtract — no multiplier.
- **Basis choice:** blocky signals compress in few Walsh terms; smooth signals in few Fourier terms. Neither basis is "the truth" — both are exact.
