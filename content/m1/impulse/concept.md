---
id: m1/impulse
title: "The impulse: a kick defined by what it does, not by what it is"
short: Impulse
module: 1
tier: core
hero: false
outcomes: [CO1]
prereqs: [m1/elementary-signals]
aliases: ["dirac delta", "unit impulse", "delta function", "sifting property", "sampling property", "impulse scaling", "delta(at)", "distribution", "generalized function", "arrow with weight"]
exam: { minor1: high, major: medium, marks: "4–8", styles: [compute, conceptual] }
crosslinks:
  - { target: m1/convolution, relation: "sifting is what makes the echo decomposition legal — and δ is convolution's identity: x∗δ = x" }
  - { target: m1/elementary-signals, relation: "δ is the missing top rung of the singularity chain r → u → δ" }
  - { target: m1/impulse-response, relation: "hitting a system with δ produces h(t) — the fingerprint that predicts every output" }
  - { target: m2/fourier-transform, relation: "δ's spectrum is perfectly flat — one kick contains every frequency equally" }
---

## @intuition

A hammer taps a bell. A camera flash fires. Lightning grazes a power line. Each event is over almost before it starts, yet the aftermath — ring, exposure, surge — lasts and lasts. Engineers want a *standard kick* to test systems with: one so short that no system can resolve its details, only feel its total punch. But what should "the standard kick" be, exactly? Make it a millisecond wide? A microsecond? Any finite choice is arbitrary — and the honest answer, "infinitely short," refuses to be an ordinary function. This concept builds the object that answers anyway.

---

Here is the physical clue. Strike the bell with a shorter, harder tap that delivers the *same total punch* (force × duration, kept fixed): the ring is indistinguishable. Shorter still: no change. The bell cannot see the tap's shape — only the total it delivers. So the ideal kick shouldn't be defined by its graph at all. It should be defined by its **effect**: what it does to things it meets. That inversion — defining an object by its action — is the whole trick.

---
@viz forge {"family":"rect"}
The forge makes this precise. A rectangular pulse with **area pinned at 1** (watch the meter — it never moves) drives an RC circuit. Squeeze the width $\varepsilon$: the pulse grows taller and thinner, and the circuit's response settles onto one fixed curve — the dashed limit. Past a certain narrowness the response simply stops changing: the circuit has stopped resolving the pulse and now feels only its area.

---
@viz forge {"family":"gauss"}
Now swap the rectangle for a Gaussian — no corners, entirely different shape — and squeeze again. **Same limiting response.** Triangle: same again. Any family works, provided its area stays pinned at 1 while the width shrinks. The limit object, written $\delta(t)$, is therefore not a shape: every shape leads to it. What survives the limit is a pure *behavior* — "hand over the value at the strike point" — and that behavior, called **sifting**, is taken as the definition.

---

One warning before the formalism. It is tempting to summarize the pictures as "$\delta(0) = \infty$, zero elsewhere." Resist it: a function that is zero everywhere except one point has integral zero — no punch at all — and $\infty$ is not a value. Every true statement about $\delta$ lives **under an integral sign**. The pictures of tall spikes are scaffolding; the integral behavior is the building. This also completes the ladder from elementary signals: $r \to u \to \delta$, with the last rung reachable only in this limit sense.

## @definition

The **unit impulse** $\delta(t)$ is defined by the **sifting property**: for every signal $x(t)$ continuous at $t_0$,

$$\int_{-\infty}^{\infty} x(t)\,\delta(t - t_0)\,dt = x(t_0)$$

Everything else is a consequence:

$$\int_{-\infty}^{\infty} \delta(t)\,dt = 1 \qquad \delta(-t) = \delta(t) \qquad \delta(at) = \frac{\delta(t)}{|a|} \;\; (a \neq 0)$$

$$x(t)\,\delta(t - t_0) = x(t_0)\,\delta(t - t_0) \qquad u(t) = \int_{-\infty}^{t} \delta(\tau)\,d\tau \qquad \frac{du}{dt} = \delta(t) \;\;\text{(distributional sense)}$$

**Reading the symbols.** $\delta(t-t_0)$ is an impulse *located* where its argument crosses zero: at $t = t_0$ — same rule as every letter of the alphabet. The sifting integral scans $x$ with the impulse and hands back the single number $x(t_0)$: the impulse **sifts out one value**. In $A\,\delta(t-t_0)$, the number $A$ is the **weight** (also called strength) — it is *area*, never height; height is meaningless. "Distributional sense" means: the equation is a promise about behavior under integrals (made exact in the derivation), not a pointwise statement — classically, $u$ has no derivative at the jump.

**Exam conventions.** Sketch an impulse as a vertical **arrow** at its location with the weight written beside it; negative weight points the arrow down. $\delta$ is dimensionful: since $\int \delta(t)\,dt = 1$ is pure, $\delta(t)$ carries units of 1/time — which is why an impulse of current delivers finite charge.

## @derivation

The goal: watch the naive definition fail, then extract the definition that works, then harvest the identities from it.

### Step: No ordinary function can be the kick
?why: An integral cannot see a single point — changing a function at one point changes no integral.
Suppose $f(t) = 0$ for all $t \neq 0$, with $f(0)$ as large as you like. Then $\int x(t) f(t)\,dt = 0$ for every $x$ — zero punch, always. A "value at 0", however huge, carries no area. If the ideal kick exists, it is not a function defined by values.

### Step: Build a concrete kick family and integrate against a smooth signal
?why: The forge's rectangle, done symbolically; continuity of x is the only tool needed.
Let $\delta_\varepsilon(t) = 1/\varepsilon$ on $[0, \varepsilon]$, zero elsewhere — unit area for every $\varepsilon$. Then
$$\int_{-\infty}^{\infty} x(t)\,\delta_\varepsilon(t)\,dt = \frac{1}{\varepsilon}\int_0^{\varepsilon} x(t)\,dt = \text{average of } x \text{ over } [0,\varepsilon] \;\xrightarrow[\varepsilon \to 0]{}\; x(0)$$
since $x$, being continuous, is nearly constant on a shrinking interval.

### Step: Notice the shape never mattered — only the pinned area
?why: The same argument runs for ANY unit-area family whose width shrinks: the integral is a weighted average of x near 0, and the weights always total 1.
Triangle, Gaussian, anything: if the family has unit area and concentrates at 0, the integral against $x$ is an average of values of $x$ ever closer to $x(0)$, so the limit is $x(0)$. This is the shape-independence the forge demonstrates — and why the unit-area condition is non-negotiable: a family with area 2 sifts out $2x(0)$ instead.

### Step: Promote the limiting behavior to the definition
?why: The families disagree about pointwise values but agree perfectly about integrals — so keep only what they agree on.
Define $\delta$ by: $\int x(t)\,\delta(t-t_0)\,dt = x(t_0)$ for all $x$ continuous at $t_0$. Immediate harvest: taking $x = 1$ gives $\int \delta = 1$ (unit area); the definition is symmetric under $t \to -t$, so $\delta(-t) = \delta(t)$.

### Step: Derive the scaling identity δ(at) = δ(t)/|a|
?why: Substitution τ = at inside the integral; a negative a flips the limits, which is where the absolute value comes from.
For $a > 0$, substituting $\tau = at$:
$$\int_{-\infty}^{\infty} x(t)\,\delta(at)\,dt = \int_{-\infty}^{\infty} x\!\left(\tfrac{\tau}{a}\right)\delta(\tau)\,\frac{d\tau}{a} = \frac{x(0)}{a}$$
For $a < 0$ the substitution reverses the limits; restoring their order costs a sign, leaving $x(0)/|a|$. So $\delta(at)$ *behaves as* $\delta(t)/|a|$: **compressing an impulse's clock dilutes its weight**. General form: $\delta(at - b) = \frac{1}{|a|}\,\delta\!\left(t - \tfrac{b}{a}\right)$ — the exam's favorite identity.

### Step: Connect to the step — the ladder's top rung
?why: Integrate δ and read off the answer; then check that "du/dt = δ" does the right thing under an integral, which is all "distributional sense" means.
Running total: $\int_{-\infty}^{t} \delta(\tau)\,d\tau = 0$ for $t < 0$ and $1$ for $t > 0$ — that is $u(t)$. Conversely, for any smooth $x$ vanishing at $\pm\infty$, integration by parts gives
$$\int_{-\infty}^{\infty} x(t)\,u'(t)\,dt = -\int_{-\infty}^{\infty} x'(t)\,u(t)\,dt = -\int_0^{\infty} x'(t)\,dt = x(0)$$
— precisely what sifting demands of $u'$. So $du/dt = \delta$ holds *in the distributional sense*: as a statement about what both sides do under integrals, where classical calculus is silent at the jump.

### Step: Notice what was NOT assumed
?why: The construction used no physics and no pulse shape — only continuity of the test signal at the strike point.
Nothing about bells, circuits, or hammers. Any measurement that responds linearly to short kicks is governed by this one object — which is why a single symbol serves mechanics ("impulse"), circuits ("charge injection"), optics ("point source"), and probability later on. Where $x$ jumps at the strike point, sifting is simply not defined there — honesty, not weakness.

## @examples

**Worked: the sifting ritual (exam pattern).** Evaluate each; the three-move ritual is (1) *normalize* the argument, (2) *locate* the impulse and check it lies inside the limits, (3) *evaluate* the rest of the integrand there.

1. $\displaystyle\int_{-\infty}^{\infty} (t^2 + 1)\,\delta(t-2)\,dt$ — location $t=2$, inside; answer $2^2 + 1 = 5$.
2. $\displaystyle\int_{-\infty}^{\infty} e^{-3t}\,\delta(2t - 4)\,dt$ — normalize first: $\delta(2t-4) = \tfrac{1}{2}\delta(t-2)$; answer $\tfrac{1}{2}e^{-6}$. Skipping the normalization and writing $e^{-6}$ is *the* classic lost mark.
3. $\displaystyle\int_{0}^{3} \cos(\pi t)\,\delta(t-5)\,dt$ — location $t=5$ is **outside** $[0,3]$: the answer is $0$, no computation needed.

**Worked: an impulse of current charges a capacitor instantly.** Drive a capacitor $C$ with $i(t) = Q\,\delta(t)$: the delivered charge is $\int i\,dt = Q$ — finite charge in zero time — so the voltage $v = \frac{1}{C}\int i\,dt = \frac{Q}{C}\,u(t)$ **jumps**. Read the chain both ways: the current impulse integrates to a voltage step, and $i = C\,dv/dt$ differentiates the step back into the impulse. This is $u \leftrightarrow \delta$ wearing a circuit costume, and it is exactly how impulse responses of RC networks are computed in Module 1's later concepts.

**Worked: multiplication freezes the coefficient — and differentiating sketches.** The product identity: $\cos(t)\,\delta(t - \pi) = \cos(\pi)\,\delta(t-\pi) = -\delta(t-\pi)$ — still an impulse, with its weight frozen to the signal's value at the strike location. (Only an *integral* turns it into the number $-1$.) The same idea powers the exam's differentiate-a-sketch question: for $x(t) = 4u(t-1) - 4u(t-3)$,
$$\frac{dx}{dt} = 4\,\delta(t-1) - 4\,\delta(t-3)$$
— every jump becomes an arrow whose weight is the jump's height, drawn at the jump's time. Corners, meanwhile, become jumps of the derivative (ramps → steps): differentiating a sketch moves every feature one rung down the ladder.

## @misconceptions
- wrong: "δ(0) = ∞ — the impulse is the function that is infinite at zero."
  tempting: "Every picture shows an infinitely tall spike at the origin, so a value assignment feels like the definition."
  correction: "No value at a single point can carry area — a function vanishing off one point integrates to 0. δ is defined by its ACTION: ∫x(t)δ(t−t₀)dt = x(t₀). The arrow's label is area (weight), not height; ∞ is not a number."
  probe: q-area
- wrong: "δ(2t) = δ(t) — it's already infinitely narrow, so compressing it changes nothing."
  tempting: "Time-compressing a zero-width spike looks like a no-op; the pictures are identical."
  correction: "Run the substitution: ∫δ(2t)dt = 1/2. Compression halves the area, and area is the only thing δ has: δ(at) = δ(t)/|a|. Time-scaling changes impulse WEIGHTS even though the pictures look the same."
  probe: q-scale
- wrong: "x(t)δ(t−t₀) = x(t₀) — sifting collapses it to a number."
  tempting: "The sifting property ends in x(t₀), and the product looks like the left side of it."
  correction: "Only the INTEGRAL produces a number. The bare product is still an impulse — x(t₀)δ(t−t₀): located where it was, weight frozen to x's value there. Dropping the δ is the most common one-mark leak in this topic."
  probe: q-product
- wrong: "Any spike that gets taller and thinner turns into δ."
  tempting: "Taller + thinner = more impulse-like; the shape pictures all look alike."
  correction: "Only UNIT-AREA families converge to δ. Height 1/ε over width 2ε → area 2 → limit 2δ(t). Height 1/ε² over width ε → area 1/ε → no limit at all. Area is the invariant; the forge's pinned meter is the whole point."
  probe: q-family

## @exam

**Where it appears:** Minor I reliably, 4–8 marks, echoed on the Major: (a) evaluate sifting integrals — almost always with a scaled argument like $\delta(2t-4)$ or finite limits designed to exclude the impulse; (b) differentiate a piecewise sketch and draw the impulses as arrows with weights; (c) simplify products $x(t)\delta(t-t_0)$; (d) short conceptual: "define δ" — the expected answer is the sifting property, *not* "infinite at zero".

**The method that earns full marks:** (1) normalize every argument first: $\delta(at-b) = \frac{1}{|a|}\delta(t - \tfrac{b}{a})$, and write this step down — it carries marks; (2) mark the impulse location $b/a$ and check it against the integration limits — outside means the answer is 0, finished; (3) evaluate the remaining integrand at the location; (4) on sketch questions, one arrow per jump, weight = jump height (sign included), and label weights beside arrows.

**Traps that cost marks:** forgetting $1/|a|$ (the single most harvested error); sifting on autopilot when the limits exclude the impulse; labeling an arrow with a "height"; leaving the answer as $x(t_0)$ when the question asked for the *product* (should be $x(t_0)\delta(t-t_0)$); writing $\delta(t)^2$ or $\delta(t)\delta(t)$ anywhere — products of impulses at the same instant are undefined, and examiners notice.

## @interview

The interview version of this topic is entirely conceptual. Own these: "What is δ? — the object defined by sifting: it hands back a signal's value at the strike point; it has no pointwise definition." "Is δ a function? — no, a distribution: it exists only under integrals, as the limit behavior of unit-area pulse families." "Why unit area? — area is the punch; it is the only property that survives the narrowing limit." "What is δ's role in convolution? — the identity: x∗δ = x." "Relation to u? — its running integral is u; du/dt = δ in the distributional sense." And the teaser that opens Module 2: one kick excites every frequency equally — δ's spectrum is flat.

## @history

Engineers used the impulse decades before mathematics allowed it: Heaviside's operational calculus (1890s) freely differentiated steps, and Paul Dirac put δ to systematic work in quantum mechanics (1930), naming it a "convenient notation" while knowing it was no function. Mathematicians objected — correctly — until Laurent Schwartz built distribution theory (1945), defining objects precisely by their action on test functions, which earned him the Fields Medal in 1950. The lesson taught to every generation since: the physicists' "illegal" object was fine; the *definition* of "object" was too small.

## @summary

$$\int_{-\infty}^{\infty} x(t)\,\delta(t-t_0)\,dt = x(t_0) \qquad \delta(at-b) = \frac{1}{|a|}\,\delta\!\left(t - \frac{b}{a}\right) \qquad x(t)\,\delta(t-t_0) = x(t_0)\,\delta(t-t_0)$$

- **Definition = sifting.** δ has no value at 0; every true statement lives under an integral. Unit area: $\int\delta = 1$; even: $\delta(-t)=\delta(t)$.
- **Limit families:** any pulse family with **area pinned at 1** and width → 0 works — rect, triangle, Gaussian alike. Area ≠ 1 rescales the limit; unbounded area gives no limit.
- **Ladder:** $u(t) = \int_{-\infty}^{t}\delta$; $\;du/dt = \delta$ *in the distributional sense*. Full chain $r \to u \to \delta$ under $d/dt$.
- **Sifting ritual:** normalize $\delta(at-b)$ (never forget $1/|a|$) → check location against limits (outside ⇒ 0) → evaluate integrand at $b/a$.
- **Sketching:** impulse = arrow at its location, labeled with its **weight (area)**; jumps differentiate into weighted impulses.
- **Never write:** $\delta(0)=\infty$ as a definition, or products of coincident impulses.
