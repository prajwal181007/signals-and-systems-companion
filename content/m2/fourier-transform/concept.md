---
id: m2/fourier-transform
title: "The Fourier transform: frequency content for signals that never repeat"
short: Fourier Transform
module: 2
tier: core
hero: true
outcomes: [CO2]
prereqs: [m2/fourier-series]
aliases: ["CTFT", "continuous-time fourier transform", "analysis equation", "synthesis equation", "spectrum", "rect sinc pair", "T ck envelope", "aperiodic spectrum", "distributional pairs", "fourier integral"]
exam: { minor1: high, major: high, marks: "8–12", styles: [compute, derive, conceptual] }
crosslinks:
  - { target: m2/ft-properties, relation: "the property algebra that lets you manipulate spectra without redoing any integral" }
  - { target: m2/frequency-response, relation: "H(jω) — the frequency response — is exactly the Fourier transform of the impulse response" }
  - { target: m2/parseval, relation: "|X(jω)|² itemizes the signal's energy frequency by frequency" }
  - { target: m3/laplace-transform, relation: "the FT is the Laplace transform read on the jω axis when the ROC allows it" }
  - { target: m1/impulse, relation: "the sifting property is what makes every entry of the distributional table verifiable in one line" }
---

## @intuition

A lightning strike happens once and never again. So does a spoken word, a camera flash, a key click on your laptop. The most interesting signals in engineering refuse to repeat — yet your radio, your Wi-Fi chip, and your noise-cancelling headphones all reason about them by *frequency*. That should bother you: the Fourier series, our only frequency tool so far, has one hard requirement — the signal must be periodic. This concept removes that requirement. The prize is enormous: a frequency description for *every* signal.

---
@viz bridge {"width":1}
The trick is almost cheeky: a signal that happens once is a periodic signal whose repeats never arrive. Take one pulse, pretend it recurs every $T$ seconds, and compute its Fourier series. Now slide $T$ upward and watch. Two things happen at once: the harmonic lines crowd together (their spacing is $2\pi/T$), and every line shrinks (there is a $1/T$ in front of the coefficient integral). Push $T\to\infty$ naively and the whole spectrum dies. Something valuable is clearly being thrown away.

---
The rescue is a single rescale: plot $T\,c_k$ instead of $c_k$. Now the lines reach up to a fixed, smooth **envelope** — a curve that does not care about $T$ at all. Double the period: twice as many lines, packed twice as densely, under the *same* envelope. Try it on the slider above. The envelope belongs to the one pulse alone, and it survives the limit. That envelope **is** the Fourier transform. The series never dies as $T$ grows — it just samples this curve ever more finely, until the samples become the curve.

---
So what kind of object is the envelope? Not "the amplitude at frequency $\omega$" — each individual line's height went to zero, remember. It is an amplitude **density**: how much sinusoid the signal contains *per unit of bandwidth*, the way population density says people per square kilometre rather than people at a point. Densities only mean something when integrated over a stretch — which is exactly what the synthesis formula will do.

---
From here the story runs in both directions. **Analysis**: feed in a signal, get its density over all frequencies — its complete recipe. **Synthesis**: add up sinusoids with those densities and the signal reassembles perfectly. Everything the series did for repeating signals, this pair does for everything else — and the series itself will turn out to be a special case, hiding inside as a row of impulses.

## @definition

For a signal $x(t)$, the **Fourier transform pair** is

$$X(j\omega) = \int_{-\infty}^{\infty} x(t)\,e^{-j\omega t}\,dt \qquad \text{(analysis)}$$

$$x(t) = \frac{1}{2\pi}\int_{-\infty}^{\infty} X(j\omega)\,e^{j\omega t}\,d\omega \qquad \text{(synthesis)}$$

**Reading the symbols:** $\omega$ is frequency in rad/s, now a *continuous* variable — no more integer harmonics $k\omega_0$. $e^{-j\omega t}$ is the probe: the analysis integral correlates $x$ against a test oscillation at each $\omega$. $X(j\omega)$ is complex: $|X(j\omega)|$ says *how much* of frequency $\omega$ the signal contains (as a density — units of $x$ times seconds), and $\angle X(j\omega)$ says *where in time* those oscillations sit. The $\frac{1}{2\pi}$ lives on the synthesis side in this rad/s convention — it is the exchange rate between $\omega$ and cycles. We write $X(j\omega)$ rather than $X(\omega)$ so that Module 3's Laplace transform drops in seamlessly: $X(j\omega) = X(s)\big|_{s=j\omega}$. For real $x(t)$: $X(-j\omega) = X^*(j\omega)$, so $|X|$ is even and $\angle X$ is odd — exams expect you to invoke this.

**Existence (ordinary sense):** if $\int_{-\infty}^{\infty}|x(t)|\,dt < \infty$ (absolute integrability, plus mild Dirichlet conditions on wiggles and jumps), the analysis integral converges for every $\omega$ and $X(j\omega)$ is a continuous function. Finite-energy signals are also covered via a limiting argument. Signals that *fail* this test — $u(t)$, $\cos\omega_0 t$, constants, all periodic signals — still get transforms, but in an **extended (distributional) sense** involving impulses in frequency. That table lives in @examples, and it is an extension, not a contradiction.

## @derivation

The transform is not defined by decree — it is forced out of the Fourier series by letting the period walk to infinity. This derivation *is* the concept.

### Step: Trap the aperiodic signal inside a periodic scaffold
?why: The FS only applies to periodic signals — so manufacture one that agrees with x on a growing window.
Let $x(t)$ live on a finite stretch of time (the general case follows by a limiting argument). Build $\tilde{x}(t)$: copies of $x$ repeated every $T$ seconds, with $T$ large enough that copies don't overlap. On $|t| \le T/2$, $\tilde{x} = x$ exactly, and as $T\to\infty$, $\tilde{x} \to x$ everywhere.

### Step: Compute the FS coefficients — and meet the envelope
?why: Inside the window x̃ equals x, and x vanishes outside it, so the limits can open to ±∞.
With $\omega_0 = 2\pi/T$,
$$c_k = \frac{1}{T}\int_{-T/2}^{T/2} \tilde{x}(t)\,e^{-jk\omega_0 t}\,dt = \frac{1}{T}\int_{-\infty}^{\infty} x(t)\,e^{-jk\omega_0 t}\,dt$$
Define the **envelope** $X(j\omega) = \int_{-\infty}^{\infty} x(t)e^{-j\omega t}dt$. Then
$$T\,c_k = X(jk\omega_0)$$
Every coefficient, for every $T$, is a *sample of one $T$-independent curve*. This single equation is the whole bridge.

### Step: Rewrite the synthesis sum so an integral can emerge
?why: 1/T = ω₀/2π turns the sum into a Riemann sum with strip width ω₀.
$$\tilde{x}(t) = \sum_{k=-\infty}^{\infty} c_k e^{jk\omega_0 t} = \sum_{k=-\infty}^{\infty} \frac{1}{T}X(jk\omega_0)\,e^{jk\omega_0 t} = \frac{1}{2\pi}\sum_{k=-\infty}^{\infty} X(jk\omega_0)\,e^{jk\omega_0 t}\cdot\omega_0$$
Read the last form as: sample value × strip width, summed — the area under $X(j\omega)e^{j\omega t}$ approximated with strips of width $\omega_0$.

### Step: Let the period walk to infinity
?why: ω₀ → 0 turns the Riemann sum into the Riemann integral, and x̃ → x.
$$x(t) = \frac{1}{2\pi}\int_{-\infty}^{\infty} X(j\omega)\,e^{j\omega t}\,d\omega \qquad \blacksquare$$
The analysis equation was already defined in Step 2. The pair is complete.

### Step: Notice what was NOT assumed — and what quietly was
Nothing about the pulse's shape: *any* finite-duration signal rides this argument. What was quietly assumed is that the envelope integral converges — that is exactly the $\int|x|\,dt < \infty$ condition, and exactly why $u(t)$ and $\cos\omega_0 t$ need the extended table. Also notice: the envelope never moved during the entire limit. Periodicity only decides *how densely you sample it*. That is the permanent FS↔FT dictionary: **line spectra are sampled envelopes**, $T c_k = X(jk\omega_0)$.

## @examples

**Worked fully: rect ↔ sinc — the pair to own.** Let $x(t) = 1$ for $|t| \le T_1$, zero elsewhere.
$$X(j\omega) = \int_{-T_1}^{T_1} e^{-j\omega t}\,dt = \left[\frac{e^{-j\omega t}}{-j\omega}\right]_{-T_1}^{T_1} = \frac{e^{-j\omega T_1} - e^{j\omega T_1}}{-j\omega} = \frac{2\sin(\omega T_1)}{\omega}$$
Checks that earn marks: $X(0) = 2T_1$ — the *area* of the pulse (small-angle limit $\sin\theta \approx \theta$); zeros at $\omega = k\pi/T_1$, $k \ne 0$; $X$ is real and even because $x$ is real and even. The main lobe spans $|\omega| < \pi/T_1$: **halve the pulse width and the lobe doubles** — time width and bandwidth are reciprocal, a law you will meet again in m2/bandwidth-uncertainty. (Books disagree on whether $\mathrm{sinc}(\theta)$ means $\sin\theta/\theta$ or $\sin(\pi\theta)/(\pi\theta)$; at the exam, write $2\sin(\omega T_1)/\omega$ and dodge the convention trap.)

**Worked, engineering skin: the one-sided exponential.** $x(t) = e^{-at}u(t)$, $a > 0$:
$$X(j\omega) = \int_{0}^{\infty} e^{-(a+j\omega)t}\,dt = \frac{1}{a+j\omega}, \qquad |X| = \frac{1}{\sqrt{a^2+\omega^2}},\quad \angle X = -\arctan\frac{\omega}{a}$$
The upper limit is legal because $a>0$: the *real* part of the exponent does the taming (your first taste of a Laplace ROC). This signal is the impulse response of the RC filter with $a = 1/RC$ — so this transform will reappear as the RC's frequency response in m2/frequency-response.

**The extended table: signals the integral refuses.** For $u(t)$, $\cos\omega_0 t$, and constants, $\int|x|\,dt$ diverges — no ordinary transform exists. That is a signpost, not a scandal: these signals carry finite *power* forever, not finite energy, so their frequency content is infinitely concentrated — impulses in $\omega$. The extended pairs:

| $x(t)$ | $X(j\omega)$ |
|---|---|
| $1$ | $2\pi\,\delta(\omega)$ |
| $e^{j\omega_0 t}$ | $2\pi\,\delta(\omega - \omega_0)$ |
| $\cos\omega_0 t$ | $\pi[\delta(\omega-\omega_0) + \delta(\omega+\omega_0)]$ |
| $\sin\omega_0 t$ | $\frac{\pi}{j}[\delta(\omega-\omega_0) - \delta(\omega+\omega_0)]$ |
| $\mathrm{sgn}(t)$ | $\frac{2}{j\omega}$ |
| $u(t)$ | $\pi\,\delta(\omega) + \frac{1}{j\omega}$ |
| periodic, FS coeffs $c_k$ | $2\pi\sum_k c_k\,\delta(\omega - k\omega_0)$ |

Verify one and believe the rest: put $2\pi\delta(\omega-\omega_0)$ into synthesis: $\frac{1}{2\pi}\int 2\pi\delta(\omega-\omega_0)e^{j\omega t}d\omega = e^{j\omega_0 t}$ — the sifting property from m1/impulse, working in the frequency variable. For $u(t)$, split $u = \tfrac12 + \tfrac12\mathrm{sgn}(t)$: the DC average $\tfrac12$ contributes $\pi\delta(\omega)$, the sign flip contributes $1/j\omega$. Writing $1/j\omega$ *alone* for $u(t)$ is the single most common table error — that is the transform of $\tfrac12\mathrm{sgn}(t)$, and it has lost $u$'s DC content.

## @misconceptions
- wrong: "As T → ∞ the coefficients cₖ go to zero, so aperiodic signals have no frequency content."
  tempting: "The lines really do all shrink to zero on the plot — it looks like the spectrum is dying."
  correction: "Heights die but *density* survives: $T c_k$ locks onto a fixed envelope, and that envelope — the Fourier transform — is the frequency content. The spectrum didn't vanish; it changed from a bar chart to a density curve."
  probe: q-envelope
- wrong: "X(jω₀) is the amplitude of the sinusoid at ω₀ inside x(t)."
  tempting: "That's exactly what cₖ meant in the series, and X looks like its replacement."
  correction: "X is amplitude *per unit bandwidth* — a density. Only $\\frac{1}{2\\pi}X(j\\omega)d\\omega$ is an amplitude, and a single frequency point carries none. Units betray it: if x is in volts, X is in volt-seconds."
- wrong: "u(t) has no Fourier transform, since it isn't absolutely integrable."
  tempting: "The existence test genuinely fails — the analysis integral does not converge for u(t)."
  correction: "No *ordinary* transform — correct. But the theory extends: $u(t) \\leftrightarrow \\pi\\delta(\\omega) + 1/j\\omega$ in the distributional sense, where the impulse carries the DC average and $1/j\\omega$ carries the transition. Same table, wider entrance."
  probe: q-ustep
- wrong: "The FT of cos ω₀t has value ½ at ±ω₀."
  tempting: "The Fourier SERIES of cos ω₀t really does have coefficients ½ at k = ±1 — easy to transplant."
  correction: "The FT concentrates that finite strength into zero bandwidth, which forces impulses, and the bridge factor is 2π: each coefficient ½ becomes an impulse of *area* 2π·½ = π. Finite value and impulse area are different kinds of objects."
  probe: q-cosarea

## @exam

**Where it appears:** Minor I (alongside the series) and the Major, reliably 8–12 marks: (a) compute $X(j\omega)$ by direct integration for rect, one- and two-sided exponentials; (b) sketch $|X(j\omega)|$ with zeros labeled; (c) one-line table lookups for the distributional pairs; (d) "does the FT exist in the ordinary sense?" reasoning; (e) occasionally the FS→FT bridge itself as a conceptual question — state $T c_k = X(jk\omega_0)$.

**The method that earns full marks:** (1) write the analysis definition; (2) substitute, converting the support of $x$ into the integration limits ($u(t)$ sets the lower limit to 0); (3) integrate, keeping $a + j\omega$ as one block; (4) combine conjugate exponential pairs into $\sin$ or $\cos$; (5) check $X(0) = $ area under $x(t)$; (6) sketch, labeling zeros and the value at $\omega = 0$.

**Traps that cost marks:** sign slip in $e^{-j\omega t}$ (the analysis exponent is negative); writing the FT of $u(t)$ as $1/j\omega$ — the missing $\pi\delta(\omega)$ is an instant deduction; putting the $2\pi$ on the wrong side of the pair (it belongs to synthesis, and to the $\delta$-pairs as $2\pi\delta$); quoting $\cos\omega_0 t$ impulses with area $\tfrac12$ instead of $\pi$; forgetting that a real, even $x$ must produce a real, even $X$ — a free sanity check most students never cash.

## @interview

One-liners worth owning: "The FT is the Fourier series with the period sent to infinity — lines densify under an invariant envelope, $T c_k = X(jk\omega_0)$." "X(jω) is a density, not an amplitude — that's why aperiodic spectra are curves, not bars." "Absolutely integrable signals get ordinary transforms; power signals like u(t) and cosines get impulses in frequency — an extension of the theory, not an exception to it." "$X(0)$ is the area under the signal — the DC content read at a glance." A favorite probe: "why does the FT of a periodic signal consist of impulses?" — because all its strength sits at isolated frequencies, and finite strength at zero bandwidth is precisely what an impulse encodes.

## @history

Fourier claimed in his 1807 memoir on heat that *arbitrary* functions decompose into sinusoids; Lagrange objected so strongly the paper sat unpublished for years. The transform grew out of the series by exactly the limit argument on this page — it appears in Fourier's own 1822 treatise. The impulses in the extended table waited a century longer: Dirac used $\delta$ freely in 1930s quantum mechanics while mathematicians winced, and Laurent Schwartz's theory of distributions (1945) finally made every entry of that table rigorous — earning him the Fields Medal for legalizing what engineers were already doing.

## @summary

$$X(j\omega) = \int_{-\infty}^{\infty} x(t)e^{-j\omega t}dt \qquad\qquad x(t) = \frac{1}{2\pi}\int_{-\infty}^{\infty} X(j\omega)e^{j\omega t}d\omega$$

- **The bridge:** $T c_k = X(jk\omega_0)$ — line spectra are samples of the envelope, spacing $\omega_0 = 2\pi/T$; as $T\to\infty$ samples become the curve.
- **Pair to own:** rect ($|t|\le T_1$) ↔ $\dfrac{2\sin(\omega T_1)}{\omega}$; $X(0) = 2T_1$ = area; zeros at $k\pi/T_1$; reciprocal widths.
- **Pair to own:** $e^{-at}u(t) \leftrightarrow \dfrac{1}{a+j\omega}$, $a>0$.
- **Existence (ordinary):** $\int|x|dt < \infty$. **Extended pairs:** $1 \leftrightarrow 2\pi\delta(\omega)$; $\cos\omega_0 t \leftrightarrow \pi[\delta(\omega-\omega_0)+\delta(\omega+\omega_0)]$; $u(t) \leftrightarrow \pi\delta(\omega) + \frac{1}{j\omega}$; periodic $\leftrightarrow 2\pi\sum_k c_k\delta(\omega-k\omega_0)$.
- **Symmetry:** real $x$ ⇒ $|X|$ even, $\angle X$ odd; real even $x$ ⇒ $X$ real even.
- **Checks:** $X(0)$ = area of $x$; the $2\pi$ sits on synthesis.
