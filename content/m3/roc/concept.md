---
id: m3/roc
title: "The ROC: half of every transform"
short: ROC
module: 3
tier: core
hero: true
outcomes: [CO3]
prereqs: [m3/laplace-transform]
aliases: ["region of convergence", "roc", "right sided", "left sided", "strip of convergence"]
exam: { minor2: high, major: high, marks: "6–10", styles: [conceptual, compute] }
crosslinks:
  - { target: m3/z-roc, relation: "the same story in z, with annuli instead of half-planes" }
  - { target: m3/inverse-laplace, relation: "the ROC decides WHICH signal a given X(s) inverts to" }
---

## @intuition

Here is the most under-appreciated fact in Module 3: the algebra $X(s) = \frac{1}{s+1}$ does **not** specify a signal. Two completely different signals — decaying $e^{-t}u(t)$ and the left-sided, blowing-up $-e^{-t}u(-t)$ — produce *that exact same expression*. What distinguishes them is invisible in the formula: *where* the defining integral converges. The ROC is not a technicality stapled to the answer; it is **half the answer**.

---
@viz explorer {"mode":"s","signal":"rightexp"}
Paint the ROC yourself. For $e^{-t}u(t)$, slide σ: every σ > −1 tames it (the future-tail dies faster than the weight can amplify) — the region right of the pole fills in, stroke by stroke. Now switch to the left-sided twin: the SAME pole at −1, but now σ must be *less* than −1 (the weight must die toward $t = -\infty$ where the signal grows). Same algebra; mirror-image regions; different universes of signal.

---
The geometry follows the signal's *sidedness*, always: **right-sided ⇒ right of the rightmost pole. Left-sided ⇒ left of the leftmost pole. Two-sided ⇒ a vertical strip** between poles (each tail imposes its own inequality; both must hold). And it can be *empty*: $e^{|t|}$ grows both ways — no σ tames both tails; some signals simply have no Laplace transform.

---
Why care beyond bookkeeping? Two theorems read straight off the region. **FT exists** (ordinary sense) ⇔ the ROC contains the jω-axis. **A causal system is stable** ⇔ its ROC — right of the rightmost pole — contains the axis ⇔ *all poles strictly in the left half-plane*: the stability criterion the rest of the course (Bode, Nyquist, state-space) keeps re-deriving in other clothes starts right here.

## @definition

For $X(s) = \int x e^{-st}dt$: $\mathrm{ROC} = \{s : \int |x(t)e^{-\sigma t}|dt < \infty\}$ — depends only on $\sigma = \mathrm{Re}(s)$; always an open vertical strip/half-plane; never contains a pole.

| Signal class | ROC shape |
|---|---|
| right-sided (incl. causal) | $\mathrm{Re}(s) > \sigma_{max}$ (right of rightmost pole) |
| left-sided | $\mathrm{Re}(s) < \sigma_{min}$ |
| two-sided | strip $\sigma_1 < \mathrm{Re}(s) < \sigma_2$ (may be empty) |
| finite duration | all $s$ |

- **FT exists** (ordinary) ⇔ jω-axis ⊂ ROC.
- **Causal + stable** ⇔ ROC ⊇ axis and extends right ⇔ all poles in open LHP.
- Unilateral LT: sidedness is fixed (right), so the ROC is implied — one reason exams can afford to focus on it.

## @derivation

### Step: The two-signals-one-formula theorem, honestly
?why: Run both defining integrals; identical algebra, disjoint convergence sets.
Right: $\int_0^\infty e^{-t}e^{-st}dt = \frac{1}{s+1}$, needs $\mathrm{Re}(s) > -1$. Left: $\int_{-\infty}^0 (-e^{-t})e^{-st}dt = \frac{1}{s+1}$, needs $\mathrm{Re}(s) < -1$. Same rational function; complementary half-planes. Handing someone "$\frac{1}{s+1}$" without a region is handing them a coin, unflipped.

### Step: Why sidedness sculpts the region
?why: Each infinite tail imposes one inequality on σ.
Future tail ($t \to +\infty$): needs the weight to *kill* it ⇒ σ big enough (lower bound). Past tail ($t \to -\infty$): the weight $e^{-\sigma t}$ *grows* backwards unless σ is small ⇒ upper bound. Right-sided: only the first constraint. Left: only the second. Two-sided: both ⇒ strip. Empty when the constraints conflict ($e^{|t|}$: needs σ>1 and σ<−1).

### Step: Stability reads off the region
?why: BIBO ⇔ ∫|h| < ∞ ⇔ the untamed (σ = 0) integral converges ⇔ the axis is in the ROC.
For a causal system the ROC is right of the rightmost pole; the axis sits inside iff that rightmost pole has $\mathrm{Re} < 0$. "All poles in the LHP" is Module 1's $\int|h| < \infty$ wearing s-plane clothes — one criterion, two languages.

## @examples

**Worked (exam classification):** $X(s) = \frac{1}{(s+1)(s-2)}$, three possible ROCs: (a) $\mathrm{Re}(s)>2$: right-sided, growing (the $e^{2t}$ mode is live) — causal but unstable; (b) $\mathrm{Re}(s)<-1$: left-sided; (c) $-1<\mathrm{Re}(s)<2$: two-sided, and since the strip contains the axis — this is the *stable* (but noncausal) reading. One algebra, three signals; the question "which signal?" is answered ONLY by the region.

**Worked (given properties, find the region):** "X has poles at $-3, 1$; $x$ is stable." Stability ⇒ axis in ROC ⇒ the strip $-3 < \mathrm{Re}(s) < 1$. Then $x$ is necessarily two-sided (a strip between poles) — stability *bought* at the price of causality. This inference chain is a favorite short question.

**Worked (empty ROC):** $x = e^{t^2}$ out-grows every exponential weight: no σ works, ROC = ∅, no transform. Existence is a privilege, not a right.

## @misconceptions
- wrong: "The ROC is decoration; the fraction is the answer."
  tempting: "All the computation lives in the algebra."
  correction: "1/(s+1) names TWO signals until the region picks one. Inverse transforms are ill-posed without it; exams deduct for its absence because the mathematics genuinely is ambiguous."
- wrong: "The ROC can contain poles at its edge — close enough."
  tempting: "The boundary feels like part of the region."
  correction: "At a pole the integral diverges by definition; the ROC is OPEN, bounded by pole lines, never touching them. 'Re(s) ≥ −1' is always wrong; '>' is the only legal sign."
- wrong: "Causal and stable are the same thing in the s-plane."
  tempting: "Both feel like 'good behavior'."
  correction: "Causal fixes the ROC's SHAPE (right of rightmost pole); stable fixes a MEMBER (the axis). 1/(s−2) with Re(s)>2 is causal and unstable; the strip reading of the same poles is stable and noncausal. Independent properties, one picture."

## @exam

6–10 marks and philosophically the most exam-loaded idea of Minor II: (a) list all possible ROCs for a given rational X and classify each signal (sidedness/causality/stability/FT-existence); (b) infer the ROC from stated properties (stable ⇒ axis inside; causal ⇒ rightmost); (c) the two-signals-one-formula explanation in words. Ritual: draw the pole lines, mark the candidate regions, test each claim against the region — never against the algebra. Traps: closed-boundary answers (≥), forgetting the strip option for two-sided signals, "stable therefore causal".

## @summary

- ROC = the σ's that tame $x$; open vertical region, pole-free, shaped by sidedness: right ⇒ right half-plane, left ⇒ left, two-sided ⇒ strip (possibly empty).
- **Same X(s), different ROC ⇒ different signal.** The pair (algebra, region) is the transform.
- FT exists ⇔ axis ∈ ROC. Causal+stable ⇔ all poles in open LHP (axis inside a right-region).
- Unilateral LT: right-sidedness built in — the region is implied.
- Boundary strictly open: poles are never inside; '≥' is never correct.
