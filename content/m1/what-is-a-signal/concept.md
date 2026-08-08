---
id: m1/what-is-a-signal
title: "What is a signal? Classification decides your toolbox"
short: Signal types
module: 1
tier: core
outcomes: [CO1]
prereqs: []
aliases: ["continuous time", "discrete time", "analog", "digital", "deterministic", "random signal", "classification"]
exam: { minor1: medium, major: low, marks: "2–6", styles: [conceptual] }
crosslinks:
  - { target: m4/sampling, relation: "sampling is the bridge from CT to DT — and quantization is a separate, independent step" }
  - { target: m2/white-noise-psd, relation: "random signals need statistical tools, not transforms of one recording" }
---

## @intuition

Your phone records your voice: a microphone voltage that exists at *every* instant, taking *any* value. By the time it is an MP3, it exists only at 44,100 instants per second, each stored with finite precision. Same sound — two utterly different mathematical objects. Every tool in this course works on some signal types and silently fails on others, so the first skill is knowing *what kind of thing you are holding*.

---
Two independent questions classify most signals. **Is time continuous or discrete?** $x(t)$ lives on the whole real line; $x[n]$ exists only at integer steps — square brackets are the course-wide flag. **Is amplitude continuous or quantized?** These are separate dials: you can discretize time without touching amplitude (a sampled voltage), or quantize amplitude while time stays continuous. "Digital" means *both* discretized — discrete-time is not the same word.

---
A third question: **would a replay look identical?** A chirp generator produces the same trace every run — *deterministic*, one formula tells all. Thermal noise is different every run, yet its *statistics* repeat — *random*, and Module 2 will build the right tools (power spectra, not point values). Finally: where does the signal live? Nonzero only for $t \ge 0$ (causal / right-sided), only for $t \le 0$ (anti-causal), or everywhere (two-sided) — this bookkeeping quietly decides Laplace ROCs in Module 3.

## @definition

- **Continuous-time (CT)**: $x(t)$, $t \in \mathbb{R}$. **Discrete-time (DT)**: $x[n]$, $n \in \mathbb{Z}$ — usually born by sampling: $x[n] = x(nT_s)$.
- **Analog vs digital**: amplitude continuous vs quantized to finite levels. Time-discretization ⊥ amplitude-quantization — four combinations exist.
- **Deterministic vs random**: fully specified by a rule vs specified only statistically.
- **Duration**: finite-duration, right-sided ($x = 0$ for $t < t_0$), left-sided, two-sided. **Causal signal**: zero for $t<0$.
- **Magnitude classes**: bounded ($|x(t)| \le M$), unbounded; even/odd and periodic/aperiodic get their own concepts next.

**Reading the notation:** parentheses = CT, brackets = DT — the exams and this app never mix them casually. $T_s$ is the sampling period; its reciprocal $f_s$ the sampling rate.

## @derivation

### Step: Why classification is load-bearing, not vocabulary
?why: Each tool's derivation quietly assumes a class; using it outside the class produces confident nonsense.
The convolution *integral* assumes CT; the convolution *sum* assumes DT. Fourier *series* assumes periodic; the *transform* assumes finite energy (or distributions). Laplace assumes one-sided growth bounds; averages-over-time assume determinism or stationarity.

### Step: Time and amplitude discretization commute — and are independent
?why: Sampling touches only the time axis; quantization touches only the value axis.
Sample first then quantize, or quantize then sample: the same digital signal results. One operation can even be *undone* under conditions (perfect reconstruction of band-limited signals — Module 4's headline); quantization error, once made, is permanent. That asymmetry is why "which information survives?" is a classification question.

### Step: Random signals demand different questions
?why: A single realization of noise has no repeatable value at any t — only its ensemble/time statistics repeat.
Asking "what is $x(3.2)$?" of noise is meaningless; asking "what is the average power near 1 kHz?" is answerable and stable. Different class ⇒ different well-posed questions.

## @examples

**Classify fully:** (a) $x(t) = e^{-2t}u(t)$ — CT, analog, deterministic, causal, right-sided. (b) Daily closing price of a stock — DT (one value per day), quantized (cents), random. (c) Output of an 8-bit DAC before smoothing — CT in time (a held staircase exists at every instant) but quantized in amplitude: analog time, digital amplitude — the classic trick question. (d) $x[n] = \cos(0.3\pi n)$ — DT, analog-amplitude, deterministic.

**Exam-style:** "A voltage is sampled at 1 kHz and stored as 12-bit numbers. State every classification that changed." Answer ritual: time became discrete at $T_s = 1$ ms (CT→DT); amplitude became quantized to $2^{12}$ levels (analog→digital); determinism and duration unchanged.

## @misconceptions
- wrong: "Discrete-time and digital are the same thing."
  tempting: "Both feel like 'computer signals', and casual speech mixes them."
  correction: "They are independent dials. A sampled-but-unquantized signal (switched-capacitor circuits) is DT-analog; a quantized-but-continuous-time signal (DAC staircase) is CT-digital. 'Digital' = BOTH dials flipped."
- wrong: "A random signal has no useful description."
  tempting: "Every replay is different — what could you possibly compute?"
  correction: "Its statistics are stable and measurable: mean, power, power spectral density. Module 2 computes them; whole industries (communications, radar) run on them."
- wrong: "x[n] is just x(t) with fewer points, so all CT results carry over."
  tempting: "The stems sit on the CT curve."
  correction: "DT has its own rules that differ qualitatively: cos(Ω₀n) may be aperiodic, frequency lives on a circle, and the fastest oscillation is alternation at Ω = π. Assuming CT behavior in DT costs marks (and designs)."

## @exam

Appears in Minor I as short classification items (2–6 marks): classify given signals on every axis, or produce an example with prescribed properties ("give a CT, digital, deterministic signal"). Full marks come from *naming every axis explicitly* — time, amplitude, determinism, duration/causality — not just the one the question hints at. Trap: the DAC staircase (CT + quantized) and sampled audio before quantization (DT + analog) are the standard "gotcha" pair.

## @summary

- $x(t)$ CT vs $x[n]$ DT (brackets = discrete). Sampling: $x[n] = x(nT_s)$.
- Time-discretization ⊥ amplitude-quantization ⇒ 4 classes; **digital = both**.
- Deterministic (replayable rule) vs random (replayable statistics only).
- Duration: finite / right-sided (causal if 0 for $t<0$) / left-sided / two-sided — feeds ROCs later.
- Classification decides which tools are legal: series ↔ periodic, transform ↔ energy, sum ↔ DT, statistics ↔ random.
