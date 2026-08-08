---
id: m1/system-properties
title: "System properties: what a black box can and cannot hide"
short: System properties
module: 1
tier: core
outcomes: [CO1]
prereqs: [m1/what-is-a-signal, m1/signal-operations]
aliases: ["linearity", "time invariance", "causality", "BIBO stability", "memory", "invertibility", "passivity", "realizability"]
exam: { minor1: high, major: high, marks: "6–10", styles: [prove, conceptual] }
crosslinks:
  - { target: m1/lti-systems, relation: "the two properties that unlock everything — linear + time-invariant — get the whole next concept" }
  - { target: m1/convolution, relation: "every property of an LTI system becomes readable from h(t) alone" }
---

## @intuition

An engineer inherits an undocumented amplifier. Before trusting it anywhere, she asks a fixed checklist of questions — not "what circuit is inside?" but "how does it *behave*?": If I double the input, does the output double? If I test it tomorrow, same result? Can it react before I act? Could a small input ever blow it up? These behavioral questions are the system properties, and they decide which mathematics is allowed near the box.

---
@viz lab {}
The lab makes the checklist physical. Pick a mystery box and run the **linearity rig**: it feeds $2x_1 + \tfrac12 x_2$ through the box, separately combines the individual responses $2y_1 + \tfrac12 y_2$, and plots the difference. Zero residual: consistent with linear. Nonzero anywhere: linearity is *dead* — one counterexample executes it. Note the asymmetry: tests can only kill a property or fail to kill it; only algebra on the formula can prove it alive.

---
The classic traps live here, so meet them early. $y = t\,x(t)$: doubling $x$ doubles $y$ — **linear** — yet the same pulse fed later comes out with a different weight — **time-varying**. Linearity and time-invariance are independent axes. $y = x(2t)$: perfectly innocent-looking, yet $y(1)$ needs $x(2)$ — it reads the *future*: **non-causal**. And the running integrator passes every casual bounded-input test until you feed the one adversarial input, $u(t)$, and watch it ramp to infinity: **BIBO stability is about the worst case**, not the average one.

## @definition

For a system $x \to y$:
- **Linear:** $ax_1 + bx_2 \mapsto ay_1 + by_2$ (superposition: additivity + homogeneity). Test both; note $x = 0 \Rightarrow y = 0$ for linear systems (so $y = x + 1$ is *not* linear).
- **Time-invariant (TI):** $x(t - t_0) \mapsto y(t - t_0)$ for every shift — shifting commutes with the system.
- **Causal:** $y(t_0)$ depends only on $x(t)$, $t \le t_0$. Memoryless ⇒ causal.
- **Memoryless:** $y(t_0)$ depends only on $x(t_0)$ (this instant, nothing else).
- **BIBO stable:** every bounded input ($|x| \le M_x$) yields a bounded output.
- **Invertible:** distinct inputs give distinct outputs (an inverse system exists).
- Syllabus extras: **deterministic** system (same input ⇒ same output every run); **physically realizable** ≈ causal + stable (buildable in real time without foreseeing the future or exploding); **passive** (never delivers more energy than it absorbs: $\int|y|^2 \le \int|x|^2$-flavored bounds; an amplifier is active, an RC network passive).

## @derivation

### Step: The logic of testing vs proving
?why: A universal claim ("for ALL inputs…") dies by one counterexample but is proved only by general argument.
Properties are ∀-statements. The lab can execute them (one failed test) but never confirm them (finitely many passes prove nothing). Exam technique mirrors this: to show NOT linear, exhibit one concrete violation; to show linear, argue with symbols for arbitrary $x_1, x_2, a, b$.

### Step: Worked proof — y = t·x(t) is linear but time-varying
?why: Run both definitions honestly; they answer independently.
Linearity: $t\,[ax_1(t) + bx_2(t)] = a\,t x_1(t) + b\,t x_2(t)$ ✓ for all inputs. TI: input $x(t-t_0)$ gives $t\,x(t-t_0)$; but $y(t-t_0) = (t-t_0)x(t-t_0)$. Different (the weight $t$ didn't shift) ⇒ time-varying. The multiplier depends on the *clock*, not the signal.

### Step: Worked proof — the integrator is unstable, and how to find the killer input
?why: To break BIBO, aim the input at the system's weakness: make everything accumulate with one sign.
$y(t) = \int_{-\infty}^t x\,d\tau$ with $x = u(t)$ (bounded by 1): $y(t) = t \to \infty$. One bounded input, unbounded output — dead. Random test signals (sinusoids, pulses) all pass; the *adversarial* one kills. This "design the worst case" instinct is exactly how BIBO ⇔ $\int|h| < \infty$ will be proved next concept.

### Step: Causality by inspection of the argument
?why: The system reads x at the times its formula's argument names — just compare them to t.
$y(t) = x(t-2)$: reads the past ✓ causal. $y(t) = x(t+2)$ or $x(2t)$ (for $t>0$ needs $2t > t$): reads ahead ✗. $y(t) = x(-t)$: at $t = -3$ needs $x(3)$ — future ✗. Write the needed times; compare with $t$.

## @examples

**Worked (full exam classification):** $y(t) = x^2(t)$. Linear? $(ax)^2 = a^2x^2 \ne a\,x^2$ — homogeneity fails at $a=2$ ✗. TI: $x(t-t_0) \mapsto x^2(t-t_0) = y(t-t_0)$ ✓. Causal ✓ (this instant only). Memoryless ✓. Stable: $|x|\le M \Rightarrow |y| \le M^2$ ✓. Verdict: nonlinear, TI, causal, memoryless, stable — the standard counterpart to $t\,x(t)$, and together they prove L and TI are independent.

**Worked:** $y(t) = x(t)\cos(t)$: linear (multiplier independent of $x$), time-varying (multiplier depends on clock), causal, memoryless, stable. Multiplying by a *time function* is the signature of modulation — linear but TV, the whole point of AM radio.

**Worked (invertibility flavor):** $y = x^2$ destroys sign ⇒ not invertible ($x$ and $-x$ collide). $y(t) = x(t-1)$: invertible (shift back).

## @misconceptions
- wrong: "y = x + 1 is linear — it's a straight line!"
  tempting: "The graph of the map is literally a line."
  correction: "Linearity of SYSTEMS means superposition, and zero-in must give zero-out; here 0 ↦ 1. It is 'affine'. Straight-line graphs ≠ system linearity."
- wrong: "y = t·x(t) is nonlinear because t multiplies the signal."
  tempting: "There's a 't' in there making it feel non-uniform."
  correction: "Superposition holds perfectly for every pair of inputs — it IS linear. What fails is time-invariance: the gain follows the clock. The two properties are separate dials; this system is THE canonical proof."
- wrong: "It survived every input I tried, so it's stable."
  tempting: "Ten different bounded inputs all gave bounded outputs."
  correction: "BIBO quantifies over ALL bounded inputs. The integrator survives pulses and sinusoids and dies on u(t). Stability is proved by a bound argument (or ∫|h| next concept), never by testimony."
- wrong: "Non-causal systems are physically absurd, so causality never really fails."
  tempting: "Nothing reacts before it's poked."
  correction: "Offline processing reads 'the future' freely (the whole file already exists) — image filters and recorded-audio processing are routinely non-causal. Causality is a constraint for REAL-TIME systems, and y = x(2t) fails it on paper either way."

## @exam

A guaranteed Minor I block (6–10 marks): classify 3–5 systems across linearity/TI/causality/memory/stability with justification. The mark scheme wants METHOD: for each failed property a *specific counterexample* (name the inputs, show the two sides differ); for each held property a *general argument* (arbitrary $x_1, x_2$, arbitrary shift). Traps deployed every year: $t\,x(t)$ (L, not TI), $x^2$ (TI, not L), $x(2t)$ (non-causal), $x(-t)$ (non-causal), the integrator (unstable via $u(t)$), $y = x + 1$ (not linear). Realizability/passivity appear as one-line conceptual asks — define and give an example (RC passive; amplifier active).

## @summary

- **Linear** = superposition ($0 \mapsto 0$ necessarily). **TI** = shift commutes. Independent axes: $t\,x(t)$ is L+TV; $x^2$ is NL+TI.
- **Causal**: argument times ≤ t (check by inspection); $x(2t)$, $x(-t)$, $x(t+1)$ all fail. **Memoryless**: this instant only ⇒ causal.
- **BIBO**: ∀ bounded inputs — prove with bounds, kill with a designed worst case (integrator + $u(t)$).
- Kill with ONE counterexample; prove only with general algebra. Tests are consistent-with, never proof.
- Realizable ≈ causal + stable; passive = never amplifies energy; deterministic = replayable.
