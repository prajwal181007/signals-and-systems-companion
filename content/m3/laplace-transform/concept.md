---
id: m3/laplace-transform
title: "The Laplace transform: taming signals the Fourier transform can't hold"
short: Laplace transform
module: 3
tier: core
hero: true
outcomes: [CO3]
prereqs: [m3/s-plane, m2/fourier-transform]
aliases: ["laplace", "bilateral laplace", "unilateral laplace", "X(s)", "exponential weighting"]
exam: { minor2: high, major: high, marks: "6–10", styles: [derive, compute] }
crosslinks:
  - { target: m3/roc, relation: "the set of taming rates that work — half of every transform" }
  - { target: m3/solving-odes, relation: "the unilateral form turns initial-condition ODEs into algebra" }
---

## @intuition

The Fourier transform chokes on $e^{t}u(t)$ — the defining integral diverges; the signal grows faster than oscillations can average away. But here is a rescue: *weight the signal down first*. Multiply by $e^{-\sigma t}$ with $\sigma$ big enough and the product decays; NOW Fourier-transform it. The Laplace transform is exactly this: **the Fourier transform of the exponentially tamed signal**, with the taming rate $\sigma$ promoted to a full coordinate.

---
@viz taming {"mode":"s","signal":"growright"}
Watch the taming live. $e^{+t}u(t)$ explodes — but slide $\sigma$ past 1 and the weighted signal $x(t)e^{-\sigma t}$ suddenly has finite area (green). Every $\sigma$ that works contributes one vertical line of the s-plane to the region where $X(s)$ exists. The transform isn't defined *at* a point; it is defined on a **region** — and that region (next concept) carries real information.

---
So $s = \sigma + j\omega$ has two jobs written into it: $\sigma$ asks "how much taming?", $\omega$ asks "which oscillation?". Setting $\sigma = 0$ (no taming) recovers the Fourier transform — when the jω-axis lies in the region where taming works. The Laplace transform doesn't replace Fourier; it *extends* it to signals with growth, which is exactly what unstable circuits and charged capacitors produce.

---
Two flavors share the name. The **bilateral** transform integrates over all time — clean theory, needs the ROC story. The **unilateral** transform starts at $0^-$ and is the *engineer's* version: it doesn't care what happened before the switch closed, and — its killer feature — it absorbs initial conditions automatically through the differentiation rule $\mathcal{L}\{x'\} = sX(s) - x(0^-)$. Exams run almost entirely on the unilateral form; every claim in this module says which flavor it means.

## @definition

**Bilateral:** $X(s) = \displaystyle\int_{-\infty}^{\infty} x(t)\,e^{-st}\,dt$, defined for $s$ in its ROC.
**Unilateral:** $X(s) = \displaystyle\int_{0^-}^{\infty} x(t)\,e^{-st}\,dt$ — blind to $t<0$; ICs enter via the derivative rule.

Core pairs (memorize with their ROCs):
| $x(t)$ | $X(s)$ | ROC |
|---|---|---|
| $\delta(t)$ | $1$ | all $s$ |
| $u(t)$ | $1/s$ | $\mathrm{Re}(s) > 0$ |
| $e^{-at}u(t)$ | $\frac{1}{s+a}$ | $\mathrm{Re}(s) > -a$ |
| $t\,u(t)$ | $1/s^2$ | $\mathrm{Re}(s) > 0$ |
| $t^n u(t)$ | $n!/s^{n+1}$ | $\mathrm{Re}(s) > 0$ |
| $e^{-at}\cos(bt)u(t)$ | $\frac{s+a}{(s+a)^2+b^2}$ | $\mathrm{Re}(s) > -a$ |
| $e^{-at}\sin(bt)u(t)$ | $\frac{b}{(s+a)^2+b^2}$ | $\mathrm{Re}(s) > -a$ |

$X(s)\big|_{s=j\omega} = X(j\omega)$ (the FT) when the ROC contains the jω-axis.

## @derivation

### Step: Compute e^{−at}u(t) from the definition — the template for everything
?why: It is toolkit pattern 1 with complex exponent, and the convergence condition appears by itself.
$$X(s) = \int_{0}^{\infty} e^{-at}e^{-st}dt = \int_0^\infty e^{-(s+a)t}dt = \frac{1}{s+a}, \quad \text{valid where } \mathrm{Re}(s+a) > 0$$
The condition $\mathrm{Re}(s) > -a$ was not imposed — it *emerged* from the upper limit. That emergent condition is the ROC, and every from-the-definition exam question wants it stated.

### Step: The damped-cosine pair via the complex route
?why: cos is Re of a complex exponential; pattern 3 of the toolkit finishes it.
$\mathcal{L}\{e^{-at}\cos(bt)u\} = \mathrm{Re}\,\frac{1}{s + a - jb} = \frac{s+a}{(s+a)^2 + b^2}$. The denominator's roots $-a \pm jb$ are exactly the s-plane atlas points of the waveform — pairs and poles are the same data.

### Step: Laplace = Fourier ∘ taming, exactly
?why: Substitute s = σ + jω into the definition and regroup.
$X(\sigma + j\omega) = \int [x(t)e^{-\sigma t}]e^{-j\omega t}dt = \mathcal{F}\{x(t)e^{-\sigma t}\}$. Each vertical line of the s-plane is one Fourier transform of one tamed copy. All Fourier intuition (spectra, filtering) transfers along each line.

## @examples

**Worked (from the definition — exam ritual):** find $\mathcal{L}\{t e^{-2t}u(t)\}$ from the definition: toolkit pattern 2 with $a = s+2$ gives $\frac{1}{(s+2)^2}$, ROC $\mathrm{Re}(s) > -2$. Ritual: definition written, limit process shown, pattern executed, ROC stated. Four lines, full marks.

**Worked (linearity + table):** $x = 3e^{-t}u(t) - 2e^{-4t}u(t)$: $X = \frac{3}{s+1} - \frac{2}{s+4}$, ROC $\mathrm{Re}(s) > -1$ (the *intersection* of the two ROCs — the more demanding tail wins).

**Worked (u(t) has no ordinary FT, but a fine LT):** $u(t) \leftrightarrow 1/s$, ROC $\mathrm{Re}(s)>0$ — the axis is NOT inside, consistent with $u$'s Fourier transform needing the distributional $\pi\delta(\omega)$ patch. The LT's bookkeeping is cleaner precisely because σ does the taming that ω cannot.

## @misconceptions
- wrong: "X(s) is just X(jω) with letters changed."
  tempting: "The formulas look identical with s ↔ jω."
  correction: "The substitution is legal only when the ROC contains the jω-axis. For u(t) it does not — 1/s at s = jω misses the πδ(ω) term. The σ-coordinate is doing real work, not renaming."
- wrong: "The unilateral transform loses information, so it's inferior."
  tempting: "It throws away all of t < 0."
  correction: "For causal problems with initial conditions — every circuits exam — pre-switch history is SUMMARIZED by x(0⁻), and the unilateral form carries it automatically. It is not inferior; it is specialized for exactly the problems you'll be graded on."
- wrong: "The ROC is a technicality to skip."
  tempting: "The algebra 1/(s+a) feels like the whole answer."
  correction: "Two DIFFERENT signals share 1/(s+a) (right- and left-sided); only the ROC distinguishes them. Omitting it makes your transform literally ambiguous — the next concept is entirely about this."

## @exam

6–10 marks: (a) transforms from the definition with ROC stated (the $e^{-at}$, $te^{-at}$, damped-cosine trio dominate); (b) table + linearity combinations with the ROC intersection; (c) conceptual: bilateral vs unilateral, when LT exists where FT doesn't. Ritual: definition → toolkit pattern → algebra → **ROC on the same line as the answer**. Traps: dropped ROCs (auto-penalized), $0^-$ vs $0^+$ in the unilateral lower limit (use $0^-$ — it catches impulses at the origin), claiming FT = LT|_{jω} without checking the axis.

## @summary

- $X(s) = \int x e^{-st}dt$ = FT of the tamed signal $x e^{-\sigma t}$; σ tames, ω oscillates.
- Unilateral (from $0^-$): the ODE/ICs workhorse; bilateral: the full theory with ROC.
- Core pairs: $u \to 1/s$; $e^{-at}u \to \frac{1}{s+a}$; $t^n u \to n!/s^{n+1}$; damped cos/sin → $\frac{s+a}{(s+a)^2+b^2}$, $\frac{b}{(s+a)^2+b^2}$.
- FT = LT on the jω-axis IFF the axis is in the ROC. Linearity intersects ROCs.
- Every answer travels with its ROC — the algebra alone is ambiguous.
