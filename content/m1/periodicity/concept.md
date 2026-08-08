---
id: m1/periodicity
title: "Periodicity: when do repetitions actually repeat?"
short: Periodicity
module: 1
tier: core
outcomes: [CO1]
prereqs: [m1/what-is-a-signal]
aliases: ["periodic", "fundamental period", "aperiodic", "rational ratio", "fundamental frequency"]
exam: { minor1: high, major: medium, marks: "4–8", styles: [compute, conceptual] }
crosslinks:
  - { target: m2/fourier-series, relation: "the Fourier series exists exactly for periodic signals — the fundamental period sets ω₀" }
  - { target: m4/dtft, relation: "DT frequency lives on a circle, which is why DT periodicity has a different rule" }
---

## @intuition

Two gears mesh: one turns every 2 seconds, the other every 3. The *pair* returns to its exact starting pose every 6 seconds — the least common multiple. Now regear them at 2 seconds and π seconds: the pair **never** returns to its starting pose, ever. Whether combined rhythms truly repeat is a question about number theory, not about how wiggly the plot looks.

---
@viz detector {"f1":1,"f2":1.5}
The detector overlays $x(t)$ against its shifted self and hunts for a shift with zero mismatch. With $f_2/f_1 = 1.5 = 3/2$ (rational), the mismatch hits exactly zero at $T_0$ — periodic. Drag $f_2$ toward an irrational ratio: the error dips tantalizingly low, again and again, but never touches zero. *Almost periodic* is not periodic.

---
The rule: a sum of periodic signals is periodic **iff every frequency ratio is rational**, and then $T_0$ is the least common multiple of the individual periods. Nearby frequencies can produce enormous fundamental periods ($f_2/f_1 = 1.01 \Rightarrow$ 100 cycles before a true repeat) — "looks like it repeats every second" and "is periodic with $T_0 = 1$ s" are different claims.

---
@viz detector {"mode":"dt"}
Discrete time rewrites the rule entirely. $\cos(\Omega_0 n)$ repeats only if some integer number of samples advances the phase by an exact multiple of $2\pi$: $\Omega_0 N = 2\pi k$, i.e. **$\Omega_0/2\pi$ must be rational**. So $\cos(0.5n)$ — no $\pi$ anywhere — is *never* periodic: $0.5/2\pi$ is irrational. The stems dance around the envelope forever without ever reprising themselves. Most students vote "periodic" the first time; the number theory says no.

## @definition

- CT: $x(t)$ is **periodic** with period $T$ if $x(t+T) = x(t)$ for all $t$; the smallest such $T > 0$ is the **fundamental period** $T_0$, with fundamental frequency $\omega_0 = 2\pi/T_0$.
- $A\cos(\omega_0 t + \phi)$: $T_0 = 2\pi/\omega_0$. Sum of periodic signals with periods $T_1, T_2$: periodic iff $T_1/T_2 \in \mathbb{Q}$, then $T_0 = \operatorname{lcm}(T_1, T_2)$.
- DT: $x[n]$ periodic with period $N \in \mathbb{Z}^+$ if $x[n+N] = x[n]$. $\cos(\Omega_0 n + \phi)$ is periodic iff $\Omega_0/2\pi = k/N$ (rational, reduced); the fundamental period is that $N$.
- A constant is periodic with *any* period (no fundamental period). $x(t) = $ constant edge cases are stated explicitly on exams — mention them.

**Reading the symbols:** $\Omega$ (capital omega, rad/sample) flags DT frequency; $\omega$ (rad/s) flags CT — this course never swaps them.

## @derivation

### Step: The rational-ratio criterion, from first principles
?why: A common period must be an integer multiple of both individual periods simultaneously.
Suppose $x = x_1 + x_2$ has period $T$: then $T = mT_1 = nT_2$ for integers $m,n$ ⇒ $T_1/T_2 = n/m$, rational. Conversely if $T_1/T_2 = n/m$ (reduced), $T_0 = mT_1 = nT_2$ works and is smallest.

### Step: The DT criterion — and why it differs
?why: DT shifts are only allowed by whole samples; phase can only be checked at integers.
Need integer $N$ with $\cos(\Omega_0(n+N)) = \cos(\Omega_0 n)$ for all $n$ ⇒ $\Omega_0 N = 2\pi k$ ⇒ $\Omega_0/2\pi = k/N$. CT could pick ANY real $T$; DT is stuck with integers — that restriction is the entire difference.

### Step: Compute a DT fundamental period (exam mechanics)
?why: Reduce the fraction FIRST — the reduced denominator is N.
$\cos(3\pi n/8)$: $\Omega_0/2\pi = 3/16$, already reduced ⇒ $N = 16$. Not $8$: the numerator 3 means the phasor wraps 3 full turns before landing exactly, and $N$ counts samples, not turns.

## @examples

**Worked (CT, the lcm ritual):** $x(t) = \cos(4\pi t) + \sin(6\pi t)$. Periods: $T_1 = 1/2$, $T_2 = 1/3$. Ratio $3/2$ rational ⇒ periodic. $T_0 = \operatorname{lcm}(1/2, 1/3) = 1$ (smallest number both divide into). Check: 2 cycles of the first, 3 of the second. For rationals, $\operatorname{lcm}(p/q, r/s) = \operatorname{lcm}(p,r)/\gcd(q,s)$.

**Worked (the classic "not periodic"):** $x(t) = \cos(2t) + \cos(2\pi t)$. Ratio $= \pi$ — irrational ⇒ aperiodic, full stop. No "approximately periodic" partial credit exists.

**Worked (DT):** $x[n] = \cos(0.6\pi n) + \cos(0.5\pi n)$. First: $0.3 = 3/10 \Rightarrow N_1 = 10$ (after reducing $0.6\pi/2\pi = 3/10$). Second: $N_2 = 4$ ($0.25 = 1/4$). Overall $N = \operatorname{lcm}(10, 4) = 20$.

## @misconceptions
- wrong: "cos(0.5n) is periodic — cosines always repeat."
  tempting: "The CT cousin cos(0.5t) is periodic, and the stems trace a repeating-looking wave."
  correction: "DT needs Ω₀/2π rational. 0.5/2π = 1/4π is irrational ⇒ never repeats exactly. The stems sample a periodic envelope at phases that never realign. THE standard DT trap — decide by arithmetic, not by eye."
- wrong: "T₀ of a sum is the period of the slower component."
  tempting: "The slow wave dominates the picture."
  correction: "T₀ = lcm of both periods — often LONGER than either (1/2 and 1/3 give 1). Both components must complete whole cycles."
- wrong: "Nearly rational ratios are 'practically periodic', so call them periodic."
  tempting: "The waveform visually repeats for many cycles."
  correction: "Periodicity is exact by definition. f₂/f₁ = 1.01 IS periodic (rational) but with T₀ = 100 periods; ratio √2 is NOT periodic at all — and exams award the distinction, not the vibe."

## @exam

Minor I regular: (a) determine periodicity and $T_0$/$N$ for sums of sinusoids — CT lcm mechanics; (b) the DT rationality check with a $\pi$-free frequency (the intended trap); (c) conceptual one-liner on why DT differs. Ritual: write each component's period → ratio → rational? → lcm; DT: reduce $\Omega_0/2\pi$ fully, denominator = $N$, and SAY "irrational ⇒ aperiodic" when it is. Marks are lost to unreduced fractions and to trusting the sketch.

## @summary

- CT sum periodic ⇔ frequency ratios rational; $T_0 = \operatorname{lcm}$ of periods; $\omega_0 = 2\pi/T_0$.
- DT: $\cos(\Omega_0 n)$ periodic ⇔ $\Omega_0/2\pi = k/N$ rational (reduced) ⇒ fundamental period $N$.
- $\cos(0.5n)$: aperiodic. $\cos(3\pi n/8)$: $N = 16$. Decide by arithmetic, never by eye.
- lcm of fractions: $\operatorname{lcm}(p/q, r/s) = \operatorname{lcm}(p,r)/\gcd(q,s)$.
- Constants: periodic with every period, no fundamental.
