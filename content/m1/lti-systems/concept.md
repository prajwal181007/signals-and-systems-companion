---
id: m1/lti-systems
title: "LTI systems: the two promises that unlock everything"
short: LTI systems
module: 1
tier: core
outcomes: [CO1]
prereqs: [m1/system-properties]
aliases: ["linear time-invariant", "LTI", "superposition", "LTI properties"]
exam: { minor1: high, major: high, marks: "4–8", styles: [conceptual, derive] }
crosslinks:
  - { target: m1/impulse-response, relation: "the payoff: one recorded response characterizes the whole system" }
  - { target: m2/frequency-response, relation: "the second payoff: sinusoids pass through unchanged in shape — eigenfunctions" }
---

## @intuition

Of all possible systems — nonlinear, shifty, chaotic — this course spends 90% of its time on the tiny subclass that keeps two promises: **linearity** (superposition works) and **time-invariance** (the rules don't drift). Why such devotion? Because those two promises together produce a miracle: *complete knowledge of the system from one experiment*. No other class of systems offers anything close.

---
Here is the miracle's mechanism, in words. Any input can be chopped into elementary pieces (thin pulses). Linearity says: process the pieces separately and add — the system cannot object. Time-invariance says: every piece gets the *same* treatment, just delayed to its own moment. So knowing the response to ONE standard piece — one impulse — determines the response to every input that will ever exist. The next two concepts cash this in as $h(t)$ and convolution.

---
The promises also buy a second miracle, visible without any computation: feed an LTI system $\cos(\omega t)$ forever, and the output is $\cos(\omega t + \phi)$ scaled — *the same frequency*, always. Sums of sinusoids come out as the same sums, reweighted. No new frequencies are ever created (distortion = evidence of nonlinearity). This is why the frequency domain will work: sinusoids are the food LTI systems digest without changing its species.

---
Real devices only *approximately* keep the promises — an amplifier clips (nonlinear at the edges), components age (slow time-variation). LTI analysis is engineering's most successful idealization: valid in the small-signal regime, checked at the boundaries. Knowing when the promises break is part of owning the tool.

## @definition

A system is **LTI** if it is both linear and time-invariant. Consequences bundled with the name:
- **Superposition machinery:** $x = \sum_k a_k x_k \Rightarrow y = \sum_k a_k y_k$, including infinite sums and integrals (the limits that make convolution legal).
- **Frequency preservation:** sinusoidal steady state in ⇒ same-frequency sinusoid out. Complex exponentials $e^{st}$ are **eigenfunctions**: $e^{st} \mapsto H(s)e^{st}$ — the output is the input times a (complex) constant.
- **Commuting with shifts and derivatives:** the response to $x'(t)$ is $y'(t)$; the response to $x(t{-}t_0)$ is $y(t{-}t_0)$. Differentiate the step response ⇒ impulse response.
- Series/parallel interconnections of LTI systems are LTI; series order is irrelevant.

## @derivation

### Step: Eigenfunction property — the two-line proof with a big consequence
?why: Time-invariance handles the shift; the exponential turns a shift into a scale factor.
Let $y(t)$ be the response to $x(t) = e^{st}$. Feed the shifted input $e^{s(t-\tau)} = e^{-s\tau}e^{st}$. By TI the response is $y(t-\tau)$; by linearity (input scaled by $e^{-s\tau}$) it is also $e^{-s\tau}y(t)$. So $y(t-\tau) = e^{-s\tau}y(t)$ for all $\tau$ — forcing $y(t) = H\,e^{st}$ for some constant $H$ (set $t = 0$). The exponential's shape survives; only its amplitude/phase is touched.

### Step: Why no new frequencies can appear
?why: A real sinusoid is two conjugate eigenfunctions; each is scaled, none is created.
$\cos(\omega t) = \tfrac12 e^{j\omega t} + \tfrac12 e^{-j\omega t}$; the system scales each term by $H(j\omega)$, $H(-j\omega)$. The output contains exactly the frequencies $\pm\omega$ — nothing else. Any harmonic you measure at the output of a real amplifier is a confession of nonlinearity (that's literally what a distortion analyzer measures).

### Step: Differentiation commutes
?why: The derivative is a limit of shifted differences, and both operations that build it commute with the system.
$x'(t) = \lim_{\epsilon\to 0}\tfrac{1}{\epsilon}[x(t) - x(t-\epsilon)]$ — scaling, shifting, subtracting, and limits are all superposition-legal. Hence step response $s(t)$ and impulse response $h(t)$ are locked together: $h = ds/dt$, $s(t) = \int_{-\infty}^t h$.

## @examples

**Worked (using superposition to skip work):** an LTI system's step response is $s(t) = (1 - e^{-t})u(t)$. Response to $x(t) = 3u(t) - 3u(t-2)$ (a pulse of height 3, width 2)? By L+TI: $y = 3s(t) - 3s(t-2) = 3(1-e^{-t})u(t) - 3(1-e^{-(t-2)})u(t-2)$. No convolution needed — decompose the input into things you already know.

**Worked (eigenfunction in action):** the same system has $H(j1) = \tfrac{1}{1+j}$ (magnitude $1/\sqrt2$, phase $-45°$). Steady-state response to $\cos(t)$: $\tfrac{1}{\sqrt2}\cos(t - \pi/4)$. One complex number answered the whole question — the promise of Module 2.

**Boundary example:** an amplifier with $y = \tanh(x)$ is nearly linear for $|x| \ll 1$ and badly nonlinear near saturation — feed a pure tone near clipping and harmonics appear at $3\omega, 5\omega$. LTI analysis applies in the small-signal window; the harmonics measure how far outside it you are.

## @misconceptions
- wrong: "LTI is just a modeling convenience — real insight needs the full nonlinear system."
  tempting: "Reality is nonlinear, so the linear theory feels like a toy."
  correction: "The LTI theory is exact for the idealization and DOMINANT in practice: filters, channels, circuits, mechanics near equilibrium. Even nonlinear design starts by linearizing. The 'toy' carries the entire discipline."
- wrong: "An LTI system can output frequencies the input lacks (e.g. harmonics)."
  tempting: "Systems 'do things' to signals, and distortion is a familiar sound."
  correction: "Impossible: eigenfunctions in, scaled eigenfunctions out. Harmonic distortion is DEFINED as the nonlinearity signature. If new frequencies appear, the box is not LTI — that is a measurement, not an opinion."
- wrong: "Knowing the response to one input tells you nothing about others."
  tempting: "Different inputs are different problems."
  correction: "For LTI systems, one well-chosen input (the impulse, or the step) determines ALL responses — that is the defining miracle, and the entire justification for h(t)."

## @exam

Appears as (a) conceptual questions — state/derive the eigenfunction property, explain why LTI systems can't create frequencies (4–6 marks); (b) superposition shortcuts — given a step response, find the response to staircase/pulse inputs by shifting and scaling $s(t)$ (4–8 marks; the mark scheme wants the decomposition written explicitly before substitution); (c) as the silent foundation of every convolution and transform question after. Trap: applying superposition to a system that fails linearity ($y = x+1$, $y = x^2$) — always verify LTI before invoking its privileges.

## @summary

- LTI = superposition + shift-commuting. Together: **one experiment determines all behavior** (→ $h(t)$, convolution).
- **Eigenfunctions:** $e^{st} \mapsto H(s)e^{st}$; sinusoid in ⇒ same-frequency sinusoid out; new frequencies = nonlinearity.
- Differentiation/shift commute: $h = ds/dt$, response to $x(t-t_0)$ is $y(t-t_0)$.
- Step-response shortcut: decompose inputs into scaled/shifted steps; add scaled/shifted $s(t)$.
- Check the promises before using the privileges; small-signal regime is where real devices keep them.
