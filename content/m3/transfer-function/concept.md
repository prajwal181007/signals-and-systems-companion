---
id: m3/transfer-function
title: "Transfer function: the system's entire personality in one ratio of polynomials"
short: Transfer Function
module: 3
tier: core
hero: true
outcomes: [CO3]
prereqs: [m3/inverse-laplace]
aliases: ["H(s)", "system function", "poles and zeros", "pole-zero map", "natural frequency", "damping ratio", "zeta", "omega n", "second-order system", "dominant pole", "characteristic polynomial"]
exam: { minor2: high, major: high, marks: "6–10", styles: [compute, sketch, conceptual] }
crosslinks:
  - { target: m2/frequency-response, relation: "H(jω) is H(s) evaluated on the imaginary axis — the sinusoidal slice of the same object" }
  - { target: m3/solving-odes, relation: "the zero-state response is always H(s)X(s); ICs add the other piece" }
  - { target: m4/feedback, relation: "feedback moves the poles of H — the central act of control engineering" }
  - { target: m5/bode-plots, relation: "Bode plots draw |H(jω)| from the same poles and zeros, on log axes" }
  - { target: m1/convolution, relation: "Y = HX is convolution y = h∗x after the transform collapses it to multiplication" }
---

## @intuition

A vendor sells vibration mounts for machine tools. You ask: "What will this do to *my* machine?" They cannot ship you their lab, their differential equations, or a thousand test recordings. The datasheet carries a handful of numbers instead — and from those numbers alone you can predict the mount's response to any input you will ever apply. Control engineers talk the same way: a whiteboard sketch of crosses and circles on a plane, and everyone in the room reads off ringing, settling time, and danger at sight. This concept teaches you to read and write that language.

---
@viz tf-explorer {"preset":"lp1","k":1}
Where does this compact description come from? Convolution — the LTI input–output law — becomes *multiplication* after the Laplace transform: output transform = $H(s)$ × input transform. One function of $s$, the **transfer function**, is the whole system. And for the systems this course builds (circuits, mechanics — anything governed by a linear ODE), $H$ is always a ratio of two polynomials. Polynomials are their roots: a short list of special points tells all.

---
@viz tf-explorer {"preset":"resonator","k":1}
The denominator's roots are the **poles** — crosses on the map. Each pole is a mode the system *wants* to perform: its position sets decay rate (how far left) and ring frequency (how far up). Drag the pole pair toward the imaginary axis and watch $h(t)$ ring longer; drag it upward and watch it ring faster. The numerator's roots — **zeros**, drawn as circles — are inputs the system refuses to pass; they reshuffle how strongly each mode is excited.

---
@viz tf-explorer {"preset":"unstable","k":1}
Stability becomes geography. A causal system is stable exactly when every pole sits strictly in the left half plane — every mode decays. One pole across the axis, like the one shown here, and some mode grows without bound: the system is a bomb, not a filter. No integral test, no simulation: look at the map.

---
Second-order systems get special coordinates because they are engineering's workhorse: distance of the pole pair from the origin is the natural frequency $\omega_n$ (how fast events unfold), and the angle from the negative real axis encodes the damping ratio $\zeta$ (how oscillatory). Same angle, same *shape* of response at different speeds; same radius, same speed with different shapes. Two numbers, read straight off the picture.

## @definition

For an LTI system, the **transfer function** is

$$H(s) = \frac{Y(s)}{X(s)}\Big|_{\text{zero initial conditions}} = \mathcal{L}\{h(t)\} = \int_{-\infty}^{\infty} h(t)\,e^{-st}\,dt$$

— the ratio of output to input transforms (all initial conditions zero), equivalently the Laplace transform of the impulse response. (The defining integral is the bilateral transform; for the causal systems of this course, $h(t)=0$ for $t<0$ makes it identical to the unilateral one.)

**From the ODE directly.** If the system obeys
$$a_n y^{(n)} + \cdots + a_1 y' + a_0 y = b_m x^{(m)} + \cdots + b_1 x' + b_0 x$$
then with zero ICs each $d/dt$ becomes a factor of $s$:
$$H(s) = \frac{b_m s^m + \cdots + b_1 s + b_0}{a_n s^n + \cdots + a_1 s + a_0}$$
Read the coefficients straight out of the equation — no solving.

**Two display forms.** *Expanded* (ratio of polynomials, as above) is what the ODE hands you. *Factored ZPK* form,
$$H(s) = K\,\frac{(s-z_1)\cdots(s-z_m)}{(s-p_1)\cdots(s-p_n)}$$
exposes the DNA: **zeros** $z_i$ (numerator roots), **poles** $p_i$ (denominator roots), gain $K$. Convert freely; exams ask for both.

**Stability.** A causal system's ROC is the half-plane right of the rightmost pole; BIBO stability requires the ROC to contain the $j\omega$ axis. Hence: **causal LTI is BIBO stable iff every pole has $\mathrm{Re}\{p_i\} < 0$** (open left half plane). Poles *on* the axis: marginal at best (simple) or unstable (repeated); zeros are irrelevant to the verdict.

**Standard second-order form.**
$$H(s) = \frac{\omega_n^2}{s^2 + 2\zeta\omega_n s + \omega_n^2}, \qquad p_{1,2} = -\zeta\omega_n \pm j\,\omega_n\sqrt{1-\zeta^2} \;\; (0 \le \zeta < 1)$$
Pole geometry: $|p| = \omega_n$ (poles live on a circle of radius $\omega_n$) and $\cos\theta = \zeta$, where $\theta$ is the angle measured from the *negative real axis*. Constant-$\zeta$ = rays from the origin; constant-$\omega_n$ = circles. Regimes: $\zeta > 1$ overdamped (two real poles), $\zeta = 1$ critically damped (double real pole), $0<\zeta<1$ underdamped (complex pair, damped ringing at $\omega_d = \omega_n\sqrt{1-\zeta^2}$), $\zeta = 0$ pure oscillator (axis poles), $\zeta < 0$ unstable.

**Dominant pole.** The pole (or pair) closest to the $j\omega$ axis decays slowest and rules the long-run response; poles 5–10× further left die too fast to matter, licensing low-order approximations (match the DC gain when you truncate).

**Reading the symbols:** $s$ is a complex frequency probe; $H(s)$ is the system's complex gain to the probe $e^{st}$. $\zeta$ is dimensionless "oscillation temperament"; $\omega_n$ carries the rad/s and sets the clock.

## @derivation

### Step: Exponentials go straight through LTI systems
?why: Convolution with input e^{st} factors — the integral no longer depends on t.
Feed $x(t) = e^{st}$ (an eternal complex exponential) into convolution:
$$y(t) = \int_{-\infty}^{\infty} h(\tau)\,e^{s(t-\tau)}\,d\tau = e^{st}\underbrace{\int_{-\infty}^{\infty} h(\tau)\,e^{-s\tau}\,d\tau}_{H(s)}$$
The output is the *same exponential*, scaled by $H(s)$: exponentials are eigenfunctions of LTI systems, and $H$ is the eigenvalue — which is precisely $\mathcal{L}\{h\}$.

### Step: The ODE surrenders H without being solved
?why: Linearity of L plus the derivative rule (zero ICs): each d/dt is a factor of s.
Transform $a_2 y'' + a_1 y' + a_0 y = b_1 x' + b_0 x$ with zero initial conditions:
$$(a_2 s^2 + a_1 s + a_0)\,Y(s) = (b_1 s + b_0)\,X(s) \;\Rightarrow\; H(s) = \frac{Y}{X} = \frac{b_1 s + b_0}{a_2 s^2 + a_1 s + a_0}$$
The denominator is the ODE's characteristic polynomial — poles ARE the characteristic roots.

### Step: Poles dictate the modes of h(t); zeros only set the mix
?why: Partial fractions of H — the previous concept — applied to the system itself.
For distinct poles, $H(s) = \sum_i \frac{A_i}{s-p_i}$, so
$$h(t) = \sum_i A_i\,e^{p_i t}\,u(t)$$
Moving a zero changes the residues $A_i$ (the amounts) but cannot create or destroy a mode. That asymmetry is why stability reads from poles alone.

### Step: Stability is pole geography
?why: BIBO ⇔ ∫|h| < ∞, and each mode integrates iff its pole is strictly LHP.
$\int_0^\infty |e^{p_i t}|\,dt = \int_0^\infty e^{\mathrm{Re}\{p_i\}t}\,dt$ converges iff $\mathrm{Re}\{p_i\} < 0$. All modes decay ⇔ all poles in the open LHP ⇔ the causal ROC contains the $j\omega$ axis. One glance at the map is a complete stability proof.

### Step: Second-order geometry — solve the quadratic and look
?why: The quadratic formula on the standard form, then polar coordinates.
$$s^2 + 2\zeta\omega_n s + \omega_n^2 = 0 \;\Rightarrow\; p = -\zeta\omega_n \pm j\,\omega_n\sqrt{1-\zeta^2}$$
Magnitude: $|p|^2 = \zeta^2\omega_n^2 + \omega_n^2(1-\zeta^2) = \omega_n^2$, so $|p| = \omega_n$ always. Angle from the negative real axis: $\cos\theta = \zeta\omega_n/\omega_n = \zeta$. Damping is an *angle*, speed is a *radius* — the two knobs are orthogonal on the map.

### Step: Notice what was NOT assumed
?why: H(s) is blind to physics — and, alone, blind to causality too.
No circuits, no mechanics: any linear constant-coefficient ODE yields this structure, which is why one pole-zero language serves electronics, vibrations, and flight control alike. Also unstated so far: $H(s)$ as a formula does not fix causality — the ROC does. This course (and the exam) reads "system with transfer function $H$" as *causal* unless told otherwise; then "all poles LHP ⇔ stable" is the complete rule.

## @examples

**Worked (exam standard): ODE → H → poles/zeros → h(t).** System: $y'' + 3y' + 2y = x' + 3x$.

1. *Transfer function by inspection:* $H(s) = \dfrac{s+3}{s^2+3s+2} = \dfrac{s+3}{(s+1)(s+2)}$.
2. *DNA:* zero at $-3$; poles at $-1, -2$ — both in the open LHP: **stable** (and both real: overdamped, no ringing possible).
3. *Impulse response* (the inversion done in the previous concept): $h(t) = (2e^{-t} - e^{-2t})\,u(t)$.
4. *DC gain:* $H(0) = 3/2$ — a unit step settles at $1.5$.
One line of reading per fact; nothing was "solved".

**Worked (engineering skin): car suspension as a second-order map.** Mass–spring–damper, $m = 1$ kg, damper $b = 2$ N·s/m, spring $k = 5$ N/m (force in, position out):
$$H(s) = \frac{1}{s^2 + 2s + 5}$$
Match to standard form: $\omega_n^2 = 5 \Rightarrow \omega_n = \sqrt{5} \approx 2.24$ rad/s; $2\zeta\omega_n = 2 \Rightarrow \zeta = 1/\sqrt{5} \approx 0.45$ (underdamped — the car will bounce). Poles: $-1 \pm 2j$. Geometry check: radius $\sqrt{1+4} = \sqrt{5} = \omega_n$ ✓; $\cos\theta = 1/\sqrt{5} = \zeta$ ✓. Predictions read off the map: ringing at $\omega_d = 2$ rad/s, envelope $e^{-t}$ (real part), settling in roughly $4/\zeta\omega_n = 4$ s, step overshoot $e^{-\pi\zeta/\sqrt{1-\zeta^2}} = e^{-\pi/2} \approx 21\%$. A stiffer spring ($k\uparrow$) slides the poles along the *ray* (same $\zeta$ — wait, check: $b$ fixed means $\zeta = b/2\sqrt{k}$ falls) — the map makes you *ask* the right question: which knob moves poles along rays, which along circles?

**Worked: dominant pole earns its name.** $H(s) = \dfrac{200}{(s+1)(s+20)}$, unit step input. Then $Y(s) = \dfrac{200}{s(s+1)(s+20)}$ and cover-up gives
$$y(t) = \left(10 - \tfrac{200}{19}e^{-t} + \tfrac{200}{380}e^{-20t}\right)u(t) \approx \left(10 - 10.5\,e^{-t} + 0.5\,e^{-20t}\right)u(t)$$
The fast mode is 20× smaller *and* 20× quicker — invisible after $0.15$ s. The first-order stand-in $\tilde H(s) = \dfrac{10}{s+1}$ (same dominant pole, **DC gain matched**: $\tilde H(0) = H(0) = 10$) reproduces the response to plotting accuracy. Rule of thumb: neglect poles 5–10× further left than the dominant one, but never forget to re-match the DC gain.

## @misconceptions
- wrong: "A zero in the right half plane makes the system unstable."
  tempting: "RHP = danger zone was just established for poles; symmetry suggests zeros there are equally fatal."
  correction: "Stability is decided by POLES alone — zeros cannot create a growing mode, only reweight existing ones. An RHP zero gives a stable but 'non-minimum-phase' system: its step response famously starts in the WRONG direction before recovering."
  probe: q-stability
- wrong: "Every system has a transfer function."
  tempting: "H = Y/X looks like a definition you can always write down."
  correction: "The ratio Y/X is input-independent ONLY for LTI systems with zero initial state — that is the eigenfunction property at work. For y = x², Y/X changes with every input; no single H exists. 'Has a transfer function' is practically a definition of LTI."
- wrong: "Larger ω_n means more oscillatory."
  tempting: "ω_n is called a frequency, and more frequency sounds like more wiggle."
  correction: "Shape and speed are separate knobs: ζ (the ray angle) alone fixes overshoot and how many wiggles; ω_n (the circle radius) only rescales time. Doubling ω_n at fixed ζ plays the SAME response twice as fast."
  probe: q-zeta
- wrong: "An unstable pole can be fixed by cancelling it with a zero at the same spot."
  tempting: "Algebra agrees: the factors cancel and the ratio looks stable."
  correction: "The ratio hides the mode; the physical mode remains and any disturbance or nonzero IC ignites e^{+at}. RHP pole–zero cancellation is a paper fix for a real explosion — module 4's interconnection lab demonstrates the hazard live."

## @exam

**Where it appears:** Minor II and the Major — the connective tissue of every module-3 question. Typical asks: write $H(s)$ from an ODE or circuit (2–3 marks); find poles/zeros and sketch the map (2 marks); stability verdict *with reason* (2 marks); identify $\omega_n$, $\zeta$ and classify damping (2–4 marks); find $h(t)$ or step response via partial fractions (4 marks).

**The method that earns full marks:** (1) replace derivatives by powers of $s$ (say "zero initial conditions"); (2) write both expanded and factored forms; (3) list poles and zeros explicitly, plot crosses/circles; (4) stability: quote pole real parts, not vibes — "all poles in open LHP ⇒ BIBO stable (causal)"; (5) for second order, normalize the leading coefficient to 1 *before* matching $2\zeta\omega_n$ and $\omega_n^2$; (6) $h(t)$ via the inverse-Laplace ritual.

**Traps that cost marks:** matching $\omega_n, \zeta$ against $2s^2 + 4s + 8$ without dividing by 2 first; calling a simple $j\omega$-axis pole pair "stable" (it is *marginally* stable — bounded inputs at the resonant frequency produce unbounded output); deciding stability from zeros; sign slips reading poles ($s^2+2s+5$ has poles $-1\pm2j$, real part *minus* one); quoting $\omega_d$ where $\omega_n$ was asked; dominant-pole approximations that forget to match $H(0)$.

## @interview

The pole-zero map is the interviewer's favorite whiteboard. Own these: "$H(s)$ exists because $e^{st}$ is an eigenfunction of LTI systems — $H$ is the eigenvalue map." "Poles are the modes the system can produce; zeros set how strongly each is excited — that's why stability is pole-only." "$\zeta$ is an angle, $\omega_n$ is a radius: shape and speed decouple on the map." "A pole at $-1\pm 10j$? Fast ring, slow decay — tell me the envelope before you tell me the frequency." And the classic: "why is RHP pole-zero cancellation forbidden?" — because you can cancel it from the ratio but not from the physics.

## @summary

$$H(s) = \frac{Y(s)}{X(s)}\Big|_{\text{zero ICs}} = \mathcal{L}\{h(t)\} = K\,\frac{\prod (s-z_i)}{\prod (s-p_i)}$$

- **From ODE:** coefficients transcribe directly; denominator = characteristic polynomial.
- **Poles** = modes of $h(t)$ ($e^{p_i t}$); **zeros** = reweight residues, never modes.
- **Stability (causal):** all poles in open LHP. Axis poles ⇒ marginal (simple) / unstable (repeated). Zeros irrelevant.
- **2nd order:** $\dfrac{\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}$; poles $-\zeta\omega_n \pm j\omega_n\sqrt{1-\zeta^2}$; $|p|=\omega_n$, $\cos\theta = \zeta$; $\omega_d = \omega_n\sqrt{1-\zeta^2}$.
- **Damping ladder:** $\zeta>1$ over / $=1$ critical / $0<\zeta<1$ under / $=0$ oscillator / $<0$ unstable.
- **Dominant pole:** nearest the axis rules; drop poles 5–10× further left, re-match DC gain $H(0)$.
- **Exam ritual:** ODE → $H$ → factor → map → stability with reason → ($\omega_n,\zeta$) → invert if asked.
