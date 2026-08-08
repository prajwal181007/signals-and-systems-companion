---
id: m1/energy-and-power
title: "Energy and power signals: a race between two meters"
short: Energy & power
module: 1
tier: core
outcomes: [CO1]
prereqs: [m1/what-is-a-signal]
aliases: ["energy signal", "power signal", "mean power", "signal magnitude", "rms"]
exam: { minor1: high, major: medium, marks: "4–8", styles: [compute, conceptual] }
crosslinks:
  - { target: m2/parseval, relation: "Parseval computes the same energy from the spectrum — energy is basis-independent" }
  - { target: m2/white-noise-psd, relation: "power signals are exactly the ones whose right spectral object is a power spectral density" }
---

## @intuition

A camera flash and a lighthouse both "emit light" — but you'd never rate them the same way. The flash delivers a finite blast of joules and is done; the lighthouse delivers a steady rate of joules forever. Signals split the same way, and the split decides which mathematics applies to them for the rest of the course.

---
@viz race {"signal":"expdecay"}
Watch the two meters race as the observation window $[-T, T]$ grows. $E(T)$ accumulates $\int|x|^2dt$; $P(T) = E(T)/2T$ is the running average. For a decaying pulse, $E$ levels off at a finite number — and once $E$ stops growing, dividing by an ever-larger $2T$ drives $P \to 0$. **Energy signal: finite blast, zero average.**

---
@viz race {"signal":"sine"}
Now a sinusoid. $E$ climbs forever — every new cycle deposits the same energy. But $P$ settles to a constant: energy grows *linearly*, so energy-per-time converges. **Power signal: infinite total, finite rate.** The number it settles at, $A^2/2$ for amplitude $A$, is one of the most-used constants in engineering.

---
@viz race {"signal":"ramp"}
Can a signal be neither? Feed the ramp $t\,u(t)$: it outruns even the averaging — $P$ diverges too. So the classification is really about the **asymptotic growth rate of accumulated energy**: saturating (energy), linear (power), faster (neither). Amplitude at any instant is irrelevant; the tail behavior is everything.

## @definition

$$E = \int_{-\infty}^{\infty} |x(t)|^2\,dt \qquad P = \lim_{T\to\infty}\frac{1}{2T}\int_{-T}^{T} |x(t)|^2\,dt$$

(DT: $E = \sum_n |x[n]|^2$, $P = \lim_{N\to\infty}\frac{1}{2N+1}\sum_{-N}^{N}|x[n]|^2$.)

- **Energy signal:** $0 < E < \infty$ (then automatically $P = 0$).
- **Power signal:** $0 < P < \infty$ (then automatically $E = \infty$).
- **Neither:** both diverge (e.g. $t\,u(t)$). No signal is both — a finite $E$ forces $P = 0$.
- For periodic signals, average over one period suffices: $P = \frac{1}{T_0}\int_{T_0}|x|^2dt$. **Mean power of $A\cos(\omega_0 t + \phi)$ is $A^2/2$** regardless of frequency and phase. RMS value $= \sqrt{P}$.

**Reading the symbols:** $|x|^2$ is instantaneous power (think $v^2/R$ with $R = 1\,\Omega$ — the universal normalization); the integral accumulates it into energy; dividing by window length turns it into a rate.

## @derivation

### Step: Mean power of a sinusoid — the computation you will do a hundred times
?why: cos² averages to ½ because cos²θ = (1 + cos 2θ)/2 and the oscillating half integrates to zero over a period.
$$P = \frac{1}{T_0}\int_0^{T_0} A^2\cos^2(\omega_0 t)\,dt = \frac{A^2}{T_0}\int_0^{T_0}\frac{1 + \cos(2\omega_0 t)}{2}dt = \frac{A^2}{2}$$
The $\cos(2\omega_0 t)$ term completes whole cycles over $T_0$ and contributes nothing.

### Step: Finite energy forces zero power
?why: A finite numerator over an unbounded denominator.
If $E < \infty$, then $P = \lim_{T\to\infty} \frac{1}{2T}\underbrace{\int_{-T}^{T}|x|^2}_{\le E} \le \lim \frac{E}{2T} = 0$. Hence the classes are exclusive — a signal cannot be a *little* of both.

### Step: The classes are about tails, not peaks
?why: Any bounded, finite-duration chunk contributes finite energy; only tail behavior can make E or P diverge.
Truncate any signal to $[-10, 10]$: always an energy signal. Divergence needs an infinite tail that decays too slowly (or not at all). This is why $e^{-t}u(t)$ (integrable tail) is energy-type and $u(t)$ (flat tail) is power-type with $P = \tfrac12$.

## @examples

**Worked (exam pattern):** classify $x(t) = e^{-2t}u(t)$. $E = \int_0^\infty e^{-4t}dt = \tfrac14$ — finite ⇒ energy signal, $P = 0$. Ritual: write the integral, evaluate, then STATE the class and the other quantity.

**Worked:** $x(t) = u(t)$. $E = \int_0^\infty 1\,dt = \infty$. $P = \lim \frac{1}{2T}\int_0^T 1\,dt = \lim \frac{T}{2T} = \tfrac12$ ⇒ power signal with $P = \tfrac12$ — the window is two-sided but the signal fills only half of it, hence the $\tfrac12$.

**Worked:** $x(t) = 3\cos(10t) + 4\sin(10t)$. Same frequency ⇒ combine: amplitude $\sqrt{3^2+4^2} = 5$, so $P = 25/2$. For *different* frequencies, powers add directly ($P = \tfrac{9}{2} + \tfrac{16}{2}$) because cross-terms average to zero — orthogonality, quietly previewing Module 2.

## @misconceptions
- wrong: "Big amplitude ⇒ power signal, small ⇒ energy signal."
  tempting: "Power sounds like strength."
  correction: "Classification reads the TAIL, not the peak. A million-volt flash (decaying) is an energy signal; a microvolt sinusoid is a power signal. Ask: does accumulated energy saturate, grow linearly, or worse?"
- wrong: "P is the power at some instant."
  tempting: "The word 'power' is used for |x(t)|² too."
  correction: "|x(t)|² is instantaneous power; P is its long-run AVERAGE. Exams ask for P (mean power) — a single number, not a function."
- wrong: "Every signal is either energy-type or power-type."
  tempting: "The two definitions feel exhaustive."
  correction: "t·u(t) defeats both — energy grows like T³. 'Neither' is a real answer and exams use it."

## @exam

Reliable 4–8 marks in Minor I: classify 3–4 given signals with computed $E$ and $P$. Full-marks ritual: (1) write the defining integral for THIS signal; (2) evaluate cleanly (know $\int e^{-at}$, cos² → ½ tricks); (3) state class AND the value of the finite quantity; (4) for periodic signals integrate over one period only and say so. Traps: $u(t)$ gives $P = 1/2$ (not 1); combining same-frequency sinusoids before squaring; forgetting that "neither" exists ($t\,u(t)$ appears regularly).

## @summary

$$E = \int |x|^2 dt,\qquad P = \lim_{T\to\infty}\tfrac{1}{2T}\int_{-T}^{T}|x|^2dt,\qquad P_{A\cos} = \tfrac{A^2}{2},\qquad \text{RMS} = \sqrt{P}$$

- Energy signal: $E$ finite ⇒ $P = 0$. Power signal: $P$ finite ≠ 0 ⇒ $E = \infty$. Neither: both diverge ($t\,u(t)$). Never both.
- Periodic ⇒ average over one period; $u(t)$ ⇒ $P = \tfrac12$; decaying exponentials ⇒ energy-type.
- Same-frequency sinusoids: combine amplitudes first. Different frequencies: powers add.
- The classification is about asymptotic tail growth of $\int |x|^2$ — never about amplitude.
