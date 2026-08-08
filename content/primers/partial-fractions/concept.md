---
id: primers/partial-fractions
title: "Partial fractions: the inverse-transform engine"
short: Partial fractions
module: 0
tier: supplementary
outcomes: []
prereqs: [primers/complex-numbers]
aliases: ["cover-up method", "residues", "long division", "repeated poles", "partial fraction expansion"]
exam: { minor2: high, major: high, marks: "embedded in every inversion", styles: [compute] }
crosslinks:
  - { target: m3/inverse-laplace, relation: "inverse LT in practice = this primer + a table lookup" }
  - { target: m3/inverse-z, relation: "same engine in z — with the X(z)/z trick bolted on" }
---

## @intuition

Module 3 will hand you expressions like $\frac{s+3}{(s+1)(s+2)}$ and ask for the time signal hiding inside. The table only knows simple shapes — $\frac{1}{s+a}$, $\frac{1}{(s+a)^2}$ — so the entire game is *demolition*: break the big fraction into table-sized pieces. Partial fractions is that demolition, and at 10+2 level you met only its easiest case. This primer upgrades you to the four cases exams actually use.

---
**Case 0 first — improper fractions.** If the numerator's degree ≥ denominator's, partial fractions is *illegal* until you long-divide: $\frac{s^2+3s+1}{s^2+3s+2} = 1 - \frac{1}{s^2+3s+2}$, then demolish the remainder. Skipping this step is the most common wrecked answer in inverse-Laplace questions — the check costs three seconds.

---
**Case 1 — distinct real poles**, and the **cover-up method**: for $\frac{s+3}{(s+1)(s+2)} = \frac{A}{s+1} + \frac{B}{s+2}$, find $A$ by *covering* $(s+1)$ and evaluating the rest at $s = -1$: $A = \frac{-1+3}{-1+2} = 2$. Cover the other: $B = \frac{-2+3}{-2+1} = -1$. Ten seconds per coefficient, self-checking (recombine mentally), zero simultaneous equations.

---
**Case 2 — complex pole pairs:** keep them as an unfactored quadratic $\frac{Cs+D}{s^2+2s+5}$ and complete the square (→ damped sin/cos forms), or split into complex conjugate residues (cover-up works verbatim with complex arithmetic — this is where the complex-numbers primer pays off). **Case 3 — repeated poles:** $\frac{1}{(s+1)^2(s+2)}$ needs *both* $\frac{A_1}{s+1} + \frac{A_2}{(s+1)^2}$ layers. Cover-up gives the highest layer directly; the lower layer comes from differentiation or a strategic substitution.

## @definition

For a proper rational $\frac{N(s)}{D(s)}$ (deg N < deg D):
- **Distinct real poles** $p_i$: $\sum \frac{A_i}{s-p_i}$, $A_i = \left[(s-p_i)\frac{N}{D}\right]_{s=p_i}$ (cover-up).
- **Complex pair** $s^2+bs+c$ (irreducible): one term $\frac{Cs+D}{s^2+bs+c}$; complete the square to $\frac{C(s+\alpha) + E\beta}{(s+\alpha)^2+\beta^2}$ → $e^{-\alpha t}(C\cos\beta t + E\sin\beta t)$ flavors.
- **Repeated pole** $(s-p)^m$: layers $\frac{A_1}{s-p} + \cdots + \frac{A_m}{(s-p)^m}$; $A_m$ by cover-up; $A_{m-k} = \frac{1}{k!}\frac{d^k}{ds^k}\left[(s-p)^m\frac{N}{D}\right]_{s=p}$ (or substitution of convenient s-values).
- **Improper**: long-divide first; the quotient's terms invert to impulses/derivatives.

## @derivation

### Step: Why cover-up works
?why: Multiply both sides by (s−p₁) and take the limit s → p₁; every other term carries a factor that vanishes.
$(s-p_1)\frac{N}{D} = A_1 + (s-p_1)\left[\frac{A_2}{s-p_2}+\cdots\right]$. At $s = p_1$ the bracket dies, leaving $A_1$ alone. "Cover the factor, substitute its root" is this limit, performed with a thumb.

### Step: Why repeated poles need layers
?why: A single A/(s−p) term can never reproduce the double-pole's growth rate near s = p.
Near a double pole, $\frac{N}{D} \sim \frac{c}{(s-p)^2}$: any expansion missing the $(s-p)^{-2}$ layer diverges at the wrong rate — the algebra literally cannot balance. Time-domain echo: $\frac{1}{(s+a)^2} \leftrightarrow t\,e^{-at}u(t)$ — the extra layer buys the factor of $t$.

### Step: The differentiation formula for lower layers, once
?why: After multiplying by (s−p)^m, the layers become a Taylor series around p; Taylor coefficients are derivatives.
$(s-p)^m\frac{N}{D} = A_m + A_{m-1}(s-p) + \cdots$: match Taylor coefficients at $p$. In practice for $m = 2$: get $A_2$ by cover-up, then pick one easy value of $s$ (like 0), plug into the full identity, solve for $A_1$ — faster than differentiating under pressure.

## @examples

**Worked (the exam standard):** $\frac{5s+7}{(s+1)(s+2)(s+3)}$. Cover-up: at $-1$: $\frac{2}{(1)(2)} = 1$; at $-2$: $\frac{-3}{(-1)(1)} = 3$; at $-3$: $\frac{-8}{(-2)(-1)} = -4$. So $\frac{1}{s+1} + \frac{3}{s+2} - \frac{4}{s+3}$. Verify with one spot value ($s=0$: LHS $= \tfrac{7}{6}$; RHS $= 1 + \tfrac32 - \tfrac43 = \tfrac76$ ✓) — the 10-second insurance markers love.

**Worked (repeated):** $\frac{s}{(s+1)^2}$: layers $\frac{A_1}{s+1} + \frac{A_2}{(s+1)^2}$. Cover-up (m=2): $A_2 = [s]_{s=-1} = -1$. Substitute $s=0$: $0 = A_1 - 1 \Rightarrow A_1 = 1$. Result $\frac{1}{s+1} - \frac{1}{(s+1)^2}$ → $e^{-t} - t e^{-t}$ later.

**Worked (complex pair, real route):** $\frac{s+1}{s^2+2s+5} = \frac{(s+1)}{(s+1)^2+4}$ — already完成 the square: it's the damped-cosine template with $\alpha = 1, \beta = 2$ → $e^{-t}\cos 2t$ shape. Recognizing templates beats grinding.

## @misconceptions
- wrong: "Partial fractions applies to any rational function directly."
  tempting: "The recipe never mentioned degrees."
  correction: "Only PROPER fractions (deg N < deg D). Improper ⇒ long-divide first; the quotient becomes δ terms after inversion. Skipping the degree check is the #1 wrecked-inversion cause."
- wrong: "A double pole needs just A/(s−p)² — one term."
  tempting: "One pole location, one term."
  correction: "BOTH layers, always: A₁/(s−p) + A₂/(s−p)². Omitting the first layer fails on any numerator that doesn't vanish suitably — and exams choose numerators so it fails."
- wrong: "Cover-up finds every coefficient in every problem."
  tempting: "It worked three times in a row."
  correction: "Cover-up directly gives residues at SIMPLE poles and the TOP layer of repeated ones. Lower layers need differentiation or substitution. Know which tool opens which lock."

## @exam

Embedded in every inverse Laplace/Z question on Minor II and the Major (the expansion is usually 60% of the marks; the table lookup the rest). Ritual: (1) degree check — divide if improper, SAY SO; (2) factor the denominator; (3) name the case per factor; (4) cover-up what cover-up can reach, substitution for the rest; (5) spot-check with one s value. Traps: missing repeated-pole layers, sign slips at negative substitutions, and complex pairs ground through real simultaneous equations when completing the square was two lines.

## @summary

- Proper check FIRST: improper ⇒ long division, quotient → δ-terms later.
- Distinct poles: cover-up $A_i = [(s-p_i)N/D]_{s=p_i}$; spot-check with one s value.
- Repeated $(s-p)^m$: all $m$ layers; top layer by cover-up, lower by substitution/differentiation; buys the $t^k e^{pt}$ factors.
- Complex pair: complete the square → $e^{-\alpha t}\cos/\sin(\beta t)$ templates (or complex residues if you like j).
- The expansion is the marks; the table lookup is the victory lap.
