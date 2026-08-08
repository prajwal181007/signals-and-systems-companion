---
id: m2/ft-properties
title: "Fourier transform properties: the symmetries that generate the table"
short: FT properties
module: 2
tier: core
outcomes: [CO2]
prereqs: [m2/fourier-transform]
aliases: ["duality", "modulation property", "convolution theorem", "scaling property", "transform table"]
exam: { minor1: high, major: high, marks: "6–10", styles: [compute, derive] }
crosslinks:
  - { target: m1/convolution, relation: "the convolution theorem is why transforms exist: hard time-domain work becomes multiplication" }
  - { target: m4/sampling, relation: "the modulation property, applied to an impulse comb, IS the sampling theorem's engine" }
---

## @intuition

Nobody computes every Fourier transform from the definition. Working engineers know perhaps six pairs and a handful of *properties* — the rules for how transforms respond to shifting, scaling, modulating, differentiating. The properties don't just save labor: each one is a two-domain symmetry, and together they generate the entire standard table on demand from a couple of seeds.

---
@viz explorer {"signal":"rect"}
Pull the **scale** lever: squeeze the pulse and its sinc smears wide; stretch it and the sinc sharpens — with the height trading as $1/|a|$ so total area bookkeeping survives. Time and frequency stretch *reciprocally*, always. Pull **shift**: the magnitude refuses to move while phase tilts — same story as FS, now continuous. Pull **modulate**: multiply by $\cos(\omega_c t)$ and the whole spectrum splits into half-copies parked at $\pm\omega_c$ — that slide-apart animation is AM radio in one gesture.

---
The crown jewel: **convolution ⇔ multiplication**. $x * h$ in time — the sliding-integral grind of Module 1 — becomes plain pointwise product $X(j\omega)H(j\omega)$ in frequency. This is *the* reason transforms exist: filtering becomes multiplication by a frequency-shaped window, and cascade design becomes arithmetic. Its mirror twin: multiplication in time ⇔ (scaled) convolution in frequency — which will explain windowing and sampling.

---
And **duality**, the strangest symmetry: the transform machine applied twice returns the original reversed ($X(t) \leftrightarrow 2\pi x(-\omega)$). Practically: every pair you know is secretly two pairs — rect ↔ sinc gives you sinc ↔ rect for free (with $2\pi$ bookkeeping). The table is half as long as it looks.

## @definition

Let $x \leftrightarrow X(j\omega)$, $y \leftrightarrow Y$:

| Time | Frequency |
|---|---|
| $ax + by$ | $aX + bY$ |
| $x(t-t_0)$ | $e^{-j\omega t_0}X(j\omega)$ |
| $e^{j\omega_0 t}x(t)$ | $X(j(\omega - \omega_0))$ |
| $x(t)\cos(\omega_c t)$ | $\tfrac12 X(j(\omega{-}\omega_c)) + \tfrac12 X(j(\omega{+}\omega_c))$ |
| $x(at)$ | $\tfrac{1}{|a|}X(j\omega/a)$ |
| $x(-t)$ | $X(-j\omega)$ ($= X^*(j\omega)$ for real $x$) |
| $\tfrac{dx}{dt}$ | $j\omega\,X(j\omega)$ |
| $\displaystyle\int_{-\infty}^{t} x$ | $\tfrac{X(j\omega)}{j\omega} + \pi X(0)\delta(\omega)$ |
| $x * h$ | $X\cdot H$ |
| $x\cdot y$ | $\tfrac{1}{2\pi}(X * Y)$ |
| **Duality** | $X(t) \leftrightarrow 2\pi\,x(-\omega)$ |

Seed pairs to know cold: $e^{-at}u(t) \leftrightarrow \frac{1}{a+j\omega}$; rect width $2T \leftrightarrow 2T\,\mathrm{sinc}$-shape $\frac{2\sin\omega T}{\omega}$; $\delta(t) \leftrightarrow 1$; Gaussian ↔ Gaussian.

## @derivation

### Step: Convolution theorem — the two-line proof that pays your salary
?why: Swap the integration order; the inner integral is a shifted transform, which factors by the shift property.
$$\mathcal{F}\{x*h\} = \int\!\!\int x(\tau)h(t-\tau)d\tau\, e^{-j\omega t}dt = \int x(\tau)\underbrace{\left[\int h(t-\tau)e^{-j\omega t}dt\right]}_{e^{-j\omega\tau}H(j\omega)}d\tau = X(j\omega)H(j\omega)$$
Every filter design and every transfer function in the rest of the course stands on these two lines.

### Step: Scaling with the 1/|a| — where it comes from
?why: Substituting λ = at rescales dt, and a negative a also flips the integration limits.
$\int x(at)e^{-j\omega t}dt \xrightarrow{\lambda = at} \tfrac{1}{|a|}\int x(\lambda)e^{-j(\omega/a)\lambda}d\lambda = \tfrac{1}{|a|}X(j\omega/a)$. Squeeze by 2: spectrum stretches by 2 and drops to half height. Bandwidth × duration is scale-invariant — the uncertainty principle's bookkeeping.

### Step: Modulation from the frequency-shift property
?why: cos splits into two complex exponentials; each shifts the spectrum one way.
$x\cos\omega_c t = \tfrac12 x e^{j\omega_c t} + \tfrac12 x e^{-j\omega_c t} \leftrightarrow \tfrac12 X(j(\omega{-}\omega_c)) + \tfrac12 X(j(\omega{+}\omega_c))$. Baseband audio (±20 kHz) parked at a 700 kHz carrier: that split-and-slide is the entire physical layer of AM broadcasting.

### Step: Differentiation, and the integration fine print
?why: Differentiate the synthesis integral in t; integration inverts it except for the DC ambiguity.
$\frac{d}{dt}$ pulls down $j\omega$: high frequencies boosted linearly. Integration divides by $j\omega$ *plus* the $\pi X(0)\delta(\omega)$ term — the accumulated DC that pure division misses (integrating a signal with nonzero average yields a step-like component). Forgetting that δ-term is the most common properties error on papers: $u(t) = \int\delta$ is the canonical case, giving $\frac{1}{j\omega} + \pi\delta(\omega)$.

## @examples

**Worked (generate a pair from seeds):** find $\mathcal{F}\{t\,e^{-at}u(t)\}$. Differentiate the seed $\frac{1}{a+j\omega}$ with respect to $a$... or use the frequency-differentiation twin ($-jt\,x \leftrightarrow \frac{dX}{d\omega}$): result $\frac{1}{(a+j\omega)^2}$. No integral was harmed.

**Worked (modulated pulse, exam classic):** rect of width 2 modulated by $\cos(10t)$: two half-sincs centered at $\omega = \pm10$. Sketch: the baseband sinc, halved, copied to ±10. Three labeled features = three marks: centers, heights ($\times\tfrac12$), first nulls (unchanged spacing).

**Worked (duality in anger):** what signal has a *rectangular spectrum* (ideal low-pass)? Duality on rect ↔ sinc: a sinc in time ↔ rect in frequency (2π bookkeeping absorbed into the width). Consequence: the ideal filter's impulse response is a sinc — noncausal, infinitely long — hence unrealizable: a one-line proof via properties.

## @misconceptions
- wrong: "Compressing a signal compresses its spectrum."
  tempting: "Everything about the signal shrank, so surely its transform did too."
  correction: "RECIPROCAL: x(2t) has spectrum X(jω/2)/2 — twice as WIDE. Fast events need wide bandwidth; that reciprocity is physics (uncertainty), not convention."
- wrong: "∫x dt ↔ X/(jω), done."
  tempting: "It's the clean inverse of the differentiation rule."
  correction: "Plus πX(0)δ(ω)! Division by jω loses the accumulated DC. u(t) = ∫δ is the witness: 1/(jω) + πδ(ω). Papers specifically bait this term."
- wrong: "Multiplication in time is multiplication in frequency."
  tempting: "Convolution↔multiplication makes the operations feel interchangeable."
  correction: "Multiplication in time ⇔ CONVOLUTION in frequency (÷2π). The pairing is crossed: each domain's product is the other's convolution. Windowing (time-multiply) smears spectra — that's the frequency convolution talking."
- wrong: "Duality means X and x are equal."
  tempting: "rect↔sinc↔rect looks like a loop of sameness."
  correction: "X(t) ↔ 2πx(−ω): a reversal AND a 2π. Duality doubles the table; it doesn't collapse it."

## @exam

Reliable 6–10 marks: (a) compute transforms of shifted/scaled/modulated variants of table signals — NAME the property at each step (the mark is for the name + correct factor); (b) prove one property from the definition (shift and convolution are the favorites — rehearse both to ≤ 5 lines); (c) sketch modulated-pulse spectra with labeled centers/heights/nulls. Traps: the missing $\pi X(0)\delta(\omega)$ in integration; the crossed multiplication/convolution pairing; $1/|a|$ dropped in scaling; duality's reversal-and-$2\pi$.

## @summary

- Shift ⇒ phase ramp; modulate ⇒ split to $\pm\omega_c$ (halved); scale ⇒ reciprocal stretch with $1/|a|$.
- **$x*h \leftrightarrow XH$** (the reason transforms exist); $x\cdot y \leftrightarrow \frac{1}{2\pi}X*Y$ (crossed pairing!).
- $d/dt \leftrightarrow j\omega$; $\int \leftrightarrow \frac{1}{j\omega} + \pi X(0)\delta(\omega)$ — keep the δ.
- Duality: $X(t) \leftrightarrow 2\pi x(-\omega)$ — every pair is two pairs; ideal-filter sinc unrealizability in one line.
- Seeds ($e^{-at}u$, rect↔sinc, δ↔1, Gauss↔Gauss) + properties = the whole table on demand.
