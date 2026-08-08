---
id: m2/bandwidth-uncertainty
title: "Bandwidth and the uncertainty principle: why short pulses must be spectrally wide"
short: Bandwidth
module: 2
tier: core
hero: false
outcomes: [CO2]
prereqs: [m2/parseval]
aliases: ["time-bandwidth product", "uncertainty principle", "3 dB bandwidth", "half-power bandwidth", "first-null bandwidth", "rms bandwidth", "90 percent energy bandwidth", "band-limited", "time-limited", "gabor limit", "range resolution", "duration-bandwidth"]
exam: { minor1: medium, major: medium, marks: "4–8", styles: [conceptual, compute] }
crosslinks:
  - { target: m2/ft-properties, relation: "the time-scaling property x(at) ↔ (1/|a|)X(ω/a) is the engine that drives the time–frequency see-saw" }
  - { target: m2/parseval, relation: "the 90%-energy bandwidth is a band-energy fence — Parseval is what makes it computable" }
  - { target: m2/frequency-response, relation: "the ideal brick-wall filter fails realizability for exactly the reason band-limited signals cannot be time-limited" }
  - { target: m4/sampling, relation: "sampling theory prices a signal by its bandwidth — meaningful only once you say WHICH bandwidth" }
---

## @intuition

An air-traffic radar fires a pulse and listens. Two aircraft, one a few hundred metres behind the other, return two echoes — but if the pulse lasts too long, the echoes overlap into one blob and the controller sees one plane. The fix seems obvious: fire a shorter pulse. Then the receiver electronics must suddenly pass an enormously wider swath of frequencies, the amplifier gets expensive, and the spectrum-licensing office gets involved. Shortening time costs frequency. This concept prices that trade — exactly.

---
@viz seesaw {"family":"gauss"}
Drag the duration slider on the see-saw: squeeze the pulse to half its width and its spectrum stretches to twice the width. This is no coincidence of one shape — it is the Fourier transform's time-scaling property at work: compressing time by a factor stretches frequency by the same factor. Duration down, bandwidth up, their product stubborn. Every pulse family rides this see-saw; the only question each family answers differently is *how low its product can go*.

---
But wait — what exactly did the meter labelled "bandwidth" measure? Where a spectrum "ends" is a decision, not a fact: most spectra trail off forever. Engineers use at least four rulers: where power drops to half (**3-dB**), where the spectrum first touches zero (**first-null**), where 90% of the energy is fenced in (**90%-energy**), and a standard-deviation-style spread (**RMS**). Same signal, four different numbers — sometimes wildly different. A datasheet that says "bandwidth: 1 MHz" without naming its ruler has told you almost nothing.

---
@viz seesaw {"family":"rect"}
Switch the family to the rectangular pulse and pick the RMS ruler: the reading is not merely large — it is **infinite**. Sharp edges are expensive: a jump in time demands spectrum that dies off so slowly the RMS spread diverges. The one-sided exponential, with its cliff at $t=0$, fails the same way. This is not a bug in the ruler; it is the honest verdict. For such signals you compare families with the 3-dB or 90%-energy rulers instead.

---
Two hard truths crown the story. First: a signal strictly confined in time can never be strictly confined in frequency — which is why the ideal brick-wall filter is a fiction no circuit can build. Second: even for well-behaved shapes there is a floor — the RMS duration–bandwidth product can never drop below one half, and exactly one shape sits on the floor: the **Gaussian**. Everything else pays more.

## @definition

Let $x(t)$ have finite energy $E = \int_{-\infty}^{\infty} |x(t)|^2\,dt = \frac{1}{2\pi}\int_{-\infty}^{\infty}|X(j\omega)|^2\,d\omega$ (Parseval). The four bandwidth rulers, each a one-sided width for a spectrum peaked at $\omega = 0$:

- **3-dB (half-power) bandwidth** $\omega_{3\text{dB}}$: the frequency where $|X(j\omega)|^2$ first falls to **half** its peak — equivalently $|X|$ falls to $1/\sqrt{2} \approx 0.707$ of its peak. The name: $10\log_{10}(1/2) \approx -3\,$dB.
- **First-null bandwidth**: the first frequency where $X(j\omega) = 0$. Exists only for spectra that actually touch zero (sinc-like); for monotone spectra the honest answer is "does not exist."
- **90%-energy bandwidth** $W_{90}$: the smallest $W$ with
$$\frac{1}{2\pi}\int_{-W}^{W} |X(j\omega)|^2\,d\omega = 0.90\,E$$
- **RMS bandwidth** $\Delta\omega$ (and its twin, RMS duration $\Delta t$), for signals centered at $t=0$, $\omega=0$:
$$\Delta t^2 = \frac{1}{E}\int_{-\infty}^{\infty} t^2|x(t)|^2\,dt \qquad \Delta\omega^2 = \frac{1}{2\pi E}\int_{-\infty}^{\infty} \omega^2|X(j\omega)|^2\,d\omega$$

**Reading the symbols:** $|x(t)|^2/E$ and $|X(j\omega)|^2/(2\pi E)$ are unit-area *energy densities* — where the energy sits in time and in frequency. $\Delta t$ and $\Delta\omega$ are their standard deviations: "moment-of-inertia" widths, dominated by how the tails decay. That tail-sensitivity is exactly why RMS widths can diverge while 3-dB widths stay finite.

**The uncertainty principle** (for RMS widths): every finite-energy signal obeys
$$\Delta t \cdot \Delta\omega \ \ge\ \tfrac{1}{2}$$
with equality **only** for the Gaussian pulse $x(t) = Ce^{-t^2/2\sigma^2}$.

**The exclusion theorem:** a signal cannot be both time-limited (exactly zero outside a finite interval) and band-limited (spectrum exactly zero outside $[-W, W]$), except $x \equiv 0$. Sketch of why: if $X$ vanishes outside $[-W,W]$, then $x(t) = \frac{1}{2\pi}\int_{-W}^{W} X(j\omega)e^{j\omega t} d\omega$; expanding $e^{j\omega t}$ as its (everywhere-convergent) power series and integrating term by term over the *finite* band shows $x(t)$ is one power series in $t$, valid for all $t$ — an "infinite polynomial," like the series for $e^x$ you met in 10+2. A power series that is zero over any interval is zero everywhere. So a band-limited signal cannot vanish on any time interval — it cannot be time-limited. By the symmetry of the FT, the argument runs both ways. **Consequence:** the ideal low-pass filter's $h(t) = \frac{W}{\pi}\,\mathrm{sinc}(Wt)$ is band-limited, hence eternal in time and nonzero for $t<0$: it must start responding *before* the input arrives. Real filters only approximate it.

**Exam conventions:** if a problem says "bandwidth" of a low-pass filter without qualification, Mahindra convention is 3-dB. Always state your ruler, and watch units: $\omega$ [rad/s] $= 2\pi f$ [Hz].

## @derivation

The target: $\Delta t\,\Delta\omega \ge \tfrac12$, using only integration by parts, one inequality, and Parseval. Take $x(t)$ real, finite-energy, centered, with $t\,x^2(t) \to 0$ as $t \to \pm\infty$.

### Step: Put both widths on the same footing
?why: Definitions — the two RMS widths are second moments of the time and frequency energy densities.
$$\Delta t^2 \, E = \int t^2 x^2(t)\,dt \qquad \Delta\omega^2\, E = \frac{1}{2\pi}\int \omega^2 |X(j\omega)|^2 d\omega$$

### Step: The bridge identity — time position meets slope
?why: Integration by parts, legal because t·x² dies at ±∞.
Since $\frac{d}{dt}x^2 = 2xx'$,
$$\int_{-\infty}^{\infty} t \cdot 2x x'\,dt = \Big[t\,x^2\Big]_{-\infty}^{\infty} - \int_{-\infty}^{\infty} x^2\,dt = -E
\quad\Longrightarrow\quad \int t\,x\,x'\,dt = -\frac{E}{2}$$
The signal's energy shows up as a *coupling* between "where the signal sits" ($t\,x$) and "how fast it changes" ($x'$).

### Step: Cauchy–Schwarz turns the identity into an inequality
?why: The dot-product inequality |a·b| ≤ |a||b| from 10+2 vectors, applied to functions: |∫fg| ≤ √(∫f²)·√(∫g²).
With $f = t\,x$ and $g = x'$:
$$\frac{E^2}{4} = \left(\int t\,x\,x'\,dt\right)^{2} \le \left(\int t^2x^2\,dt\right)\left(\int (x')^2\,dt\right)$$

### Step: Parseval converts slope energy into RMS bandwidth
?why: Differentiation property x′ ↔ jωX, then Parseval on x′.
$$\int (x')^2 dt = \frac{1}{2\pi}\int |j\omega X(j\omega)|^2 d\omega = \frac{1}{2\pi}\int \omega^2 |X|^2 d\omega = \Delta\omega^2\,E$$
This line is worth memorizing on its own: **RMS bandwidth is the energy of the derivative** (normalized). Wiggly and sharp-edged signals are wide-band *by definition of wiggly*.

### Step: Combine
?why: Substitute the two moment expressions into the inequality and cancel E².
$$\frac{E^2}{4} \le (\Delta t^2 E)(\Delta\omega^2 E) \quad\Longrightarrow\quad \Delta t\,\Delta\omega \ge \frac{1}{2} \qquad \blacksquare$$

### Step: Equality forces the Gaussian
?why: Cauchy–Schwarz is tight only when the two "vectors" are proportional.
Equality requires $x'(t) = k\,t\,x(t)$ for a constant $k$. Separate and integrate (10+2 calculus): $\ln x = kt^2/2 + c$, so $x = Ce^{kt^2/2}$; finite energy forces $k<0$ — a Gaussian. No other shape touches the floor.

### Step: Notice what was NOT assumed — and when the bound says nothing
No pulse shape was assumed — the bound is universal. But it presumes both RMS widths are *finite*. A rectangular pulse has jumps, so $x'$ contains impulses, the slope energy $\int (x')^2$ is infinite, and $\Delta\omega$ **diverges**; the one-sided exponential's cliff at $t=0$ does the same. For those families the inequality is true but vacuous ($\Delta t \cdot \infty \ge \tfrac12$), which is precisely why engineers compare them using 3-dB or 90%-energy bandwidths instead.

## @examples

**Worked (exam style): all four rulers on $x(t) = e^{-1000t}u(t)$.** Here $|X(j\omega)|^2 = \dfrac{1}{10^6 + \omega^2}$, $E = \dfrac{1}{2000}$. Ritual: *name the ruler → write $|X|^2$ → solve its defining equation → check units.*

1. **3-dB:** solve $\dfrac{1}{10^6+\omega^2} = \dfrac{1}{2}\cdot\dfrac{1}{10^6}$ → $\omega_{3\text{dB}} = 1000$ rad/s ($\approx 159$ Hz).
2. **First-null:** $|X|$ never touches zero → **does not exist**. Write exactly that.
3. **90%-energy:** $\dfrac{1}{2\pi E}\displaystyle\int_{-W}^{W}\dfrac{d\omega}{10^6+\omega^2} = \dfrac{2}{\pi}\arctan\!\Big(\dfrac{W}{1000}\Big) = 0.90$ → $W_{90} = 1000\tan(0.45\pi) \approx 6310$ rad/s.
4. **RMS:** the integrand of $\int \omega^2|X|^2 d\omega$ is $\dfrac{\omega^2}{10^6+\omega^2} \to 1$ as $\omega \to \infty$ — the area grows without bound: $\Delta\omega$ **diverges** (time-domain reason: the jump at $t=0$).

The 3-dB and 90%-energy answers differ by a factor of **6.3** — same signal, both "the bandwidth." This is the datasheet lesson in one line.

**Worked (engineering skin): radar range resolution.** A pulse of duration $\tau$ produces echoes of duration $\tau$; two targets blur together when their echo delay difference is under $\tau$, i.e. when their range separation is under
$$\Delta R = \frac{c\,\tau}{2}$$
(the 2: the wave travels out *and* back). A 1 μs pulse gives $\Delta R = 150$ m — fine for aircraft, useless for imaging. Want $\Delta R = 1.5$ m? You need $\tau = 10$ ns, and the see-saw bills you: first-null-style bandwidth $B \approx 1/\tau = 100$ MHz, so
$$\Delta R \approx \frac{c}{2B}$$
**Resolution is bought with bandwidth, not with duration.** That re-reading is the deep one: modern radars keep the pulse *long* (for energy) but sweep its frequency — a chirp — so the bandwidth is wide anyway; a matched filter then compresses the echo. Same $\Delta R = c/2B$, no short-pulse power problem.

**Worked: the Gaussian rides the floor.** $x(t) = e^{-t^2/2\sigma^2}$ with $\sigma = 1$ ms. Then $|x|^2 = e^{-t^2/\sigma^2}$ has RMS width $\Delta t = \sigma/\sqrt{2} \approx 0.707$ ms, and $|X|^2 \propto e^{-\sigma^2\omega^2}$ gives $\Delta\omega = 1/(\sigma\sqrt{2}) \approx 707$ rad/s. Product: $\Delta t\,\Delta\omega = \tfrac12$ **exactly** — the only family that achieves it. Compress to $\sigma = 0.5$ ms: $\Delta t$ halves, $\Delta\omega$ doubles, product still $\tfrac12$. The see-saw pivots; the floor holds.

## @misconceptions
- wrong: "Bandwidth is a single well-defined number for a signal."
  tempting: "Datasheets and problems say 'the bandwidth' with a definite article, so it must be unique."
  correction: "There are (at least) four standard rulers — 3-dB, first-null, 90%-energy, RMS — and they disagree, sometimes by factors of 5–10, and some may not even exist for a given signal. A bandwidth number is meaningless until the definition is named."
  probe: q-ruler
- wrong: "Making a pulse shorter makes its spectrum narrower too — smaller signal, smaller everything."
  tempting: "Compressing feels like shrinking; surely both plots shrink."
  correction: "Time and frequency sit on a see-saw: x(at) with a>1 compresses time but stretches the spectrum by the same factor. Shorter pulse ⇒ WIDER bandwidth. The product resists; it never drops below 1/2 (RMS rulers)."
- wrong: "The RMS bandwidth of a rectangular pulse is some finite number you compute like any other."
  tempting: "The sinc spectrum decays, so its spread should be finite."
  correction: "sinc² decays only like 1/ω², so ω²·|X|² tends to a constant and the second moment DIVERGES. Any jump in x(t) puts impulses in x′ and makes slope energy infinite. Say 'diverges' — that is the full-marks answer — and switch to 3-dB or 90%-energy to compare."
  probe: q-rms-rect
- wrong: "−3 dB means the amplitude has dropped to half."
  tempting: "3 dB, half… the words rhyme."
  correction: "Half POWER. |X|² falls to 1/2, so |X| falls to 1/√2 ≈ 0.707. Reading 0.5 on an amplitude plot lands you at the −6 dB point instead."

## @exam

**Where it appears:** Minor I and the Major, 4–8 marks. Patterns: (a) *define* two bandwidth measures and compute both for $e^{-at}u(t)$ or a rect pulse; (b) "can a signal be both time-limited and band-limited? Justify" (conceptual, 3–4 marks); (c) verify $\Delta t\,\Delta\omega = 1/2$ for a Gaussian; (d) radar/comms numerical via $\Delta R = c/2B$ or "pulse halved ⇒ bandwidth?"

**The method that earns full marks:** (1) **name the ruler** before computing — examiners award the definition line; (2) write $|X(j\omega)|^2$ explicitly; (3) solve the ruler's defining equation (half-power equation, energy fence via Parseval, second moment); (4) state units and convert rad/s ↔ Hz with the $2\pi$ shown; (5) sanity-check with the see-saw: any answer where a shorter pulse got a *narrower* spectrum is wrong before you re-derive anything.

**Traps that cost marks:** reading 3-dB as half *amplitude* (it is half power, 0.707 amplitude); dropping the $2\pi$ between Hz and rad/s; computing a "finite" RMS bandwidth for rect or one-sided exp instead of writing **diverges**; applying $\Delta t\,\Delta\omega \ge \tfrac12$ to 3-dB widths (the bound is a statement about the RMS pair); inventing a first-null for a monotone spectrum instead of writing "does not exist."

## @interview

One-liners worth owning: "Why can't ideal filters exist? — band-limited ⇒ the impulse response is an everywhere-alive power series, so it's non-causal and eternal." "Which bandwidth would you quote for a sinc-spectrum pulse? — 90%-energy or first-null; RMS diverges because of the time-domain edges." "Why is the Gaussian special? — it is the unique equality case of Cauchy–Schwarz in the uncertainty proof: slope proportional to t·x forces $e^{-\lambda t^2}$." "What does chirp radar exploit? — resolution depends on bandwidth, not duration, so sweep frequency instead of shortening the pulse."

## @history

Heisenberg's 1927 uncertainty principle was a statement about position and momentum — which are a Fourier pair in quantum mechanics, so the mathematics is *this* mathematics. Dennis Gabor's 1946 "Theory of Communication" carried it into engineering: he tiled the time–frequency plane into minimum-area cells ("logons"), showed the Gaussian pulse is the unique shape achieving the cell, and in passing invented the short-time spectral analysis that became the spectrogram — and, decades later, seeded wavelets. The same integral by parts underlies your radar's spec sheet and an electron's blur.

## @summary

$$\Delta t^2 = \frac{1}{E}\int t^2|x|^2 dt \qquad \Delta\omega^2 = \frac{1}{2\pi E}\int \omega^2|X|^2 d\omega \qquad \boxed{\Delta t\,\Delta\omega \ge \tfrac12}$$

- **Four rulers:** 3-dB (half power, $|X| \to 0.707|X|_{\max}$) · first-null (first zero of $X$; may not exist) · 90%-energy (Parseval fence) · RMS (second moment; tail-sensitive).
- **Reference numbers:** rect width $T$: 3-dB $\approx 2.78/T$, first-null $= 2\pi/T$, main lobe holds $\approx 90\%$ of energy, RMS **diverges**. One-sided exp $e^{-at}u(t)$: 3-dB $= a$, $W_{90} \approx 6.31a$, no first null, RMS **diverges**. Gaussian ($\sigma$): 3-dB $\approx 0.83/\sigma$, $\Delta\omega = 1/(\sigma\sqrt2)$, product exactly $\tfrac12$.
- **See-saw:** $x(at)$ ⇒ duration $\div a$, bandwidth $\times a$; product invariant. Shorter is always wider.
- **RMS bandwidth = slope energy:** $\Delta\omega^2 E = \int (x')^2 dt$; any jump ⇒ diverges ⇒ compare by 3-dB / 90%-energy.
- **Exclusion:** time-limited and band-limited together only for $x \equiv 0$; hence ideal (brick-wall) filters are unrealizable (non-causal sinc $h$).
- **Gaussian:** the unique product-minimizer, $\Delta t\,\Delta\omega = \tfrac12$.
- **Radar:** $\Delta R = c\tau/2 = c/(2B)$ — resolution is bought with bandwidth (chirp: long pulse, wide band).
- **Exam ritual:** name the ruler → write $|X|^2$ → solve its equation → units ($2\pi$!) → see-saw sanity check.
