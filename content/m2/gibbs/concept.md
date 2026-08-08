---
id: m2/gibbs
title: "The Gibbs phenomenon: the 9% that never dies"
short: Gibbs
module: 2
tier: core
outcomes: [CO2]
prereqs: [m2/fourier-series]
aliases: ["gibbs overshoot", "ringing", "truncation", "nonuniform convergence"]
exam: { minor1: medium, major: medium, marks: "3–6", styles: [conceptual] }
crosslinks:
  - { target: m2/bandwidth-uncertainty, relation: "hard truncation in one domain always rings in the other — the same tradeoff" }
  - { target: m4/reconstruction, relation: "the ringing around sharp edges in reconstructed/filtered signals IS Gibbs at work" }
---

## @intuition

Add more and more harmonics of a square wave, and something obstinate appears at each jump: little horns that overshoot the target by about 9%. Add ten times more terms — the horns get *narrower*, crowding the jump, but their **height refuses to shrink**. This is not numerical error, not a rendering artifact, not impatience: it is a theorem, and it has real consequences in every system that cuts off high frequencies sharply.

---
@viz gibbs-scope {"target":"square","n":40}
The magnifier is pinned to the discontinuity. Crank $N$ from 5 to 60: the ringing compresses horizontally toward the jump, but the first horn's tip keeps grazing the same dashed line — about $1.0895$ against a target of $1$ (8.95% overshoot). At any *fixed* point off the jump, convergence eventually wins; but the *worst* point (which slides ever closer to the jump) never improves. Pointwise convergence, non-uniform convergence — this picture is the difference between those two phrases.

---
Why does it happen? Truncating the series at $N$ terms is the same as convolving the signal with a sinc-shaped kernel whose ripples have *fixed relative size*. Sliding that rippled kernel across a jump traces out the overshoot; more terms shrink the kernel's width but not its ripple *proportions*. Sharp truncation in frequency ⇒ ringing in time — a shape of tradeoff you will meet again at ideal filters and reconstruction.

---
Engineering face: any system that brick-walls the spectrum — an "ideal" low-pass filter, an image compressor discarding high frequencies, a bandwidth-limited scope — rings at sharp edges. The fix is never "more terms"; it is *gentler truncation*: taper the coefficients (windowing) and the horns melt at the cost of a slightly softer edge. Sharpness or calm — pick one.

## @definition

For a periodic signal with a jump of height $\Delta$ at $t_j$, the $N$-term partial sums $S_N$ satisfy:
- At every continuity point, $S_N \to x$ (pointwise convergence ✓).
- At $t_j$ itself, $S_N \to$ midpoint of the jump.
- The **maximum overshoot** near $t_j$ approaches $\approx 0.0895\,\Delta$ (about 9% of the jump height) as $N \to \infty$ — it narrows toward $t_j$ but never lowers.
- Consequence: convergence is **non-uniform** near discontinuities; $\max_t |S_N - x|$ does not go to zero.

The overshoot constant comes from $\frac{1}{\pi}\int_0^\pi \frac{\sin u}{u}du - \frac12 \approx 0.0895$ — a fixed number of mathematics, not of any particular signal.

## @derivation

### Step: Truncation is convolution with a rippled kernel
?why: Keeping |k| ≤ N multiplies the coefficients by a boxcar; multiplying coefficients is convolving in time.
$S_N = x * D_N$ where $D_N$ (the Dirichlet kernel) is the time-shape of the coefficient boxcar — a periodic sinc: tall main lobe, oscillating side lobes with fixed *relative* amplitudes.

### Step: Slide the kernel across a jump
?why: The running integral of a rippled kernel overshoots when the ripples cross the edge.
Near the jump, $S_N(t)$ ≈ the accumulated area of $D_N$ up to $t$. Accumulating past the main lobe swallows the first side lobe too — overshoot; the next lobe undershoots; hence the ringing train. The kernel narrows as $N$ grows (horns crowd in) but its lobe-area *ratios* are $N$-independent (height frozen).

### Step: Why tapering (windowing) cures it
?why: A smooth taper of coefficients has a kernel with tiny side lobes — nothing to swallow.
Replacing the boxcar with a gradual fade (triangular/Hann weighting) trades a slightly wider main lobe (softer edges) for side lobes that vanish — no overshoot. The Fejér/Cesàro-averaged series converges uniformly. Same information, gentler knife.

## @examples

**Worked (the number):** a 0-to-5 V square wave through a sharp low-pass keeping 41 harmonics: predicted horn ≈ $5 \times 1.09 \approx 5.45$ V, ringing at roughly the 41st harmonic's period near each edge. If your logic circuit's absolute-maximum is 5.25 V, the "ideal" filter just violated it — Gibbs is a hardware spec issue, not a curiosity.

**Exam-style conceptual:** "Does increasing N remove the overshoot? Explain." Model answer: no — the overshoot height tends to 8.95% of the jump; only its width shrinks; convergence is non-uniform at discontinuities; at the jump the series converges to the midpoint. Four sentences, four marks.

**Where you'll see it again:** ringing haloes around sharp edges in over-compressed images; echo-like "pre-ringing" near transients in brick-wall audio filters — both are Gibbs wearing different clothes.

## @misconceptions
- wrong: "More terms will eventually flatten the horns."
  tempting: "Convergence should mean everything gets better everywhere."
  correction: "The horn height converges to ≈ 9% of the jump — a fixed floor. Only its WIDTH shrinks. 'Pointwise' convergence at each fixed t coexists with a never-improving worst case: that distinction IS this concept."
- wrong: "The ringing is a numerical/plotting artifact."
  tempting: "Wiggles near sharp edges look like aliasing or bad sampling."
  correction: "The overshoot is provable mathematics with a closed-form constant (0.0895…). This app evaluates the partial sums exactly on a fine grid near the jump — what you see is the theorem, not the pixels."
- wrong: "Gibbs only matters for square waves."
  tempting: "It's always demonstrated on the same toy signal."
  correction: "ANY jump through ANY sharp band-limit rings: filtered audio transients, compressed image edges, scope traces. The square wave is just the cleanest witness."

## @exam

Short conceptual money (3–6 marks): describe the phenomenon (9% overshoot, narrows-but-never-lowers, midpoint at the jump), explain non-uniform convergence in one sentence, name a practical consequence and the windowing cure. The trap answers to avoid: "more terms fix it", "it's an approximation error". Numbers to keep: **8.95%**, midpoint convergence, ringing frequency ≈ the highest kept harmonic.

## @summary

- Truncated FS at a jump: overshoot → **≈ 9% of the jump height**, width → 0, height → never.
- At the jump: midpoint. Off the jump: pointwise convergence. Near the jump: non-uniform.
- Mechanism: coefficient boxcar ⇔ rippled (Dirichlet) kernel in time; side lobes cause the horns.
- Cure: taper, don't chop (windowing/Fejér) — calm edges, slightly softer.
- Same physics at ideal filters, reconstruction, image compression: sharp band-limits ring.
