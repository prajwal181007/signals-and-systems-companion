---
id: m3/z-roc
title: "The z-domain ROC: annuli, and the same two-signals trap"
short: z-ROC
module: 3
tier: core
outcomes: [CO3]
prereqs: [m3/z-transform, m3/roc]
aliases: ["z roc", "annulus", "region of convergence z", "unit circle"]
exam: { minor2: high, major: medium, marks: "4–8", styles: [conceptual, compute] }
crosslinks:
  - { target: m3/inverse-z, relation: "the ROC selects which sequence a given X(z) inverts to" }
  - { target: m4/dtft, relation: "the DTFT exists iff the ROC contains the unit circle" }
---

## @intuition

Everything the s-plane ROC taught you crosses to z with one geometric translation: **vertical lines become circles**. In s, the taming weight was $e^{-\sigma t}$ and regions were half-planes. In z, the weight is $r^{-n}$ — a geometric leash — and the question "which $r$ tames $x[n]$?" carves out **rings centered on the origin**. Outside a circle, inside a circle, or an annulus between two: those are the only shapes.

---
@viz z-explorer {"mode":"z","signal":"rightexp"}
The trap ports over intact. $a^n u[n]$ (right-sided) and $-a^n u[-n-1]$ (left-sided) share the *identical* algebra $X(z) = \frac{z}{z-a}$. Only the region separates them: right-sided ⇒ ROC **outside** the outermost pole ($|z| > |a|$); left-sided ⇒ **inside** the innermost ($|z| < |a|$). Same coin, new currency. Every inverse-z answer must carry its ring.

---
The unit circle inherits the jω-axis's starring role: the **DTFT exists iff $|z| = 1$ lies inside the ROC**, and a **causal system is stable iff all poles sit strictly inside the unit circle** (its ROC $|z| > r_{max}$ then contains the circle). The stability geometry of DT filters — "keep your poles in the disk" — is this sentence.

## @definition

$\mathrm{ROC} = \{z : \sum_n |x[n]|\,|z|^{-n} < \infty\}$ — depends only on $|z|$; always an open ring/disk-complement; never contains poles.

| Sequence class | ROC shape |
|---|---|
| right-sided (incl. causal) | $|z| > r_{max}$ (outside outermost pole) |
| left-sided | $|z| < r_{min}$ (inside innermost pole) |
| two-sided | annulus $r_1 < |z| < r_2$ (possibly empty) |
| finite duration | all $z$ (except possibly $0$ and/or $\infty$) |

- **DTFT exists** ⇔ unit circle ⊂ ROC.
- **Causal + stable** ⇔ all poles strictly inside the unit circle.
- Causal sequences include $z = \infty$ in the ROC (no positive powers of $z$); this "value at infinity" test is a quick causality check on any X(z).

## @derivation

### Step: The geometric leash — where the ring comes from
?why: Each tail imposes one bound on r, exactly as each tail bounded σ.
Future tail ($n \to +\infty$): $\sum |x[n]|r^{-n}$ needs $r$ LARGE (the leash $r^{-n}$ must shrink faster than $x$ grows) ⇒ $|z| > r_{max}$. Past tail ($n \to -\infty$): $r^{-n}$ *grows* backwards unless $r$ is small ⇒ $|z| < r_{min}$. Both tails ⇒ annulus. The s-plane derivation with $e^{\sigma}$ renamed $r$.

### Step: The twins, computed
?why: Two geometric series, complementary convergence.
Right: $\sum_{n\ge0} a^n z^{-n} = \frac{1}{1 - az^{-1}}$ converges for $|az^{-1}| < 1$, i.e. $|z| > |a|$. Left: $-\sum_{n\le-1} a^n z^{-n} = \frac{1}{1-az^{-1}}$ again, but the series (in positive powers of $z/a$) needs $|z| < |a|$. Identical closed form; disjoint rings; the coin again.

### Step: Stability through the circle
?why: BIBO ⇔ Σ|h[n]| < ∞ ⇔ the untamed (r = 1) sum converges ⇔ the unit circle is in the ROC.
For causal $h$, ROC is $|z| > r_{max}$; the circle fits iff $r_{max} < 1$. "Poles in the disk" = Module 1's absolute summability wearing z-plane clothes — the DT twin of "poles in the LHP".

## @examples

**Worked (three readings):** $X(z) = \frac{z^2}{(z-\tfrac12)(z-2)}$. ROC options: $|z|>2$ (right-sided, unstable — the $2^n$ mode lives); $|z|<\tfrac12$ (left-sided); $\tfrac12 < |z| < 2$ (two-sided — and since the ring contains $|z|=1$: the stable reading). Identical drill to the s-plane, radial edition.

**Worked (inference):** "h[n] causal, X has poles at $0.9$ and $1.2$." ROC: $|z| > 1.2$ — which excludes the unit circle: causal but UNSTABLE (the 1.2ⁿ mode). To be stable this system would have to give up causality ($0.9 < |z| < 1.2$).

**Quick causality test:** $X(z) = z + 1 + z^{-1}$: the positive power $z$ means $x[-1] \ne 0$ — not causal; equivalently $X(\infty)$ diverges. Five-second check before longer work.

## @misconceptions
- wrong: "ROC shapes in z are half-planes, like s."
  tempting: "The theory transferred, so the pictures should too."
  correction: "The map z = e^{sT} rolls vertical lines into CIRCLES: z-ROCs are rings/disk-complements, always centered at the origin. Right-sided means OUTSIDE a circle, not to the right of anything."
  probe: q-shape
- wrong: "aⁿu[n] with |a| > 1 has no z-transform."
  tempting: "It grows, and growth killed Fourier transforms."
  correction: "It has a fine transform — z/(z−a) with ROC |z| > |a|. The leash just needs r > |a|. What it lacks is a DTFT (circle outside the ROC) and stability. Existence, stability, and Fourier-existence are three separate questions."
- wrong: "Stable means poles inside the unit circle, for any system."
  tempting: "The slogan is catchy."
  correction: "That slogan is the CAUSAL case. A left-sided system with a pole at 0.5 (ROC |z| < 0.5) excludes the circle — unstable despite the 'inside' pole. Slogan + sidedness = truth; slogan alone = exam bait."

## @exam

4–8 marks mirroring the s-plane drill: enumerate possible ROCs of a rational X(z), classify each (sidedness/causality/stability/DTFT-existence); infer the ring from stated properties. Ritual: draw the pole circles, name the rings between them, test each claim against the ring. Traps: half-plane answers (wrong geometry), the causal-only slogan applied to non-causal readings, forgetting $z=\infty$ membership as the causality tell.

## @summary

- z-ROC = rings: right-sided ⇒ $|z| > r_{max}$; left ⇒ $|z| < r_{min}$; two-sided ⇒ annulus; finite ⇒ almost all z.
- $a^nu[n]$ and $-a^nu[-n-1]$ share $\frac{z}{z-a}$ — the ring disambiguates. Always state it.
- DTFT exists ⇔ unit circle ∈ ROC. **Causal + stable ⇔ poles strictly inside the unit circle.**
- Causal ⇔ ROC includes $z = \infty$ (no positive powers) — the five-second check.
- Every s-plane ROC instinct ports over with lines → circles.
