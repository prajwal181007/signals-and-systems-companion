---
id: m3/s-plane
title: "The s-plane: a map where every point is a waveform"
short: s-Plane
module: 3
tier: core
hero: false
outcomes: [CO3]
prereqs: [primers/complex-numbers]
aliases: ["complex frequency", "sigma omega plane", "e^st", "complex frequency plane", "left half plane", "LHP", "RHP", "s domain map", "pole location intuition", "decaying exponential map"]
exam: { minor2: medium, major: high, marks: "4–6", styles: [conceptual, sketch, compute] }
crosslinks:
  - { target: m3/laplace-transform, relation: "the Laplace transform measures how much of each e^{st} lives inside a signal — the s-plane is its address system" }
  - { target: m1/lti-systems, relation: "e^{st} passes through any LTI system with its shape intact, only scaled — that eigenfunction property is why this family gets a map" }
  - { target: m3/z-transform, relation: "the z-plane is the same atlas after sampling: vertical lines wrap into circles" }
  - { target: m5/bode-plots, relation: "every stability judgment in control engineering is read off pole positions on this map" }
---

## @intuition

An experienced engineer glances at a few × marks on a grid and announces: "this design rings about five times a second and settles within two — ship it; that one will shake itself apart." No simulation, no equations solved. The secret: the marks sit on a map where every location *is* a complete waveform — read the position and you have already seen the signal. This concept hands you that map, the **s-plane**. Every pole-zero plot for the rest of your degree is written in its language.

---
@viz atlas {"sigma":-1,"omega":0}
Start on the horizontal axis. Drag $s$ left of the origin: the waveform is pure decay — the further left, the faster it dies. Drag right: pure runaway growth. The origin itself is a constant, frozen forever. The horizontal coordinate — called $\sigma$ — is the decay/growth knob, and nothing else. One number tells you the fate of the envelope: negative dies, positive explodes, zero holds steady.

---
@viz atlas {"sigma":0,"omega":5}
Now climb the vertical axis. At height $\omega$ the waveform oscillates — $\omega$ radians per second, forever, at constant amplitude. Higher up: faster wiggling. The vertical coordinate is the oscillation-rate knob and nothing else. The two axes never interfere: $\sigma$ owns the envelope, $\omega$ owns the wiggle. Every waveform on this map is a combination of exactly these two behaviors.

---
@viz atlas {"sigma":-0.5,"omega":5}
Any other point mixes the two: a decaying ring here (left and up), a growing shriek at the mirror point on the right. This is the atlas's three-zone law, worth more than any formula in this module: **left half dies, right half explodes, the axis between them sustains.** Stability analysis — Modules 3 through 5 — is the art of asking which zone a system's marks occupy.

---
One honest confession: the waveform at a single off-axis point is complex-valued — a spiral, not something an oscilloscope can display. Real signals are built from **conjugate pairs**: a point and its mirror image below the real axis working together, imaginary parts cancelling, leaving a real decaying (or growing) cosine. That is why every pole plot of a real system is symmetric about the horizontal axis. Twins, always.

---
From here on, this atlas is a *reading skill*. When Laplace hands you "poles at $-2 \pm j10$", you should instantly see the thumbnail: a cosine at 10 rad/s inside an envelope dying with a half-second time constant. Practice until pole positions render as little movies in your head — that is the entire point of this concept.

## @definition

The **complex frequency** is $s = \sigma + j\omega$, and each point of the s-plane names the waveform

$$e^{st} = e^{\sigma t}\,e^{j\omega t} = e^{\sigma t}\big(\cos\omega t + j\sin\omega t\big)$$

A single off-axis point gives a complex spiral; a **conjugate pair** $\{s, s^*\}$ with $s^* = \sigma - j\omega$ builds the real waveform

$$e^{st} + e^{s^*t} = 2e^{\sigma t}\cos\omega t$$

(with complex weights $A$ and $A^*$, the pair gives $2|A|\,e^{\sigma t}\cos(\omega t + \angle A)$).

**Reading the symbols.** $\sigma = \operatorname{Re} s$ (units $\text{s}^{-1}$) is the envelope rate: the amplitude follows $e^{\sigma t}$, so for $\sigma < 0$ the **time constant** is $1/|\sigma|$ (about 37% left after one time constant, about 2% after four). $\omega = \operatorname{Im} s$ (rad/s) is the oscillation rate: period $2\pi/\omega$, frequency in hertz $f = \omega/2\pi$. The symbol $j$ is the engineer's name for the $i$ of your 10+2 complex numbers — see the complex-numbers primer for Euler's formula, the one identity this whole map rests on.

**Exam conventions.** Axes are labeled $\sigma$ (horizontal) and $j\omega$ (vertical). "LHP" and "RHP" mean the *open* half-planes $\operatorname{Re} s < 0$ and $\operatorname{Re} s > 0$; the $j\omega$ axis belongs to neither. Poles are drawn as $\times$, zeros as $\circ$ (they arrive with the transform). Standard verdicts: LHP marks = "decaying modes / stable", axis marks = "marginal / sustained", RHP marks = "growing modes / unstable".

## @derivation

The whole atlas unfolds from one splitting of an exponent. Watch how far three lines of 10+2 algebra go.

### Step: Split the exponent
?why: The law e^{p+q} = e^p·e^q holds for complex exponents — it is the defining property of exp.
$$e^{st} = e^{(\sigma + j\omega)t} = e^{\sigma t}\cdot e^{j\omega t}$$
The two coordinates of $s$ land in separate factors and never mix again. Everything the atlas shows follows from reading each factor alone.

### Step: Unpack the rotating factor with Euler's formula
?why: Euler's formula (complex-numbers primer): e^{jθ} = cos θ + j sin θ, a point on the unit circle at angle θ.
$$e^{j\omega t} = \cos\omega t + j\sin\omega t$$
As $t$ advances, the angle $\omega t$ grows: a point circling the unit circle at $\omega$ radians per second. No growth, no decay — pure rotation.

### Step: The real factor scales the radius
?why: Multiplying a unit-circle point by the positive number e^{σt} moves it radially.
$$e^{st} = e^{\sigma t}\big(\cos\omega t + j\sin\omega t\big)$$
A rotating point whose distance from the origin is $e^{\sigma t}$: a shrinking spiral for $\sigma < 0$, a growing spiral for $\sigma > 0$, a perfect circle for $\sigma = 0$. One complex number $s$ encodes an entire motion.

### Step: Real signals demand conjugate twins
?why: Adding any complex number to its conjugate cancels imaginary parts — z + z* = 2 Re z.
$$e^{st} + e^{s^*t} = 2\operatorname{Re}\big\{e^{st}\big\} = 2e^{\sigma t}\cos\omega t$$
An oscilloscope shows real voltages, so every off-axis point works in a pair with its mirror image $s^* = \sigma - j\omega$. This is why pole plots of real systems are always symmetric about the real axis — and why a lone complex pole in your working is a sign of an arithmetic slip.

### Step: Notice what was NOT assumed
?why: e^{st} is an eigenfunction of every LTI system — the deep reason THIS family gets a map and no other family does.
Nothing about circuits, springs, or acoustics. Feed $e^{st}$ into *any* LTI system and the convolution integral factors:
$$y(t) = \int_{-\infty}^{\infty} h(\tau)\,e^{s(t-\tau)}\,d\tau = e^{st}\underbrace{\int_{-\infty}^{\infty} h(\tau)\,e^{-s\tau}\,d\tau}_{H(s)}$$
The output is $H(s)\,e^{st}$ — the same waveform, merely scaled by a complex constant. Atlas waveforms pass through LTI systems shape-intact, which is exactly why decomposing signals into them (the Laplace transform, next concept) makes systems easy. And that inner integral you just met? Memorize its face — it *is* the Laplace transform.

## @examples

**Worked (exam style): read a conjugate pair.** A system has poles at $s = -2 \pm j10$. Describe the natural response. The ritual — real part first, imaginary part second, then combine:

1. $\sigma = -2$: envelope $e^{-2t}$, time constant $1/2 = 0.5$ s; effectively gone (about 2%) after $4 \times 0.5 = 2$ s.
2. $\omega = 10$ rad/s: period $2\pi/10 \approx 0.63$ s; in hertz, $f = 10/2\pi \approx 1.59$ Hz.
3. Conjugate pair present ⇒ real waveform $\propto e^{-2t}\cos(10t + \phi)$.
4. Sanity sketch: about $2/0.63 \approx 3$ visible cycles before the envelope swallows the ring.

Answer in one exam sentence: *a decaying oscillation at 10 rad/s (≈1.6 Hz) with time constant 0.5 s, essentially settled by t = 2 s.* Sketch with dashed $\pm e^{-2t}$ envelope guides — examiners look for those guides.

**Worked (engineering skin): locate a tuning fork on the map.** A microphone records a struck A440 fork. The scope shows the amplitude halving every 0.8 s. Where does this sound live on the s-plane? Decay: $e^{\sigma \cdot 0.8} = \tfrac12 \Rightarrow \sigma = -\ln 2/0.8 \approx -0.87\ \text{s}^{-1}$. Oscillation: $\omega = 2\pi \times 440 \approx 2765$ rad/s. Poles: $s \approx -0.87 \pm j2765$. Note the wild aspect ratio — $|\omega| \gg |\sigma|$ — the point sits a whisker left of the axis and enormously high: hundreds of cycles per e-fold of decay, which is exactly why a fork *rings* rather than *thuds*.

**Worked: the boundary cases (matching-question drill).** Fill the verdicts:

| Point(s) | Waveform | Physical example |
|---|---|---|
| $s = 0$ | constant (DC) | a battery's steady voltage |
| $s = \pm j\omega_0$ | sustained $\cos\omega_0 t$ | ideal lossless LC oscillation |
| $s = -3$ | pure decay $e^{-3t}$ | RC discharge, no ringing |
| $s = +0.5$ | pure growth $e^{0.5t}$ | feedback squeal beginning, thermal runaway |
| $s = 0.3 \pm j8$ | growing oscillation | flutter — the "shakes itself apart" case |

Exams present exactly this as match-the-column for 4–6 marks. Decide $\sigma$-zone first, $\omega$ second — never the reverse.

## @misconceptions
- wrong: "ω on the map is the frequency in hertz."
  tempting: "440 appears in 'A440', so its pole should sit at height 440."
  correction: "The vertical axis is radians per second: f = ω/2π. A440 sits at ω ≈ 2765 rad/s. Mixing the two scales every later answer by 6.28 — a classic lost mark."
  probe: q-hz
- wrong: "A single complex point s produces the real waveform e^{σt}cos ωt."
  tempting: "The atlas appears to show exactly that at one point."
  correction: "One off-axis point gives the complex spiral e^{st}. Real signals need the conjugate twin: e^{st} + e^{s*t} = 2e^{σt}cos ωt — a pair, with a factor of 2 that exams notice when you drop it."
  probe: q-pair
- wrong: "Points far from the origin decay fast."
  tempting: "Distance feels like intensity — bigger |s|, more extreme behavior."
  correction: "Only the horizontal coordinate touches the envelope. s = −0.1 + j1000 oscillates furiously yet decays lazily (time constant 10 s); s = −5 dies fast without oscillating at all. Read σ and ω separately, always."
  probe: q-race
- wrong: "Left half-plane means the waveform goes negative."
  tempting: "'Negative σ' sounds like 'negative signal'."
  correction: "σ < 0 shrinks the ENVELOPE; the waveform still swings both positive and negative whenever ω ≠ 0. The sign of σ and the sign of the signal are unrelated."

## @exam

**Where it appears:** Minor II and the Major, usually 4–6 marks standalone and silently embedded in every transfer-function question: (a) match pole plots to waveform sketches; (b) given poles, state time constant, oscillation frequency (rad/s *and* Hz — read which is asked), and stability verdict; (c) sketch the natural response with envelope guides; (d) "which of these systems is stable?" by inspection.

**The method that earns full marks:** (1) plot or read the poles; (2) verdict from $\sigma$ alone — LHP/axis/RHP, in words; (3) time constant $1/|\sigma|$; (4) oscillation from $\omega$: rad/s, convert to Hz only if asked; (5) if poles are complex, say "conjugate pair ⇒ real response $2|A|e^{\sigma t}\cos(\omega t + \angle A)$"; (6) sketch with dashed $e^{\sigma t}$ envelopes and roughly the right number of cycles.

**Traps that cost marks:** reporting $\omega$ as Hz (or vice versa); calling a $j\omega$-axis pole "slowly decaying" — it never decays; treating $|s|$ as decay speed; forgetting the conjugate twin (a real system cannot have one lone complex pole); envelope guides missing from sketches.

## @interview

One-liners worth owning: "The s-plane is a map of waveforms $e^{st}$ — real part sets decay, imaginary part sets oscillation; left dies, right explodes, the axis sustains." "Why $e^{st}$? — it's the eigenfunction of every LTI system: input $e^{st}$, output $H(s)e^{st}$." "Why conjugate pairs? — real signals force symmetric spectra; the pair sums to a real cosine with envelope $e^{\sigma t}$." A favorite follow-up: "where does Fourier live on this map?" — on the $j\omega$ axis: the Fourier transform is the atlas restricted to the sustained waveforms, which is precisely why it cannot describe growth or decay rates and Laplace can.

## @summary

$$s = \sigma + j\omega, \qquad e^{st} = e^{\sigma t}(\cos\omega t + j\sin\omega t), \qquad e^{st} + e^{s^*t} = 2e^{\sigma t}\cos\omega t$$

- **Three-zone law:** $\sigma<0$ (LHP) decays; $\sigma>0$ (RHP) grows; $\sigma=0$ (axis) sustains — origin is DC, $\pm j\omega_0$ is a pure oscillator.
- **σ owns the envelope:** time constant $1/|\sigma|$; ≈37% after one, ≈2% after four.
- **ω owns the wiggle:** $\omega$ rad/s; period $2\pi/\omega$; $f = \omega/2\pi$ Hz.
- **Real signals = conjugate pairs**, factor 2, pole plots symmetric about the real axis.
- **Eigenfunction fact:** $e^{st} \to H(s)\,e^{st}$ through any LTI system, $H(s) = \int h(\tau)e^{-s\tau}d\tau$.
- **Reading ritual:** $\sigma$-zone verdict → time constant → $\omega$ → pair check → sketch with envelope guides.
