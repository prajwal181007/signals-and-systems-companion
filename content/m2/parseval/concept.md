---
id: m2/parseval
title: "Parseval's theorem: energy is basis-independent"
short: Parseval
module: 2
tier: core
outcomes: [CO2]
prereqs: [m2/ft-properties]
aliases: ["parseval", "energy spectral density", "rayleigh energy theorem", "band energy"]
exam: { minor1: high, major: medium, marks: "4–8", styles: [compute] }
crosslinks:
  - { target: m1/energy-and-power, relation: "the same E, now computable from either domain" }
  - { target: m2/white-noise-psd, relation: "for power signals, this energy-density story graduates into the PSD" }
---

## @intuition

You can count a country's population by visiting every town (time domain), or by reading the census table by age group (frequency domain) — same total, guaranteed. Parseval is that guarantee for signal energy: computing $\int|x|^2 dt$ or summing $|X(j\omega)|^2$ across frequency gives the *same number*, always. Energy belongs to the signal, not to the coordinates you describe it in.

---
@viz ledger {"signal":"rect","band":3}
The ledger runs both computations live. More useful than the equality itself: the frequency version tells you **where the energy lives**. $|X(j\omega)|^2$ is an *energy density* — joules per rad/s — and dragging the shaded band edge accumulates the fraction inside. For the rect pulse: the main lobe alone holds ≈ 90.3% of everything. That one number is why "bandwidth = first null" is a sane engineering convention.

---
The practical superpower is *choosing the easy side*. $\int_{-\infty}^{\infty}\mathrm{sinc}^2$-type integrals are miserable directly — but they are the frequency-side energy of a rect pulse, whose time-side energy is trivial. Exams exploit this in both directions; so do link-budget calculations in communications.

## @definition

**Energy form** (aperiodic, finite energy):
$$E = \int_{-\infty}^{\infty} |x(t)|^2\,dt = \frac{1}{2\pi}\int_{-\infty}^{\infty} |X(j\omega)|^2\,d\omega$$

- $|X(j\omega)|^2$ = **energy spectral density** (energy per rad/s, measured through the $\frac{1}{2\pi}$ convention). Band energy in $[\omega_1, \omega_2]$ (and its mirror): $\frac{1}{\pi}\int_{\omega_1}^{\omega_2}|X|^2 d\omega$ for real signals.
- **Power form** (periodic — from the FS concept): $P = \frac{1}{T_0}\int_{T_0}|x|^2 = \sum_k |c_k|^2$.
- Phase never appears: two signals with identical $|X|$ and different phase carry identical energy at every frequency (their *waveforms* differ; their energy budgets don't).

**Reading the formula:** the $\frac{1}{2\pi}$ pairs with measuring frequency in rad/s; in hertz the theorem reads $E = \int |X(f)|^2 df$ with no prefactor — state which convention you're in.

## @derivation

### Step: Two-line proof via the convolution theorem
?why: Energy is a self-inner-product, and inner products survive the transform (with the 2π).
$\int x\,x^*\,dt$ is the $t{=}0$ value of the correlation $x * x^*(-t)$, whose transform is $X \cdot X^* = |X|^2$. Reading a signal's value at $t=0$ from its transform: $\frac{1}{2\pi}\int|X|^2 d\omega$. Equate. (For exams, the formal inner-product swap $\int x y^* dt = \frac{1}{2\pi}\int XY^* d\omega$ with $y = x$ is the citable route.)

### Step: The rect-pulse main-lobe number
?why: One honest numerical integral gives an engineering constant worth memorizing.
Rect of width $2T$: $E = 2T$. Its sinc spectrum's main lobe ($|\omega| < \pi/T$) integrates to $\approx 0.903 \times 2T$. **≈90% of a pulse's energy lives inside its first nulls** — the justification for null-to-null bandwidth, and the number behind "the rest is spectral clutter."

### Step: Why phase is invisible to energy
?why: |X|² = X·X* kills the phase factor identically.
Write $X = |X|e^{j\theta(\omega)}$: then $|X|^2$ contains no $\theta$. All-pass filters (|H| = 1, any phase) pass energy untouched while reshaping waveforms — energy accounting and waveform shape are separate ledgers.

## @examples

**Worked (choose the easy side):** evaluate $\displaystyle\int_{-\infty}^{\infty}\frac{\sin^2 t}{\pi^2 t^2}dt$. Recognize $\frac{\sin t}{\pi t}$ as the inverse transform of a rect of height 1 on $|\omega| \le 1$. Parseval: $E = \frac{1}{2\pi}\int_{-1}^{1}1^2 d\omega = \frac{1}{\pi}$. A calculus nightmare collapsed to a width measurement.

**Worked (band fraction, exam pattern):** $x = e^{-t}u(t)$, $X = \frac{1}{1+j\omega}$, $E = \tfrac12$. Energy below $\omega = 1$ (the 3-dB point): $\frac{1}{\pi}\int_0^1 \frac{d\omega}{1+\omega^2}\cdot$... $= \frac{1}{\pi}\arctan(1)\cdot 2 \cdot \tfrac12$ — carefully: $\frac{1}{2\pi}\int_{-1}^{1}\frac{d\omega}{1+\omega^2} = \frac{\arctan 1}{\pi} = \tfrac14$. Fraction: $\tfrac14 / \tfrac12 = $ **50%** — half the energy of a first-order pulse sits below its corner frequency. A number worth keeping.

**Worked (power form):** square wave, $P = 1$: fundamental pair carries $2(2/\pi)^2 \approx 0.81$. Truncating after the 3rd harmonic keeps ≈ 95% of the power — quantifying "the first terms carry the signal."

## @misconceptions
- wrong: "Parseval needs the signal to be periodic."
  tempting: "It was first met as Σ|cₖ|² in the series chapter."
  correction: "Two forms: POWER form (periodic, Σ|cₖ|²) and ENERGY form (aperiodic, ∫|X|²/2π). Use the one matching the signal's class from Module 1 — mixing them is a category error."
- wrong: "The 1/2π is optional decoration."
  tempting: "Some books don't show it."
  correction: "It pairs with rad/s; in hertz it vanishes. Omitting it in rad/s inflates every energy by 6.28×. State the convention, keep the factor."
- wrong: "Phase distortion loses energy."
  tempting: "A mangled waveform looks like something was lost."
  correction: "|X|² is phase-blind: all-pass networks rearrange the waveform, energy intact. What phase distortion costs is SHAPE (timing of peaks), never joules."

## @exam

4–8 marks, two reliable patterns: (a) "evaluate this impossible-looking integral" — recognize it as the energy of a known pair, jump domains, finish in two lines (cite Parseval by name); (b) band-energy fractions — compute $E$, integrate $|X|^2$ over the band, take the ratio (the $\arctan$ pattern for first-order signals is the standard instance). Power-form items feed from given $c_k$ tables. Traps: dropped $\frac{1}{2\pi}$, forgetting the mirror band at negative frequencies, applying the energy form to periodic (infinite-energy) signals.

## @summary

$$E = \int|x|^2dt = \frac{1}{2\pi}\int|X(j\omega)|^2d\omega \qquad P_{\text{periodic}} = \sum_k|c_k|^2$$

- $|X|^2$ = energy density; band fractions by integrating it (× mirror band). Phase is invisible to energy.
- Rect pulse: ≈ **90.3%** of energy in the main lobe. First-order pulse: 50% below the corner.
- Superpower: jump to whichever domain makes the integral trivial — cite the theorem.
- Keep the $\frac{1}{2\pi}$ (rad/s) or drop it (Hz) — but say which. Energy form ↔ aperiodic; power form ↔ periodic.
