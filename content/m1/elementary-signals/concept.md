---
id: m1/elementary-signals
title: "Elementary signals: the alphabet every waveform is spelled with"
short: Elementary Signals
module: 1
tier: core
hero: false
outcomes: [CO1]
prereqs: [m1/what-is-a-signal]
aliases: ["unit step", "u(t)", "unit ramp", "r(t)", "rect", "rectangular pulse", "signum", "sgn", "exponential signal", "sinusoid", "singularity functions", "standard signals", "sketch to formula", "piecewise signals"]
exam: { minor1: high, major: medium, marks: "4–8", styles: [sketch, compute] }
crosslinks:
  - { target: m1/impulse, relation: "differentiating the step once more (in the limit sense) forges the impulse — the chain r → u → δ" }
  - { target: m1/signal-operations, relation: "shifting and scaling these letters is how every exam sketch becomes a formula" }
  - { target: primers/complex-numbers, relation: "the complex exponential — the sinusoid's adult form — is built there, ready for the Fourier module" }
  - { target: m3/laplace-transform, relation: "transform tables are indexed by exactly these signals — know them cold and the tables read themselves" }
---

## @intuition

Look at any oscilloscope in any lab: a power rail that switches on, a motor speed climbing steadily, a radar pulse that fires and stops, a capacitor voltage dying away. You can photograph these traces — but a photograph cannot be integrated, filtered, or transformed. Engineering needs waveforms as *formulas*. The fix is an alphabet: a handful of standard signals with exact definitions, so that every trace a scope can show is written as a short algebraic word. This concept is that alphabet.

---
Each letter is one physical verb. The **unit step** is *switch on*: zero, then one, forever. The **ramp** is *rise steadily*: off, then climbing at slope one. The **rect** is *on for a while*: a gate that opens and shuts. The **signum** is *polarity*: minus one, then plus one. The **exponential** is *die away* (or blow up), and the **sinusoid** is *oscillate*. Six verbs. Combined with shifting, scaling, and adding, they spell every waveform this course will throw at you.

---
@viz explorer {"signal":"rampsig","a":1,"b":2}
The letters are related by calculus, and that is their real power. The explorer shows a delayed ramp: flat, then rising with slope 1 from $t=2$ (it levels off a second later — screens are finite; the pure $r(t-2)$ would climb forever). Read the slope: 0, then 1 — a step turning on at 2. Differentiating a ramp gives a step: $r'(t) = u(t)$ away from the corner. Run it backwards: integrating a step gives a ramp. The alphabet is a ladder; differentiation moves you down one rung.

---
One rung remains. Differentiate the step: the slope is zero on both sides, but the jump at $t=0$ hides all the action. Steepen the jump — a ramp rising over a tiny width $\Delta$ — and its derivative is a thin rectangle of height $1/\Delta$: always area one, ever narrower. As $\Delta \to 0$ that unit-area spike stops being an ordinary function. It earns its own concept next: the impulse. The full chain is $r \to u \to \delta$, one differentiation per arrow, the last one in the limit sense.

---
Here is the exam payoff. Every piecewise-linear sketch is steps and ramps in disguise: a **jump** is a step turning on; a **corner** (slope change) is a ramp turning on. Read a sketch event by event, write one term per event, and the formula assembles itself. That translation — sketch to formula and back — is worth near-guaranteed marks on Minor I, and it is the skill this page drills.

## @definition

The six letters, with the conventions Mahindra papers use:

$$u(t) = \begin{cases} 1, & t > 0 \\ 0, & t < 0 \end{cases} \qquad\qquad r(t) = t\,u(t) = \begin{cases} t, & t \ge 0 \\ 0, & t < 0 \end{cases}$$

$$\operatorname{rect}\!\left(\frac{t}{T}\right) = \begin{cases} 1, & |t| < T/2 \\ 0, & |t| > T/2 \end{cases} \qquad\qquad \operatorname{sgn}(t) = \begin{cases} +1, & t > 0 \\ -1, & t < 0 \end{cases}$$

$$x(t) = A\,e^{-t/\tau}\,u(t) \;\;\text{(switched decay, time constant } \tau\text{)} \qquad x(t) = A\cos(\omega_0 t + \phi)$$

Composition identities you will use constantly:

$$\operatorname{rect}\!\left(\frac{t}{T}\right) = u\!\left(t+\tfrac{T}{2}\right) - u\!\left(t-\tfrac{T}{2}\right) \qquad \operatorname{sgn}(t) = 2u(t) - 1 \qquad r(t) = \int_{-\infty}^{t} u(\tau)\,d\tau$$

**Reading the symbols.** A step (or any letter) turns on where its **argument** crosses zero: $u(t-t_0)$ switches at $t = t_0$ — solve the argument, never guess from the sign. The ramp's slope is exactly 1; a ramp of slope $m$ is $m\,r(t)$. In rect, $T$ is the **full width**, centered at 0; a pulse that is on for $a < t < b$ is $u(t-a) - u(t-b)$. In the exponential, $\tau$ is the time to fall to $e^{-1} \approx 37\%$ of the start; after $5\tau$ the signal is below 1% — "gone" by engineering standards. In the sinusoid, $\omega_0$ is in rad/s, $f_0 = \omega_0/2\pi$ in Hz, period $T_0 = 2\pi/\omega_0$.

**Exam conventions.** The value $u(0)$ may be taken as $0$, $\tfrac12$, or $1$ — it changes no integral and Mahindra papers leave it unspecified; do not spend time on it. Sketches must label corner times and levels. The complex exponential $e^{j\omega_0 t}$ waits for the complex-numbers primer and the Fourier module; everything here is real.

## @derivation

The goal: establish the calculus chain $r \to u \to \delta$, then extract the sketch-to-formula recipe from it.

### Step: Differentiate the ramp — you get the step
?why: For t ≠ 0 the ramp is a straight line on each side; slopes read off directly.
For $t < 0$, $r(t) = 0$: slope $0$. For $t > 0$, $r(t) = t$: slope $1$. So $r'(t) = u(t)$ for every $t \neq 0$; at the single corner point the derivative is undefined, but no integral ever notices one point.

### Step: Integrate the step — you get the ramp back
?why: Fundamental theorem of calculus, applied on each flat piece.
$$\int_{-\infty}^{t} u(\tau)\,d\tau = \begin{cases} 0, & t < 0 \\ t, & t \ge 0 \end{cases} \;=\; r(t)$$
So $(u, r)$ is a derivative–integral pair: the ladder works in both directions.

### Step: Differentiate the step — classical calculus taps out
?why: u is flat on each side, so the pointwise derivative is 0 for all t ≠ 0 — but integrating 0 gives 0, not u. The jump must be carrying hidden content.
Replace the jump by a steep ramp climbing from 0 to 1 over a width $\Delta$. Its derivative exists everywhere except two corners: a rectangle of height $1/\Delta$ and width $\Delta$ — **area exactly 1 for every** $\Delta$.

### Step: Take the limit — a unit-area spike
?why: The area stays pinned at 1 while the width shrinks; whatever the limit is, it is not an ordinary function.
As $\Delta \to 0$ the derivative-pulses grow taller and narrower with area locked at 1. The limiting object — defined honestly in the next concept by what it does inside integrals — is the impulse $\delta(t)$. Chain complete: $r \xrightarrow{d/dt} u \xrightarrow{d/dt} \delta$, the last arrow in the limit sense.

### Step: The sketch-to-formula recipe falls out
?why: In a piecewise-linear signal the only possible "events" are jumps and slope changes — and we now know which letter produces each.
At each event time $t_0$: a jump of height $\Delta A$ contributes $\Delta A\, u(t - t_0)$; a slope change of $\Delta m$ contributes $\Delta m\, r(t - t_0)$. Sum one term per event. That is the whole algorithm.

### Step: Notice what was NOT assumed
?why: The chain is pure calculus plus one honest limit — no circuits, no physics, no shape assumptions.
Nothing depends on what the signal means. Differentiation sharpens ($r \to u \to \delta$); integration smooths ($\delta \to u \to r$). That two-way ladder is the deep structure behind step responses and transform tables later in the course.

## @examples

**Worked: sketch → formula (the Minor I staple).** A signal rises from 0 to 2 over $[0,2]$, holds at 2 until $t=4$, then falls to 0 at $t=6$. The method ritual:

1. **Event table first.** $t=0$: slope changes $0 \to 1$ ($\Delta m = +1$). $t=2$: slope $1 \to 0$ ($\Delta m = -1$). $t=4$: slope $0 \to -1$ ($\Delta m = -1$). $t=6$: slope $-1 \to 0$ ($\Delta m = +1$). No jumps anywhere.
2. **One ramp per event:** $x(t) = r(t) - r(t-2) - r(t-4) + r(t-6)$.
3. **Verify at test points:** $x(2) = 2-0-0+0 = 2$ ✓. $x(5) = 5-3-1+0 = 1$ ✓ (halfway down the fall). $x(7) = 7-5-3+1 = 0$ ✓.
4. **Coefficient check:** the ramp coefficients sum to $1-1-1+1 = 0$ — the final slope. If they don't cancel, your "pulse" marches off to $\pm\infty$. *This one-line check catches the most common wrong answer before the examiner does.*

**Worked: formula → sketch, with a jump.** $x(t) = 2u(t-1) - r(t-1) + r(t-3)$. Read the letters separately: the $u$-term says *jump up by 2 at* $t=1$; the ramp pair says *slope $-1$ starting at 1, cancelled at 3*. So: zero until $t=1$, jump to 2, fall with slope $-1$ reaching $2 - 2 = 0$ at $t=3$, flat zero after. Jumps come only from steps; corners come only from ramps — decoding them independently is what makes this fast.

**Worked: engineering skin — the switched discharge and the radar gate.** A charged capacitor is switched onto a resistor at $t=0$: $v(t) = 5\,e^{-t/RC}\,u(t)$. The $u(t)$ is doing real work: without it, $e^{-t/RC}$ *explodes toward the past* (at $t = -5RC$ it is already $e^{5} \approx 148$ times bigger). The step is how a formula says "nothing happened before the switch closed." A radar transmitter gates a sinusoid the same way: $x(t) = \cos(\omega_0 t)\,[u(t) - u(t-T)]$ — a burst that exists for exactly $T$ seconds. Multiplying by a step pair is the standard on/off switch of signal processing.

## @misconceptions
- wrong: "u(t−2) starts earlier — the minus sign pushes it left."
  tempting: "Subtracting feels like moving backward along the time axis."
  correction: "A letter turns on where its ARGUMENT crosses zero: t−2 = 0 at t = 2, so u(t−2) switches on LATER, at t = 2. Always solve argument = 0; never trust the sign's 'direction'."
  probe: q-step-shift
- wrong: "r(t) − r(t−2) comes back down to zero at t = 2, the way u(t) − u(t−2) does."
  tempting: "The step pair makes a pulse that returns to zero, so the ramp pair should match."
  correction: "Subtracting a delayed ramp cancels the SLOPE, not the accumulated height: r(t) − r(t−2) climbs to 2 and then stays at 2 forever. Steps subtract values; ramps subtract slopes. Coming back down needs additional downhill ramps."
- wrong: "The derivative of u(t) is zero — u is flat everywhere you look."
  tempting: "Pointwise, the slope really is zero at every t ≠ 0."
  correction: "All the action hides in the jump. Steepen the jump over a width Δ and the derivative is a unit-area pulse of height 1/Δ; the Δ → 0 limit is the impulse, not zero. If u′ were truly 0, integrating it could never rebuild the step."
- wrong: "e^(−t) is a decaying signal, full stop."
  tempting: "The exponent is negative, so it must shrink."
  correction: "It decays only toward the future. Toward the past it explodes: e^(−t) → ∞ as t → −∞. The physically switched decay is e^(−t)u(t) — the step is load-bearing, not decoration."
  probe: q-exp-past

## @exam

**Where it appears:** Minor I, near-guaranteed, 4–8 marks: (a) sketch a given steps-and-ramps formula; (b) express a given sketch in steps and ramps; (c) short simplifications (write sgn via u, gate a sinusoid, identify a time constant). It also hides inside bigger questions: a wrong $x(t)$ here silently poisons a 10-mark convolution or Laplace problem downstream.

**The method that earns full marks:** (1) build the event table — every time where a jump or slope change happens, with $\Delta A$ and $\Delta m$; (2) write one term per event, $\Delta A\,u(t-t_0) + \Delta m\,r(t-t_0)$; (3) run the coefficient checks — ramp coefficients must sum to the final slope (usually 0), steps plus accumulated ramps must give the final level; (4) verify two test points in the regimes you trust least; (5) on sketches, label every corner time and level — unlabeled corners drop marks.

**Traps that cost marks:** shift direction ($u(t-2)$ turns on at $+2$, not $-2$); the plateau error (pattern-matching $r(t)-r(t-2)$ to a rect); forgetting the closing ramp so the formula drifts to $-\infty$; writing a width-$T$ rect as $u(t) - u(t - T/2)$; mixing amplitude with slope — a ramp reaching height 4 over 2 s has slope 2, so it is $2r(t)$, not $4r(t)$.

## @interview

Own these one-liners: "Why are $u$, $r$, $\delta$ called *singularity functions*? — each differentiation makes them one degree more singular, ending at $\delta$." "What does $u(t)$ buy in $e^{-t}u(t)$? — causality: nothing exists before the switch." "Express sgn via the step? — $2u(t)-1$; and sgn is odd, which will matter for Fourier symmetry." "What is the time constant, physically? — the 37% mark; five of them and the transient is dead to 1%." "Fastest sanity check on a steps-and-ramps answer? — sum the ramp coefficients: that is the final slope, and it must match the sketch."

## @history

The step function carries Oliver Heaviside's name for a reason: the self-taught telegraph engineer built his 1890s "operational calculus" on switching functions and their forbidden derivatives, solving cable problems the rigorous mathematics of his day could not touch. His methods were dismissed as unjustified for decades — his reply, roughly, was that he did not refuse dinner because he did not fully understand digestion. Every $u(t)$ you write is his shorthand for "the switch closes now."

## @summary

$$u(t)=\begin{cases}1,& t>0\\0,& t<0\end{cases} \qquad r(t)=t\,u(t) \qquad \operatorname{sgn}(t)=2u(t)-1 \qquad \operatorname{rect}\!\left(\tfrac{t}{T}\right)=u\!\left(t+\tfrac{T}{2}\right)-u\!\left(t-\tfrac{T}{2}\right)$$

- **Pulse on $[a,b]$:** $u(t-a) - u(t-b)$; amplitude $A$ multiplies in front.
- **The chain:** $r \xrightarrow{d/dt} u \xrightarrow{d/dt} \delta$ (last arrow in the limit sense); integrate to climb back up.
- **Sketch → formula:** each jump $\Delta A$ at $t_0$ → $\Delta A\,u(t-t_0)$; each slope change $\Delta m$ at $t_0$ → $\Delta m\,r(t-t_0)$.
- **Checks:** ramp coefficients sum to the final slope; verify two test points; a letter turns on where its argument crosses zero.
- **Switched decay:** $e^{-t/\tau}u(t)$ — value $\approx 37\%$ at $t=\tau$, dead after $5\tau$; without $u(t)$ it explodes toward the past.
- **Sinusoid:** $A\cos(\omega_0 t + \phi)$, period $2\pi/\omega_0$; gate a burst by multiplying with a step pair.
- **Handy scaling fact:** $r(at) = a\,r(t)$ for $a > 0$ — compressing a ramp is the same as amplifying it.
