---
id: m4/interconnections
title: "Interconnections: wiring blocks into systems — and reading the composite at sight"
short: Interconnections
module: 4
tier: core
hero: false
outcomes: [CO4]
prereqs: [m3/transfer-function]
aliases: ["cascade", "series connection", "parallel connection", "feedback connection", "feed-forward", "feedforward", "block diagram", "block diagram reduction", "closed loop", "loop gain", "pole-zero cancellation", "internal stability", "disturbance cancellation"]
exam: { minor2: high, major: high, marks: "4–8", styles: [compute, sketch, conceptual] }
crosslinks:
  - { target: m3/transfer-function, relation: "ZPK is the vocabulary; interconnection is the grammar for combining ZPK descriptions" }
  - { target: m1/convolution, relation: "cascade in the s-domain is h₁∗h₂ in time; the order-swap freedom is commutativity" }
  - { target: m4/feedback, relation: "the loop pattern relocates poles — powerful enough to earn its own concept next" }
  - { target: m5/bode-plots, relation: "cascade gains multiply, so on log axes Bode magnitudes simply add" }
---

## @intuition

No one designs a fortieth-order system from scratch. An audio rig is a chain: microphone, preamp, equalizer, compressor, power amp. A chemical plant splits flows and merges them. A cruise controller watches its own output and corrects. Engineering's real superpower is **composition**: build small blocks you trust, wire them together, and predict the whole from the parts. This concept is the wiring manual — three patterns (chain, split-and-add, loop) plus one clever hybrid, and the rules for reading the combined system's personality at sight.

---
@viz sandbox {"topology":"cascade"}
**Cascade** — the output of one block feeds the next. Each block stamps its own poles and zeros onto the signal, so the composite collects them all: pole lists merge, zero lists merge, gains multiply. Stranger: for LTI blocks the *order doesn't matter* — filter then amplify equals amplify then filter. Swap the blocks in the sandbox and watch the composite response refuse to change. That freedom is a theorem, not a coincidence — and it dies the moment any block is nonlinear.

---
@viz sandbox {"topology":"parallel"}
**Parallel** — the signal splits, travels two roads, and the arrivals add. Poles again pool from both branches. But watch the map: a **new zero** appears at a location neither branch owns. At that complex frequency the two arrivals are equal and opposite — they interfere and cancel, like noise-cancelling headphones built out of pure wiring. Parallel connection is a *zero factory*: this is where engineers go when they need a zero at a specific address.

---
@viz sandbox {"topology":"feedback"}
**Feedback** — the output is measured, compared with the command, and the *difference* drives the system. This wiring does something cascade and parallel cannot: the composite's poles sit at brand-new locations, in neither block's list. The loop rewrites the denominator itself. That is either a superpower or a hazard — it earns its own concept next. Here we derive the famous formula and learn to apply it without sign accidents.

---
@viz sandbox {"topology":"feedforward"}
**Feed-forward** — measure a disturbance on its way in and inject an equal-and-opposite correction *before* it reaches the output. No waiting for an error to appear; the fix is preemptive. The syllabus names this pattern for a reason: it is how a furnace pre-compensates for a cold snap and how consoles cancel hum. Its algebra is parallel-path algebra — which means it, too, is a zero-placement tool.

---
@viz sandbox {"topology":"cancelhazard"}
One last exhibit — the sandbox's crime scene. Cascade an *unstable* block with a compensator whose zero sits exactly on the bad pole. On paper the factors cancel and the input–output response looks innocent. But probe the signal *between* the blocks: it grows without bound. Algebra deleted the pole from the ratio; physics kept the mode. Keep this exhibit in mind every time a cancellation looks tempting.

## @definition

Let block $i$ have transfer function $H_i(s) = N_i(s)/D_i(s)$ in polynomial form, or $K_i \prod(s-z)/\prod(s-p)$ in ZPK form. The three wiring patterns:

**Cascade (series).** Output of $H_1$ drives $H_2$:
$$H(s) = H_1(s)\,H_2(s) \qquad\Leftrightarrow\qquad h(t) = h_1(t) * h_2(t)$$
ZPK bookkeeping: **zeros = union** of both zero lists, **poles = union** of both pole lists, **gains multiply** ($K = K_1K_2$). Order is irrelevant for LTI blocks (multiplication of functions commutes).

**Parallel.** Same input to both, outputs added:
$$H(s) = H_1(s) + H_2(s) = \frac{N_1 D_2 + N_2 D_1}{D_1 D_2}$$
**Poles = union** of both pole lists (barring cancellation). **Zeros are brand new**: the roots of $N_1D_2 + N_2D_1$, where the two branch outputs interfere destructively. The branches' own zeros do *not* survive in general.

**Feedback (negative).** Forward block $G$, feedback block $H$, error $E = X - HY$ driving $G$:
$$T(s) = \frac{Y(s)}{X(s)} = \frac{G(s)}{1 + G(s)H(s)}$$
The minus sign at the summing junction becomes the **plus** in the denominator. (Positive feedback, $E = X + HY$, gives $1 - GH$.) The product $GH$ is the **loop gain** — the transfer function once around the loop.

**Feed-forward.** An extra forward path added to the diagram. Two standard uses: (a) a parallel path around a block — a zero-placement device, e.g. $K_p + K_i/s = (K_p s + K_i)/s$ manufactures a zero at $-K_i/K_p$; (b) **disturbance cancellation**: if a measured disturbance $d$ reaches the output through $G_d(s)$ and your control acts through $G(s)$, inserting a block $F(s)$ from the measurement to the control input makes the disturbance's net effect $(G_d + GF)D(s)$ — choosing $F = -G_d/G$ cancels it *exactly and instantly*, before any error exists. Requires $G_d/G$ to be stable and proper (an RHP zero in $G$ forbids it) and the model to be accurate — cancellation is only as good as your knowledge of the plant.

**Internal stability.** A diagram is internally stable only if the transfer function from *every* injection point (input, disturbance entering anywhere) to *every* internal signal is stable — not merely the one from $x$ to $y$. This is the clause that outlaws RHP pole–zero cancellation.

**Reading the symbols:** $G$, $H$ are whole systems, not numbers — every formula above is an equality of rational functions. $E$ is the error signal, the loop's lifeblood. "Union" means multiplicities add: two cascaded poles at $-3$ make a double pole.

## @derivation

### Step: Cascade multiplies — and order cannot matter
?why: Apply Y = (TF)·X twice; multiplication of rational functions commutes.
$W = H_1 X$ enters the second block: $Y = H_2 W = H_2 H_1 X = H_1 H_2 X$. In time this is $y = h_2 * (h_1 * x)$ — associativity and commutativity of convolution, inherited for free. ZPK: numerators multiply and denominators multiply, so zero lists and pole lists merge and $K = K_1 K_2$.

### Step: Parallel adds — and the sum manufactures zeros
?why: Linearity: the two branch outputs superpose; then common-denominator algebra.
$$Y = H_1X + H_2X = \left(\frac{N_1}{D_1} + \frac{N_2}{D_2}\right)X = \frac{N_1D_2 + N_2D_1}{D_1D_2}\,X$$
The denominator is the pooled pole set. The numerator is neither $N_1$ nor $N_2$ — try $\frac{1}{s+1} + \frac{1}{s+2} = \frac{2s+3}{(s+1)(s+2)}$: a zero at $-1.5$ appears though neither branch had any. And $\frac{1}{s+1} - \frac{1}{s+2} = \frac{1}{(s+1)(s+2)}$: interference can also *erase* terms. Zeros live where branches disagree perfectly.

### Step: The loop equation solves in two lines
?why: Write what each wire carries, then eliminate the internal signal E.
$$E = X - HY, \qquad Y = GE \;\Rightarrow\; Y = G(X - HY) \;\Rightarrow\; (1+GH)\,Y = GX \;\Rightarrow\; T = \frac{G}{1+GH}$$
Note the sign migration: *negative* feedback at the junction produces the *plus* in $1+GH$. The closed-loop poles are the roots of $1 + GH = 0$ — a brand-new polynomial, not a merger of old lists.

### Step: Feed-forward cancels a disturbance before feedback could react
?why: Superposition again — track the disturbance along its two routes to the output.
Disturbance path: $G_d$. Corrective path: measurement $\to F \to$ control input $\to G$. Net effect on the output:
$$Y_d = \left(G_d + G\,F\right)D(s) \;\xrightarrow{\;F = -G_d/G\;}\; 0$$
Feedback must *see an error* to act; feed-forward acts on the forecast. The price: $F$ must be realizable ($G_d/G$ proper, no RHP zeros of $G$ becoming RHP poles of $F$) and the cancellation degrades gracefully with model error — which is why real designs pair feed-forward (speed) with feedback (robustness, next concept).

### Step: The forbidden cancellation — algebra hides, physics keeps
?why: The cancelled factor vanishes from x→y, but the internal mode still exists and other inputs reach it.
Cascade compensator $C(s) = \frac{s-2}{s+3}$ with unstable plant $P(s) = \frac{1}{s-2}$:
$$\frac{Y}{X} = C\,P = \frac{s-2}{(s+3)(s-2)} = \frac{1}{s+3} \quad\text{(looks stable)}$$
Now inject a disturbance $w$ at the plant input (sensor offset, breeze, anything): $\dfrac{Y}{W} = P = \dfrac{1}{s-2}$ — unstable. The mode $e^{2t}$ was never removed; the compensator merely arranged for $x$ not to excite it. Internal stability demands *every* path be stable — this one fails.

### Step: Notice what was NOT assumed
?why: Every rule above leans on LTI + non-loading blocks; know where the fine print lives.
Linearity and time-invariance carry the whole structure: swap a clipper and an amplifier (nonlinear) and the order emphatically matters. And block algebra assumes each block does not *load* the previous one — true for diagrams by definition, made true in circuits by buffering (an op-amp follower between stages). Nothing assumed about physics: the same five rules serve circuits, mechanics, and DSP untouched.

## @examples

**Worked (exam standard): full reduction ritual.** $G_1 = \dfrac{2}{s+3}$ cascades into $G_2 = \dfrac{5(s+4)}{s+7}$, and the pair sits in a unity negative feedback loop. Find the closed-loop transfer function and assess stability.

1. *Innermost structure first — cascade:* $G = G_1G_2 = \dfrac{10(s+4)}{(s+3)(s+7)}$. ZPK read: $K=10$, zero $-4$, poles $\{-3,-7\}$.
2. *Close the loop* ($H=1$): $T = \dfrac{G}{1+G} = \dfrac{10(s+4)}{(s+3)(s+7) + 10(s+4)}$.
3. *Expand the denominator:* $s^2 + 10s + 21 + 10s + 40 = s^2 + 20s + 61$.
4. *New poles:* $s = -10 \pm \sqrt{39} \approx -3.76,\ -16.24$ — both open LHP: **stable**. Neither is $-3$ nor $-7$: the loop moved them.
5. *Zero check:* the forward-path zero $-4$ survives untouched in $T$. Feedback relocated poles, not zeros.

**Worked (zero factory): the PI controller is a feed-forward pattern.** A proportional path $K_p$ in parallel with an integrator path $K_i/s$:
$$K_p + \frac{K_i}{s} = \frac{K_p s + K_i}{s} = K_p\cdot\frac{s + K_i/K_p}{s}$$
One pole at the origin (from the integrator branch) plus a **manufactured zero at $-K_i/K_p$** — placeable anywhere on the negative real axis by choosing the ratio. Neither branch alone has a zero; the parallel sum built it. This is the single most-manufactured zero in industry.

**Worked (the hazard, with numbers): cancelling an unstable pole.** Plant $P = \frac{1}{s-2}$, compensator $C = \frac{s-2}{s+3}$, cascade $C$ then $P$. On paper $Y/X = \frac{1}{s+3}$: a step command produces a tidy settled output. Now let a disturbance step of size just $0.01$ enter at the plant input:
$$Y_w(s) = \frac{0.01}{s(s-2)} \;\Rightarrow\; y_w(t) = 0.005\,(e^{2t}-1)$$
At $t = 5$ s: $y_w \approx 0.005 \times 22{,}000 \approx 110$ — a hundred-fold blow-up from a one-percent nudge, while the $x\to y$ math still claims all is well. Run the sandbox's cancellation preset and watch the internal trace ignite. *Rule: never cancel a pole in the closed right half plane; state any LHP cancellation explicitly and keep it out of the RHP.*

## @misconceptions
- wrong: "In a parallel connection, the zeros of the combination are the union of the branch zeros, just like the poles."
  tempting: "Poles pool by union, and symmetry suggests zeros do the same."
  correction: "Poles union because denominators multiply; zeros come from the SUM N₁D₂ + N₂D₁, which is a brand-new polynomial. 1/(s+1) ∥ 1/(s+2) has a zero at −1.5 that neither branch owns. Parallel zeros are born from interference, not inherited."
  probe: q-parallel-zero
- wrong: "An unstable pole can be fixed by cascading a block with a zero at the same spot — the factors cancel."
  tempting: "The algebra genuinely does cancel, and the resulting x→y transfer function is genuinely stable."
  correction: "Only the map from x to y is sanitized. The unstable mode still exists physically; any disturbance or initial condition entering after the cancelling zero excites e^{at} unchecked. Internal stability requires EVERY input-to-signal path stable — the disturbance path here is 1/(s−2)."
  probe: q-cancel
- wrong: "Negative feedback means a minus sign in the denominator: T = G/(1 − GH)."
  tempting: "The junction literally subtracts, so a minus 'should' appear somewhere in the answer."
  correction: "Trace the algebra: E = X − HY leads to (1 + GH)Y = GX. The junction's minus becomes the denominator's PLUS. The minus-denominator formula belongs to positive feedback — using it on an exam flips a stable answer into an unstable one."
  probe: q-feedback-sign
- wrong: "Swapping the order of two blocks in a chain never changes anything."
  tempting: "It was just proven for the cascade of transfer functions."
  correction: "The proof used linearity. A soft clipper followed by a ×10 amplifier distorts gently then amplifies; the reverse order slams into hard clipping — audibly different. Order-freedom is an LTI privilege, and it is also why the cancellation hazard cares which block sits first: the internal signal differs even when x→y does not."

## @exam

**Where it appears:** Minor II and the Major, 4–8 marks, usually as the opening act of a feedback question: (a) reduce a two- or three-block diagram to one $T(s)$; (b) give poles/zeros/gain of a cascade or parallel combination; (c) spot-the-flaw questions on pole-zero cancellation; (d) write the closed-loop TF with correct sign.

**The method that earns full marks:** (1) label every internal signal on the diagram ($E$, $W$, …); (2) reduce innermost structures first — cascade: multiply (merge ZPK lists, multiply gains); parallel: add over the common denominator and *expand the numerator* to expose new zeros; feedback: $G/(1+GH)$ quoting the sign convention; (3) expand the final denominator and factor or quote the quadratic roots; (4) if any pole-zero cancellation occurs, state it explicitly and note whether the cancelled pole is LHP (acceptable, mention it) or RHP (forbidden — declare internal instability); (5) finish with the pole list and a one-line stability verdict.

**Traps that cost marks:** writing $1-GH$ for negative feedback; adding parallel branches by adding denominators ("$\frac{1}{s+1}+\frac{1}{s+2} = \frac{2}{2s+3}$" — nonsense); forgetting to multiply gains in cascade ZPK form; cancelling $(s-2)$ factors silently and claiming stability; treating the feedback block $H$ as if it were in the forward path (numerator is $G$ alone, never $GH$).

## @interview

Interviewers probe whether you see diagrams as algebra. Own these: "Cascade multiplies, parallel adds, feedback divides — and only feedback creates poles at genuinely new locations." "Where do parallel zeros come from? — frequencies where the branches interfere and cancel; zeros are born, not inherited." "Why is RHP pole-zero cancellation forbidden? — you can cancel it from the ratio but not from the physics; the disturbance path still contains the unstable mode." "What is feed-forward good for? — cancelling measurable disturbances before an error exists; feedback then mops up what the model got wrong."

## @summary

$$\text{Cascade: } H_1H_2 \quad\bullet\quad \text{Parallel: } H_1 + H_2 = \frac{N_1D_2+N_2D_1}{D_1D_2} \quad\bullet\quad \text{Feedback: } \frac{G}{1+GH}$$

- **Cascade:** zeros ∪ zeros, poles ∪ poles, gains multiply; $h = h_1 * h_2$; order irrelevant (LTI only).
- **Parallel:** poles ∪ poles; **zeros are NEW** — roots of $N_1D_2 + N_2D_1$ (interference). $K_p + K_i/s$ ⇒ zero at $-K_i/K_p$.
- **Feedback (negative):** $T = G/(1+GH)$; junction minus ⇒ denominator plus; closed-loop poles = roots of $1+GH=0$ (brand new).
- **Feed-forward:** disturbance through $G_d$, control through $G$ ⇒ $F = -G_d/G$ cancels preemptively; needs invertible-$G$ and a good model.
- **Cancellation hazard:** RHP pole–zero cancellation sanitizes only $x\to y$; disturbance paths keep the unstable mode. Internal stability = ALL paths stable.
- **Exam ritual:** label signals → reduce innermost first → expand numerator (parallel) and denominator (feedback) → declare cancellations → pole list + verdict.
