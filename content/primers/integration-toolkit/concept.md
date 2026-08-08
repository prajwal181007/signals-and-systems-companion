---
id: primers/integration-toolkit
title: "The transform calculus toolkit: four integral patterns you will reuse forever"
short: Integration toolkit
module: 0
tier: supplementary
outcomes: []
prereqs: [primers/complex-numbers]
aliases: ["integration by parts", "improper integrals", "piecewise integration", "exponential integrals"]
exam: { minor1: high, minor2: high, major: high, marks: "embedded everywhere", styles: [compute] }
crosslinks:
  - { target: m2/fourier-series, relation: "FS coefficients are exactly these integrals with cos/sin factors" }
  - { target: m3/laplace-transform, relation: "computing transforms from the definition is pattern 1 and 2 on repeat" }
---

## @intuition

Every transform in this course — Fourier coefficients, Fourier transforms, Laplace transforms — is *computed* with the same four integral patterns. Students rarely lose marks because they misunderstand transforms; they lose them because $\int t e^{-st} dt$ wobbles under exam pressure. This toolkit drills the four patterns once, names them, and then every later chapter just says "pattern 2."

---
**Pattern 1 — exponential with limits:** $\int_0^\infty e^{-at}dt = \tfrac{1}{a}$ (for $a > 0$). The workhorse. With complex $a = \sigma + j\omega$ it works identically *provided* $\sigma > 0$ — and that little condition is where ROCs will come from in Module 3. Evaluate at the limits honestly: the upper limit dies only when the real part of the exponent is negative.

---
**Pattern 2 — polynomial × exponential (by parts):** $\int t e^{-st}dt$: differentiate the polynomial, integrate the exponential; each pass knocks the power down by one. **Pattern 3 — exponential × sinusoid:** $\int e^{-at}\cos(bt)\,dt$ — either loop by-parts twice and solve for the integral, or (slicker) write $\cos(bt) = \mathrm{Re}\{e^{jbt}\}$ and fall back to pattern 1 with complex $a - jb$. Both routes are shown below; the complex route is why the primer on complex numbers came first.

---
**Pattern 4 — piecewise:** when the signal is defined in pieces (every pulse, every ramp-then-flat), split the integral at the breakpoints, solve each piece with patterns 1–3, and *keep the limits as functions of $t$ when the breakpoints move* — the exact skill convolution regimes demand.

## @definition

The four patterns, exam-ready:
1. $\displaystyle\int_0^\infty e^{-at}dt = \frac1a$ ($\mathrm{Re}(a)>0$); $\displaystyle\int_0^T e^{-at}dt = \frac{1-e^{-aT}}{a}$ (any $a \ne 0$).
2. $\displaystyle\int_0^\infty t\,e^{-at}dt = \frac{1}{a^2}$; general: $\displaystyle\int_0^\infty t^n e^{-at}dt = \frac{n!}{a^{n+1}}$.
3. $\displaystyle\int_0^\infty e^{-at}\cos(bt)dt = \frac{a}{a^2+b^2}$, $\displaystyle\int_0^\infty e^{-at}\sin(bt)dt = \frac{b}{a^2+b^2}$.
4. Piecewise: split at breakpoints; limits may depend on $t$; check continuity at the seams.

**Convergence discipline:** an improper integral means $\lim_{T\to\infty}\int_0^T$ — write the limit when the exam asks "from the definition", and state the condition that makes the boundary term vanish.

## @derivation

### Step: Pattern 2 by parts, cleanly
?why: u = polynomial (dies under differentiation), dv = exponential (harmless under integration).
$\int_0^\infty t e^{-at}dt = \left[-\tfrac{t}{a}e^{-at}\right]_0^\infty + \tfrac1a\int_0^\infty e^{-at}dt = 0 + \tfrac1a\cdot\tfrac1a = \tfrac{1}{a^2}$. The boundary term dies because $e^{-at}$ beats any polynomial — say this on paper, it is a mark.

### Step: Pattern 3 the slick way (complex route)
?why: cos is the real part of a complex exponential; then it's pattern 1.
$\int_0^\infty e^{-at}\cos(bt)dt = \mathrm{Re}\int_0^\infty e^{-(a - jb)t}dt = \mathrm{Re}\frac{1}{a - jb} = \mathrm{Re}\frac{a + jb}{a^2+b^2} = \frac{a}{a^2+b^2}$. The imaginary part gives the sine result free of charge. One computation, two table entries.

### Step: Pattern 3 the loop way (twice by parts) — know it too
?why: Some markers want the real-variable route; and the loop teaches the "solve for I" move.
$I = \int e^{-at}\cos(bt)dt$: by parts twice returns $I = \tfrac{b^2}{a^2}\left(\text{stuff}\right) - \tfrac{b^2}{a^2}I$-shaped algebra; collect $I$ on one side and solve. The trick is recognizing the ORIGINAL integral reappearing — circle it, move it left.

### Step: Piecewise with moving limits (the convolution rehearsal)
?why: When one limit is t, the antiderivative is evaluated AT t — the answer is a function, not a number.
$\int_0^{t} e^{-(t-\tau)}d\tau$ (a convolution-flavored integrand): pull out $e^{-t}$: $e^{-t}\int_0^t e^{\tau}d\tau = e^{-t}(e^t - 1) = 1 - e^{-t}$. Keeping $t$ frozen while $\tau$ integrates is the σ/τ discipline the convolution machine colors amber and blue.

## @examples

**Worked (FS rehearsal):** $\int_0^{1} t\cos(2\pi t)\,dt$ — by parts, $u = t$: $\left[\tfrac{t\sin 2\pi t}{2\pi}\right]_0^1 + \tfrac{1}{2\pi}\left[\tfrac{\cos 2\pi t}{2\pi}\right]_0^1$... evaluate carefully: $= 0 + \tfrac{1}{4\pi^2}(\cos 2\pi - \cos 0) = 0$. Vanishing answers are common and *correct* — symmetry often guarantees them; don't panic-redo.

**Worked (LT rehearsal, from the definition):** $\mathcal{L}\{t e^{-2t}u(t)\} = \int_0^\infty t e^{-2t}e^{-st}dt = \int_0^\infty t e^{-(s+2)t}dt = \tfrac{1}{(s+2)^2}$ by pattern 2 with $a = s+2$, valid for $\mathrm{Re}(s) > -2$ — the condition IS the ROC.

**Worked (piecewise):** $\int_{-\infty}^{\infty} x(t)dt$ for the trapezoid $x$ = ramp up on $[0,1]$, flat 1 on $[1,2]$, down on $[2,3]$: $\int_0^1 t + \int_1^2 1 + \int_2^3 (3-t) = \tfrac12 + 1 + \tfrac12 = 2$. Split, conquer, add — and sanity-check against the geometric area.

## @misconceptions
- wrong: "∫₀^∞ e^{−at}dt = 1/a always."
  tempting: "The formula is memorized without its condition."
  correction: "Only for Re(a) > 0 — otherwise the upper limit explodes and the integral DIVERGES. That condition is not pedantry: it becomes the ROC, the central object of Module 3."
- wrong: "By parts on t·e^{−st}: integrate the t, differentiate the exponential."
  tempting: "Either assignment feels symmetric."
  correction: "Backwards: the polynomial must be DIFFERENTIATED (so it eventually dies), the exponential integrated (it never gets worse). Wrong assignment makes the integral harder each pass."
- wrong: "When the answer comes out 0, something went wrong."
  tempting: "All that work for nothing?"
  correction: "Zero is often forced by symmetry (odd × even over symmetric limits) and is a CORRECT, expected answer — Fourier coefficients die in droves this way. Check parity before redoing anything."

## @exam

Not examined alone — embedded in EVERY transform computation across all three exams. The papers say "from the definition": that means write the improper-limit form, name the convergence condition, execute the pattern, and state where it is valid. Rehearse until each pattern is ≤ 4 lines. Marks bleed at: dropped $\tfrac1a$ factors, boundary terms asserted dead without the "exponential beats polynomial" line, and sign slips in the by-parts loop.

## @summary

1. $\int_0^\infty e^{-at} = \tfrac1a$ (Re a > 0 — the future ROC);  finite: $\tfrac{1-e^{-aT}}{a}$.
2. $\int_0^\infty t^n e^{-at} = \tfrac{n!}{a^{n+1}}$ (by parts, polynomial differentiates).
3. $\int_0^\infty e^{-at}\cos bt = \tfrac{a}{a^2+b^2}$, sine ⇒ $\tfrac{b}{a^2+b^2}$ (complex route: Re/Im of $\tfrac{1}{a-jb}$).
4. Piecewise: split at breakpoints; moving limits stay as functions of t; check seams.
- Zero answers are often symmetry, not error. State convergence conditions — they become ROCs.
