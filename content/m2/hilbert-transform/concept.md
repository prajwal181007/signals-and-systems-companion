---
id: m2/hilbert-transform
title: "The Hilbert transform: making 'envelope' an honest word"
short: Hilbert transform
module: 2
tier: core
outcomes: [CO2]
prereqs: [m2/ft-properties]
aliases: ["analytic signal", "envelope", "instantaneous frequency", "90 degree phase shifter", "quadrature"]
exam: { minor1: medium, major: medium, marks: "4–8", styles: [compute, conceptual] }
crosslinks:
  - { target: m2/frequency-response, relation: "the Hilbert transformer is itself an LTI filter — with |H| = 1 and a ±90° phase flip" }
  - { target: m4/sampling, relation: "one-sided (analytic) spectra halve the bandwidth bookkeeping in communication systems" }
---

## @intuition

Engineers say "the envelope of this AM signal" and "the instantaneous frequency of this chirp" every day — but for a plain real signal neither phrase means anything: $x(t)$ is just a wiggle; where exactly is its "envelope"? The Hilbert transform exists to make those words honest. It builds a companion signal $\hat{x}$, and the pair $z = x + j\hat{x}$ — the **analytic signal** — has a magnitude and an angle that *are*, rigorously, the envelope and the phase.

---
@viz demo {"f0":8,"df":1}
Two close tones beat. Your ear tracks a slow swell — but the raw waveform (thin trace) crosses zero constantly; no point on it is "the envelope". The amber curve $|z(t)|$ hugs the oscillation from above and below: that is the analytic magnitude, and it equals exactly $2|\cos(\Delta\omega\,t/2)|$. Ledger check: the *audible beat rate* is $\Delta\omega$, not $\Delta\omega/2$ — the absolute value folds every negative lobe up, halving the period. A classic factor-of-2 trap, now visible instead of memorized.

---
What is $\hat{x}$? Take each frequency component of $x$ and delay its phase by exactly 90° — cos becomes sin, sin becomes −cos, every component, regardless of frequency. In the spectrum this is one clean multiplier: $\hat{X}(j\omega) = -j\,\mathrm{sgn}(\omega)X(j\omega)$. And forming $z = x + j\hat{x}$ performs surgery: negative frequencies cancel, positive ones double — a **one-sided spectrum**. The redundant mirror half of every real signal's spectrum is discarded, and what remains rotates one way, like a clean corkscrew whose radius is the envelope.

---
One honesty note the exams reward: **instantaneous frequency** $\frac{d}{dt}\angle z$ is meaningful only for single-component signals (one carrier, slowly modulated). For the two-tone beat it spikes and even goes negative at the envelope nulls — not a bug, a warning that "the frequency right now" is an ill-posed question when two tones coexist.

## @definition

- **Hilbert transform:** $\hat{x}(t) = \mathcal{H}\{x\}$, defined in frequency by $\hat{X}(j\omega) = -j\,\mathrm{sgn}(\omega)\,X(j\omega)$ — an all-pass ($|\hat{X}| = |X|$) with $-90°$ shift for $\omega > 0$, $+90°$ for $\omega < 0$.
- **Standard pairs:** $\cos\omega_0 t \mapsto \sin\omega_0 t$; $\sin\omega_0 t \mapsto -\cos\omega_0 t$ ($\omega_0 > 0$).
- **Analytic signal:** $z(t) = x(t) + j\hat{x}(t)$; $Z(j\omega) = 2X(j\omega)$ for $\omega>0$, $0$ for $\omega<0$.
- **Envelope:** $a(t) = |z(t)|$. **Phase:** $\phi(t) = \angle z(t)$; instantaneous frequency $= d\phi/dt$ (single-component signals only).
- Properties: $\mathcal{H}\{\mathcal{H}\{x\}\} = -x$; $\hat{x} \perp x$ ($\int x\hat{x}\,dt = 0$); $x$ and $\hat{x}$ have identical magnitude spectra and identical energy.
- For AM, $x = a(t)\cos\omega_c t$ with slow $a(t) \ge 0$: $\hat{x} = a(t)\sin\omega_c t$ and $|z| = a(t)$ exactly — the envelope detector's mathematical license.

## @derivation

### Step: Why −j·sgn(ω) means "90° for every component"
?why: Multiplying a positive-frequency phasor by −j rotates it a quarter turn back; conjugate symmetry demands +j on the mirror side.
$e^{j\omega_0 t} \mapsto -j\,e^{j\omega_0 t} = e^{j(\omega_0 t - \pi/2)}$: a quarter-period delay *of that component's phase*, whatever $\omega_0$ is. (Not a constant TIME delay — each frequency is delayed by a different time, the same angle.) Applying to $\cos = \tfrac12(e^{j\omega_0 t}+e^{-j\omega_0 t})$ gives $\tfrac{1}{2j}(e^{j\omega_0 t}-e^{-j\omega_0 t})$... $= \sin\omega_0 t$ ✓.

### Step: The analytic signal's spectrum is one-sided
?why: Adding j·(−j·sgn(ω)) = sgn(ω) to 1 gives 2 on the right half-axis, 0 on the left.
$Z = X + j\hat{X} = X[1 + j(-j\,\mathrm{sgn}\,\omega)] = X[1 + \mathrm{sgn}\,\omega]$: doubled for $\omega>0$, annihilated for $\omega<0$. For real signals the negative half was a conjugate copy — no information lost, redundancy removed. The one-way rotation of $z$ is this one-sidedness made visible.

### Step: The beat envelope, and where the factor of 2 hides
?why: Sum-to-product plus |·| — the folding halves the period.
$\cos\omega_1 t + \cos\omega_2 t = 2\cos\!\big(\tfrac{\Delta\omega}{2}t\big)\cos(\bar{\omega}t)$ with $\bar\omega$ the average. Envelope: $a(t) = 2\big|\cos(\tfrac{\Delta\omega}{2}t)\big|$. The cosine inside has angular rate $\Delta\omega/2$ — but $|\cdot|$ folds each negative lobe up, so maxima arrive at rate $\Delta\omega$. **The ear counts maxima:** beat rate $= \Delta\omega$ (in Hz: $\Delta f$). Write both the formula and the folding sentence; the sentence is where the mark lives.

### Step: Orthogonality and equal energy
?why: Parseval + the all-pass multiplier.
$|\hat{X}| = |X|$ ⇒ equal energy (Parseval, phase-blind). Orthogonality: $\int x\hat x\,dt = \frac{1}{2\pi}\int X^*\hat X d\omega = \frac{1}{2\pi}\int -j\,\mathrm{sgn}(\omega)|X|^2 d\omega = 0$ — an odd integrand (sgn) against an even one ($|X|^2$). The companion carries the same energy at right angles: exactly what "quadrature" means.

## @examples

**Worked (exam pair):** $x = \cos(10t) + \tfrac13\cos(30t)$. $\hat{x} = \sin(10t) + \tfrac13\sin(30t)$ (componentwise — the transform is linear). Verify orthogonality termwise: each cos ⊥ its sin over a period.

**Worked (AM envelope license):** $x = (2 + \cos t)\cos(50t)$ — a carrier at 50 with slow AM. $\hat{x} = (2+\cos t)\sin(50t)$ (the envelope is slow and positive, so it rides along); $|z| = 2 + \cos t$: the envelope detector in a radio recovers exactly the message. The condition "slow and positive" is what keeps the license valid — over-modulate ($a(t)$ crossing zero) and the envelope folds: audible distortion, mathematical warning.

**Conceptual (interview flavor):** why do communication systems love one-sided spectra? A real signal wastes half its spectral description on a mirror image; the analytic form halves the bookkeeping and enables single-sideband (SSB) transmission — half the bandwidth of AM for the same message.

## @misconceptions
- wrong: "The beat rate of cos(ω₁t)+cos(ω₂t) is Δω/2 — it's right there in the formula."
  tempting: "The envelope formula literally contains cos(Δω·t/2)."
  correction: "The ENVELOPE is 2|cos(Δω t/2)| — the absolute value halves the period, so maxima (what you hear) arrive at Δω. Formula rate ≠ audible rate; the |·| is the whole story."
- wrong: "The Hilbert transformer is a 90° time delay."
  tempting: "'Phase shift' and 'delay' blur together."
  correction: "It shifts every component by 90° of ITS OWN cycle — a different time delay per frequency. A constant time delay would be phase ∝ ω (linear), not phase = ±90° (flat). Different filters entirely."
- wrong: "Instantaneous frequency always means something."
  tempting: "Every signal is doing SOMETHING right now."
  correction: "dφ/dt is meaningful for single-component signals. For multi-tone signals it spikes and goes negative at envelope nulls — the question 'what frequency right now' has no single answer when two tones coexist. State the caveat; it is ledger material."
- wrong: "x̂ contains new information about the signal."
  tempting: "We computed a whole new signal."
  correction: "x̂ is DERIVED from x (all-pass filter): same magnitude spectrum, same energy, orthogonal phase. The analytic signal reorganizes information (one-sided spectrum); it adds none."

## @exam

4–8 marks: (a) compute $\hat{x}$ for sinusoid combinations (componentwise cos→sin, sin→−cos); (b) show $\hat x \perp x$ or equal-energy (Parseval + sgn parity — four lines); (c) envelope of a two-tone beat with the beat-rate question (the Δω vs Δω/2 trap is the intended discriminator); (d) one-liner: define the analytic signal and its one-sided spectrum. Keep the multiplier $-j\,\mathrm{sgn}(\omega)$ and both standard pairs cold.

## @summary

- $\hat{X} = -j\,\mathrm{sgn}(\omega)X$: all-pass, ±90° per component. $\cos\to\sin$, $\sin\to-\cos$; $\mathcal{H}^2 = -1$; $\hat x \perp x$, equal energy.
- Analytic $z = x + j\hat x$: spectrum $2X$ for $\omega>0$, zero for $\omega<0$. Envelope $=|z|$, phase $=\angle z$.
- Beats: envelope $2|\cos(\Delta\omega t/2)|$, audible beat rate $\Delta\omega$ (|·| halves the period).
- AM with slow positive $a(t)$: $|z| = a(t)$ exactly — the envelope detector's license; over-modulation breaks it.
- Instantaneous frequency: single-component signals only. One-sided spectra ⇒ SSB, half the bandwidth.
