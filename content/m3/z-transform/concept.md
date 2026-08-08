---
id: m3/z-transform
title: "The z-transform: the s-plane learns to count"
short: Z-Transform
module: 3
tier: core
hero: false
outcomes: [CO3]
prereqs: [m3/laplace-transform]
aliases: ["zt", "z transform", "discrete laplace", "z plane", "unit circle", "e^sT mapping", "geometric series transform", "sum x[n] z^-n"]
exam: { minor2: high, major: high, marks: "4–8", styles: [compute, conceptual] }
crosslinks:
  - { target: m3/z-roc, relation: "the defining sum only converges for some |z| — that unpaid debt becomes the ROC story" }
  - { target: m3/laplace-transform, relation: "X(z) is the Laplace transform's discrete twin: z^{-n} plays the role of e^{-st}" }
  - { target: m3/difference-equations, relation: "z^{-1} = one-sample delay is what turns recursions into algebra" }
  - { target: m4/sampling, relation: "the collapsing strips of z = e^{sT} are aliasing, seen from the s-plane side" }
  - { target: m4/dtft, relation: "the DTFT is X(z) walked around the unit circle |z| = 1" }
---

## @intuition

Your phone's noise canceller, a guitar tuner, a pacemaker's beat detector — none of them ever touches a waveform. Each is a chip doing arithmetic on a **list of samples**: this number, the previous number, the one before that. The Laplace transform was engineered to tame *derivatives*; a chip has no derivatives — its only verbs are "remember the previous sample" and "multiply–add". We need a transform with the same pole–zero superpowers, but native to lists. That transform is the **z-transform**, and its home is a new map: the z-plane.

---
@viz atlas {"r":0.85,"omega":0.6}
In continuous time the all-star probe signal was $e^{st}$ — one complex number $s$ encoding decay rate and oscillation together. The discrete twin is the geometric sequence $z^n$: pick one complex number $z$ and raise it to the sample index. Drag the point in the atlas above. Write $z$ in polar form and the anatomy splits cleanly: the distance from the origin sets growth or decay per sample; the angle sets how many radians of oscillation each sample advances.

---
@viz atlas {"r":0.8,"omega":3.1416}
The atlas has a geography worth memorizing. **Inside** the unit circle ($|z|<1$): samples decay. **Outside**: they grow. **On** the circle: constant-amplitude oscillation, forever. And the **negative real axis** is the strangest street on the map — park $z$ at $-0.8$, as above, and the samples *alternate sign every step* while shrinking: $+,-,+,-$. That is the fastest wiggle a sampled signal can perform — one full flip per sample. No s-plane point behaves like this.

---
@viz atlas {"r":1.0,"omega":0.785}
Where did the s-plane go? If your samples came from $e^{st}$ measured every $T$ seconds, then sample $n$ is $(e^{sT})^n$ — a geometric sequence with $z = e^{sT}$. That exponential *rolls the s-plane up*: the left half-plane lands inside the unit circle, the $j\omega$ axis wraps around the circle's rim. And here is the sting: $s$ and $s + j2\pi/T$ land on the **same** $z$. Infinitely many CT frequencies, one DT point. Horizontal strips of the s-plane collapse onto one disk — your first sighting of *aliasing*.

---
Now the transform itself is inevitable. Laplace measured "how much of each $e^{st}$" by weighting with $e^{-st}$ and integrating. The z-transform measures "how much of each $z^n$" by weighting with $z^{-n}$ and summing. Same recipe; $\Sigma$ replaces $\int$. Every skill you built in the s-plane — poles as modes, partial fractions, transfer functions — ports over almost unchanged. This concept builds the dictionary; the next two collect the fine print (ROC) and the way back (inversion).

## @definition

The **(bilateral) z-transform** of a sequence $x[n]$ is

$$X(z) = \sum_{n=-\infty}^{\infty} x[n]\, z^{-n}$$

together with its **region of convergence** (ROC) — the set of $z$ for which the sum converges. We write $x[n] \leftrightarrow X(z)$.

**Reading the symbols:** $z = re^{j\Omega}$ is a complex number — $r$ dials decay/growth per sample, $\Omega$ dials radians of rotation per sample. $z^{-n}$ is the probe: multiplying by it and summing asks "how strongly does $x[n]$ resemble the geometric sequence $z^n$?" The sum is the discrete stand-in for the Laplace integral $\int x(t)e^{-st}dt$ — compare them symbol by symbol: $x[n] \leftrightarrow x(t)$, $z^{-n} \leftrightarrow e^{-st}$, $\Sigma \leftrightarrow \int$.

**Exam conventions:** answers may be left in **z form** $\frac{z}{z-a}$ or **$z^{-1}$ form** $\frac{1}{1-az^{-1}}$ — they are the same function, and you must move fluently between them. A transform **without its ROC is half an answer** — state it every time. The **unilateral** z-transform $\sum_{n=0}^{\infty}x[n]z^{-n}$ agrees with the bilateral one for causal signals and earns its keep when initial conditions appear — that story lives in *difference equations*.

**The delay fact** (used constantly): $\delta[n] \leftrightarrow 1$ and $\delta[n-k] \leftrightarrow z^{-k}$. Each power of $z^{-1}$ is one sample of delay. A finite-length sequence transforms *by inspection* into a polynomial in $z^{-1}$.

## @derivation

The transform is not decreed — it is discovered, the same way $e^{st}$ forced Laplace on us.

### Step: Feed a DT LTI system the sequence zⁿ — it comes out scaled, not changed
?why: The convolution sum plus the exponent law z^{n-k} = zⁿ·z^{-k}; this is the DT copy of the e^{st} eigenfunction argument.
$$y[n] = \sum_{k} h[k]\, z^{\,n-k} = z^n \underbrace{\sum_{k} h[k]\, z^{-k}}_{\text{a number, once } z \text{ is fixed}}$$
The output is the *same* sequence $z^n$, multiplied by a complex constant. Geometric sequences are the eigenfunctions of DT LTI systems.

### Step: Name the eigenvalue — that name is the z-transform
?why: The scale factor depends on z; written as a function of z it deserves a symbol.
$$H(z) = \sum_{k} h[k]\, z^{-k}$$
Apply the same recipe to any sequence and you have the definition of $X(z)$. Nothing arbitrary happened: the weighting $z^{-n}$ is the only choice that makes $z^n$ pass through untouched-but-scaled.

### Step: Work the flagship pair — aⁿu[n]
?why: The geometric series Σqⁿ = 1/(1−q), legal exactly when |q| < 1 — 10+2 math carries the whole computation.
$$X(z) = \sum_{n=0}^{\infty} a^n z^{-n} = \sum_{n=0}^{\infty}\left(\frac{a}{z}\right)^{n} = \frac{1}{1-az^{-1}} = \frac{z}{z-a}, \qquad \left|\frac{a}{z}\right|<1 \;\Rightarrow\; |z|>|a|$$
One pole at $z=a$: the pole *is* the geometric ratio. Pole inside the unit circle ⇒ decaying signal; outside ⇒ growing; at $z=1$ ($a=1$) this is $u[n] \leftrightarrow \frac{z}{z-1}$.

### Step: Build the bridge z = e^{sT}
?why: Substituting t = nT into e^{st} is all it takes — the mapping is forced, not designed.
Sampling $e^{st}$ every $T$ seconds gives $e^{snT} = (e^{sT})^n = z^n$ with $z = e^{sT}$. Take magnitudes and angles: $|z| = e^{\sigma T}$, $\angle z = \omega T$. So: $\sigma<0$ (LHP) $\Rightarrow |z|<1$ (inside); $\sigma = 0$ (the $j\omega$ axis) $\Rightarrow |z|=1$ — **the axis wraps onto the unit circle**. But $e^{(s + j2\pi/T)T} = e^{sT}e^{j2\pi} = z$: shifting $\omega$ by $2\pi/T$ changes nothing. Every horizontal strip of height $2\pi/T$ **collapses onto the same z-plane** — distinct CT frequencies become indistinguishable after sampling. That is aliasing, and you have just derived it from an exponent law.

### Step: Notice what was NOT assumed
?why: The z-transform stands on its own; the bridge is a dictionary, not a definition.
Nothing above required $x[n]$ to come from sampling a waveform. Daily stock closes, pixel rows, a Fibonacci recursion — any sequence has a z-transform. Also *not* settled: for which $z$ the defining sum actually converges. We used $|z|>|a|$ once and moved on; that debt is real, and the next concept (ROC) pays it in full.

## @examples

**Worked (exam warm-up): finite list by inspection.** $x[n] = \{2,\; 0,\; -1,\; 3\}$ for $n = 0,1,2,3$, zero elsewhere. Each sample rides its own delay:
$$X(z) = 2 - z^{-2} + 3z^{-3}$$
ROC: all $z \neq 0$ (a finite sum can only fail where $z^{-n}$ itself blows up). The method *is* the notation: exponent = sample index. And it runs backwards for free — handed $X(z) = 1 + 4z^{-1} - 2z^{-5}$, you read off $x[0]=1$, $x[1]=4$, $x[5]=-2$ with no computation. Exams open with this to hand you 2 marks; take them in one line.

**Worked (audio skin): the alternating pole.** $x[n] = (-0.9)^n u[n]$. Run the flagship ritual with $a = -0.9$:
$$X(z) = \frac{1}{1+0.9z^{-1}} = \frac{z}{z+0.9}, \qquad |z| > 0.9$$
The pole sits at $z=-0.9$ — negative real axis. The signal $+1, -0.9, +0.81, \dots$ flips sign every sample: in audio terms it rings at *half the sample rate*, the harsh metallic top of the digital world. Watch the sign in the denominator: $(-a)^n$ gives $z/(z+a)$. Writing $z/(z-0.9)$ here is the classic dropped mark.

**Worked (the bridge in numbers): sampled RC discharge.** A capacitor discharges as $x(t) = e^{-t/RC}u(t)$ with $RC = 10\,\text{ms}$, and an ADC samples every $T = 1\,\text{ms}$. Then
$$x[n] = e^{-nT/RC} = \left(e^{-0.1}\right)^{n} \approx (0.905)^n u[n] \;\leftrightarrow\; \frac{z}{z - e^{-0.1}}, \quad |z| > e^{-0.1}$$
The CT pole was at $s = -1/RC = -100\;\text{s}^{-1}$; the DT pole is at $z = e^{sT} = e^{-0.1} \approx 0.905$ — the bridge formula verified on real hardware numbers. Faster sampling (smaller $T$) slides the pole toward $z=1$: finely sampled slow decays crowd the unit circle from inside.

## @misconceptions
- wrong: "The stable/decaying region of the z-plane is the left half, like the s-plane."
  tempting: "A whole semester of Laplace trained you: left = decay, right = growth. The reflex transfers."
  correction: "The exponential map rolls the s-plane up: decay/growth is now inside/outside the UNIT CIRCLE. The left half of the z-plane just means Ω near π — alternation, not decay. z = −2 alternates AND grows; z = +0.5 decays without alternating."
  probe: q-atlas
- wrong: "A pole on the negative real axis means the signal grows — negative feels unstable."
  tempting: "Negative numbers read as 'bad', and (−0.9)ⁿ does look violent when the signs flip."
  correction: "Sign of the pole sets the FLIP; magnitude sets the FATE. (−0.9)ⁿ alternates while decaying since |−0.9| < 1. Only |z| decides growth."
- wrong: "Σ aⁿ z⁻ⁿ = z/(z−a) is an identity that holds for every z."
  tempting: "The algebra of geometric series feels unconditional once memorized."
  correction: "The series only sums to that formula when |a/z| < 1, i.e. |z| > |a|. Outside that ring the sum diverges and the formula describes nothing. A transform without its ROC is half an answer."
- wrong: "z = e^{sT} pairs each s with its own private z."
  tempting: "Exponentials are one-to-one on the reals, so why not here."
  correction: "e^{j2π} = 1 makes the map many-to-one: s and s + j2π/T hit the SAME z. Whole horizontal strips of the s-plane stack onto one disk — this collapse is exactly why sampling can alias."
  probe: q-bridge

## @exam

**Where it appears:** Minor II and the Major, 4–8 marks — usually as part (a) of a longer question that then asks for inversion or a difference-equation solution. Standalone forms: "find $X(z)$ and its ROC", "transform this finite sequence", "where does this s-plane pole land under sampling?"

**The method that earns full marks (for "find $X(z)$ of $a^n u[n]$-type signals):** (1) write the defining sum with the actual signal substituted; (2) rearrange into $\sum (\cdot)^n$ — name the geometric ratio; (3) state the convergence condition on the ratio and convert it to a condition on $|z|$ — that line **is** the ROC and it carries a mark; (4) sum the series and simplify to $\frac{z}{z-a}$ or $\frac{1}{1-az^{-1}}$ form. For finite sequences: skip all of it and write the polynomial by inspection, ROC $z \neq 0$.

**Traps that cost marks:** sign slip on alternating signals — $(-a)^n u[n] \leftrightarrow \frac{z}{z+a}$, not $\frac{z}{z-a}$; omitting the ROC entirely; mixing $z$ and $z^{-1}$ notation mid-derivation (pick one, convert at the end); writing $u[n] \leftrightarrow \frac{z}{z-1}$ without $|z|>1$; on bridge questions, forgetting that $|z| = e^{\sigma T}$ needs the *actual* $T$ from the problem.

## @interview

Interviewers use the z-transform to check whether you see structure or memorized tables. One-liners worth owning: "Why $z^{-n}$? — geometric sequences are the eigenfunctions of DT LTI systems, and $z^{-n}$ is the weighting that reveals the eigenvalue." "What is $z^{-1}$ physically? — one sample of delay; the whole transform is bookkeeping for delays." "Where did the $j\omega$ axis go? — wrapped onto the unit circle by $z = e^{sT}$, which is also why sampling aliases: strips of height $2\pi/T$ collapse." "Why is $z = -1$ special? — it is the Nyquist point, the fastest oscillation a sampled system can represent."

## @history

The z-transform is war surplus. In the 1940s, radar fire-control systems tracked aircraft from *pulsed* — sampled — measurements, and Witold Hurewicz (1947) built the transform of sequences to analyze them; Ragazzini and Zadeh at Columbia named it the "z-transform" in 1952. But the mathematics is far older: Abraham de Moivre invented generating functions — the same sum in different clothes — around 1730, precisely to crack the Fibonacci recursion. The tool waited two centuries for hardware that could sample.

## @summary

$$X(z) = \sum_{n=-\infty}^{\infty} x[n] z^{-n} \qquad z = re^{j\Omega} \qquad z^{-1} = \text{one-sample delay}$$

**Core pairs** (state the ROC every time):

| $x[n]$ | $X(z)$ | ROC |
|---|---|---|
| $\delta[n]$ | $1$ | all $z$ |
| $\delta[n-k]$ | $z^{-k}$ | $z \neq 0$ |
| $u[n]$ | $\frac{z}{z-1}$ | $\|z\|>1$ |
| $a^n u[n]$ | $\frac{z}{z-a} = \frac{1}{1-az^{-1}}$ | $\|z\|>\|a\|$ |
| $(-a)^n u[n]$ | $\frac{z}{z+a}$ | $\|z\|>\|a\|$ |

- **Atlas:** inside unit circle = decay; outside = growth; on the circle = constant oscillation; negative real axis = sign-alternation ($z=-1$ is the fastest DT oscillation).
- **Bridge:** $z = e^{sT}$; $|z| = e^{\sigma T}$, $\angle z = \omega T$; LHP → inside circle; $j\omega$ axis → unit circle; strips of height $2\pi/T$ collapse (aliasing).
- **Exam ritual:** defining sum → geometric ratio → ratio condition ⇒ ROC → closed form. Finite lists: by inspection, exponent = index.
