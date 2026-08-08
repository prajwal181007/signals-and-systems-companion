---
id: m5/bode-plots
title: "Bode plots: why log axes let you sketch a 6th-order system by hand"
short: Bode plots
module: 5
tier: core
hero: true
outcomes: [CO5]
prereqs: [m3/transfer-function, m2/frequency-response]
aliases: ["bode", "asymptotes", "corner frequency", "dB", "decade", "20 dB per decade"]
exam: { major: high, marks: "8–12", styles: [sketch, compute] }
crosslinks:
  - { target: m5/stability-margins, relation: "the margins live on these axes — the payoff of the sketch" }
  - { target: m2/frequency-response, relation: "the same |H| and ∠H, re-plotted so factors ADD" }
---

## @intuition

Hendrik Bode's gift to every engineer since 1940: plot $|H|$ in **decibels** against **log frequency**, and multiplication becomes addition. A transfer function is a product of first- and second-order factors; on log axes each factor contributes its own simple piece, and the total is their *graphical sum*. A 6th-order response — hopeless to evaluate mentally — becomes six straight-line stencils stacked on top of each other. That is why Bode plots are hand-sketchable, and why exams demand exactly that sketch.

---
@viz workbench {"preset":"motor"}
The asymptote rules, which the workbench overlays in dashed amber: each **pole** contributes a line that runs flat until its corner frequency $|p|$, then falls at **−20 dB/decade**; each **zero** rises at +20 after its corner. Phase: each pole lays in **−90°**, smeared over roughly a decade either side of its corner (−45° *at* the corner); zeros mirror upward. Poles at the origin skip the flat part: a **type-$n$** system *starts* at $-20n$ dB/dec. Toggle "reality" on and off: the exact curve hugs the asymptotes everywhere except near corners, where it misses by a civilized **−3 dB** (first-order) — the sketch is quantitatively trustworthy.

---
The hand ritual, in full: (1) factor $H$ into standard forms and pull out the DC/low-frequency gain; (2) list corners in ascending order; (3) start the magnitude line at the low-frequency asymptote (slope $= -20 \times$ type), bending −20 at each pole corner, +20 at each zero; (4) phase: sum the per-factor ramps; (5) annotate exact −3 dB at first-order corners. Reading numbers *off* the sketch is the second examined skill: gain at a given ω via slope arithmetic ("2 decades above crossover at −20 dB/dec ⇒ −40 dB"), crossover locations, and — next concept — the margins.

---
Second-order pairs bring the one wrinkle: a complex pole pair contributes −40 dB/dec past $\omega_n$ *plus a resonant bump* near $\omega_n$ whose height grows as damping ζ falls (peak $\approx \frac{1}{2\zeta}$ for small ζ). The asymptotes miss the bump entirely — annotate it or lose the physics (and the mark).

## @definition

With $H$ factored into $K$, $s^{\pm n}$, $(1 + s/\omega_c)^{\pm1}$, and quadratic pairs $(1 + 2\zeta s/\omega_n + s^2/\omega_n^2)^{\pm1}$:

- **Magnitude (dB = $20\log_{10}|H|$):** constant $K$: flat $20\log K$. Pole at origin: −20 dB/dec through 0 dB at ω = 1 (× type $n$). Real pole (corner $\omega_c$): flat, then −20 dB/dec; exact curve −3 dB at the corner. Zero: mirror (+20). Quadratic pair: −40 dB/dec past $\omega_n$, resonant peak ≈ $-20\log(2\zeta)$ dB for $\zeta < 0.5$.
- **Phase:** real pole: 0° → −90°, −45° at the corner, transition ≈ $[\omega_c/10, 10\omega_c]$. Zero: mirror. Origin pole: constant −90° (× n). Quadratic: 0° → −180°, −90° at $\omega_n$, sharper as ζ falls.
- **Slope bookkeeping:** total slope at any ω = −20 × (poles engaged) + 20 × (zeros engaged); "engaged" = corner below ω.

## @derivation

### Step: Why decibels make factors add
?why: log of a product is a sum of logs — the entire trick.
$|H| = |F_1||F_2|\cdots \Rightarrow 20\log|H| = \sum 20\log|F_i|$; phases add as $\angle H = \sum\angle F_i$ outright (angles of a product). The log axes don't approximate anything — they re-coordinate so that superposition of simple stencils is EXACT; only the stencils themselves are asymptotic.

### Step: The one-pole stencil, derived once
?why: Two regimes of |1 + jω/ω_c| give the two asymptote segments; the corner value gives the −3 dB.
$|H| = \frac{1}{\sqrt{1 + (\omega/\omega_c)^2}}$: for $\omega \ll \omega_c$: ≈ 1 (0 dB, flat); for $\omega \gg \omega_c$: ≈ $\omega_c/\omega$ — a straight line on log axes falling 20 dB per ×10. At $\omega = \omega_c$ exactly: $1/\sqrt2$ = −3.01 dB. One derivation; every real pole forever after is this stencil slid to its corner.

### Step: Reading gain off slopes (the numeric skill)
?why: A straight line in (log ω, dB) coordinates is arithmetic: ΔdB = slope × decades.
Example: crossover (0 dB) at 2 rad/s falling at −20 dB/dec; gain at 20 rad/s = one decade above = **−20 dB** (= ×0.1). At 200 rad/s: −40 dB. Inverting: where does a line at +26 dB with −20 dB/dec hit 0? $26/20 = 1.3$ decades above its reference. This slope-arithmetic is half the marks in every Bode question.

## @examples

**Worked (the exam sketch, in full):** $H(s) = \frac{100(s+1)}{s(s+10)(s+100)}$. Normalize: $\frac{100 \cdot 1}{10\cdot100}\cdot\frac{(1+s)}{s(1+s/10)(1+s/100)} = \frac{0.1(1+s)}{s(1+s/10)(1+s/100)}$. Type 1 ⇒ start at −20 dB/dec; low-freq asymptote passes $20\log(0.1/\omega)$... at ω = 0.1: 0 dB. Corners ascending: zero at 1 (+20 ⇒ slope 0), poles at 10 (−20) and 100 (−40). Phase: −90° (origin) + ramps. The five-line table "corner | type | new slope" IS the answer format markers want.

**Worked (reading numbers):** from that sketch, gain at ω = 1000: last segment −40 dB/dec from the corner at 100 where the level was ≈ −20 dB ⇒ −20 − 40·1 = **−60 dB**. Stated as slope-arithmetic, one line.

**Worked (resonance annotation):** $\frac{1}{1 + 0.2(s/3) + (s/3)^2}$: $\omega_n = 3$, $\zeta = 0.1$ ⇒ peak ≈ $-20\log(0.2) = +14$ dB above the asymptote at ω ≈ 3, then −40 dB/dec. Omitting the bump halves the physics of every lightly-damped plant.

## @misconceptions
- wrong: "The asymptotic sketch is a rough cartoon."
  tempting: "Straight lines can't capture a smooth curve."
  correction: "The worst first-order error is 3 dB, AT the corner, with a known sign — everywhere else the asymptotes converge to the truth. It is an engineering-grade approximation with an error bar, not a cartoon. (Exception: low-ζ resonances — annotate the bump.)"
- wrong: "Phase snaps by −90° at the corner."
  tempting: "The magnitude bends there, so phase should too."
  correction: "Phase SMEARS over ±1 decade (−45° at the corner, ~−6°/octave tails). The smear is why phase margins erode a decade before a pole 'arrives' — treating phase as a step function wrecks margin estimates."
- wrong: "Slopes come in any value."
  tempting: "Curves are free to do anything."
  correction: "Asymptotic slopes are QUANTIZED: multiples of ±20 dB/dec (±40 for quadratics). A sketched segment at −30 dB/dec is a self-announcing error. Count engaged poles minus zeros; multiply by 20."
- wrong: "The plot starts flat for every system."
  tempting: "The first stencil is flat, so start flat."
  correction: "Poles at the origin never flatten: a type-1 system ENTERS at −20 dB/dec (type 2: −40). The starting slope = −20 × type is the first thing an examiner checks."

## @exam

The Major's banker (8–12 marks): sketch magnitude AND phase for a 2–3 corner $H$ (often type 1). Full-marks format: normalized form → corner table (corner | pole/zero | slope after) → magnitude polyline with the starting slope stated → phase as summed ramps → −3 dB annotations → numeric reads (gain at a given ω, crossover location) by slope arithmetic. Traps: unnormalized gain (wrong level everywhere); starting slope ignoring type; −30 dB/dec segments; phase as steps; missing resonant bump on low-ζ quadratics.

## @summary

- dB + log-ω ⇒ factors ADD: sketch = sum of stencils. Slopes quantized: ±20 dB/dec per engaged pole/zero (±40 quadratics).
- Real pole: flat → −20 past the corner, −3 dB exact at it; phase 0→−90° smeared ±1 decade, −45° at corner. Zeros mirror.
- Type $n$ ⇒ starting slope $-20n$ dB/dec (never flat). Quadratic pair: −40 + resonant peak ≈ $-20\log 2\zeta$ dB.
- Slope arithmetic reads gains: ΔdB = slope × decades — half the marks.
- Ritual: normalize → corner table → polyline → phase ramps → annotate → numeric reads.
