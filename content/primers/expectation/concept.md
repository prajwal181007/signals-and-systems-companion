---
id: primers/expectation
title: "Expectation: the two numbers that tame noise — the average and the wiggle"
short: Expectation
module: 0
tier: supplementary
hero: false
outcomes: [CO2]
prereqs: [primers/integration-toolkit]
aliases: ["mean", "expected value", "variance", "standard deviation", "ensemble average", "time average", "E[X]", "sigma", "law of large numbers", "uncorrelated", "independent"]
exam: { minor1: medium, major: medium, marks: "2–4 direct, more embedded in white-noise questions", styles: [compute, conceptual] }
crosslinks:
  - { target: m2/white-noise-psd, relation: "PSD, R(τ), and output noise power are all expectations — this primer is the vocabulary that module speaks" }
  - { target: m1/energy-and-power, relation: "the time-average power of a deterministic signal is the same limiting integral, with no randomness in it" }
---

## @intuition

Your sensor should read a steady 5 volts. The oscilloscope shows a trace that is *furry* — every glance a different value: 5.31, 4.86, 5.07. Which reading is the truth? None of them — and asking is the wrong move. Engineering under noise means trading "the value" for two honest numbers: what the readings **average to** in the long run, and how hard they **wiggle** around that average. Nearly everything Module 2 says about noise — flat spectra, filtered-noise power, why averaging cleans a measurement — is built from just those two numbers.

---
Take a million readings and average them. Upward flickers cancel downward flickers, and the average settles onto one repeatable number: the **expectation**. That is the entire definition — expectation *is* the long-run average; no deeper machinery is needed in this course. One warning, courtesy of a fair die: its long-run average is 3.5, a value no face shows. Expectation is the *balance point* of the outcomes — not the most likely one, and not necessarily a possible one.

---
How hard does it wiggle? Averaging the misses fails — the up-misses cancel the down-misses exactly, by the definition of the average. So square each miss first: now every miss counts, and big misses count extra. The long-run average of squared misses is the **variance**; its square root **σ** brings you back to volts. A bonus that signals people cash in constantly: for zero-mean noise, the variance is precisely the average **power**. From Module 2 onward, "noise power" and "variance" are the same number wearing two names.

---
There are two different ways to average a noisy waveform, and they deserve different names. **Ensemble average**: freeze time at one instant, imagine a thousand parallel copies of the experiment, and average *across the copies*. **Time average**: take the single recording you actually have and average *along its length*. Module 2's analytic results speak the ensemble language; your oscilloscope can only speak the time language. For the well-behaved noise in this course the two agree — the quiet assumption that lets one measured trace stand in for a thousand experiments you never ran.

---
Why does averaging clean a signal? Average N independent readings: the signal part reinforces — it is the same every time — while the noise contributions arrive with random signs and mostly cancel. *Mostly*: variances add (N of them), amplitudes do not, so the wiggle of the average shrinks only by √N. Ten times less noise costs one hundred times more data — the most consequential square root in measurement. Watch it return as Welch averaging in the white-noise module: many short, jagged spectra, averaged into one smooth estimate.

## @definition

For a random quantity $X$ taking values $x_1, \dots, x_m$ with probabilities $p_1, \dots, p_m$ (the $p_i$ sum to 1):

$$E[X] = \sum_{i} x_i\, p_i \qquad \text{(the mean, written } \mu\text{)}$$

For a continuously-valued $X$, replace the bar chart by a **density** $f(x)$ — the histogram of outcomes refined until smooth, with $f(x)\,dx$ = probability of landing within $dx$ of $x$:

$$E[X] = \int_{-\infty}^{\infty} x\, f(x)\, dx$$

**Variance and standard deviation:**

$$\sigma^2 = \mathrm{Var}(X) = E\big[(X-\mu)^2\big] = E[X^2] - \mu^2, \qquad \sigma = \sqrt{\mathrm{Var}(X)}$$

**Linearity (unconditional):** $E[aX + bY] = a\,E[X] + b\,E[Y]$ — true for *any* $X, Y$, dependent or not.

**Uncorrelated vs independent:** $X$ and $Y$ are **uncorrelated** when $E[XY] = E[X]E[Y]$. They are **independent** when knowing $X$ tells you nothing about $Y$. Independent ⇒ uncorrelated; the converse is false (take $X$ uniform on $\{-1, 0, 1\}$ and $Y = X^2$: uncorrelated, yet $Y$ is completely determined by $X$).

**Two averages of a waveform:** the **time average** of one recording, $\langle x \rangle = \lim_{T\to\infty} \frac{1}{2T}\int_{-T}^{T} x(t)\,dt$, versus the **ensemble average** $E[x(t)]$ taken across imagined repetitions at each frozen $t$.

**Reading the symbols:** $E[\cdot]$ eats a random quantity and returns a plain number — and it is a *linear operator*, like $\int$: it passes through sums and constants. $\mu$ lives in the units of $X$; $\sigma$ does too (volts), while $\sigma^2$ lives in units squared (volts² — power-flavored). In $E[x(t)]$, the time $t$ is frozen; the averaging runs over the ensemble, not over $t$.

**Exam conventions:** tabulate discrete computations in columns $x$, $p$, $xp$, $x^2 p$; sum the last two columns to get $\mu$ and $E[X^2]$, then use the shortcut. Noise is zero-mean unless stated, so its power is $\sigma^2$ — the value $R(0)$ in Module 2's notation.

## @derivation

The whole toolkit is four small consequences of "expectation = long-run average", ending in the $1/\sqrt{N}$ law.

### Step: The long-run average collapses to the probability-weighted sum
?why: In N trials, outcome xᵢ turns up about N·pᵢ times — group the repeated terms.
$$\frac{1}{N}\sum_{\text{trials}} X \;\approx\; \frac{1}{N}\sum_i (N p_i)\, x_i \;=\; \sum_i x_i\, p_i$$
This is the bridge between the physical picture (average of many runs) and the formula you compute with — and it is the *only* piece of probability theory this course requires.

### Step: Expectation is linear — always, with no independence anywhere
?why: A weighted sum distributes over + and lets constants walk out front.
$$E[aX + bY] = a\,E[X] + b\,E[Y]$$
Averaging each trial's value of $aX + bY$ is the same as $a$ times the average of $X$ plus $b$ times the average of $Y$ — term by term. Students find this suspicious ("surely they must be independent?"); exams exploit exactly that suspicion. Dependence changes many things, but never this.

### Step: The variance shortcut
?why: Expand the square, apply linearity; μ is a constant, so E[μ²] = μ² and E[μX] = μ².
$$\mathrm{Var}(X) = E[X^2 - 2\mu X + \mu^2] = E[X^2] - 2\mu\cdot\mu + \mu^2 = E[X^2] - \mu^2$$
Compute two averages, subtract. This is the version to use at speed — but see the exam traps for the sign of what gets squared.

### Step: Variances of uncorrelated quantities add
?why: Expand the square of a sum — the cross terms are exactly what "uncorrelated" kills.
For zero-mean $X_1, X_2$ (shift the means out first; linearity lets you):
$$E[(X_1 + X_2)^2] = E[X_1^2] + 2\,E[X_1 X_2] + E[X_2^2] = \sigma_1^2 + \sigma_2^2$$
since uncorrelated means $E[X_1 X_2] = E[X_1]E[X_2] = 0$. Powers add; amplitudes do not: $\sigma = \sqrt{\sigma_1^2 + \sigma_2^2}$, like perpendicular legs of a triangle — never $\sigma_1 + \sigma_2$.

### Step: The 1/√N law
?why: Apply the last two steps to the average of N readings.
Let $\bar{X} = \frac{1}{N}\sum_{i=1}^{N} X_i$ with each reading having mean $\mu$ and variance $\sigma^2$, mutually uncorrelated. Linearity gives $E[\bar{X}] = \mu$ (averaging is honest), and
$$\mathrm{Var}(\bar{X}) = \frac{1}{N^2}\left(N\sigma^2\right) = \frac{\sigma^2}{N} \qquad\Longrightarrow\qquad \sigma_{\bar{X}} = \frac{\sigma}{\sqrt{N}}$$
The variance divides by $N$; the *visible* wiggle only by $\sqrt{N}$.

### Step: Notice what was NOT assumed
?why: The law's power is how little it needs — and its failure mode is exactly where the assumption breaks.
No bell curve, no particular distribution — and independence was never used, only *uncorrelatedness*, which is strictly weaker. Where it fails: **correlated** samples, whose cross terms no longer vanish, so the cancellation stalls and averaging helps less than $\sqrt{N}$. That is precisely why Welch's method (the *measured*, estimated view of a spectrum) chops one long record into segments that are nearly uncorrelated before averaging them — the trick only pays when the cross terms die.

## @examples

**Worked (exam table ritual): mean, variance, and σ of a fair die.** Columns $x$, $p$, $xp$, $x^2p$; sum the last two.

| $x$ | $p$ | $xp$ | $x^2 p$ |
|---|---|---|---|
| 1…6 | $\tfrac16$ each | sums to $\tfrac{21}{6}$ | sums to $\tfrac{91}{6}$ |

$$\mu = \frac{21}{6} = 3.5 \qquad E[X^2] = \frac{91}{6} \qquad \mathrm{Var} = \frac{91}{6} - (3.5)^2 = \frac{182 - 147}{12} = \frac{35}{12} \approx 2.92 \qquad \sigma \approx 1.71$$

Note what the numbers say: the "expected" value 3.5 is a face no die has, and typical rolls miss it by about 1.7. Write the table, sum the columns, apply the shortcut — that ordering is the mark scheme.

**Worked (engineering skin): how many samples must the ADC average?** A strain-gauge bridge outputs 5 V plus zero-mean noise with $\sigma = 20$ mV, and the spec demands an uncertainty of 1 mV. The averaged reading has $\sigma_{\bar{X}} = \sigma/\sqrt{N}$, so

$$\sqrt{N} = \frac{20}{1} \Rightarrow N = 400 \text{ samples}$$

The trap the law punishes: 400 samples buys a factor of 20, not 400. And note the fine print from the derivation — the 400 samples must be (nearly) uncorrelated; sampling faster than the noise actually changes buys correlated repeats and cleans nothing.

**Worked (time vs ensemble showdown): when can one trace speak for the ensemble?**
- $x(t) = \cos(t + \theta)$, phase $\theta$ random, uniform over a cycle. Ensemble average at any frozen $t$: the thousand copies have phases scattered around the whole circle, and they cancel — $E[x(t)] = 0$. Time average of any *single* copy: a cosine averages to 0 along its length. **They agree.**
- $x(t) = A$ for all $t$, where $A = +1$ or $-1$ on a fair coin flip at switch-on. Ensemble average: half the copies sit at $+1$, half at $-1$, so $E[x(t)] = 0$. Time average of the one recording you own: $+1$ or $-1$, forever. **They disagree** — no amount of watching your one trace reveals the ensemble mean, because time-averaging can never forget which coin you got. Module 2's noise is assumed to be the first kind ("ergodic in the mean" — the name is enough for now), and that assumption is what licenses measuring an ensemble quantity with one oscilloscope.

## @misconceptions
- wrong: "E[X] is the most likely value of X — or at least a value X can actually take."
  tempting: "'Expected value' sounds like 'the value you should expect to see'."
  correction: "It is the balance point of the outcomes, nothing more. A fair die has E[X] = 3.5 — a face that does not exist — and a fair ±1 coin-signal has mean 0, its single impossible value. Read E[X] as 'long-run average', never as a prediction of one trial."
  probe: q-die-var
- wrong: "Uncorrelated and independent are synonyms."
  tempting: "Both translate to 'unrelated' in everyday English."
  correction: "Independence is the strong claim (knowing X tells you nothing about Y); uncorrelated only says the average product splits, E[XY] = E[X]E[Y]. X uniform on {−1, 0, 1} with Y = X²: uncorrelated, yet Y is completely determined by X. Independent ⇒ uncorrelated; never the reverse."
  probe: q-uncorr
- wrong: "Averaging N samples divides the noise by N."
  tempting: "N times the data should buy N times the cleanliness."
  correction: "The variance divides by N; the visible wiggle σ divides only by √N. 100 samples buys a factor of 10. Budget accordingly — every extra decimal digit of precision costs 100× more data."
  probe: q-avg16
- wrong: "Standard deviations of independent noise sources add: σ = σ₁ + σ₂."
  tempting: "Signal amplitudes add at a summing node, so noise 'amplitudes' should too."
  correction: "Independent noises add in POWER: σ² = σ₁² + σ₂², so σ = √(σ₁² + σ₂²) — perpendicular triangle legs, not lengths on a line. 3 mV and 4 mV of independent noise make 5 mV, not 7. (Two copies of the SAME noise do add amplitudes — correlation is the difference.)"
  probe: q-sigma-add

## @exam

**Where it appears:** rarely as a standalone question — occasionally a direct 2–4 mark expectation/variance table — but constantly as the *vocabulary* of white-noise items on Minor I and the Major: output noise power is $E[y^2]$, computed analytically as $\int \frac{N_0}{2}|H(j\omega)|^2 \frac{d\omega}{2\pi}$ in m2/white-noise-psd; conceptual marks ask "time average vs ensemble average" or "why does Welch averaging smooth the periodogram" (answer: it averages nearly-uncorrelated segment spectra, so the estimate's wiggle drops like $1/\sqrt{N}$ — and say clearly that the periodogram is the *measured estimate*, while the flat $N_0/2$ PSD is the *analytic ensemble* quantity).

**The method that earns full marks:** for tables — columns $x, p, xp, x^2p$; sum; $\mu$; $E[X^2]$; then $\sigma^2 = E[X^2] - \mu^2$ stated before numbers go in. For averaging questions — name $N$, write $\sigma_{\bar{X}} = \sigma/\sqrt{N}$ as a formula first, substitute, box the number with its units. For summed noise — write $\sigma^2_{\text{tot}} = \sigma_1^2 + \sigma_2^2$ and state "independent ⇒ uncorrelated ⇒ powers add" as the one-line justification.

**Traps that cost marks:** subtracting $\mu$ before squaring in the shortcut (it is $E[X^2] - \mu^2$, not $E[(X - \mu)]^2$ — the latter is 0); dividing σ by $N$ instead of $\sqrt{N}$; adding σ's linearly; asserting independence when only uncorrelatedness is given (or needed); calling a periodogram "the PSD" without the word *estimate*; dropping units on σ (it carries volts; σ² carries volts²).

## @interview

One-liners that signal fluency: "Expectation is linear even under total dependence — no independence needed, ever." "Variance is the mean squared miss; for zero-mean noise it is literally the average power." "Why √N? — variances add, amplitudes don't; the noise power of the average falls like 1/N, so its amplitude falls like 1/√N." "Uncorrelated kills the cross terms; independence kills every statistical linkage — the first is all that variance bookkeeping needs." "Time average is what a scope measures; ensemble average is what the theory computes; *ergodic* is the word for signals where the two agree."

## @history

Expectation was born at a gambling table, not in a lecture hall. In 1654 Pascal and Fermat exchanged letters over a puzzle: two players are forced to abandon a game mid-way — how should the pot be split *fairly*, given each player's chances of winning had it continued? Their answer — weight each outcome's payoff by its probability — is exactly $\sum x_i p_i$, the fair price of an unfinished future. Huygens wrote it up in 1657 in the first probability textbook, and the gambler's "expectation" kept its name all the way into your noise-power integrals.

## @summary

$$E[X] = \sum_i x_i p_i = \int x f(x)\,dx \qquad \sigma^2 = E[X^2] - \mu^2 \qquad \sigma_{\bar{X}} = \frac{\sigma}{\sqrt{N}}$$

- **Expectation = long-run average** — the balance point; not the likeliest value, not always attainable (die: 3.5).
- **Linearity, unconditional:** $E[aX + bY] = aE[X] + bE[Y]$ — dependence never breaks it.
- **Variance shortcut:** two averages, subtract: $E[X^2] - \mu^2$. Units: σ in volts, σ² in volts² (power).
- **Zero-mean noise:** power = variance = $R(0)$ (Module 2's notation).
- **Uncorrelated:** $E[XY] = E[X]E[Y]$. Independent ⇒ uncorrelated; converse FALSE ($Y = X^2$).
- **Sums of uncorrelated noise:** variances add; σ's add in quadrature ($3, 4 \to 5$, never 7).
- **Averaging N uncorrelated looks:** variance ÷ N, wiggle ÷ √N; 10× cleaner costs 100× data. Correlated samples cancel slower.
- **Time vs ensemble:** scope measures time averages; theory computes ensemble averages; they agree for the course's ("ergodic") noise — Welch/periodogram = measured estimate, flat $N_0/2$ = analytic PSD.
