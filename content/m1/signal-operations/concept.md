---
id: m1/signal-operations
title: "Time operations: the x(at − b) machine"
short: Signal operations
module: 1
tier: core
outcomes: [CO1]
prereqs: [m1/elementary-signals]
aliases: ["time shifting", "time scaling", "time reversal", "transformation of the independent variable"]
exam: { minor1: high, major: medium, marks: "4–8", styles: [sketch, compute] }
crosslinks:
  - { target: m2/ft-properties, relation: "each time operation becomes a clean spectral operation — shift ↔ phase ramp, scale ↔ reciprocal stretch" }
  - { target: m1/convolution, relation: "reading h(t−τ) correctly is this skill applied inside the convolution integral" }
---

## @intuition

A tape deck can play a recording later (shift), faster (scale), or backwards (reversal). Each is trivial alone. The catastrophe — and a guaranteed exam question — is the *combination*: what exactly is $x(2t - 6)$? Played twice as fast then moved where? The order in which you apply the operations changes the intermediate pictures, and one popular order gives the wrong final answer.

---
@viz transformer {"signal":"flag","a":1,"b":1.5}
Start with shift only: $y(t) = x(t - 1.5)$. Everything slides **right** by 1.5 — minus in the argument means *later*, because the machine needs a bigger $t$ to feed the old argument values. The asymmetric flag makes the direction unmistakable. Now the reliable method appears in the readout: **track one feature**. The notch sat where the argument equals $t_0$; it lands where $at - b = t_0$.

---
@viz transformer {"signal":"flag","a":3,"b":6}
Now the full $x(3t - 6)$. Guessing "compress by 3, shift by 6" puts the flag in the wrong place. Solve instead: a feature at $t_0$ lands at $t = (t_0 + b)/a = (t_0 + 6)/3$ — the original notch at $0.6$ lands at $2.2$, not at $-5.4$ or $6.6$. Algebra on the argument beats every mnemonic. If you must sequence the operations: **shift by $b$ first, then scale by $a$** (reading $x(at-b)$ outside-in), or scale first and shift by $b/a$ — both land identically; mixing them up does not.

---
Reversal is just $a < 0$: flip about $t = 0$ *first*, then everything else. $x(-t - 1)$ vs $x(-t + 1)$: track the feature — $-t - 1 = t_0 \Rightarrow t = -(t_0 + 1)$. The flag flips and its landmarks mirror; the machine's negative-$a$ range lets you feel how flip-then-shift composes without memorizing anything.

## @definition

For $y(t) = x(at - b)$, $a \neq 0$:
- $|a| > 1$: **compression** by factor $|a|$ (plays faster); $|a| < 1$: **expansion**. $a < 0$: time **reversal** plus scaling.
- The shift is $b/a$ in final-position terms: a feature at $t_0$ lands at $t = (t_0 + b)/a$.
- Legal orders: shift by $b$ → scale by $a$; or scale by $a$ → shift by $b/a$. (Illegal: scale by $a$ → shift by $b$.)
- Amplitude operations act on the output: $A\,x(\cdot) + C$ scales and offsets vertically — they commute with all time operations and never confuse anyone; the argument is where the danger lives.

**Reading the symbols:** everything inside the parentheses transforms the *time axis*; the graph moves opposite to naive reading ($-b$ moves right, $a>1$ squeezes).

## @derivation

### Step: Why "minus b shifts right"
?why: The machine y(t) = x(t−b) reproduces x's value from b seconds AGO — old content appears later.
$y(b + s) = x(s)$: whatever $x$ did at time $s$, $y$ does at time $b + s$. The whole history replays $b$ late — rightward on the axis.

### Step: The feature-tracking identity
?why: A landmark is defined by its argument value; set the new argument equal to it.
The landmark of $x$ at $t_0$ appears in $y(t) = x(at-b)$ wherever $at - b = t_0$, i.e. $t = (t_0 + b)/a$. One equation, zero mnemonics, immune to ordering confusion. Endpoints of supports are landmarks too: a signal on $[t_1, t_2]$ maps to $[(t_1+b)/a,\,(t_2+b)/a]$ (endpoints swap if $a < 0$).

### Step: Why one operation order fails
?why: Scaling acts about the origin, so a shift performed before scaling gets scaled too.
Scale-then-shift-by-$b$ produces $x(a(t - b)) = x(at - ab)$ — the shift got multiplied by $a$. Compare $x(at - b)$: to land correctly after scaling, shift by $b/a$ instead. The two expressions $x(a(t-b))$ and $x(at-b)$ are DIFFERENT signals; exams print both to see who notices.

## @examples

**Worked (exam sketch):** $x(t)$ is a triangle on $[0, 2]$ peaking at $t=1$. Sketch $y(t) = x(2t - 4)$ (endpoints: $t = (0+4)/2 = 2$ and $(2+4)/2 = 3$; peak at $(1+4)/2 = 2.5$). Result: triangle on $[2,3]$, half as wide, same height — amplitude never changes under time operations.

**Worked (reversal):** same $x$, sketch $y = x(-t + 1) = x(-(t-1))$. Endpoints: $-t + 1 = 0 \Rightarrow t = 1$; $-t+1 = 2 \Rightarrow t = -1$. Triangle now on $[-1, 1]$, mirrored, peak at $t = 0$.

**Worked (with amplitude):** $y = -2x(3 - t) + 1$: time part is reversal about $t=3$-ish (track: $3 - t = t_0 \Rightarrow t = 3 - t_0$), then flip vertically ×2 and raise by 1. Time ops from the argument, amplitude ops applied last, sketch in two passes.

## @misconceptions
- wrong: "x(2t − 6) is x compressed by 2 then shifted right by 6."
  tempting: "Read the operations left to right as written."
  correction: "After compressing, the shift is 6/2 = 3 (or shift by 6 FIRST, then compress). Feature check: x's point at 0 lands at t = 3, not 6. Always solve at − b = t₀."
- wrong: "x(a(t−b)) and x(at−b) are the same thing."
  tempting: "Both contain an a and a b."
  correction: "x(a(t−b)) = x(at − ab): the shift is b in one and b/a in the other. Exams juxtapose them precisely to catch this."
- wrong: "Compression makes the signal taller (conservation of area)."
  tempting: "Squeezing should pile the signal up."
  correction: "Time scaling of the ARGUMENT changes width only; amplitude is untouched (area does change!). Only the impulse renormalizes: δ(at) = δ(t)/|a| — because δ is defined by its integral, not its height. That exception is a Module-1 favorite."

## @exam

Guaranteed sketching marks in Minor I (4–8): given a piecewise sketch, draw $x(at-b)$ variants, often with $a<0$ and an amplitude flip stacked on. Full-marks ritual: (1) list landmark times of $x$ (endpoints, peaks, jumps); (2) map each through $t = (t_0+b)/a$; (3) plot mapped landmarks, connect with the (possibly mirrored) shapes; (4) apply amplitude operations last; (5) label axes with exact numbers. Traps: the $x(a(t-b))$ vs $x(at-b)$ pair, reversed endpoint order when $a<0$, and $\delta(at) = \delta(t)/|a|$ hiding in a later part.

## @summary

- $y(t) = x(at-b)$: feature at $t_0$ lands at $t = (t_0+b)/a$ — solve the argument, skip the mnemonics.
- Legal orders: shift $b$ then scale $a$; or scale $a$ then shift $b/a$. $x(a(t-b)) = x(at-ab) \ne x(at-b)$ in general.
- $a<0$: mirror first. Amplitude ops ($A(\cdot)+C$) act last, commute freely, never change timing.
- Time ops change width/position only — amplitude untouched; exception $\delta(at) = \delta(t)/|a|$.
- Support $[t_1,t_2] \to [(t_1+b)/a, (t_2+b)/a]$ (endpoints swap if $a<0$).
