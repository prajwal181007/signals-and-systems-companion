---
id: m5/stability-margins
title: "Gain and phase margins: distances to disaster"
short: Stability margins
module: 5
tier: core
outcomes: [CO5]
prereqs: [m5/bode-plots, m4/feedback]
aliases: ["gain margin", "phase margin", "GM", "PM", "crossover frequency", "bode stability"]
exam: { major: high, marks: "6–10", styles: [compute, sketch] }
crosslinks:
  - { target: m5/nyquist, relation: "the margins re-appear as distances from the −1 point" }
  - { target: m4/feedback, relation: "why margins exist: feedback loops ring, then break, as gain and lag accumulate" }
---

## @intuition

A feedback loop breaks into oscillation when the signal returning around the loop comes back *in phase* with itself *at full strength* — a self-sustaining echo: loop gain 1 at phase −180° (the loop's minus sign supplies the other 180°). Stability margins measure **how far your loop sits from that cliff, in the two currencies that push it over**: extra gain (component drift, temperature, a bolder tuning) and extra phase lag (delays, unmodeled poles). They are not abstract indices — they are *safety stock*, in dB and degrees.

---
@viz margins {"preset":"resonant"}
The two measurements, on the Bode axes you can now sketch: find the **gain crossover** $\omega_{gc}$ (where $|L| = 0$ dB) — the **phase margin** is how far the phase there sits above −180°: $\mathrm{PM} = 180° + \angle L(j\omega_{gc})$. Find the **phase crossover** $\omega_{pc}$ (where $\angle L = -180°$) — the **gain margin** is how many dB below 0 the magnitude sits there: $\mathrm{GM} = -|L(j\omega_{pc})|_{dB}$. Crank the K slider and watch both margins spend themselves; at PM → 0 the closed-loop step response rings *without decay*, and the ring's frequency is the crossover — margins made kinetic.

---
The margins also *predict* behavior short of disaster: PM ≈ 45–60° gives well-damped responses; PM ≈ 20° is already ringing hard (rule of thumb: $\zeta \approx \mathrm{PM}/100$ for the dominant pair); GM ≥ 6 dB tolerates a doubled gain. And the slope heuristic ties it back to sketching: crossing 0 dB at **−20 dB/dec** keeps phase near −90°-ish (healthy PM); crossing at **−40 dB/dec** means phase near −180° — asking for trouble. Loop-shaping is the art of arranging the crossover to happen on a −20 segment.

---
One honest caveat, previewing Nyquist: Bode-margin reading assumes the "typical" case (open-loop stable, magnitude crossing 0 dB once). Open-loop *unstable* plants and multi-crossing loops need the full Nyquist criterion — margins are the everyday tool; Nyquist is the court of final appeal.

## @definition

For loop transfer function $L(s) = KG(s)H(s)$ (the product around the loop):

- **Gain crossover $\omega_{gc}$:** $|L(j\omega_{gc})| = 1$ (0 dB). **Phase margin:** $\mathrm{PM} = 180° + \angle L(j\omega_{gc})$.
- **Phase crossover $\omega_{pc}$:** $\angle L(j\omega_{pc}) = -180°$. **Gain margin:** $\mathrm{GM}_{dB} = -20\log|L(j\omega_{pc})|$ — the dB of extra gain that lands the loop on the cliff (as a factor: $1/|L(j\omega_{pc})|$).
- Stable (typical case) ⇔ both margins positive. PM < 0 or GM < 0: closed loop unstable.
- Design norms: PM 45–60°, GM 6–12 dB; $\zeta \approx \mathrm{PM}/100$ (PM in degrees, dominant-pair approximation); closed-loop ring frequency ≈ $\omega_{gc}$.
- If $\angle L$ never reaches −180° (e.g. first/second-order minimum-phase loops): $\mathrm{GM} = \infty$ — say so, don't invent a number.

## @derivation

### Step: Why −180° at unity gain is the cliff
?why: Negative feedback's own inversion plus −180° of lag closes a positive-feedback echo at unity strength.
The loop feeds $-L$ back; if $L = 1\angle{-180°}$, the return signal is $+1\times$ the original: any disturbance at that frequency reinforces itself exactly — a sustained oscillation (1 + L = 0 is the closed-loop pole condition landing ON the axis). Margins measure distance to $L = -1$ in gain (at the phase condition) and phase (at the gain condition).

### Step: Reading both margins off given plots (the exam mechanics)
?why: Each margin is one vertical measurement at one landmark frequency.
On the magnitude plot: find 0 dB crossing → drop to the phase plot at that ω → PM = distance above −180°. On the phase plot: find −180° crossing → rise to the magnitude plot → GM = distance below 0 dB. Two landmarks, two vertical rulers. With asymptotic sketches, slope arithmetic locates both landmarks without a calculator — the previous concept's skill, cashed in.

### Step: Why K trades directly against both margins
?why: Gain multiplies |L| — a pure vertical shift in dB — leaving phase untouched.
$K \times 2$ = +6 dB across the board: the magnitude curve rises, $\omega_{gc}$ slides right (into worse phase — PM falls), and the headroom at $\omega_{pc}$ shrinks by exactly 6 dB (GM falls dB-for-dB). One knob, both margins, predictable arithmetic: "how much can K grow before instability?" *is* the GM.

## @examples

**Worked (numeric read, exam staple):** a plot shows $|L| = 0$ dB at $\omega = 2$ where $\angle L = -155°$, and $\angle L = -180°$ at $\omega = 6$ where $|L| = -10$ dB. PM $= 180 - 155 = \mathbf{25°}$ (thin — expect ringing at ≈ 2 rad/s); GM $= \mathbf{10}$ dB (gain can grow ×3.16 before oscillation). Both statements, with their frequencies, are the full answer.

**Worked (how much K?):** loop currently has GM = 10 dB. Doubling K costs 6 dB → GM = 4 dB, still stable but fragile; K × 3.16 lands exactly on the cliff (sustained oscillation at $\omega_{pc}$ = 6). "Find the K for marginal stability" = "spend the GM" — one subtraction.

**Worked (slope heuristic in design):** a loop crossing 0 dB at −40 dB/dec has phase ≈ −180° there ⇒ PM ≈ 0. Fix: add a zero (lead compensator) below crossover to flatten the slope to −20 and buy back phase. This one heuristic is 80% of classical loop-shaping.

## @misconceptions
- wrong: "Margins are properties of the closed loop."
  tempting: "They predict closed-loop behavior, so they must be measured on it."
  correction: "Both margins are read from the OPEN-loop L(jω) — that is their magic: you certify the closed loop before ever closing it (and the lab can measure L safely). Closing the loop is the exam's step two, not step one."
- wrong: "GM and PM are redundant — one number should do."
  tempting: "Both measure 'distance to instability'."
  correction: "They guard against DIFFERENT drifts: GM against gain growth (component tolerances), PM against added lag (delays, parasitic poles). A loop can have generous GM and razor-thin PM (resonant plants often do) — quote both, always."
- wrong: "PM = 0 means the output explodes."
  tempting: "Zero margin sounds like divergence."
  correction: "PM = 0 is MARGINAL: sustained, constant-amplitude oscillation at ω_gc (poles ON the axis). Negative margin is divergence. The distinction — ring vs runaway — is a favorite one-mark discriminator."
- wrong: "Bode margins settle stability for every system."
  tempting: "The rules worked on every textbook loop so far."
  correction: "The simple readings assume open-loop-stable, single-crossing loops. Open-loop UNSTABLE plants (P ≠ 0) need Nyquist's encirclement count — Bode margins can even mislead there. Next concept exists precisely for that court of appeal."

## @exam

6–10 marks, two reliable forms: (a) read GM and PM off given (or just-sketched) Bode plots — show both landmark frequencies and both vertical measurements; (b) "find K for marginal stability / for PM = 45°" — spend the margins with dB arithmetic. Also: the ζ ≈ PM/100 estimate, the ring-at-crossover prediction, GM = ∞ recognition. Traps: reading PM at the phase crossover (swapped landmarks); reporting GM as a factor when dB were asked (or vice versa); "PM = 0 ⇒ explosion"; inventing a finite GM when phase never reaches −180°.

## @summary

- **PM** $= 180° + \angle L$ at $|L| = 0$ dB;  **GM** $= -|L|_{dB}$ at $\angle L = -180°$. Both from the OPEN loop; both positive ⇒ stable (typical case).
- Cliff: $L = 1\angle-180°$ (i.e. $L = -1$): self-sustaining echo; PM = 0 ⇒ constant ring AT $\omega_{gc}$; negative ⇒ runaway.
- $K\times2$ = +6 dB: GM drops 6 dB, $\omega_{gc}$ slides right, PM falls. "Max K" = spend the GM.
- Health: PM 45–60°, GM 6–12 dB, $\zeta \approx$ PM/100; cross 0 dB on a −20 dB/dec segment (−40 = trouble).
- Open-loop unstable or multi-crossing ⇒ Bode readings insufficient — Nyquist decides.
