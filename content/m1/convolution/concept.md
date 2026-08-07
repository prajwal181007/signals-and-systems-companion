---
id: m1/convolution
title: "Convolution: predicting any output from one experiment"
short: Convolution
module: 1
tier: core
hero: true
outcomes: [CO1]
prereqs: [m1/impulse-response]
aliases: ["flip and slide", "convolution integral", "superposition integral", "x*h"]
exam: { minor1: high, major: high, marks: "8–12", styles: [compute, sketch, derive] }
crosslinks:
  - { target: m2/fourier-transform, relation: "convolution in time becomes multiplication in frequency — the single biggest reason transforms exist" }
  - { target: m1/impulse, relation: "the sifting property is what makes the echo decomposition legal" }
  - { target: m4/dt-systems, relation: "the discrete-time convolution sum is the same idea with Σ in place of ∫" }
---

## @intuition

You tap a bell once and record what you hear: that recording is the bell's **impulse response** $h(t)$ — its reaction to one idealized kick. Here is the astonishing claim this concept makes: *that single recording is enough to predict the bell's response to any input whatsoever* — a melody, a drum roll, your voice. No new experiments needed. The machine that turns "response to one kick" into "response to anything" is **convolution**.

---
@viz conv-machine {"view":"echo","x":"rect1","h":"exp","t":3}
Why should one experiment be enough? Because of two promises the system makes: it is **linear** (double the input, double the output; add inputs, add outputs) and **time-invariant** (kick it tomorrow, same reaction, just delayed). Now look at the input signal above: slice it into many thin pulses. Each thin pulse is approximately an impulse — scaled by the signal's height there, delayed to its location. So each slice launches its own *scaled, shifted copy* of $h$. The faint amber curves are exactly those launched copies — **echoes** of the impulse response.

---
The output is nothing more than all echoes added up — the green curve. Crank the **echo density** slider: more, thinner slices. The sum barely changes, and as the slices become true impulses it converges to the exact output. This limit *is* the convolution integral. Notice what just happened: we didn't define a formula and then interpret it — the formula is forced on us by linearity + time invariance. There is no other possible answer.

---
@viz conv-machine {"view":"slide","x":"rect1","h":"rect1","t":0.4}
The **flip-and-slide** view is the bookkeeping that computes this sum efficiently. At each output time $t$, ask: which input moments $\tau$ can still influence me, and how strongly? The input at time $\tau$ contributes its value $x(\tau)$, weighted by how much the system still "remembers" a kick from $t-\tau$ seconds ago: $h(t-\tau)$. Written over all moments, that is $\int x(\tau)\,h(t-\tau)\,d\tau$. On screen: $x(\tau)$ frozen in blue, $h(t-\tau)$ — the *flipped* memory curve — sliding in amber, their product shaded, and the shaded **area** dropping onto the output curve as the dot. Scrub $t$ slowly and watch each area become one output point.

---
Why does $h$ appear *flipped*? No mystery: $h(t-\tau)$ as a function of $\tau$ runs backwards because $\tau$ appears with a minus sign. The system's memory of the **most recent** input ($\tau$ near $t$) is $h(0^+)$ — the freshest part of the response — while inputs long past sit under the tail of $h$. Flipping is just "recent inputs meet the young part of the memory."

## @definition

For a continuous-time LTI system with impulse response $h(t)$, the output for input $x(t)$ is the **convolution**

$$y(t) = (x * h)(t) = \int_{-\infty}^{\infty} x(\tau)\,h(t-\tau)\,d\tau$$

For discrete-time systems the same reasoning with sums gives the **convolution sum**

$$y[n] = (x * h)[n] = \sum_{k=-\infty}^{\infty} x[k]\,h[n-k]$$

**Reading the symbols** (colors match the machine above): $\tau$ is the *integration variable* — it sweeps over all input moments and vanishes after integrating. $t$ is the *output instant* — frozen during the integral. $x(\tau)$ is the input's value at moment $\tau$; $h(t-\tau)$ weighs it by the system's remaining memory of a kick $t-\tau$ seconds old.

**Support rule** (constantly tested): if $x$ is nonzero on $[a,b]$ and $h$ on $[c,d]$, then $y$ is nonzero at most on $[a+c,\, b+d]$. In DT: $\text{len}(y) = \text{len}(x) + \text{len}(h) - 1$.

## @derivation

Everything follows from linearity + time invariance + the sifting property. Watch how little is assumed.

### Step: Write the input as a weighted sum of impulses
?why: The sifting property of δ — the defining property of the impulse — read in reverse.
$$x(t) = \int_{-\infty}^{\infty} x(\tau)\,\delta(t-\tau)\,d\tau$$
This is not a trick: it literally says "the signal is a sum of its own samples, each sitting on its own impulse."

### Step: Push the input through the system, using linearity
?why: Linearity lets the system act on each impulse separately, and scaling by x(τ) survives.
The system maps each $\delta(t-\tau)$ somewhere. Call the response to $\delta(t-\tau)$ by the name $h_\tau(t)$. Then
$$y(t) = \int_{-\infty}^{\infty} x(\tau)\,h_\tau(t)\,d\tau$$

### Step: Use time invariance to collapse all responses into one
?why: TI says: delay the kick, delay the same response — h_τ(t) = h(t−τ).
A kick at time $\tau$ is a kick at 0, delayed. So $h_\tau(t) = h(t-\tau)$, and
$$y(t) = \int_{-\infty}^{\infty} x(\tau)\,h(t-\tau)\,d\tau \qquad \blacksquare$$

### Step: Notice what was NOT assumed
?why: This is why convolution is the universal signature of LTI systems — and only LTI systems.
Nothing about circuits, mechanics, or acoustics. *Any* system that is linear and time-invariant — RC filter, room reverb, spring, optical blur — is completely described by $h$, through this one integral. If a system is not LTI, this formula is simply false for it (test: $y(t)=x^2(t)$).

## @examples

**Worked: two rectangular pulses** — the exam's favorite. Let $x(t) = u(t)-u(t-1)$ and $h(t) = u(t)-u(t-2)$. Five regimes as the flipped pulse slides across:

1. $t < 0$: no overlap → $y=0$.
2. $0 \le t < 1$: overlap is $\tau \in [0, t]$ → $y = \int_0^t 1\,d\tau = t$ (rising ramp).
3. $1 \le t < 2$: $x$ fully inside → $y = \int_{t-2}^{?}...$ careful: overlap is $\tau\in[0,1]$ entirely → $y = 1$ (flat top).
4. $2 \le t < 3$: overlap is $\tau \in [t-2, 1]$ → $y = 3 - t$ (falling ramp).
5. $t \ge 3$: past each other → $y = 0$.

Result: a **trapezoid** with support $[0+0,\,1+2]=[0,3]$ — confirming the support rule. Set the machine above to rect × rect₂ and scrub through all five regimes; the limits readout follows precisely this case analysis. *Write the regime boundaries first, then integrate — that ordering is where the marks live.*

**Worked: echo channel.** $h(t) = \delta(t) + \tfrac12\delta(t-3)$ (a direct path plus a delayed half-strength bounce). Then $y(t) = x(t) + \tfrac12 x(t-3)$ — convolution with impulses is pure copy-and-shift. This is why $\delta$ is the identity: $x * \delta = x$.

**Worked: RC filter smooths.** $x = $ rect, $h(t) = e^{-1.5t}u(t)$: the output rises like a charging capacitor and decays after the pulse ends — convolution with a spread-out $h$ **blurs** the input. Wider memory ⇒ more smoothing. This single sentence explains audio muffling, camera blur, and slow thermometers.

## @misconceptions
- wrong: "Convolution is just multiplying the two signals."
  tempting: "The integrand does contain a product, and y(t) at a glance looks like 'x times h'."
  correction: "The product happens at *every relative shift*, then gets integrated. Multiply-only would make two rects give a rect; convolution gives a triangle/trapezoid. If your answer has the same support as x, you multiplied."
  probe: q-shape
- wrong: "The output starts when x starts."
  tempting: "Cause then effect — surely y begins with x."
  correction: "y starts at the SUM of the start times (a+c). Convolve signals starting at 1 and 2: the output is silent until 3 — both delays stack."
- wrong: "Flipping h changes the physics."
  tempting: "Why would the system see a reversed h? Reversal feels like an extra operation someone invented."
  correction: "Nothing physical flips. h(t−τ) plotted against τ is mechanically reversed because τ carries a minus sign — it's the same memory curve read from 'most recent' backwards. The commutativity button (x∗h = h∗x) shows the flip is pure bookkeeping."
- wrong: "Longer inputs give bigger outputs."
  tempting: "More signal in, more out."
  correction: "The output at each t only sees inputs within h's memory span. A bounded system (∫|h| finite) gives bounded output no matter how long x runs — that is exactly the BIBO condition."

## @exam

**Where it appears:** Minor I and the Major, reliably 8–12 marks: (a) compute $x*h$ for piecewise signals with **regime-by-regime limits**; (b) sketch the result; (c) DT convolution sum tables; (d) properties used to shortcut (convolve with $\delta(t-t_0)$, use support rule to sanity-check).

**The method that earns full marks:** (1) write both supports; (2) state the output support $[a+c, b+d]$ *before* integrating; (3) find the regime boundaries — every t where an edge of the flipped h crosses an edge of x; (4) for each regime, write limits + integrand explicitly, THEN integrate; (5) check continuity at regime boundaries and sketch.

**Traps that cost marks:** forgetting the flip when writing $h(t-\tau)$'s edges; limits as functions of $t$ written backwards (lower must stay ≤ upper); dropping the $\frac{1}{a}$ when one signal is time-scaled; DT: off-by-one in output length ($N+M-1$, not $N+M$).

## @interview

Interviewers use convolution as an *understanding* probe, not a computation one. One-liners worth owning: "Why convolution? — it's the unique consequence of linearity + time invariance." "Why flipped? — τ enters as t−τ; recent inputs meet the young part of the memory." "What's the frequency-domain view? — convolution becomes multiplication; filtering is literally reshaping the spectrum." A favorite follow-up: "when is convolution commutative?" — always for signals, and the swap button proves x and h are interchangeable *mathematically* even though physically one is a signal and one is a system.

## @history

The integral predates the name: Euler and Laplace used superposition integrals in the 1700s; D'Alembert's vibrating-string work contains the idea in embryo. The name "convolution" (Faltung — "folding" — in German, which is exactly the flip) settled in the 1920s. The operational calculus of Oliver Heaviside — an engineer distrusted by mathematicians for decades — is what turned superposition into an everyday engineering tool; rigor caught up with him only after his methods had already built the telegraph network.

## @summary

$$y(t) = \int_{-\infty}^{\infty} x(\tau)h(t-\tau)\,d\tau \qquad y[n] = \sum_k x[k]h[n-k]$$

- **Meaning:** every input moment launches a scaled, delayed copy of h; the output is all copies summed.
- **Support:** $[a,b]*[c,d] \subseteq [a+c, b+d]$; DT length $N+M-1$.
- **Identity:** $x*\delta = x$;  shift: $x * \delta(t-t_0) = x(t-t_0)$.
- **Commutative, associative, distributive** — series order never matters (LTI only).
- **Smoothing:** wide h ⇒ blur;  $s(t) = \int_{-\infty}^t h$ (step response is the running integral of h).
- **Exam ritual:** supports → output support → regime boundaries → limits per regime → integrate → continuity check.
