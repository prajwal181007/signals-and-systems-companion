---
id: m1/convolution-properties
title: "Convolution properties: the algebra of systems"
short: Convolution properties
module: 1
tier: core
outcomes: [CO1]
prereqs: [m1/convolution]
aliases: ["commutative", "associative", "distributive", "convolution algebra", "cascade", "parallel"]
exam: { minor1: high, major: medium, marks: "4–8", styles: [compute, conceptual] }
crosslinks:
  - { target: m4/interconnections, relation: "these three properties ARE the rules for combining blocks in diagrams" }
  - { target: m2/ft-properties, relation: "convolution becomes multiplication in frequency — where this algebra turns trivial" }
---

## @intuition

Convolution isn't just a computation — it obeys an *algebra*, and each law is a physical statement about connecting systems. Put an equalizer before a reverb, or the reverb before the equalizer: the final sound is identical. That everyday-odd fact is associativity + commutativity doing real work.

---
@viz conv-props {"view":"slide","x":"rect1","h":"exp"}
**Commutativity** ($x * h = h * x$): press the swap button — the output curve does not move. Mathematically the input and the system are interchangeable ingredients, even though physically one is a signal and one is a box. Practically: flip whichever is *easier to flip* when computing by hand — a freedom worth marks.

---
**Associativity** ($(x*h_1)*h_2 = x*(h_1*h_2)$): two systems in **cascade** act like one system with $h = h_1 * h_2$ — and the order of the cascade is irrelevant. **Distributivity** ($x*(h_1+h_2) = x*h_1 + x*h_2$): systems in **parallel** add their impulse responses. Every block-diagram manipulation in Module 4 is these two lines wearing boxes and arrows.

---
Then the workhorse identities. Convolving with $\delta(t - t_0)$ *copies and shifts* — no integral needed. Convolving with $u(t)$ *accumulates* (running integral). Widths add: supports $[a,b]*[c,d] \subseteq [a{+}c, b{+}d]$. The derivative can be moved onto either factor: $(x*h)' = x'*h = x*h'$ — often turning a hard convolution into a trivial one plus an integration.

## @definition

For signals (all LTI-legal):
- **Commutative:** $x * h = h * x$.
- **Associative:** $(x * h_1) * h_2 = x * (h_1 * h_2)$ — cascade equivalent: $h_{eq} = h_1 * h_2$, any order.
- **Distributive:** $x * (h_1 + h_2) = x*h_1 + x*h_2$ — parallel equivalent: $h_{eq} = h_1 + h_2$.
- **Identity & shift:** $x * \delta = x$; $x * \delta(t - t_0) = x(t - t_0)$.
- **Accumulation:** $x * u(t) = \int_{-\infty}^{t} x(\tau)\,d\tau$.
- **Differentiation:** $(x * h)' = x' * h = x * h'$.
- **Width/support:** supports add; DT lengths: $N + M - 1$.
- **Time shift:** $x(t-t_1) * h(t-t_2) = y(t - t_1 - t_2)$ — delays stack.

## @derivation

### Step: Commutativity by substitution
?why: A change of integration variable λ = t − τ swaps the roles of the two factors.
$\int x(\tau)h(t-\tau)d\tau \xrightarrow{\lambda = t-\tau} \int x(t-\lambda)h(\lambda)d\lambda = (h*x)(t)$. One substitution — no symmetry assumptions about the signals themselves.

### Step: Distributivity is linearity restated
?why: The integral of a sum splits; nothing deeper.
$x*(h_1+h_2) = \int x(\tau)[h_1(t{-}\tau) + h_2(t{-}\tau)]d\tau$ splits into the two convolutions. Parallel systems add responses because integration is linear — the property was inherited, not invented.

### Step: The shift identity from sifting
?why: δ(t−t₀−τ) plucks out exactly one value of x.
$x * \delta(t{-}t_0) = \int x(\tau)\,\delta(t - t_0 - \tau)\,d\tau = x(t - t_0)$ — the impulse's defining property applied inside the convolution. Copy, shift, done; anyone integrating by regimes here is losing minutes.

### Step: Moving the derivative
?why: Differentiate under the integral in t — only h(t−τ) depends on t.
$(x*h)'(t) = \int x(\tau)h'(t-\tau)d\tau = x * h'$, and by commutativity also $x' * h$. Use: rect' = two impulses ⇒ (rect ∗ h)' = h(t) − h(t−T) ⇒ integrate to recover rect ∗ h with almost no work.

## @examples

**Worked (exam speedrun):** compute $y = x * h$ with $x = u(t) - u(t-2)$, $h = e^{-t}u(t)$, using the derivative trick: $x' = \delta(t) - \delta(t-2)$, so $x' * h = h(t) - h(t-2)$. Then $y(t) = \int_{-\infty}^t [h(\lambda) - h(\lambda - 2)]d\lambda = (1 - e^{-t})u(t) - (1 - e^{-(t-2)})u(t-2)$. No flip-and-slide regimes at all.

**Worked (cascade):** two identical RC filters, $h_1 = h_2 = e^{-t}u(t)$. Cascade: $h_{eq} = h_1 * h_2 = t\,e^{-t}u(t)$ — a repeated-pole shape (peaks then decays; no longer a pure exponential). One-line preview of what repeated poles will mean in Module 3.

**Worked (echo channel algebra):** channel $h = \delta(t) + \tfrac12\delta(t - 3)$; equalizer in cascade must satisfy $h * g = \delta$: the algebra of these identities is how echo cancellers are *designed* — the interview version of this concept.

## @misconceptions
- wrong: "Cascade order matters — the first system 'gets the signal first'."
  tempting: "Physically the signal really does pass through one box before the other."
  correction: "For LTI blocks, h₁∗h₂ = h₂∗h₁: the composite is identical either way. (For NONLINEAR blocks order matters enormously — clip-then-filter ≠ filter-then-clip. The privilege is LTI-only.)"
- wrong: "x ∗ δ(t−3) requires setting up the integral with regimes."
  tempting: "Every convolution so far needed limits and cases."
  correction: "Sifting collapses it instantly: a copy of x delayed by 3. Recognizing identity/shift/accumulate patterns before integrating is exactly what the property list is FOR."
- wrong: "(x∗h)' = x'∗h' — differentiate both."
  tempting: "Product-rule instincts."
  correction: "The derivative lands on ONE factor: (x∗h)' = x'∗h = x∗h'. Differentiating both would double-differentiate the output (that's x'∗h' = y''1)."

## @exam

4–8 marks, two flavors: (a) *use* the properties to shortcut a convolution (derivative trick on pulses, shift identities, distributing over a sum of impulses) — the mark scheme rewards naming the property used; (b) *conceptual*: equivalent impulse response of cascade/parallel arrangements, order-independence justification. Traps: applying commutativity to nonlinear blocks (illegal), forgetting delays stack ($t_1 + t_2$), and DT length $N+M-1$ (not $N+M$).

## @summary

- $x*h = h*x$; $(x*h_1)*h_2 = x*(h_1*h_2)$ (cascade: $h_1*h_2$, any order); $x*(h_1{+}h_2) = x*h_1 + x*h_2$ (parallel: add h's).
- $x*\delta(t{-}t_0) = x(t{-}t_0)$;  $x*u = \int_{-\infty}^t x$;  $(x*h)' = x'*h = x*h'$ (one factor!).
- Supports add; DT length $N{+}M{-}1$; delays stack.
- Speedrun recipe for pulses: differentiate to impulses → copy/shift h → integrate back.
- LTI-only privileges: nonlinear cascades do NOT commute.
