---
id: m2/white-noise-psd
title: "White noise and the PSD: putting a number on hiss — and predicting what a filter leaves behind"
short: White Noise
module: 2
tier: core
hero: false
outcomes: [CO2]
prereqs: [primers/expectation, m2/frequency-response]
aliases: ["power spectral density", "PSD", "N0/2", "autocorrelation", "wiener-khinchin", "periodogram", "welch averaging", "thermal noise", "johnson noise", "noise power", "colored noise", "flat spectrum", "uncorrelated samples", "kT/C", "spectrum analyzer"]
exam: { minor1: high, major: high, marks: "6–10", styles: [compute, conceptual] }
crosslinks:
  - { target: primers/expectation, relation: "R(τ), the PSD, and output power are all expectations — the primer supplies E[·], variance = power, and the √N averaging law that Welch cashes in" }
  - { target: m1/impulse, relation: "R(τ) = (N₀/2)δ(τ) is the impulse again, now as a correlation — and sifting is what collapses the noise-through-filter double integral" }
  - { target: m2/parseval, relation: "the two routes to output power — (1/2π)∫(N₀/2)|H|²dω and (N₀/2)∫h²dt — are Parseval in action" }
  - { target: m2/frequency-response, relation: "the filter acts on the noise budget through |H(jω)|² — the frequency response squared, phase discarded" }
  - { target: m2/bandwidth-uncertainty, relation: "output noise power scales with the filter's noise-equivalent bandwidth — one more named ruler in the bandwidth zoo" }
---

## @intuition

Short the input of your new audio preamp, turn up the gain, and listen: hiss. The scope shows fur — a waveform that never repeats and never will. Here is the designer's dilemma: the datasheet you must publish promises a signal-to-noise ratio, and the filter you must choose is supposed to tame this hiss — yet you cannot write down the very waveform you are designing against. This concept is the escape: stop trying to predict the noise's values, and start budgeting its **power**, frequency by frequency.

---

That budget ledger is the **power spectral density**: how much noise power lives in each slice of frequency. The model that makes every exam problem tractable is the boldest one imaginable — **white noise**, whose ledger is perfectly flat: the same density $N_0/2$ at every frequency, the way white light mixes all colors equally. One number describes the entire process. The price of that audacity: sum a flat budget over all frequencies and the total is infinite. Keep the paradox in view — it resolves exactly the way $\delta(t)$ did in Module 1.

---

What does "flat" mean back in the time domain? Total amnesia. The value of white noise now tells you nothing about its value any instant later, however close: the process is uncorrelated with itself at every nonzero lag. Its autocorrelation $R(\tau)$ is zero everywhere except a zero-width spike at $\tau = 0$ — an **impulse**, the same $\delta$ from Module 1, returning as a statistical object. Flat spectrum and impulse correlation are a Fourier pair: each forces the other.

---
@viz lab {}
Below is what a spectrum analyzer actually sees — the **measured view**. Press replay: a single periodogram is violently jagged. Intuition says record longer and it will settle. It will not — this is the rare place where the more-data instinct fails. The cure is the Welch slider: chop the record into segments, average their spectra, and the fur shrinks by the $\sqrt{N}$ law from the expectation primer. The flat line is the analytic truth; the jagged trace is what measurement looks like on the way there.

---

Now the payoff exams live on. Push white noise through any LTI filter and the flat budget gets reweighted by the filter's frequency response — bands the filter passes keep their noise, bands it stops lose theirs. Integrate the reweighted budget and out comes a single finite number: the output noise power, the denominator of every SNR you will ever publish. One multiplication, one integral. The rest of this page makes those two moves exact.

## @definition

A noise waveform is a **random process**: at each frozen time $t$, the value $x(t)$ is a random quantity in the sense of the expectation primer. Course conventions: noise is **zero-mean** ($E[x(t)] = 0$) and **stationary** (its statistics do not drift with time), unless a problem says otherwise.

**Autocorrelation** — the memory meter:

$$R(\tau) = E\big[x(t)\,x(t+\tau)\big]$$

how strongly the value now predicts the value $\tau$ seconds later. At zero lag it is the **average power**: $R(0) = E[x^2(t)] = \sigma^2$ (variance = power for zero-mean noise — the primer's identity).

**Power spectral density** $S_x(\omega) \ge 0$ — the power budget over frequency, defined as the Fourier transform of the autocorrelation (the **Wiener–Khinchin relation**):

$$S_x(\omega) = \int_{-\infty}^{\infty} R(\tau)\,e^{-j\omega\tau}\,d\tau \qquad\qquad P = R(0) = \frac{1}{2\pi}\int_{-\infty}^{\infty} S_x(\omega)\,d\omega$$

**White noise** — three faces of one definition, to be recited as a unit: *white = flat PSD = uncorrelated samples.*

$$S_x(\omega) = \frac{N_0}{2}\ \ \text{(all } \omega\text{)} \quad\Longleftrightarrow\quad R(\tau) = \frac{N_0}{2}\,\delta(\tau) \quad\Longleftrightarrow\quad \text{values at distinct times are uncorrelated}$$

The equivalence of the first two is the table pair "constant $\leftrightarrow$ impulse," scaled by $N_0/2$. Be precise about what the middle statement says: $R(\tau)$ is an **impulse**, not a tall finite spike — so $R(0)$ is *not a finite number*. Ideal white noise has infinite power; every finite number in this subject appears only *after* a filter. That is not a defect: it is the same idealization bargain as $\delta(t)$, and it is priced honestly below.

**Through an LTI filter** $H(j\omega)$ — the two formulas the whole topic runs on:

$$S_y(\omega) = |H(j\omega)|^2\,S_x(\omega) = \frac{N_0}{2}\,|H(j\omega)|^2 \qquad\qquad P_y = \frac{1}{2\pi}\int_{-\infty}^{\infty} \frac{N_0}{2}|H(j\omega)|^2\,d\omega = \frac{N_0}{2}\int_{-\infty}^{\infty} h^2(t)\,dt$$

**Reading the symbols:** $E[\cdot]$ is the ensemble average (primer); stationarity is what lets one recording stand in for the ensemble. $N_0/2$ carries units of V²/Hz (or W/Hz into 1 Ω) — density, not power. The filter enters only through $|H|^2$: **phase never appears** — power spectra are blind to it. And the two $P_y$ integrals are the same number by Parseval: integrate in whichever domain is easier.

**Exam conventions:** this course uses the **two-sided** PSD $N_0/2$ with the $\frac{1}{2\pi}\int(\cdot)\,d\omega$ power recovery. Some books quote a one-sided density $N_0$ per Hz of positive frequency; for an ideal low-pass of $B$ Hz both conventions give the same $P = N_0 B$. State which convention you are using and the marker cannot touch you.

## @derivation

The target is the exam's central claim — $S_y = \frac{N_0}{2}|H|^2$ and the RC number that follows — using only tools already on the bench: linearity of $E[\cdot]$ (primer), convolution and sifting (Module 1), Parseval (this module).

### Step: Write the output the only way an LTI system allows
?why: Convolution is the universal LTI input–output law from Module 1.
$$y(t) = \int_{-\infty}^{\infty} h(a)\,x(t-a)\,da$$
The output at any instant is a weighted sum of past input values — random input, so a random output, but a *lawfully assembled* one.

### Step: Correlate the output with itself; E slides inside
?why: E[·] is linear (primer), and h(a), h(b) are constants as far as the ensemble average is concerned.
$$R_y(\tau) = E[y(t)\,y(t+\tau)] = \int\!\!\int h(a)\,h(b)\; E[x(t-a)\,x(t+\tau-b)]\;da\,db = \int\!\!\int h(a)\,h(b)\,R_x(\tau + a - b)\,da\,db$$
Randomness has been quarantined into one deterministic function: the input's autocorrelation.

### Step: White input — sifting collapses one integral
?why: R_x is an impulse, and δ under an integral means: evaluate where the argument vanishes (m1/impulse).
With $R_x(\cdot) = \frac{N_0}{2}\delta(\cdot)$, the $b$-integral picks out $b = \tau + a$:
$$R_y(\tau) = \frac{N_0}{2}\int_{-\infty}^{\infty} h(a)\,h(a+\tau)\,da$$
Read what this says: the output is **no longer white**. The filter smears its input over its memory span, so output values within that span share ancestry and correlate. Filtering *colors* noise — the name "colored noise" is literal.

### Step: Fourier transform both sides — the PSD law appears
?why: The τ-integral is h correlated with itself, i.e. h(τ) ∗ h(−τ); FT of h(−t) is H(−jω) = H*(jω) for real h.
$$S_y(\omega) = \frac{N_0}{2}\,H(j\omega)\,H^*(j\omega) = \frac{N_0}{2}\,|H(j\omega)|^2 \qquad \blacksquare$$
For a general (non-white) input the same computation gives $S_y = |H|^2 S_x$ — the white case is the cleanest instance.

### Step: Output power, two routes, one number
?why: P_y = R_y(0) from the definition; the frequency route is Parseval applied to h.
$$P_y = R_y(0) = \frac{N_0}{2}\int_{-\infty}^{\infty} h^2(t)\,dt = \frac{1}{2\pi}\int_{-\infty}^{\infty} \frac{N_0}{2}|H(j\omega)|^2\,d\omega$$
On an exam, glance at both and integrate the easier one — they cannot disagree.

### Step: Notice what was NOT assumed
?why: The result is second-order only — that is why it is so robust.
Nothing about the noise's amplitude distribution: Gaussian, uniform, or otherwise, only $R_x$ entered. Nothing about the filter's phase: two filters with identical $|H|$ produce identical output *power* however different their phase responses. And nothing required the input power to be finite — the impulse model works precisely because the filter band-limits before any power is tallied.

## @examples

**Worked (the exam drill): white noise through an RC low-pass.** White noise with two-sided PSD $N_0/2$ drives $H(j\omega) = \dfrac{1}{1 + j\omega RC}$. Ritual: *statement line → $|H|^2$ → integrate → units.*

1. Statement line (this earns marks by itself): $S_y(\omega) = \dfrac{N_0}{2}\,|H(j\omega)|^2$.
2. Magnitude squared, by multiplying with the conjugate: $|H(j\omega)|^2 = \dfrac{1}{1 + (\omega RC)^2}$.
3. Integrate with the standard form $\int_{-\infty}^{\infty} \frac{d\omega}{1+(\omega RC)^2} = \frac{\pi}{RC}$:
$$P_y = \frac{1}{2\pi}\cdot\frac{N_0}{2}\cdot\frac{\pi}{RC} = \boxed{\frac{N_0}{4RC}} \ \ \text{V}^2$$
4. Cross-check by the time route: $h(t) = \frac{1}{RC}e^{-t/RC}u(t)$, $\int h^2 = \frac{1}{2RC}$, so $P_y = \frac{N_0}{2}\cdot\frac{1}{2RC} = \frac{N_0}{4RC}$. Agreement — Parseval keeping the books.

Two readings worth owning. *Design reading:* larger $RC$ = narrower filter = less noise power — you buy SNR with bandwidth. In fact the RC filter passes exactly as much white noise as an ideal low-pass of width $B_N = \frac{1}{4RC}$ Hz — its **noise-equivalent bandwidth**, yet another named ruler for the bandwidth zoo. *Physics reading:* a resistor's own thermal noise has two-sided PSD $2kTR$; feed that into its own RC and $P_y = \frac{4kTR}{4RC} = \frac{kT}{C}$ — the famous $kT/C$ noise. The resistance cancels: a bigger $R$ makes more noise but proportionally less bandwidth.

**Worked (datasheet skin): noise in a measurement bandwidth, then SNR.** A sensor line carries white noise with $N_0/2 = 2\times 10^{-9}$ V²/Hz (two-sided). The acquisition chain is, to good approximation, an ideal unity-gain low-pass of $B = 20$ kHz. The PSD is flat, so no integral table is needed — the power is a rectangle: height $N_0/2$, width $2B$ (both sides of zero, in Hz):
$$P_y = \frac{N_0}{2}\cdot 2B = N_0 B = 4\times10^{-9} \times 2\times10^{4} = 8\times10^{-5}\ \text{V}^2 \quad\Rightarrow\quad \sigma = \sqrt{P_y} \approx 8.9\ \text{mV rms}$$
A 1 V-rms signal then enjoys $\text{SNR} = \frac{1}{8\times10^{-5}} = 12500 \approx 41$ dB. Note the halving trap in reverse: $P = N_0 B$, not $N_0 B/2$ — the widths $2B$ and the density $N_0/2$ trade their factors of 2.

**Worked (the measured view — labeled as such): why your spectrum analyzer never shows the flat line.** Estimate the PSD from one record by a **periodogram** (magnitude-squared FFT, normalized). Each frequency bin is effectively a *one-shot* estimate of the power there: its standard deviation is about equal to its mean — 100% fur — and this does not improve with record length; a longer record only adds more, equally furry bins. **Welch's method** splits the record into $K$ segments, computes $K$ periodograms, and averages: the primer's law gives fluctuation $\propto 1/\sqrt{K}$ ($K = 16 \Rightarrow$ about 25%). The price: shorter segments mean coarser frequency resolution. This variance-vs-resolution bargain is the *measured* face of the subject; the analytic model — flat $N_0/2$ reshaped by $|H|^2$ — is what exams compute with, and what the average is converging to.

## @misconceptions
- wrong: "Record the noise longer and the periodogram will smooth out toward the flat PSD."
  tempting: "More data improves every estimate — that is what the √N law says."
  correction: "The fluctuation of each periodogram bin stays about 100% of its value at ANY record length — a longer record buys more frequency bins, not calmer ones. The √N law applies to AVERAGING: Welch's K averaged segments cut the fur by 1/√K. Right law, wrong place."
  probe: q-welch
- wrong: "R(τ) = (N₀/2)δ(τ) means the noise variance is the finite number N₀/2."
  tempting: "Reading δ(0) as 1, or as a tall-but-finite spike, makes R(0) look like N₀/2."
  correction: "δ is an impulse — defined by its area under an integral, with no finite value at 0 (m1/impulse). R(0) is not finite: ideal white noise has infinite power. Every finite power in this topic is an OUTPUT power, computed after |H|² has band-limited the budget."
  probe: q-impulse
- wrong: "White noise is unphysical (infinite power), so results computed from it are only rough approximations."
  tempting: "A model with an infinite in it feels like it should contaminate the answers."
  correction: "It is the same bargain as δ(t): an idealization that becomes exact where it is used. If the real noise's PSD is flat across the filter's passband — thermal noise is flat to ~THz — then N₀/2-based output numbers are exact for every practical purpose. The model is judged inside the band, not at ω → ∞."
- wrong: "To find the output noise power I also need the filter's phase response."
  tempting: "Phase reshapes waveforms, and the noise waveform surely matters."
  correction: "S_y = (N₀/2)|H|² — phase never enters, so an all-pass filter leaves noise power untouched and two filters with identical |H| give identical output power. Phase matters to waveforms and to signal fidelity, never to power spectra."
  probe: q-phase

## @exam

**Where it appears:** Minor I and the Major, reliably 6–10 marks, almost always as the drill: *"White noise with PSD $N_0/2$ is applied to [an RC filter / an ideal low-pass / a given $H(j\omega)$]. Find the output PSD and the average output noise power."* Conceptual riders: "why is it called white?", "is the output still white?", "does phase matter?"

**The method that earns full marks:** (1) write the statement line $S_y(\omega) = \frac{N_0}{2}|H(j\omega)|^2$ — it carries marks on its own; (2) compute $|H|^2$ by multiplying with the conjugate (never by squaring a complex expression term-wise); (3) integrate $P_y = \frac{1}{2\pi}\int S_y\,d\omega$ using $\int \frac{d\omega}{a^2+\omega^2} = \frac{\pi}{a}$; (4) where $h(t)$ is simple, cross-check with $\frac{N_0}{2}\int h^2\,dt$; (5) close with units — V² (or W into 1 Ω).

**Traps that cost marks:** dropping the $\frac{1}{2\pi}$ (the single most common error); using $N_0$ where the two-sided convention wants $N_0/2$ — or halving twice; integrating $|H|$ instead of $|H|^2$; declaring $R(0) = N_0/2$ "the input power"; mixing Hz and rad/s mid-integral (carry one symbol set to the end); asserting the output is still white — it is colored, correlated over the filter's memory span.

## @interview

One-liners worth owning: "White = flat PSD = impulse autocorrelation = uncorrelated samples — one definition, three faces." "Why does filtering *color* noise? — the filter smears its input over its memory, so nearby output samples share ancestry: $R_y(\tau) = \frac{N_0}{2}\int h(a)h(a+\tau)da$." "Why doesn't a longer record smooth a periodogram? — each bin is a one-shot power estimate; only averaging segments divides the variance." "Why does $kT/C$ not contain $R$? — the resistor sets both the noise density ($\propto R$) and the bandwidth ($\propto 1/R$); the product cancels." "Does an all-pass filter change noise power? — no: power spectra are blind to phase."

## @summary

$$R(\tau) = E[x(t)x(t+\tau)] \qquad S_x(\omega) = \mathcal{F}\{R(\tau)\} \qquad P = R(0) = \frac{1}{2\pi}\int S_x\,d\omega$$

- **White noise:** $S_x = \frac{N_0}{2}$ flat $\Leftrightarrow$ $R(\tau) = \frac{N_0}{2}\delta(\tau)$ (an **impulse** — $R(0)$ not finite, infinite total power) $\Leftrightarrow$ samples at distinct times uncorrelated. *White = flat PSD = uncorrelated samples.*
- **Through a filter:** $S_y = \frac{N_0}{2}|H(j\omega)|^2$ (phase irrelevant); $P_y = \frac{1}{2\pi}\int \frac{N_0}{2}|H|^2 d\omega = \frac{N_0}{2}\int h^2 dt$ (Parseval — either route).
- **Reference results:** RC low-pass: $P_y = \frac{N_0}{4RC}$; noise-equivalent bandwidth $B_N = \frac{1}{4RC}$ Hz; thermal-into-own-RC: $kT/C$. Ideal LPF of $B$ Hz: $P = N_0 B$.
- **Output is colored:** correlated over the filter's memory; only the input was white.
- **Measured view (label it so):** one periodogram is ~100% jagged at any record length; Welch averaging of $K$ segments cuts fluctuation by $1/\sqrt{K}$, at the price of frequency resolution.
- **Exam ritual:** statement line $\to$ $|H|^2$ via conjugate $\to$ $\frac{1}{2\pi}\int$ with $\int\frac{d\omega}{a^2+\omega^2} = \frac{\pi}{a}$ $\to$ time-route cross-check $\to$ units.
