---
id: m4/reconstruction
title: "Reconstruction: not connect-the-dots — a sum of sincs"
short: Reconstruction
module: 4
tier: core
outcomes: [CO4]
prereqs: [m4/sampling]
aliases: ["interpolation", "sinc interpolation", "zero order hold", "ZOH", "DAC", "ideal reconstruction"]
exam: { minor2: high, major: medium, marks: "4–8", styles: [conceptual, compute] }
crosslinks:
  - { target: m2/ft-properties, relation: "the reconstruction filter is duality's sinc — with all its unrealizability" }
  - { target: m2/gibbs, relation: "truncating sincs rings, exactly as truncating series did" }
---

## @intuition

Given clean samples of a band-limited signal, how do you rebuild the curve *between* them? Not by connecting dots with straight lines — that adds corners the original never had. The exact answer drops out of the replica picture: the sampled spectrum has copies at every $kf_s$; **keep the baseband copy, delete the rest** with an ideal low-pass at $f_s/2$, and what remains *is* the original — perfectly.

---
@viz recon {"f":3,"fs":12}
And what is that filter *doing* in the time domain? Its impulse response is a **sinc**, so filtering the sample-impulses means: **every sample launches its own sinc** — scaled by the sample's value, centered on its instant — and the reconstruction is the sum of all of them. Watch the build-up view: each sinc individually wiggles everywhere, yet their sum threads every sample exactly and fills the gaps with the one band-limited curve that fits.

---
The magic of the threading: a sinc centered at sample $n$ equals 1 there and has **zeros at every other sample instant** — at each dot, exactly one sinc speaks and all the rest are silent. Between dots, they all speak at once, and the interference pattern *is* the interpolation. It works because the signal was band-limited: only one curve of bandwidth $\le f_s/2$ passes through those dots (that is the sampling theorem read backwards).

---
Real DACs can't afford sincs (infinite, noncausal — duality's fine print), so they hold each sample flat until the next: the **zero-order hold** staircase. In the spectrum, ZOH means multiplying by a sinc-shaped droop (the transform of the hold-rectangle) plus leftover replica energy at high frequencies — which is why real converters follow the DAC with a smoothing ("anti-image") filter and sometimes pre-compensate the droop. Engineering is the ideal answer, budgeted.

## @definition

**Ideal reconstruction** (for $f_s > 2f_{max}$):
$$x(t) = \sum_{n=-\infty}^{\infty} x[n]\,\mathrm{sinc}\!\left(\frac{t - nT_s}{T_s}\right), \qquad \mathrm{sinc}(u) = \frac{\sin\pi u}{\pi u}$$
— an ideal low-pass of cutoff $f_s/2$ and gain $T_s$ applied to the impulse-sampled signal. Interpolation property: $\mathrm{sinc}$ at sample $m$: equals $\delta_{nm}$ (1 at its own instant, 0 at every other).

**Zero-order hold:** $x_{ZOH}(t) = x[n]$ for $nT_s \le t < (n{+}1)T_s$. Frequency effect: multiply by $T_s\,\mathrm{sinc}(f/f_s)\,e^{-j\pi f/f_s}$ — a droop reaching $\approx -3.9$ dB at $f_s/2$, plus attenuated (not removed) replicas ⇒ follow with a smoothing filter. **First-order hold**: connect-the-dots (triangular kernel) — droop squared, gentler images.

## @derivation

### Step: From replica-deletion to the sinc sum
?why: The ideal LPF's impulse response is the sinc; filtering impulses = summing shifted kernels.
$x = x_s * h_{LPF}$ with $h_{LPF}(t) = \mathrm{sinc}(t/T_s)$ (gain $T_s$, cutoff $f_s/2$). Since $x_s = \sum x[n]\delta(t - nT_s)$, convolution copies the kernel onto every sample: $x = \sum x[n]\,\mathrm{sinc}((t-nT_s)/T_s)$. Frequency surgery and time-domain sinc-summing are the same act.

### Step: Why the sum threads every sample
?why: sinc(k) = 0 for every nonzero integer k.
At $t = mT_s$: $\mathrm{sinc}(m - n) = 1$ if $n = m$, else 0 — the sum collapses to $x[m]$. Exact interpolation is not imposed; it falls out of the sinc's zero spacing being precisely $T_s$.

### Step: The ZOH droop
?why: Holding = convolving with a T_s-wide rectangle; rectangles transform to sincs.
$x_{ZOH} = x_s * \mathrm{rect}_{T_s}$ ⇒ spectrum × $T_s\,\mathrm{sinc}(f/f_s)$ (droop) with linear phase (half-sample delay). At $f_s/2$: $\mathrm{sinc}(\tfrac12) = 2/\pi \approx 0.64$ ⇒ $-3.9$ dB. The staircase's corners = the surviving replica energy; smoothing filters exist to eat them.

## @examples

**Worked (hand interpolation, exam pattern):** samples $x[0] = 1, x[1] = 2, x[2] = 1$ ($T_s = 1$), all others 0. Reconstruct at $t = 0.5$: $x(0.5) = 1\,\mathrm{sinc}(0.5) + 2\,\mathrm{sinc}(-0.5) + 1\,\mathrm{sinc}(-1.5) = \frac{2}{\pi}(1 + 2) + 1\cdot\frac{\sin(-1.5\pi)}{-1.5\pi} = \frac{6}{\pi} - \frac{2}{3\pi} \approx 1.70$. Not the linear-interpolation 1.5 — the band-limited curve overshoots between rising samples, legitimately.

**Worked (why the staircase sounds harsh):** a 1 kHz tone through a 8 kHz ZOH DAC: droop $\mathrm{sinc}(1/8) \approx 0.997$ (negligible), but replicas at $7, 9, 15, 17$ kHz survive at $\mathrm{sinc}$-attenuated levels — audible hash without the smoothing filter. The filter, not the hold, is what makes DAC output sound clean.

**Conceptual:** why can't we use the ideal sinc? It extends over all time (noncausal, infinite) — dualitys's price for a brick-wall spectrum; truncating it rings (Gibbs's cousin). Practical kernels trade a droop and guard bands for realizability.

## @misconceptions
- wrong: "Reconstruction = connecting the dots (linear interpolation)."
  tempting: "It's what every plotting library does."
  correction: "Straight segments have corners ⇒ high-frequency content the band-limited original never had. The correct interpolant is the sinc sum — smoother than intuition expects, and it can legitimately overshoot BETWEEN samples."
- wrong: "Each sample only influences the curve near itself."
  tempting: "Locality feels physical."
  correction: "Every sinc extends over ALL time — each sample influences the entire reconstruction (decaying as 1/t). Band-limitedness is a global constraint; that's also why real-time reconstruction must approximate."
- wrong: "The ZOH staircase is the reconstruction error."
  tempting: "The steps look wrong, so steps = error."
  correction: "The staircase is a CHEAP KERNEL choice, not the theory failing: droop + surviving images, both quantified and both fixable (smoothing filter, droop compensation). Ideal reconstruction remains exact — just unaffordable."

## @exam

4–8 marks: (a) state the interpolation formula and why it threads samples (sinc zeros at integer multiples); (b) hand-evaluate a 2–3 sample reconstruction at a midpoint; (c) ZOH: sketch the staircase, name the droop ($\mathrm{sinc}$ shape, $-3.9$ dB at $f_s/2$) and the need for a smoothing filter; (d) conceptual: why ideal reconstruction is unrealizable (noncausal infinite sinc). Traps: claiming locality of influence; linear interpolation as "the" answer; forgetting the smoothing filter's role after a DAC.

## @summary

- Ideal: delete replicas with an LPF at $f_s/2$ ⇔ **sum of sincs**: $x(t) = \sum x[n]\,\mathrm{sinc}\big(\frac{t-nT_s}{T_s}\big)$.
- Threads every sample because $\mathrm{sinc}$(integer) $= 0$ — one voice per dot, interference between dots.
- Unrealizable ideally (infinite noncausal sinc); truncation rings (Gibbs's cousin).
- ZOH staircase: × $\mathrm{sinc}(f/f_s)$ droop ($-3.9$ dB at $f_s/2$) + surviving images ⇒ smoothing filter after the DAC.
- Between samples the true curve may overshoot linear interpolation — band-limited ≠ polygon.
