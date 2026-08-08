---
id: m2/frequency-response
title: "Frequency response: measuring a system one tone at a time"
short: Frequency response
module: 2
tier: core
outcomes: [CO2]
prereqs: [m2/ft-properties, m1/impulse-response]
aliases: ["H(jω)", "gain", "phase response", "filter", "3-dB corner", "network analyzer"]
exam: { minor1: high, major: high, marks: "6–10", styles: [compute, sketch] }
crosslinks:
  - { target: m5/bode-plots, relation: "the same curves on log axes — where hand-sketching rules take over" }
  - { target: m3/transfer-function, relation: "H(jω) is H(s) evaluated on the axis — poles and zeros sculpt these curves" }
---

## @intuition

Hum a slow tone into a long pipe: it comes out strong. Hum a high one: muffled. The pipe has *opinions about frequencies* — and because it is LTI, its entire input-output behavior is captured by listing those opinions: how much each frequency is scaled ($|H(j\omega)|$) and delayed in phase ($\angle H(j\omega)$). That list is the **frequency response**, and it is not an abstraction — it is literally *measured*, one tone at a time, by every network analyzer and every audio engineer with a sweep generator.

---
@viz probe {"plant":"rc"}
Do the measurement yourself. Feed the RC circuit a sinusoid; in steady state the output is a sinusoid *at the same frequency* (the LTI eigenfunction promise, now visible) — read the amplitude ratio and the zero-crossing lag. Log the point; sweep ω; the dots you accumulate *trace out* $|H(j\omega)|$. The curve was always there in the hardware; the sweep reveals it.

---
Where does the curve come from mathematically? $H(j\omega) = \mathcal{F}\{h(t)\}$ — the transform of the impulse response. And the convolution theorem turns filtering into arithmetic: $Y(j\omega) = H(j\omega)X(j\omega)$. Each input frequency is *multiplied* by the system's opinion of it. A filter is nothing but a shaped multiplication window; "low-pass", "high-pass", "band-pass" name the window's shape.

---
@viz probe {"plant":"msd"}
Switch to the mass-spring-damper and sweep toward $\omega_n$: the output *exceeds* the input — resonance. The system stores and returns energy in rhythm, like pushing a swing at its natural cadence. The peak's height is set by damping; its existence is legible in $h(t)$ as ringing. Time-domain ringing and frequency-domain peaking are one fact, two views — the theme Module 3's pole-zero geometry will make exact.

## @definition

For a stable LTI system with impulse response $h$: $H(j\omega) = \int h(t)e^{-j\omega t}dt$, and
- **Sinusoidal steady state:** input $A\cos(\omega_0 t + \phi)$ → output $A|H(j\omega_0)|\cos(\omega_0 t + \phi + \angle H(j\omega_0))$ — same frequency, scaled and phase-shifted.
- **Any input:** $Y(j\omega) = H(j\omega)\,X(j\omega)$.
- **First-order RC low-pass** ($RC = 1/\omega_c$): $H(j\omega) = \frac{1}{1 + j\omega/\omega_c}$; $|H| = \frac{1}{\sqrt{1+(\omega/\omega_c)^2}}$, $\angle H = -\arctan(\omega/\omega_c)$. At $\omega = \omega_c$: $|H| = 1/\sqrt2$ (**the 3-dB corner**), phase $-45°$.
- For real $h$: $|H|$ is even, $\angle H$ odd — negative frequencies mirror.
- DC gain $H(0) = \int h$; high-frequency behavior set by $h$'s smoothness.

## @derivation

### Step: The steady-state formula from the eigenfunction property
?why: A real cosine is two conjugate eigenfunctions; each gets scaled by the conjugate-symmetric H.
$\cos\omega_0 t = \tfrac12 e^{j\omega_0 t} + \tfrac12 e^{-j\omega_0 t} \mapsto \tfrac12 H(j\omega_0)e^{j\omega_0 t} + \tfrac12 H(-j\omega_0)e^{-j\omega_0 t}$. With $H(-j\omega_0) = H^*(j\omega_0)$ (real $h$), the sum is $|H(j\omega_0)|\cos(\omega_0 t + \angle H(j\omega_0))$ — gain and phase shift, nothing else. This is why one complex number per frequency suffices.

### Step: RC low-pass from the circuit, start to finish (the exam derivation)
?why: The differential equation transforms into algebra via the differentiation property.
KVL: $RC\,\frac{dy}{dt} + y = x$. Transform: $(j\omega RC + 1)Y = X$, so $H = \frac{1}{1+j\omega RC}$. Magnitude and phase follow by complex division (primer skills). Corner at $\omega_c = 1/RC$: below it the capacitor keeps up with the input; above it the capacitor can't charge fast enough — attenuation and lag.

### Step: Filtering a square wave — per-harmonic multiplication
?why: The FS writes the input as tones; H acts on each independently.
Feed the $4/\pi k$ square wave into the RC. Each harmonic $k\omega_0$ is multiplied by $H(jk\omega_0)$: low harmonics pass, high ones die as $1/k \cdot 1/k$. The output is visibly rounded — the edges (high-frequency content) are what the filter ate. Filtering *is* spectrum reshaping; the time-domain rounding is its shadow.

## @examples

**Worked (steady-state, exam pattern):** RC with $\omega_c = 2$, input $10\cos(2t)$. $|H(j2)| = 1/\sqrt2$, $\angle H = -45°$: output $= \frac{10}{\sqrt2}\cos(2t - 45°) \approx 7.07\cos(2t - \pi/4)$. Three numbers moved: amplitude ×|H|, phase +∠H, frequency untouched. Write all three claims explicitly.

**Worked (composite input):** input $= 4 + 6\cos(20t)$ into the same filter ($\omega_c = 2$): DC passes at $H(0) = 1$ → 4; the 20 rad/s term sees $|H| \approx 0.0995$ → ≈ 0.6 amplitude. Output ≈ $4 + 0.6\cos(20t - 84°)$: the filter kept the average and discarded the wiggle — smoothing, quantified.

**Reading a datasheet:** "audio amp: 20 Hz–20 kHz ±0.5 dB, phase linear" is a claim about $|H|$ flatness and $\angle H$ straightness over the band — this concept is the language of every analog datasheet you will ever read.

## @misconceptions
- wrong: "In steady state, a filter can change a sinusoid's frequency."
  tempting: "Filters 'do something', and detuned outputs feel plausible."
  correction: "LTI systems scale and shift sinusoids — never re-pitch them. Frequency changes require nonlinearity or time variation. On paper: the output frequency you write must equal the input's."
- wrong: "The 3-dB corner is where the filter stops passing signal."
  tempting: "'Cutoff' sounds like a wall."
  correction: "At ω_c the gain is 0.707 — HALF the power, very much alive. First-order rolloff is gentle (−20 dB/dec); the 'wall' picture belongs to ideal filters, which are unrealizable (sinc, noncausal)."
- wrong: "Phase response is cosmetic — magnitude is what matters."
  tempting: "Most plots you see show only |H|."
  correction: "Phase is timing. Nonlinear phase delays different frequencies differently, smearing pulses and wrecking waveforms (with |H| perfectly flat!). Audio crossovers, data links and control loops all live or die by phase."
- wrong: "H(jω) exists for any system."
  tempting: "Just transform h, whatever it is."
  correction: "The integral converges for STABLE systems (∫|h| < ∞ guarantees it). An unstable system has no measurable steady state to describe — the sweep experiment itself would explode. Module 3's ROC makes this precise."

## @exam

6–10 marks, three reliable shapes: (a) derive $H$ from a first-order circuit ODE, produce $|H|$ and $\angle H$, identify the 3-dB corner; (b) compute the sinusoidal steady-state output for one or two tones through a given $H$ (amplitude ×, phase +, frequency fixed — state all three); (c) qualitative: why does the output of a square wave look rounded (per-harmonic attenuation). Traps: writing the output at a shifted frequency; quoting the corner as "half amplitude" (it is $1/\sqrt2$ amplitude, half POWER); forgetting the phase contribution entirely.

## @summary

- $H(j\omega) = \mathcal{F}\{h\}$; $Y = HX$; tone in → same tone out, ×$|H|$, +$\angle H$.
- RC low-pass: $\frac{1}{1+j\omega/\omega_c}$; corner: $|H| = 1/\sqrt2$ (−3 dB, half power), phase −45°; rolloff −20 dB/dec.
- $H(0) = \int h$ (DC gain); real $h$ ⇒ $|H|$ even, $\angle H$ odd.
- Filtering = per-frequency multiplication; time-domain rounding = high-frequency loss.
- Exists for stable systems; resonance peak ↔ time-domain ringing (damping sets both).
