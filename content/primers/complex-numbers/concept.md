---
id: primers/complex-numbers
title: "Complex numbers: the arrow that carries gain and phase at once"
short: Complex Numbers
module: 0
tier: supplementary
hero: false
outcomes: []
prereqs: []
aliases: ["imaginary numbers", "euler's formula", "polar form", "rectangular form", "magnitude and phase", "phasor", "argand diagram", "complex plane", "j notation", "conjugate", "roots of unity"]
exam: { minor1: high, major: high, marks: "2–4, embedded everywhere", styles: [compute] }
crosslinks:
  - { target: m2/frequency-response, relation: "every |H(jω)| and ∠H(jω) you will ever compute is exactly the division drill from this primer" }
  - { target: m2/fourier-series, relation: "Fourier coefficients are complex numbers — magnitude says how strong a harmonic is, angle says when it peaks" }
  - { target: m3/s-plane, relation: "s = σ + jω lives in the complex plane; pole positions are complex numbers you must read geometrically" }
---

## @intuition

Feed a clean test tone into any circuit — an amplifier, a filter, a long cable — and watch the output on an oscilloscope. Exactly two things happen: the wave comes out taller or shorter, and it slides sideways in time. Every system you meet this semester does precisely these two things to a sinusoid. So you need one mathematical object that stores *both* changes — how much bigger, how much later — and combines them correctly when systems chain. That object is the complex number.

---

Drop the phrase "imaginary number" — the working picture is an **arrow in a plane**. The arrow's length says *how much* (gain); its angle says *when* (phase shift). Adding two arrows is tip-to-tail, like displacement vectors from physics. Multiplying is the magic: **lengths multiply, angles add**. Chain an amplifier (doubles the signal, slight delay) into a filter (halves it, more delay): the overall gain is the product and the overall shift is the sum — exactly what arrow arithmetic delivers automatically.

---

Engineers write $j$ for $\sqrt{-1}$ — the letter $i$ is reserved for current. One number, two costumes. **Rectangular** $z = a + jb$ gives the arrow-tip's coordinates: perfect for adding. **Polar** gives length and angle: perfect for multiplying. Exams hand you rectangular and demand polar, so the conversion $|z| = \sqrt{a^2+b^2}$ plus an angle read off a quick sketch must become reflex. Fluency in this course means switching costumes without pausing to think.

---

Euler's formula is the bridge between the costumes: $e^{j\theta}$ is the point on the **unit circle** at angle $\theta$. Let the angle grow with time, $\theta = \omega t$, and the point becomes a dot spinning counterclockwise at $\omega$ radians per second. Its shadow on the real axis traces $\cos\omega t$; its shadow on the imaginary axis traces $\sin\omega t$. Every sinusoid in this course is the shadow of a spinning arrow — and spinning arrows obey far simpler algebra than trig identities do.

---

The payoff arrives in Module 2 and never leaves: a system's **frequency response** $H(j\omega)$ is a complex number at each frequency — $|H|$ is the gain, $\angle H$ is the phase shift. Whole exam sub-questions reduce to "find $|H|$ and $\angle H$ of $(3+4j)/(1-j)$". By the end of this primer that is a fifteen-second computation you can do two independent ways — and therefore check.

## @definition

The imaginary unit and the rectangular form:

$$j^2 = -1, \qquad z = a + jb, \qquad \operatorname{Re} z = a, \qquad \operatorname{Im} z = b$$

Note carefully: $\operatorname{Im} z$ is the **real number** $b$ — the coordinate, not the term $jb$.

**Polar form** and the rectangular↔polar conversions:

$$z = r(\cos\theta + j\sin\theta) = r\,e^{j\theta}, \qquad r = |z| = \sqrt{a^2+b^2}, \qquad \tan\theta = \frac{b}{a}$$

The magnitude formula is safe as written. The angle is not: $\tan^{-1}(b/a)$ only returns values in $(-90^\circ, 90^\circ)$, so it is correct only when $a > 0$. When $a < 0$ the arrow points into quadrant II or III — sketch the arrow, take the reference angle, and add or subtract $180^\circ$ to land in the true quadrant.

**Euler's formula** and its inverse (the two most-used identities in the course):

$$e^{j\theta} = \cos\theta + j\sin\theta \qquad\Longleftrightarrow\qquad \cos\theta = \frac{e^{j\theta} + e^{-j\theta}}{2}, \quad \sin\theta = \frac{e^{j\theta} - e^{-j\theta}}{2j}$$

**Conjugate** — flip the sign of the imaginary part (mirror across the real axis):

$$z^* = a - jb = r\,e^{-j\theta}, \qquad z\,z^* = |z|^2, \qquad z + z^* = 2\operatorname{Re} z$$

**Multiplication and division laws** (the reason polar form exists):

$$|z_1 z_2| = |z_1|\,|z_2|, \quad \angle(z_1 z_2) = \angle z_1 + \angle z_2, \qquad \left|\frac{z_1}{z_2}\right| = \frac{|z_1|}{|z_2|}, \quad \angle\frac{z_1}{z_2} = \angle z_1 - \angle z_2$$

Division in rectangular form: multiply numerator and denominator by the conjugate of the denominator,

$$\frac{a+jb}{c+jd} = \frac{(a+jb)(c-jd)}{c^2+d^2}$$

**Roots of unity (teaser):** $z^N = 1$ has exactly $N$ solutions, $z_k = e^{j2\pi k/N}$ for $k = 0, 1, \dots, N-1$ — $N$ points equally spaced around the unit circle.

**Reading the symbols:** $a, b, r, \theta$ are all ordinary real numbers — the complex number is the *package*. $r \ge 0$ always; the sign information lives entirely in $\theta$. The notation $r\angle\theta$ (say "$r$ at angle $\theta$") is shorthand for $re^{j\theta}$. **Exam conventions:** radians inside formulas, degrees acceptable in final answers *if labeled*; principal angle in $(-180^\circ, 180^\circ]$; always $j$, never $i$.

## @derivation

The most-used fact in the course — magnitudes multiply, angles add — is not a new axiom. It falls out of the 10+2 angle-addition identities. Watch.

### Step: Put both numbers in polar costume
?why: Any nonzero point in the plane is pinned down by a length and an angle — plane geometry, nothing more.
$$z_1 = r_1(\cos\theta_1 + j\sin\theta_1), \qquad z_2 = r_2(\cos\theta_2 + j\sin\theta_2)$$

### Step: Multiply and use j² = −1
?why: Ordinary bracket expansion; the only new move is replacing j² by −1.
$$z_1 z_2 = r_1 r_2\big[(\cos\theta_1\cos\theta_2 - \sin\theta_1\sin\theta_2) + j(\sin\theta_1\cos\theta_2 + \cos\theta_1\sin\theta_2)\big]$$

### Step: Recognize the angle-addition identities
?why: These are the 10+2 formulas cos(A+B) and sin(A+B), appearing verbatim.
$$z_1 z_2 = r_1 r_2\big[\cos(\theta_1+\theta_2) + j\sin(\theta_1+\theta_2)\big] \qquad \blacksquare$$
Lengths multiplied ($r_1 r_2$), angles added ($\theta_1 + \theta_2$). Multiplication by a complex number is a **rotate-and-scale** operation. In particular, multiplying by $j$ (length 1, angle $90^\circ$) is a pure quarter-turn — do it twice and you have rotated $180^\circ$, i.e. multiplied by $-1$. That *is* $j^2 = -1$, now as geometry.

### Step: Division is the same law run backwards
?why: 1/z₂ is defined by the requirement z₂ · (1/z₂) = 1, an arrow of length 1 at angle 0.
For the product to have length $1$ and angle $0$, the reciprocal must have length $1/r_2$ and angle $-\theta_2$. Hence dividing means: **divide magnitudes, subtract angles**. (Rectangular check: $\dfrac{1}{z} = \dfrac{z^*}{z z^*} = \dfrac{z^*}{|z|^2}$ — the conjugate trick is this same fact in coordinates.)

### Step: Euler's notation makes the law automatic
?why: A function obeying f(θ₁)f(θ₂) = f(θ₁+θ₂) behaves exactly like an exponential — so we name it one.
Define $f(\theta) = \cos\theta + j\sin\theta$. Step 3 with $r_1 = r_2 = 1$ says $f(\theta_1)f(\theta_2) = f(\theta_1+\theta_2)$ — the defining property of exponentials. Writing $f(\theta) = e^{j\theta}$ turns "angles add" into the exponent rule you have trusted since school: $e^{j\theta_1}e^{j\theta_2} = e^{j(\theta_1+\theta_2)}$. (For the calculus-minded: $f'(\theta) = -\sin\theta + j\cos\theta = j f(\theta)$, matching $\frac{d}{d\theta}e^{j\theta} = j e^{j\theta}$ — the same signature.)

### Step: Notice what was NOT assumed
No complex analysis, no infinite series, nothing beyond the plane, $j^2 = -1$, and trig identities you already own. "Magnitudes multiply, angles add" is the angle-addition formulas wearing better notation — which is precisely why phasor arithmetic in later modules is legal mathematics, not an engineering shortcut.

## @examples

**Worked (the exam drill): $|H|$ and $\angle H$ of $H = \dfrac{3+4j}{1-j}$.**

Method ritual: for $\times$ and $\div$, go polar; sketch each arrow to place its quadrant.

- Numerator: $|3+4j| = \sqrt{9+16} = 5$ (the 3–4–5 triangle); $a>0$, so $\angle = \tan^{-1}(4/3) \approx 53.13^\circ$ — quadrant I.
- Denominator: $|1-j| = \sqrt{2}$; angle $-45^\circ$ — quadrant IV.

$$|H| = \frac{5}{\sqrt{2}} \approx 3.54, \qquad \angle H = 53.13^\circ - (-45^\circ) = 98.13^\circ$$

**Cross-check in rectangular** (this is how you verify under exam pressure):

$$H = \frac{(3+4j)(1+j)}{(1-j)(1+j)} = \frac{3 + 3j + 4j + 4j^2}{1+1} = \frac{-1+7j}{2} = -0.5 + 3.5j$$

Magnitude $\sqrt{0.25 + 12.25} = \sqrt{12.5} \approx 3.54$ ✓. Angle: the tip $(-0.5, 3.5)$ sits in quadrant II, so $\angle H = 180^\circ - \tan^{-1}(3.5/0.5) = 180^\circ - 81.87^\circ = 98.13^\circ$ ✓. The blind calculator answer $\tan^{-1}\!\big(3.5/(-0.5)\big) = -81.87^\circ$ is off by exactly $180^\circ$ — the single most common lost mark in this entire course.

**Worked (engineering skin): an RC filter at its corner frequency.** The RC low-pass has $H(j\omega) = \dfrac{1}{1 + j\omega RC}$. At the corner $\omega = 1/RC$:

$$H = \frac{1}{1+j} = \frac{1}{\sqrt{2}\,e^{j45^\circ}} = \frac{1}{\sqrt{2}}\,e^{-j45^\circ}$$

Gain $0.707$ (engineers call this the −3 dB point), phase $-45^\circ$: a cosine goes in and emerges at 70.7% amplitude, delayed by one-eighth of a cycle. One complex division predicted the entire input–output behavior — this is the phasor method, and Module 2 repeats this move at every frequency $\omega$.

**Worked (teaser): the fourth roots of unity.** Solve $z^4 = 1$. Magnitudes: $|z|^4 = 1$ forces $|z| = 1$. Angles: $4\theta$ must be a whole number of full turns, so $\theta = 0^\circ, 90^\circ, 180^\circ, 270^\circ$ — the four points $1, j, -1, -j$, a square inscribed in the unit circle. One equation, four answers, perfectly spaced. In general $z^N = 1$ has $N$ roots $e^{j2\pi k/N}$. File the picture away: these evenly spaced points return in sampling and the DFT, where "N-point" spectra live exactly on them.

## @misconceptions
- wrong: "The angle of a + jb is always tan⁻¹(b/a), straight from the calculator."
  tempting: "One button, one answer — and it works for every first-quadrant example the textbook shows."
  correction: "tan⁻¹ only returns angles between −90° and 90° (quadrants I and IV). When a < 0 the arrow lives in quadrant II or III: sketch it, take the reference angle, then add or subtract 180°. The angle of −1 + j is 135°, not −45°."
  probe: q-quadrant
- wrong: "Magnitudes add: |z₁ + z₂| = |z₁| + |z₂|."
  tempting: "It's true for positive real numbers, and 'magnitude' sounds like 'amount of stuff'."
  correction: "Arrows add tip-to-tail: |1 + j| = √2, not 2. Equality needs both arrows pointing the same way — that's the triangle inequality. Magnitudes multiply under ×; they do not add under +."
- wrong: "To divide two complex numbers, divide the real parts and divide the imaginary parts."
  tempting: "Addition and subtraction work componentwise, so division should too."
  correction: "Division must undo multiplication, and multiplication mixes the components. Either multiply top and bottom by the conjugate of the denominator, or go polar: divide the magnitudes, subtract the angles."
  probe: q-divide-mag
- wrong: "Im(3 + 4j) = 4j."
  tempting: "The imaginary part is 'the part with the j in it'."
  correction: "Im z is the real coordinate: Im(3 + 4j) = 4. The j is the axis label, not part of the coordinate. Writing 4j breaks the identity z = Re z + j·Im z and costs method marks."

## @exam

**Where it appears:** almost never as a standalone question — instead it is embedded in nearly everything from Minor I onward: evaluating $|H(j\omega)|$ and $\angle H(j\omega)$ (Modules 2, 4, 5), reading magnitude/phase of Fourier coefficients, locating poles, computing residues (Module 3). The pattern "compute $|H|$ and $\angle H$ of $\frac{3+4j}{1-j}$" recurs as a 2–4 mark sub-part, and a quadrant error poisons every mark downstream.

**The method that earns full marks:** (1) rectangular for $+$ and $-$; polar for $\times$ and $\div$ — never fight the form. (2) Magnitudes first: $\sqrt{a^2+b^2}$ per factor, then multiply/divide — fast and hard to get wrong. (3) Angles second, each with a two-second quadrant sketch; add on multiplication, subtract on division. (4) State the final answer in the form asked — $a+jb$ or $r\angle\theta$ — and label degrees vs radians. (5) If time permits, verify by redoing the computation in the other form; they must agree.

**Traps that cost marks:** the $180^\circ$ quadrant miss after $\tan^{-1}$ (the classic); mixing degrees and radians mid-computation; *adding* angles on division; conjugating the numerator instead of the denominator; writing $\operatorname{Im} z$ with a $j$ in it; announcing $|1+j| = 2$.

## @interview

One-liners worth owning: "Multiplying by $e^{j\varphi}$ rotates by $\varphi$ — $j$ itself is a quarter-turn, so two quarter-turns give $-1$: that's why $j^2 = -1$ is geometry, not mysticism." "$e^{j\omega t}$ is a unit arrow spinning at $\omega$; real sinusoids are its shadows, which is why we compute with the arrow and project at the end." "Conjugation is a mirror across the real axis — the reason real signals will have conjugate-symmetric spectra later." "$zz^* = |z|^2$ is the identity to reach for the moment any magnitude appears."

## @history

Complex numbers were tolerated for two centuries as bookkeeping for solving cubics, and only became respectable when Wessel, Argand and Gauss showed each one is a *point in a plane* — the picture this primer leads with. Engineering adopted them late but decisively: in the 1890s Charles Steinmetz showed that AC circuit analysis — then a swamp of differential equations — collapses into complex arithmetic on phasors. The electrical engineer's $j$ (because $i$ was current) is the fingerprint that industry left on the mathematics.

## @summary

$$z = a+jb = re^{j\theta}, \qquad r = \sqrt{a^2+b^2}, \qquad e^{j\theta} = \cos\theta + j\sin\theta$$

$$\cos\theta = \frac{e^{j\theta}+e^{-j\theta}}{2}, \qquad \sin\theta = \frac{e^{j\theta}-e^{-j\theta}}{2j}, \qquad zz^* = |z|^2$$

- **Add/subtract** in rectangular (componentwise). **Multiply/divide** in polar: magnitudes ×/÷, angles +/−.
- **Angle ritual:** $\tan^{-1}(b/a)$ then a quadrant sketch; $a<0$ ⇒ adjust by $180^\circ$. Principal angle in $(-180^\circ, 180^\circ]$.
- **Rectangular division:** multiply top and bottom by the denominator's conjugate.
- $j$ = a $90^\circ$ rotation; $j^2 = -1$; $1/j = -j$.
- **Roots of unity:** $z^N = 1$ ⇒ $N$ points $e^{j2\pi k/N}$, equally spaced on the unit circle.
- **The drill:** $\frac{3+4j}{1-j} = -0.5 + 3.5j = 3.54\angle 98.13^\circ$ — magnitude by the ratio $5/\sqrt{2}$, angle by $53.13^\circ + 45^\circ$.
