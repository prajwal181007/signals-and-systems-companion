---
id: m4/dtft
title: "The DTFT: frequency on a circle"
short: DTFT
module: 4
tier: core
outcomes: [CO4]
prereqs: [m3/z-transform, m4/sampling]
aliases: ["discrete time fourier transform", "periodic spectrum", "omega", "unit circle slice"]
exam: { minor2: high, major: high, marks: "6–10", styles: [compute, conceptual] }
crosslinks:
  - { target: m3/z-roc, relation: "the DTFT is the unit-circle slice of the z-transform — existence = circle in the ROC" }
  - { target: m4/sampling, relation: "the 2π-periodicity IS the replica structure sampling created" }
---

## @intuition

Continuous frequency lives on a line: 1 kHz, 1 MHz, 1 GHz — ever upward. Discrete frequency lives on a **circle**. A DT sinusoid $\cos(\Omega n)$ at $\Omega$ and at $\Omega + 2\pi$ are *literally the same sequence* — the extra $2\pi$ per sample is invisible to samples. So the DT spectrum can only be a function on a circle, and everything strange about the DTFT — its periodicity, the "highest frequency" living at $\Omega = \pi$, spectra that scroll forever — is the circle asserting itself.

---
@viz explorer {"seq":"expn","a":0.8}
The ribbon display makes it physical: $X(e^{j\Omega})$ tiles endlessly with period $2\pi$; the shaded band $[-\pi, \pi]$ is one full lap of the circle — everything outside is the same information again. And $\Omega = \pi$ — the alternation rate $(-1)^n$ — is the fastest a sequence can possibly wiggle: "high frequency" in DT means *near π*, not "large".

---
Where does the DTFT come from? It is the **z-transform evaluated on the unit circle**: $X(e^{j\Omega}) = X(z)\big|_{z = e^{j\Omega}}$ — the DT twin of "Fourier = Laplace on the axis," legal when the ROC contains the circle (stable sequences). Walk the cursor around the z-plane's circle and the DTFT pane sweeps one period: same object, two views.

---
@viz explorer {"seq":"coswin","len":8}
And the lesson every spectrum analyst pays for: window a cosine to $N$ samples and its spectral line smears into a lobe of width $\propto 1/N$. Double the window, halve the lobe: **resolution costs samples**. (That's time-multiplication ⇔ frequency-convolution, imported from Module 2 and now priced in samples.)

## @definition

$$X(e^{j\Omega}) = \sum_{n=-\infty}^{\infty} x[n]\,e^{-j\Omega n} \qquad x[n] = \frac{1}{2\pi}\int_{2\pi} X(e^{j\Omega})\,e^{j\Omega n}\,d\Omega$$

- **Always $2\pi$-periodic**: $X(e^{j(\Omega + 2\pi)}) = X(e^{j\Omega})$ — one period tells all; plot $[-\pi, \pi]$.
- Exists (absolutely) iff $\sum|x[n]| < \infty$ ⇔ unit circle ∈ ROC of $X(z)$.
- **Key pairs:** $\delta[n] \leftrightarrow 1$; $a^nu[n] \leftrightarrow \frac{1}{1 - ae^{-j\Omega}}$ ($|a|<1$); length-$N$ pulse ↔ periodic-sinc (Dirichlet kernel), mainlobe width $4\pi/N$.
- **Properties** (all FS/FT twins): shift ⇒ $e^{-j\Omega n_0}$; modulation by $(-1)^n = e^{j\pi n}$ ⇒ spectrum shifts by π (low-pass ↔ high-pass flip!); convolution ⇔ multiplication; **Parseval:** $\sum|x[n]|^2 = \frac{1}{2\pi}\int_{2\pi}|X|^2 d\Omega$.
- $\Omega = \omega T_s$ links DT frequency to the CT frequency it sampled: the circle is the s-plane axis, wrapped.

## @derivation

### Step: Periodicity in one line
?why: e^{−j(Ω+2π)n} = e^{−jΩn}·e^{−j2πn}, and e^{−j2πn} = 1 for every integer n.
The summand cannot tell $\Omega$ from $\Omega + 2\pi$ — integer $n$ absorbs whole turns. Periodicity is forced by the *integers*, not chosen. (Same arithmetic that made DT periodicity rational-only and sampling alias.)

### Step: The geometric-series pair (the exam computation)
?why: The DTFT of aⁿu[n] is a geometric series in ae^{−jΩ}.
$$\sum_{n\ge0}(ae^{-j\Omega})^n = \frac{1}{1 - ae^{-j\Omega}}, \quad |a| < 1$$
Magnitude peaks at $\Omega = 0$ (smooth decay = low-pass) and for $a < 0$ peaks at $\pi$ (alternating decay = high-pass). One pair, both filter characters — and it is the unit-circle slice of $\frac{z}{z-a}$.

### Step: Windowing widens (resolution costs samples)
?why: A finite window multiplies in time ⇒ convolves the ideal line with the window's Dirichlet kernel.
The length-$N$ rectangular window's transform has mainlobe width $4\pi/N$. A windowed cosine's two spectral lines each smear to that width: two tones closer than $\approx 2\pi/N$ merge into one lobe — unresolvable. Want finer frequency vision? Buy more samples. No algorithm beats this arithmetic (the DFT/FFT just *samples* this DTFT — enrichment note).

## @examples

**Worked (exam staple):** $x[n] = (0.5)^n u[n]$: $X = \frac{1}{1 - 0.5e^{-j\Omega}}$. $|X(e^{j0})| = 2$ (DC gain = $\sum x$ ✓), $|X(e^{j\pi})| = \frac{1}{1.5} = 0.67$: low-pass character read from two spot values — a two-minute full answer.

**Worked (the π-shift flip):** $y[n] = (-1)^n x[n]$ with $x$ low-pass: $Y(e^{j\Omega}) = X(e^{j(\Omega - \pi)})$ — the spectrum slides half a turn; the low-pass becomes high-pass. One multiplication turns a smoother into an edge detector: the cheapest filter transformation in DSP.

**Worked (five-sample pulse):** $x = u[n] - u[n-5]$: $X = \frac{\sin(5\Omega/2)}{\sin(\Omega/2)}e^{-j2\Omega}$ — the periodic sinc (Dirichlet kernel): looks like a sinc near 0, but repeats every $2\pi$ (a true sinc would forget the circle). First nulls at $\Omega = \pm 2\pi/5$.

## @misconceptions
- wrong: "The DTFT spectrum extends to infinite frequency, like the CTFT."
  tempting: "Fourier transforms have always had an infinite axis."
  correction: "DT frequency is a CIRCLE: everything repeats with period 2π, and Ω = π is the absolute speed limit (alternation). Frequencies 'beyond π' are aliases of ones below — the plot [−π, π] is the entire truth."
- wrong: "The highest frequency is the largest Ω you write down."
  tempting: "Bigger number, faster wiggle."
  correction: "Ω = 2.5π is the SAME sequence as Ω = 0.5π. Nearness to π (mod 2π) measures wiggle speed. cos(0.9πn) is nearly the fastest thing possible; cos(2πn) is DC in disguise (all samples equal)."
- wrong: "Zero-padding or clever algorithms can resolve two close tones from few samples."
  tempting: "More FFT points = more resolution, right?"
  correction: "Resolution is the window's mainlobe: ∝ 1/N in SAMPLES OBSERVED. Zero-padding interpolates the same smeared curve more finely — cosmetic, not informative. Only more data narrows the lobe."

## @exam

6–10 marks: (a) compute DTFTs via the geometric series ($a^nu[n]$ family) and evaluate spot values ($\Omega = 0, \pi$) to name the filter character; (b) state/prove 2π-periodicity (one line) and the DTFT–z-transform relation with its existence condition; (c) property applications, especially the $(-1)^n$ π-shift; (d) window-length vs resolution reasoning. Traps: plotting beyond one period as if it were new information; calling $\Omega = 2\pi$ "high frequency" (it's DC); resolution claims that ignore $N$.

## @summary

- $X(e^{j\Omega}) = \sum x[n]e^{-j\Omega n}$ — **always 2π-periodic**; one lap $[-\pi,\pi]$ is everything; π = fastest (alternation), 2π = DC again.
- = z-transform on the unit circle; exists iff $\sum|x| < \infty$ (circle ∈ ROC).
- $a^nu[n] \leftrightarrow \frac{1}{1-ae^{-j\Omega}}$: spot-check $\Omega = 0$ (DC gain $= \sum x$) and $\pi$; $a<0$ ⇒ high-pass.
- $(-1)^n$ modulation shifts the spectrum by π: LP ↔ HP in one multiply. Convolution ⇔ multiplication; Parseval on the circle.
- Windowing: mainlobe $\propto 1/N$ — **resolution costs samples**; zero-padding is cosmetic.
