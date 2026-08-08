---
id: m3/inverse-z
title: "Inverse z-transform: three routes back to the sequence"
short: Inverse Z
module: 3
tier: core
outcomes: [CO3]
prereqs: [m3/z-roc, primers/partial-fractions]
aliases: ["inverse z", "power series method", "long division z", "partial fractions in z"]
exam: { minor2: high, major: high, marks: "6–10", styles: [compute] }
crosslinks:
  - { target: m3/difference-equations, relation: "inverting Y(z) finishes every difference-equation solution" }
  - { target: m3/inverse-laplace, relation: "the same partial-fractions engine, with the X(z)/z trick bolted on" }
---

## @intuition

Inverting $X(z)$ has three working routes, and choosing the right one is half the skill. **Partial fractions** when you want a closed form ($a^n$ modes); **long division** when you want the first few samples fast; and reading **standard pairs with the ROC** to pick right- or left-sided branches. One wrinkle separates z from s: the table's natural pair is $\frac{z}{z-a}$ — with a $z$ *upstairs*. Expanding $X(z)$ directly gives $\frac{1}{z-a}$-shaped pieces that match nothing. The fix is a two-second trick that every exam question silently expects: **expand $X(z)/z$, then multiply back**.

---
Watch it work on $X(z) = \frac{z}{(z-1)(z-\tfrac12)}$ (causal). Naive expansion of $X$ gives terms like $\frac{A}{z-1}$ — table-orphans. Instead: $\frac{X(z)}{z} = \frac{1}{(z-1)(z-\tfrac12)} = \frac{2}{z-1} - \frac{2}{z-\tfrac12}$ (cover-up). Multiply back: $X = \frac{2z}{z-1} - \frac{2z}{z-\tfrac12}$ — now every piece is a table pair: $x[n] = 2\,u[n] - 2(\tfrac12)^n u[n]$. Done, and the ROC ($|z|>1$) told us to take the right-sided branch of both.

---
**Long division** is the pragmatist's route: divide numerator by denominator in powers of $z^{-1}$ (for a causal/right-sided ROC) and the quotient's coefficients *are* the samples: $X = x[0] + x[1]z^{-1} + x[2]z^{-2}+\cdots$. Three terms of division = first three samples — often all a question wants, and always a sanity check on your closed form. For a left-sided ROC, divide in powers of $z$ instead: the ROC picks the division direction.

## @definition

Routes, with their use-cases:
1. **Partial fractions via $X(z)/z$** → closed forms. Expand $X(z)/z$, multiply back, then table: $\frac{z}{z-a} \leftrightarrow a^n u[n]$ (ROC $|z|>|a|$) or $-a^n u[-n-1]$ (ROC $|z|<|a|$); repeated: $\frac{az}{(z-a)^2} \leftrightarrow n\,a^n u[n]$.
2. **Power series / long division** → sample values; direction chosen by the ROC (in $z^{-1}$ for right-sided, in $z$ for left-sided).
3. **Inspection with the shift rule**: $z^{-k}X \leftrightarrow x[n-k]$ — delayed copies read off directly.

Standard pairs: $\delta[n] \leftrightarrow 1$; $u[n] \leftrightarrow \frac{z}{z-1}$; $a^nu[n] \leftrightarrow \frac{z}{z-a}$; $na^nu[n] \leftrightarrow \frac{az}{(z-a)^2}$; $a^n\cos(\Omega_0 n)u[n]$, $a^n\sin(\Omega_0 n)u[n]$ ↔ the damped-oscillation quadratics.

## @derivation

### Step: Why divide by z first
?why: The table pair z/(z−a) carries a z upstairs; expanding X/z aligns the algebra with the table.
$X = \frac{z\,N(z)}{D(z)}$ typically. $\frac{X}{z} = \frac{N}{D}$ is proper and expands into $\frac{A_i}{z - p_i}$ pieces; multiplying by $z$ restores each to $\frac{A_i z}{z-p_i}$ — exactly the table's shape. Skipping the trick strands you with $\frac{1}{z-a}$, which is $a^{n-1}u[n-1]$ (a shifted pair) — workable but error-prone; the trick avoids the shift entirely.

### Step: Long division IS the definition
?why: The z-transform is literally the generating series Σx[n]z^{−n}; division recovers its coefficients.
$X = \frac{z}{z - \tfrac12}$: divide: $1 + \tfrac12 z^{-1} + \tfrac14 z^{-2} + \cdots$ — coefficients $1, \tfrac12, \tfrac14$: the samples of $(\tfrac12)^n u[n]$, confirmed. Any closed-form answer should survive this three-term audit.

### Step: Repeated poles buy factors of n
?why: Differentiating the geometric series pulls down an n — the DT twin of t·e^{pt}.
$\frac{az}{(z-a)^2} \leftrightarrow n a^n u[n]$: the double pole's extra layer multiplies by $n$, exactly as $\frac{1}{(s+a)^2}$ bought $t$. Cascaded identical DT filters ring with $n a^n$ envelopes for the same reason.

## @examples

**Worked (the full exam ritual):** $X(z) = \frac{z}{(z-1)(z-0.5)}$, ROC $|z| > 1$. (1) $X/z = \frac{1}{(z-1)(z-0.5)}$; (2) cover-up: $\frac{2}{z-1} + \frac{-2}{z-0.5}$; (3) restore: $\frac{2z}{z-1} - \frac{2z}{z-0.5}$; (4) ROC says right-sided: $x[n] = 2u[n] - 2(0.5)^nu[n]$; (5) audit: $x[0] = 0$ ✓ (division confirms), $x[\infty] \to 2$ ✓. Five steps, each earning marks.

**Worked (ROC changes everything):** same $X$, ROC $0.5 < |z| < 1$: the pole at 1 must now take its LEFT branch: $x[n] = -2u[-n-1] - 2(0.5)^n u[n]$ — a two-sided sequence. Same algebra as before; different ring, different world.

**Worked (division for first samples):** $X = \frac{z^2}{z^2 - z + 0.25}$, causal: divide → $1 + z^{-1} + 0.75z^{-2} + \cdots$ ⇒ $x[0]=1, x[1]=1, x[2]=0.75$. When the question says "find x[0..2]", this route wins in one minute.

## @misconceptions
- wrong: "Expand X(z) directly, like in Laplace."
  tempting: "That's how partial fractions always worked."
  correction: "The z-table's pairs carry z in the numerator. Expand X(z)/z, then multiply back — otherwise your pieces are shifted pairs (a^{n−1}u[n−1]) and off-by-one errors bloom. The /z trick is the z-specific step exams check for."
- wrong: "The inverse is unique from the algebra."
  tempting: "One formula, one answer."
  correction: "Each pole independently takes its right- or left-branch by where the ROC sits relative to it. One X with two poles has THREE readings. No ring, no answer."
- wrong: "Long division always proceeds in powers of z⁻¹."
  tempting: "That's the direction every textbook example shows."
  correction: "That direction assumes right-sidedness. A left-sided ROC demands division in powers of z (ascending). The ROC chooses the direction — division is not ROC-blind."

## @exam

6–10 marks on Minor II/Major: invert a rational X(z) with a stated ROC (or with "causal" implying it). Ritual: (1) check properness, (2) form $X/z$, (3) expand (cover-up), (4) multiply back, (5) choose branches by the ROC per pole, (6) audit with two terms of long division. Repeated poles ($na^n$) and the damped-cosine quadratics appear in harder variants. Traps: skipping the /z trick (off-by-one shifts), branch-blind inversion, division in the wrong direction.

## @summary

- **The /z trick:** expand $X(z)/z$, multiply back — aligns everything with $\frac{z}{z-a} \leftrightarrow a^nu[n]$.
- Branch per pole by ROC: outside ⇒ $a^nu[n]$; inside ⇒ $-a^nu[-n-1]$. Repeated: $\frac{az}{(z-a)^2} \leftrightarrow na^nu[n]$.
- Long division = the definition unrolled: quotient coefficients are samples; direction set by the ROC.
- Audit closed forms with 2–3 division terms; x[0] via the initial-value analogue $x[0] = \lim_{z\to\infty}X(z)$ (causal).
- Three routes, one choice-skill: closed form ⇒ fractions; first samples ⇒ division; delayed copies ⇒ shift rule.
