---
id: m4/sampling
title: "Sampling: when do dots capture the whole curve?"
short: Sampling
module: 4
tier: core
hero: true
outcomes: [CO4]
prereqs: [m2/ft-properties]
aliases: ["nyquist", "sampling theorem", "aliasing", "anti-aliasing", "spectral replicas", "fs"]
exam: { minor2: high, major: high, marks: "8–12", styles: [compute, sketch, conceptual] }
crosslinks:
  - { target: m4/reconstruction, relation: "the return trip: how dots become the curve again" }
  - { target: m3/z-transform, relation: "the strip-to-disk map e^{sT} is this concept seen from the z-plane" }
---

## @intuition

Every digital device commits the same audacious act: it throws away *almost all* of a continuous signal — keeping only samples — and claims nothing was lost. Sometimes that claim is exactly true; sometimes the signal is silently replaced by an impostor. The line between those outcomes is one inequality, and it is arguably the most consequential inequality in modern engineering: $f_s > 2f_{max}$.

---
@viz lab {"f":3,"fs":10}
Start safe: a 3 Hz sine sampled at 10 Hz. The reconstruction threads the dots and *is* the original. Now drag $f_s$ down through 6 Hz — the Nyquist line — and keep going. At $f_s = 5$: the dots are perfectly consistent with a **2 Hz** sine, and the reconstructor — doing nothing wrong — confidently produces that impostor. This is **aliasing**: a clean, plausible, *wrong* lower frequency wearing the samples of the true one. Press the audio buttons: the 3 comes back as a 2. Your ear confirms the theft.

---
Why replicas? Sampling is multiplication by an impulse comb — and the comb's transform is another comb. Multiplication in time ⇔ convolution in frequency: the spectrum gets **copied at every multiple of $f_s$**. The spectrum pane shows the copies sliding as you drag $f_s$. Nyquist's criterion is nothing more than *"keep the copies from touching"*: each replica needs $2f_{max}$ of clearance. When they collide, frequencies from one copy land on another's territory — and once mixed, **no filter can un-mix them**: two different inputs now produce identical samples. Information is not hidden; it is *gone*.

---
Hence the iron rule of practice: the **anti-aliasing filter goes BEFORE the sampler**. Band-limit first (kill everything above $f_s/2$), then sample — losing high frequencies deliberately beats corrupting low ones irreversibly. Toggling the filter *after* sampling in the lab rescues nothing: the collision already happened.

## @definition

Sampling $x(t)$ at rate $f_s = 1/T_s$: $x[n] = x(nT_s)$. Model: $x_s(t) = x(t)\cdot\sum_n \delta(t - nT_s)$.

- **Spectrum of the sampled signal:** $X_s(j\omega) = \frac{1}{T_s}\sum_{k=-\infty}^{\infty} X\big(j(\omega - k\omega_s)\big)$ — replicas at every multiple of $\omega_s = 2\pi f_s$, scaled by $1/T_s$.
- **Sampling theorem (Nyquist–Shannon):** a band-limited signal ($X = 0$ for $|f| > f_{max}$) is *perfectly recoverable* from its samples iff $f_s > 2f_{max}$. The critical rate $2f_{max}$ is the **Nyquist rate**.
- **Aliasing:** for a tone at $f > f_s/2$, the reconstructed (apparent) frequency is $f_a = |f - k f_s|$, choosing the integer $k$ that lands $f_a$ in $[0, f_s/2]$.
- **Anti-alias filter:** low-pass at $f_s/2$ applied *before* sampling.

## @derivation

### Step: The replica formula from the property table
?why: The impulse comb's transform is a comb; time-multiplication is frequency-convolution.
$\sum\delta(t - nT_s) \leftrightarrow \frac{2\pi}{T_s}\sum\delta(\omega - k\omega_s)$ (a comb transforms to a comb — the FS of the comb makes this two lines). Then $x\cdot\text{comb} \leftrightarrow \frac{1}{2\pi}X * \text{comb} = \frac{1}{T_s}\sum_k X(j(\omega - k\omega_s))$: convolution with impulses copies — so the spectrum is copied at every $k\omega_s$. No new mathematics: two Module-2 properties composed.

### Step: Nyquist as geometry
?why: Copies of width 2ω_max spaced ω_s apart overlap iff ω_s < 2ω_max.
The baseband copy occupies $[-\omega_{max}, \omega_{max}]$; its neighbor starts at $\omega_s - \omega_{max}$. No overlap ⇔ $\omega_s - \omega_{max} > \omega_{max}$ ⇔ $\omega_s > 2\omega_{max}$. The theorem is a statement about circles not touching — the picture *is* the proof.

### Step: The alias frequency formula
?why: All frequencies f + k·f_s produce identical samples; the reconstructor picks the baseband representative.
$e^{j2\pi f nT_s} = e^{j2\pi(f + kf_s)nT_s}$ for any integer $k$ (the extra phase is a multiple of $2\pi n$). Sampling cannot distinguish the family $\{f + kf_s\}$; reconstruction returns the member in $[0, f_s/2]$: $f_a = |f - kf_s|$ folded into band. A 7 kHz tone at $f_s = 10$ kHz: $|7 - 10| = 3$ kHz. Movie wagon wheels spinning backwards: the same formula with the camera's frame rate as $f_s$.

## @examples

**Worked (exam staple):** $x = \cos(2\pi\cdot 60 t)$ sampled at $f_s = 100$ Hz. $f = 60 > f_s/2 = 50$: aliased. $f_a = |60 - 100| = 40$ Hz. The samples are *identical* to those of a 40 Hz cosine — write the folded frequency AND the sentence "indistinguishable from"; both carry marks.

**Worked (composite):** $x$ has content at 10, 30, and 70 Hz; $f_s = 100$ Hz. The 70 Hz component folds to 30 Hz — landing *on top of* genuine 30 Hz content: corrupted, unrecoverable. Minimum safe rate: $f_s > 140$ Hz. This "collision with a real component" variant is the harder exam form.

**Worked (design):** speech band-limited to 3.4 kHz: Nyquist rate 6.8 kHz; telephony samples at 8 kHz — the margin (guard band) buys a realizable (non-brick-wall) anti-alias filter. Real systems always pay some margin; "sample exactly at 2f" is a trap (phase-dependent amplitude at exactly the Nyquist frequency).

## @misconceptions
- wrong: "Aliasing just blurs the signal a bit."
  tempting: "Undersampling sounds like 'lower quality'."
  correction: "Aliasing is IDENTITY THEFT, not blur: a specific wrong frequency with full amplitude and clean shape. The reconstruction looks perfect and is perfectly wrong — that confident wrongness is what makes it dangerous."
- wrong: "A filter after sampling can undo aliasing."
  tempting: "Filters remove unwanted frequencies, and the alias is unwanted."
  correction: "After folding, the impostor sits INSIDE the legitimate band, indistinguishable from real content there (two different inputs, same samples). Anti-aliasing must happen BEFORE the sampler — order is everything."
- wrong: "Sampling at exactly 2f_max is safe."
  tempting: "The theorem says 2f_max is the magic number."
  correction: "The theorem needs STRICTLY greater. At exactly 2f, a sine can be sampled at its zero crossings — amplitude information lost (phase-dependent). Real systems add margin for the filter's skirt too."
- wrong: "More samples always means more information."
  tempting: "Data feels like information."
  correction: "Above the Nyquist rate, extra samples add REDUNDANCY, not information — the band-limited signal was already fully determined. (Oversampling has engineering uses — easier filters, noise shaping — but not 'more signal'.)"

## @exam

8–12 marks, guaranteed on Minor II and the Major: (a) compute alias frequencies for given tones and rates (fold into $[0, f_s/2]$, show the $k$); (b) sketch the replicated spectrum for a given $X$ and $f_s$, marking overlap; (c) state the sampling theorem precisely (band-limited + strict inequality — both clauses marked); (d) minimum $f_s$ for a composite signal, including the collision variant. Ritual: draw the baseband triangle, copy it at $\pm f_s, \pm 2f_s$, shade any overlap, then read answers off the picture. Traps: $\ge$ vs $>$; filtering after sampling; forgetting replicas extend both directions.

## @summary

- Sampling ⇒ spectrum replicas at every $kf_s$ (comb × ⇒ comb ∗). **Nyquist: $f_s > 2f_{max}$, strictly** = "copies don't touch".
- Alias frequency: fold $f$ by multiples of $f_s$ into $[0, f_s/2]$: $f_a = |f - kf_s|$. 60 @ 100 → 40.
- Aliasing is irreversible identity theft — anti-alias filter goes BEFORE the sampler, always.
- Exactly $2f$: unsafe (zero-crossing sampling). Real systems pay margin (speech: 6.8 needed, 8 kHz used).
- Sketch ritual: baseband + replicas + shade overlap; read every answer off the picture.
