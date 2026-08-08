---
id: m4/feedback
title: "Feedback: the wiring pattern that moves poles — engineering's best trade ever"
short: Feedback
module: 4
tier: core
hero: true
outcomes: [CO4]
prereqs: [m4/interconnections]
aliases: ["closed loop", "negative feedback", "loop gain", "sensitivity", "steady-state error", "gain K", "closed-loop poles", "unity feedback", "error signal", "tracking", "root locus", "error constants", "Kp Kv", "double integrator", "non-minimum phase"]
exam: { minor2: high, major: high, marks: "8–12", styles: [compute, sketch, conceptual, derive] }
crosslinks:
  - { target: m4/interconnections, relation: "the loop formula G/(1+GH) comes from there; here we ask what closing the loop DOES" }
  - { target: m3/transfer-function, relation: "everything here is pole geography — ζ, ωn, and LHP verdicts read straight off the map" }
  - { target: m3/ivt-fvt, relation: "steady-state error rides on the FVT, which is legal only after a stability check" }
  - { target: m5/stability-margins, relation: "HOW MUCH gain is safe becomes GM/PM read off the Bode plot" }
  - { target: m5/nyquist, relation: "when the characteristic polynomial won't factor by hand, Nyquist counts encirclements instead" }
---

## @intuition

Balance a broomstick upright on your palm. Eyes shut, it falls in under a second — an unstable system, and no pre-planned hand motion can save it. Eyes open, you can keep it up all day. The broom never changed; the *wiring* did: eyes measure, brain compares, hand corrects, continuously. That loop is **feedback**, and this concept is about the astonishing thing it does that no clever chain of filters can do: it moves a system's poles — the one property that seemed fixed by physics.

---
@viz explorer {"plant":"motor"}
Interconnections handed us the formula: close a loop and the denominator becomes one-plus-loop-gain. New denominator, new roots — the closed-loop poles live where *you* put them, steered by a single gain knob $K$. Sweep $K$ above and watch the poles leave their open-loop homes and travel across the map (the trails), dragging the step response's personality along: sluggish, brisk, ringing. Control engineering in one sentence: choose $K$ — and later, extra blocks — so the poles land where you want them.

---
Why loop back at all, if a cascade corrector could reshape the response? Because everything you build is approximate: amplifier gains drift with temperature, motors age, loads change. A chain multiplies its errors. A loop *forgives* them: perturb the plant by ten percent and the closed-loop behavior barely flinches, because the loop measures the actual output and automatically leans against whatever changed. Feedback trades raw gain for certainty. That trade built the transcontinental telephone network.

---
@viz explorer {"plant":"double"}
Now the surprises. Take a double integrator — a satellite spinning in frictionless space, thruster torque in, pointing angle out. Close the loop and sweep $K$: the poles slide along the imaginary axis and *never leave it*. More gain buys a faster wobble, never damping — the step response rings forever at every single $K$. Gain alone cannot damp this plant. You will need to add a zero (a dash of derivative action) to bend the pole paths into the left half plane.

---
@viz explorer {"plant":"rhpzero"}
Crueler still: a plant with a right-half-plane zero. The rule you are about to derive says closed-loop poles migrate *toward the open-loop zeros* as gain rises. If a zero sits in the right half plane, ambition itself becomes the trap: crank $K$ and the poles march obediently toward it — straight across the axis into instability. Some plants punish enthusiasm. Knowing which ones, and why, is the difference between tuning and gambling.

## @definition

**The standard loop.** Forward path $G(s)$ (often written $K\,G(s)$ with an adjustable gain), feedback path $H(s)$ (a sensor; $H=1$ is **unity feedback**), error $E = X - HY$ driving the forward path:

$$T(s) = \frac{Y(s)}{X(s)} = \frac{G(s)}{1+G(s)H(s)}, \qquad E(s) = \frac{X(s)}{1+G(s)H(s)}$$

**Characteristic equation.** The closed-loop poles are the roots of
$$1 + G(s)H(s) = 0 \qquad\text{i.e.}\qquad D(s) + K\,N(s) = 0 \;\text{ when } GH = K\tfrac{N(s)}{D(s)}$$
This is the central object: every stability and pole-placement question is a question about this polynomial and how its roots move with $K$.

**Who moves, who stays.** Feedback relocates **poles**. With unity feedback the zeros of $T$ are exactly the zeros of $G$ — forward-path zeros survive untouched (in general, zeros of $T$ = zeros of $G$ together with poles of $H$).

**Sensitivity.** The fractional change of the closed-loop gain per fractional change of the plant:
$$S \;=\; \frac{dT/T}{dG/G} \;=\; \frac{1}{1+GH}$$
Large loop gain ⇒ tiny sensitivity: a ±10 % plant wobble shows up as ±10 %/(1+GH) at the output.

**Steady-state error (unity feedback), via the FVT.** For a stable closed loop,
$$e_{ss} = \lim_{s\to 0} s\,E(s) = \lim_{s\to0}\frac{s\,X(s)}{1+G(s)}$$
Error constants: $K_p = \lim_{s\to0} G(s)$, $K_v = \lim_{s\to0} sG(s)$. Step input: $e_{ss} = \frac{1}{1+K_p}$; ramp input: $e_{ss} = \frac{1}{K_v}$. A plant with no integrator (type 0) has finite $K_p$: a step is tracked with a permanent offset. One integrator (type 1): $K_p = \infty$, zero step error, finite ramp error $1/K_v$. **Legality clause (non-negotiable):** the FVT applies only when all poles of $sE(s)$ lie in the open LHP — i.e. *check closed-loop stability first*; on an unstable loop the formula returns a finite lie while the true error diverges.

**Reading the symbols:** $E$ is what the controller actually sees — the loop lives to shrink it. $GH$ is the *loop gain*: open the loop anywhere, go once around. $K$ is the designer's knob; every claim of the form "as $K$ increases…" is a statement about the roots of $D + KN$.

## @derivation

### Step: Close the loop and meet the characteristic equation
?why: The loop algebra from m4/interconnections, with the denominator promoted to the star of the show.
$E = X - HY$ and $Y = GE$ give $T = \dfrac{G}{1+GH}$. Write $GH = K\dfrac{N(s)}{D(s)}$ (numerator, denominator, explicit gain). Then the closed-loop poles solve
$$1 + K\frac{N(s)}{D(s)} = 0 \;\;\Longleftrightarrow\;\; D(s) + K\,N(s) = 0$$
One polynomial, with $K$ woven through it. Everything below is reading this equation.

### Step: The endpoints of every pole journey
?why: Take the two limits of D + KN = 0 — the polynomial itself says where journeys begin and end.
As $K \to 0$: the equation tends to $D(s) = 0$ — closed-loop poles start at the **open-loop poles**. As $K \to \infty$: divide by $K$ to get $N(s) + D(s)/K = 0 \to N(s) = 0$ — poles end at the **open-loop zeros** (the $n-m$ surplus poles flee to infinity). Gain drags poles from the plant's poles toward the plant's zeros, *wherever those zeros sit* — including the right half plane. You have just discovered the behavior that control courses systematize as the **root locus**; here we found it with two limits.

### Step: Differentiate T to price the plant's imperfection
?why: Sensitivity is a derivative — how loudly does T echo a small change in G?
$$\frac{dT}{dG} = \frac{(1+GH) - GH}{(1+GH)^2} = \frac{1}{(1+GH)^2}
\;\;\Rightarrow\;\;
S = \frac{dT}{dG}\cdot\frac{G}{T} = \frac{1}{(1+GH)^2}\cdot\frac{G(1+GH)}{G} = \frac{1}{1+GH}$$
A loop gain of 99 shrinks plant drift a hundred-fold. The open-loop cascade has $S=1$ — every plant error passes straight through. This derivative is the economic case for feedback.

### Step: Steady-state error by FVT — legality before arithmetic
?why: e_ss is a t→∞ question; the FVT answers it from s→0, but ONLY when sE(s) has all poles in the open LHP.
With $E = \dfrac{X}{1+G}$ (unity feedback) and a step $X = 1/s$:
$$e_{ss} = \lim_{s\to0} s\cdot\frac{1/s}{1+G(s)} = \frac{1}{1+K_p}, \qquad K_p = \lim_{s\to0}G(s)$$
A ramp $X = 1/s^2$ gives $e_{ss} = 1/K_v$ with $K_v = \lim s G(s)$. *Illegal-use counterexample:* for the RHP-zero plant of the examples at $K=4$ the closed loop is unstable, yet this formula happily outputs a finite number — the true error grows without bound. Quote pole locations first, formula second; that order is worth marks and worth hardware.

### Step: Notice what was NOT assumed
?why: The formula never promised safety — and never needed an accurate plant.
Nothing above guarantees the closed loop is stable: feedback *moves* poles, and moving them into the RHP is entirely possible (high-$K$ resonant and RHP-zero plants do exactly that). And nothing required knowing $G$ precisely — that is the point: the loop's answers are robust to the plant, which is why feedback beats the exquisitely-tuned-but-fragile feed-forward chain whenever the model is in doubt.

## @examples

**Worked (exam standard): the servo tradeoff.** Position servo, unity feedback, $G(s) = \dfrac{K}{s(s+2)}$.

1. *Closed loop:* $T = \dfrac{K}{s^2 + 2s + K}$. Characteristic equation $s^2+2s+K=0$, poles $s = -1 \pm \sqrt{1-K}$.
2. *The journey:* $K\!\to\!0$: poles at $0, -2$ (open-loop poles ✓). $K<1$: two real poles inside $(-2,0)$. $K=1$: double pole at $-1$ (critical damping). $K>1$: $-1 \pm j\sqrt{K-1}$ — a vertical line through $-1$.
3. *Read $\zeta, \omega_n$:* $\omega_n = \sqrt{K}$, $2\zeta\omega_n = 2 \Rightarrow \zeta = 1/\sqrt{K}$. At $K=4$: poles $-1\pm j\sqrt3$, $\zeta = 0.5$, $\omega_n = 2$. At $K=25$: $\zeta=0.2$ — ringing.
4. *Tracking:* type 1 ⇒ zero step error; ramp error $= 1/K_v = 2/K$ (legal: the closed loop is stable for all $K>0$). $K=4$: error $0.5$; $K=25$: error $0.08$.
5. *The tradeoff, stated:* gain buys accuracy ($2/K$ shrinks) and speed of oscillation, but damping collapses as $1/\sqrt K$ — and the real part is pinned at $-1$, so settling time never improves. Every choice of $K$ is a compromise; that tension IS control design.

**Worked (engineering skin): the amplifier that stopped drifting.** A vacuum-tube amplifier has gain $A = 1000$, wandering ±10 % with temperature. Wrap it in feedback with $\beta = 0.099$ (a resistive divider — the one component you *can* build precisely):
$$T = \frac{1000}{1+1000(0.099)} = \frac{1000}{100} = 10.00$$
Now let $A$ sag 10 % to 900: $T = \dfrac{900}{1+89.1} = 9.989$ — a **0.11 % change**. Check against theory: $S = 1/(1+A\beta) = 1/100$, and $10\% \times \frac{1}{100} = 0.1\%$ ✓. We burned a gain of 1000 down to 10 and bought a hundred-fold immunity to the plant. This exact trade is why your audio equipment sounds the same in January and July.

**Worked (the pinned surprise): double integrator.** Satellite attitude: $G = \dfrac{K}{s^2}$, unity feedback.
$$s^2 + K = 0 \;\Rightarrow\; s = \pm j\sqrt{K}$$
For *every* $K$ the poles sit exactly on the imaginary axis: a step command makes the satellite oscillate about the target forever, faster with more gain but never settling. Gain cannot damp this plant — there is no open-loop zero anywhere to attract the poles leftward. Add one: $G_c G = \dfrac{K(s+1)}{s^2}$ (proportional-plus-derivative). New characteristic equation $s^2 + Ks + K = 0$ — both coefficients positive, stable for all $K>0$; at $K=4$ it is $(s+2)^2$, critically damped. One manufactured zero converts a permanent wobble into a crisp settle.

**Worked (the cruelty): RHP zero.** $G(s) = \dfrac{K(1-s)}{(s+1)(s+2)}$ — stable open-loop poles, but a zero at $s=+1$. Characteristic equation:
$$(s+1)(s+2) + K(1-s) = s^2 + (3-K)s + (2+K) = 0$$
A quadratic is stable iff all coefficients are positive: here **iff $K < 3$**. Check the journey: $K=2$ gives $s^2+s+4$ (poles $-0.5\pm j1.94$, stable); $K=3$ gives $s^2+5$ (poles $\pm j\sqrt5$, marginal); $K=4$ gives $s^2 - s + 6$ (poles $+0.5 \pm j2.4$, **unstable**). As $K\to\infty$ one pole homes in on the zero at $+1$. More gain pulled the poles *toward* the RHP zero, exactly as the endpoint rule predicted. (Bonus cruelty: RHP-zero systems start their step response in the wrong direction — the loop is briefly deceived every time it acts.)

## @misconceptions
- wrong: "More gain always makes the closed loop faster, more accurate, and more stable."
  tempting: "In the first-order and servo examples, raising K genuinely did improve speed and tracking."
  correction: "Gain drags poles from open-loop poles TOWARD open-loop zeros. With an RHP zero the journey crosses into instability (K>3 in the worked example); with a double integrator the poles never leave the axis at any K. Gain is a direction of travel, not a virtue."
  probe: q-rhpz
- wrong: "Feedback reshapes the whole transfer function, zeros included."
  tempting: "The loop rewrote the denominator so thoroughly, surely the numerator changed too."
  correction: "Unity feedback: T = G/(1+G) has EXACTLY G's numerator — forward-path zeros pass through untouched. Feedback relocates poles only (general H adds H's poles as zeros of T). That asymmetry is why an RHP zero can't be fixed by feedback at all."
  probe: q-zeros
- wrong: "Crank K high enough and the steady-state error of any plant goes to zero."
  tempting: "e = 1/(1+Kp) keeps shrinking as K grows, so the limit looks like zero-error paradise."
  correction: "Two vetoes. Stability caps K first (the RHP-zero plant dies at K=3 with error still finite). And structurally, a type-0 plant has a permanent step offset at every finite K — zero step error requires an INTEGRATOR in the loop, not enthusiasm."
- wrong: "The open loop is stable, so the closed loop is stable too — feedback only helps."
  tempting: "Feedback was just marketed as the robustness machine; making things worse feels off-brand."
  correction: "1 + GH = 0 has brand-new roots; nothing pins them to the left half plane. A stable resonant or RHP-zero plant goes unstable at high K — and conversely feedback can STABILIZE an unstable plant (the broom). The loop rewrites fate in both directions."
  probe: q-fvt-legal

## @exam

**Where it appears:** Minor II and the Major, the marquee 8–12 mark question of module 4: (a) form $T(s)$ from a diagram (2–3 marks); (b) find the range of $K$ for stability from the characteristic polynomial (3–4 marks — for a quadratic, all coefficients positive; quote it); (c) compute $\zeta$, $\omega_n$ at a given $K$, classify damping (2–3 marks); (d) steady-state error for step and ramp via $K_p$, $K_v$ (3–4 marks).

**The method that earns full marks:** (1) write $T = G/(1+GH)$ *with the sign stated*; (2) form the characteristic polynomial $D + KN$ and expand it fully; (3) stability: for quadratics, "all coefficients positive ⇔ stable" — say it, then solve the inequality in $K$; (4) for $\zeta, \omega_n$: normalize the leading coefficient to 1 *before* matching $s^2 + 2\zeta\omega_n s + \omega_n^2$; (5) steady-state error: **state that the closed loop is stable at this K** (FVT legality), then quote $K_p$ or $K_v$ and the table formula; (6) sanity-check limits — do the poles start at open-loop poles as $K\to0$?

**Traps that cost marks:** using $1-GH$ for negative feedback; running the FVT error formula at a $K$ where the loop is unstable (an automatic zero for that part — the examiner plants this deliberately); matching $\zeta$ against $2s^2+4s+K$ without dividing by 2; quoting step-error $1/(1+K_p)$ for a type-1 system instead of just $0$ ($K_p=\infty$); forgetting that $E = X - HY$, not $X - Y$, when $H \ne 1$; claiming a marginal ($j\omega$-axis) case is "stable".

## @interview

Feedback is the interview topic where one-liners signal depth. Own these: "What does feedback actually do? — it relocates poles; the closed-loop denominator $1+GH$ has brand-new roots." "Why use it? — sensitivity $1/(1+GH)$: you trade surplus gain for immunity to the plant." "Where do poles go as gain rises? — from open-loop poles toward open-loop zeros; that's why an RHP zero is a hard limit, not an inconvenience." "Why can't gain damp a double integrator? — no zero exists to pull the poles off the axis; you must add derivative action." And the capstone: "feedback can stabilize the unstable and destabilize the stable — it is power, not safety."

## @history

In August 1927, Harold Black was riding the Lackawanna ferry to Bell Labs when the idea struck; he sketched it on his newspaper (the page is preserved). The problem was brutal: transcontinental telephony needed thousands of tube amplifiers in tandem, and their drift and distortion multiplied down the chain until speech was mush. Black's heresy — throw away a factor of a thousand in gain to buy linearity and stability — struck colleagues as perpetual-motion talk, and the patent office resisted for years. It worked. Nyquist (1932) and Bode (1940s) then explained *when* the loop sings instead of settles — theory you will meet in module 5.

## @summary

$$T = \frac{G}{1+GH} \qquad E = \frac{X}{1+GH} \qquad \text{poles: } D(s) + K\,N(s) = 0 \qquad S = \frac{1}{1+GH}$$

- **Feedback relocates poles**; forward-path zeros stay put (unity feedback: zeros of $T$ = zeros of $G$).
- **Pole journeys:** start at open-loop poles ($K\to0$), end at open-loop zeros ($K\to\infty$; surplus poles → ∞). RHP zero ⇒ high gain destabilizes.
- **Sensitivity:** plant drift is divided by $1+GH$ — the economic case for the loop.
- **Steady-state error (unity, STABLE loop only):** step $\frac{1}{1+K_p}$, ramp $\frac{1}{K_v}$; $K_p=\lim G$, $K_v = \lim sG$. Integrator in loop ⇒ zero step error.
- **FVT legality:** all poles of $sE(s)$ in open LHP — check stability BEFORE the error formula.
- **Set-piece facts:** double integrator + gain ⇒ poles pinned at $\pm j\sqrt K$ (add a zero to fix); quadratic stable ⇔ all coefficients positive.
- **Exam ritual:** $T$ with sign → characteristic polynomial → $K$-range (coefficients positive) → normalize, read $\zeta,\omega_n$ → stability check → error constants.
