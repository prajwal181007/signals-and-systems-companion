---
id: m1/impulse-response
title: "The impulse response: a system's fingerprint"
short: Impulse response
module: 1
tier: core
outcomes: [CO1]
prereqs: [m1/lti-systems, m1/impulse]
aliases: ["h(t)", "step response", "system fingerprint", "system DNA"]
exam: { minor1: high, major: high, marks: "4–8", styles: [compute, conceptual] }
crosslinks:
  - { target: m1/convolution, relation: "h(t) is the ingredient; convolution is the recipe that uses it on any input" }
  - { target: m3/transfer-function, relation: "H(s) is the Laplace transform of h(t) — same fingerprint, transform-domain clothing" }
---

## @intuition

Clap once in a cathedral and record what comes back: a burst, early reflections, a long shimmering tail. That recording — the room's answer to one idealized clap — is its **impulse response** $h(t)$. Audio engineers literally sell these recordings ("convolution reverb"): load a cathedral's $h$, and your dry vocal sounds like it was sung there. One clap captured the entire acoustic identity of the building.

---
@viz conv-echo {"view":"echo","x":"rect1","h":"exp","t":3}
Why is one clap enough? The previous concept made the promise; here it becomes concrete. Any input is a dense train of tiny scaled claps. The system — LTI, so it treats every clap identically, just delayed — answers each with a scaled, shifted copy of $h$. The amber echoes above are those copies; their sum is the output. **$h$ is the only system-specific ingredient in the whole picture.** Everything the system will ever do is already in that one curve.

---
Reading a fingerprint: $h$ tall and narrow → the system responds fast and forgets fast (wide bandwidth). $h$ spread out → sluggish smoothing (audio muffling, thermometer lag). $h$ with oscillations → the system rings at its own preferred frequency. $h$ nonzero before $t=0$ → the system reacted before the clap: non-causal. $h$ that never decays → the memory of one clap lasts forever: instability brewing. Each system property becomes *legible geometry* on one plot.

## @definition

$h(t)$ = the output of an (initially at rest) LTI system when the input is $\delta(t)$. DT: $h[n]$, response to $\delta[n]$.

**Property dictionary (LTI):**
- **Memoryless** ⇔ $h(t) = k\,\delta(t)$ (pure gain).
- **Causal** ⇔ $h(t) = 0$ for $t < 0$.
- **BIBO stable** ⇔ $\int_{-\infty}^{\infty}|h(t)|\,dt < \infty$ (DT: $\sum|h[n]| < \infty$).
- **Step response:** $s(t) = \int_{-\infty}^{t} h(\tau)d\tau$; conversely $h = ds/dt$.
- Identity system: $h = \delta(t)$. Pure delay by $t_0$: $h = \delta(t - t_0)$. Running integrator: $h = u(t)$.

**Reading the symbols:** "initially at rest" matters — $h$ is the *zero-state* response; stored initial energy would contaminate the fingerprint.

## @derivation

### Step: h exists as a well-defined limit (no faith in δ required)
?why: Physical systems respond to narrow pulses; the limit of those responses is shape-independent.
Feed unit-area pulses of shrinking width $\epsilon$ (any shape). For an LTI system with reasonable smoothing, the responses converge to a single limiting curve as $\epsilon \to 0$ — the Impulse Forge demonstrated this shape-independence. Define $h$ as that limit; δ itself never needs to "exist" physically.

### Step: Stability ⇔ absolutely integrable h — both directions
?why: The bound comes from the convolution's triangle inequality; the converse from an adversarial input.
If $\int|h| = I < \infty$ and $|x| \le M$: $|y(t)| \le \int |x(t-\tau)||h(\tau)|d\tau \le MI$ — bounded ✓. Conversely if $\int|h| = \infty$, choose $x(t-\tau) = \mathrm{sgn}(h(\tau))$ (bounded by 1): then $y(t) = \int|h| = \infty$ — the designed worst case again. So the *casual* stability checks of the last concept become one integral you can compute.

### Step: Step response as accumulated memory
?why: u is the integral of δ, and integration commutes with LTI systems.
$s(t) = \int_{-\infty}^{t}h(\tau)d\tau$: the step response at time $t$ is *all the impulse response so far*. A system settles ($s \to$ const) exactly when its impulse memory dies out ($h \to 0$ fast enough).

## @examples

**Worked (RC circuit, from physics to h):** RC low-pass, $RC\frac{dy}{dt} + y = x$. The step response (charging curve) is $s(t) = (1 - e^{-t/RC})u(t)$ — standard first-order physics. Differentiate: $h(t) = \frac{1}{RC}e^{-t/RC}u(t)$. Check the dictionary: causal ✓ (zero before 0), stable ✓ ($\int|h| = 1$), memoryful ✓ (not a bare δ). One curve, full character.

**Worked (property reading, exam pattern):** $h(t) = e^{2t}u(-t)$. Causal? $h \ne 0$ for $t<0$... careful: $u(-t)$ lives on $t \le 0$ ⇒ NON-causal (responds before the clap). Stable? $\int_{-\infty}^{0}e^{2t}dt = \tfrac12 < \infty$ ⇒ stable. Non-causal yet stable — the properties are independent, and this exact pair appears on papers.

**Worked (integrator):** $h = u(t)$: causal ✓; $\int|h| = \infty$ ⇒ unstable — the same verdict the adversarial step test gave, now by one-line integral.

## @misconceptions
- wrong: "h(t) is just one more response among many — nothing special."
  tempting: "Why privilege the impulse over any other test signal?"
  correction: "δ is the identity of convolution: its response IS the system's complete description. From h you can compute the response to EVERYTHING; from the response to (say) a sine you cannot. (The step works too — but only because h = ds/dt recovers h.)"
- wrong: "A stable system just means h decays to zero."
  tempting: "Decay feels like stability."
  correction: "h(t) = u(t)·1/(1+t) decays to zero, yet ∫|h| = ∞: unstable. The criterion is absolute INTEGRABILITY, not convergence to zero. Check the integral, not the picture."
- wrong: "h is measured with any initial conditions."
  tempting: "The system is what it is regardless of its state."
  correction: "h is the ZERO-STATE response. Stored energy adds a zero-input component that corrupts the fingerprint — real measurements discharge/rest the system first."

## @exam

Minor I staples (4–8 marks): (a) given $h$, classify causality/stability/memory with justification ($\int|h|$ computed explicitly); (b) derive $h$ from a first-order circuit via the step response; (c) $s \leftrightarrow h$ conversions. Ritual: for stability, WRITE the integral and evaluate — "it decays" earns nothing; for causality, state the support of $h$. Traps: $u(-t)$-type supports (non-causal but stable), decaying-but-not-integrable tails, and forgetting that $s(\infty) = \int_{-\infty}^{\infty} h$ (the DC gain — a free consistency check).

## @summary

- $h$ = zero-state response to δ; the complete LTI fingerprint. $s(t) = \int_{-\infty}^t h$, $h = ds/dt$, $s(\infty) = $ DC gain.
- Dictionary: memoryless ⇔ $h = k\delta$; causal ⇔ $h = 0$ for $t<0$; **BIBO ⇔ $\int|h| < \infty$**.
- Identity $\delta(t)$; delay $\delta(t-t_0)$; integrator $u(t)$ (unstable); RC: $\frac{1}{RC}e^{-t/RC}u(t)$.
- Wide h ⇒ smoothing/sluggish; oscillatory h ⇒ resonance; pre-zero h ⇒ non-causal.
- Stability by the integral, never by the vibe of decay.
