# Content authoring contract — Signals Companion (EC2102)

Every concept is a directory `content/<group>/<name>/` containing `concept.md`
(required), `practice.yaml` (required), `flashcards.yaml` (required),
`widgets.yaml` (only if the concept mounts interactives).
**The gold standard is `content/m1/convolution/` — match its depth, voice, and structure.**

## concept.md

```markdown
---
id: m1/impulse                        # MUST match the id in content/modules.yaml
title: "Long descriptive title with a hook"
short: Impulse                        # sidebar label, ≤ 3 words
module: 1                             # 0 for primers
tier: core                            # core | supplementary | enrichment — anything the SYLLABUS names is core
hero: false
outcomes: [CO1]
prereqs: [m1/elementary-signals]      # ids; forward refs OK (dropped w/ warning until written)
aliases: ["dirac delta", "unit impulse"]   # search synonyms — be generous
exam: { minor1: high, major: medium, marks: "4–8", styles: [compute, conceptual] }
crosslinks:
  - { target: m2/fourier-transform, relation: "one-line why they connect" }
---
```

### Facets (## @name delimiters), in this order

- `## @intuition` — REQUIRED. 3–6 blocks separated by `---` lines. Block 1 is the HOOK
  (the engineering problem this concept exists to solve — no math, no definitions).
  Each block ≤ 90 words. A block may open with `@viz widget-id {"param":"value"}`
  to drive the adjacent interactive to a state as the student reads.
  Intuition BEFORE mathematics: no display equations in blocks 1–2; introduce the
  formula only after the idea exists, symbol-by-symbol.
- `## @definition` — REQUIRED. The formal statement(s) + a "Reading the symbols"
  paragraph explaining what each symbol does. Include the conventions used at exams.
- `## @derivation` — REQUIRED. `### Step: <claim>` headings; first line after may be
  `?why: <one-line justification of legality>`; then the math. 3–7 steps. End with a
  "notice what was NOT assumed" style step where it teaches something.
- `## @examples` — REQUIRED. 2–3 fully worked examples, at least one in exact
  university-exam style (regime tables, partial fractions, etc.), one with an
  engineering skin (circuits, audio, comms). Show the METHOD ritual explicitly.
- `## @misconceptions` — YAML list: `- wrong:` / `tempting:` / `correction:` / optional `probe: <quiz-id>`.
  2–4 entries. These power distractors and repair content — make them the real errors.
- `## @exam` — REQUIRED. Where it appears (Minor I/II/Major), the full-marks method,
  the traps that cost marks. Concrete, mark-scheme flavored.
- `## @interview` — one tight paragraph of conceptual one-liners.
- `## @history` — optional, one paragraph, only if genuinely motivating.
- `## @summary` — REQUIRED. The quick-reference card: formulas + bullet rules.
  This is what a student scans mid-problem — complete and scannable.

Optional extras where valuable: `## @applications`, `## @code`, `## @whatif`, `## @research`.

### Math & style
- KaTeX: `$...$` inline, `$$...$$` display. NO `\begin{align}` (use aligned inside $$).
- No external links anywhere (offline app; build fails on http references).
- Voice: direct, precise, second person sparingly. Never "simply/obviously/clearly".
- Color convention app-wide: τ (integration/sliding variable) is amber; t (frozen
  output time) is blue. Mention colors only when a widget is beside the text.
- In YAML strings, escape backslashes: `"\\delta(t)"`.

## practice.yaml

```yaml
predict:                       # the concept's ONE mandatory prediction gate
  kind: choice
  prompt: |
    Scenario... **Commit before you watch:** question?
  choices: ["...", "...", "...", "..."]   # engineer distractors FROM the misconceptions
  answer: 2                    # index
  resolution: |
    Why the right one is right AND why the most tempting wrong one tempts.

quiz:                          # 5–7 items; ≥4 tagged [checkpoint]
  - id: q-something            # stable id, never renamed
    kind: mcq                  # mcq | numeric | expression | steporder
    tags: [checkpoint]
    prompt: "..."
    choices: ["...", "..."]    # mcq/steporder
    answer: 1                  # mcq: index; numeric: value; expression: reference string; steporder: [2,0,1]
    tolerance: 0.01            # numeric only
    vars: [t]                  # expression only: variable names
    explanation: "Why — one or two sentences, forward-linking."
```
Item mix per concept: 1 conceptual discrimination, 1 computation, 1 misconception trap,
1 exam-pattern mechanics item, 1 transfer/interleave item touching a PREVIOUS concept.
Expression answers use the checker grammar: variables t,n,w,s; functions sin cos exp
u (unit step) r (ramp) sgn sinc abs sqrt ln; `e^(-2t)` works; pi.

## flashcards.yaml
3–5 cards, ATOMS only (definitions, formula rows, conditions, pairs) — procedures
live in quiz items, not cards. Front = retrieval prompt, back = tight answer.

## widgets.yaml

```yaml
widgets:
  - id: local-name
    type: TypeFromCatalog
    title: "Student-facing title — say what to DO"
    params: { ... }            # defaults; must be valid per catalog below
    presets:
      - { label: "insight-forcing preset name", params: { ... } }
```

### WIDGET CATALOG (only these types exist — do not invent types)

| Type | Params | What it shows |
|---|---|---|
| ConvolutionMachine | x,h ∈ rect1,rect2,exp,tri,impulsePair,halfsin; view: slide,echo; t | flip&slide + echo superposition, CT/DT |
| FourierSeriesBuilder | target: square,triangle,sawtooth,halfsin; n | partial sums, clickable spectrum, Gibbs magnifier |
| PoleZeroExplorer | preset: lp1,resonator,overdamped,notch,allpass,unstable; k | drag poles/zeros ↔ h(t) modes ↔ |H|,∠H, geometric eval |
| SignalExplorer | signal: flag,pulse,expdecay,rampsig; a,b | y(t)=x(at−b) two-path transform machine, feature tracking |
| EnergyPowerRace | signal: rect,expdecay,step,sine,ramp | E(T),P(T) racing meters → energy/power/neither verdict |
| PeriodicityDetector | f1,f2 (CT) or mode:"dt",omega | rational-ratio periodicity, DT cos(Ωn) surprise |
| EvenOddDecomposer | signal: expu,pulse,rampsig | x_e, x_o panes + reassembly, orthogonality teaser |
| ImpulseForge | family: rect,tri,gauss | unit-area pulse width→0 through an RC: shape-independent limit |
| SystemTester | — | black-box lab: probe mystery systems with linearity/TI/causality/memory/stability rigs |
| FSFTBridge | width | period T slider: T·cₖ line spectrum densifying under the invariant sinc envelope |
| CTFTExplorer | signal: rect,tri,gauss,expu,twoexp,cosburst; band selector | pair gallery + property levers (shift/scale/modulate), band-energy ledger (Parseval) |
| UncertaintySeeSaw | family: gauss,rect,expu | Δt vs Δω see-saw; width-definition picker; time-limit ⇒ ∞ bandwidth demo |
| NoisePSDLab | — | seeded noise: single periodogram stays jagged, Welch averaging flattens; RC coloring ×|H|² |
| HilbertDemo | f0, df | two-tone beats: envelope |z(t)|, 90° shifter view, beat rate Δω |
| FreqResponseProbe | plant: rc,msd | sweep ω, measure gain & phase from waveforms, trace out |H| experimentally |
| SPlaneAtlas | sigma,omega | drag s: waveform e^{st} atlas (decay/growth/oscillation map) |
| ROCExplorer | mode: s,z; signal: rightexp,leftexp,twosided,growright | σ-slider tames x(t): integrability verdict paints the ROC; same X(s), two signals |
| ZPlaneAtlas | r,omega | drag z: rⁿcos(Ωn) stems; e^{sT} strip-to-disk bridge |
| DifferenceEquationMachine | a1,a2,b0; input: delta,step,cos | hand-crank recursion tape + live z-plane poles; Fibonacci preset |
| BlockDiagramSandbox | topology: cascade,parallel,feedback,feedforward,cancelhazard | composite ZPK + response; parallel creates zeros; RHP cancellation hazard |
| FeedbackExplorer | plant: motor,integrator,double,resonant,rhpzero | K slider sweeps closed-loop poles with trails + step response |
| SamplingLab | f, fs; recon: ideal,zoh | replicas slide with fs, aliased reconstruction threads the samples, sinc rebuild, audio A/B |
| DTFTExplorer | seq: pulse,expn,coswin; a,n0,len | 2π-periodic spectrum ribbon; window length ↔ mainlobe width |
| PhasePortrait | a11,a12,a21,a22; mode: free,control | vector field + trajectories + eigenlines; control mode: B arrow, reachability, rank |
| BodeWorkbench | preset: motor,resonant,lag,rhpz; k | log-axis mag/phase, asymptote overlay, GM/PM brackets + closed-loop step echo |
| NyquistVoyage | preset: stable2,integrator,unstable1; k | D-contour march → image trace, count-then-reveal encirclements, Z=N+P ledger |

## CORRECTNESS LEDGER (non-negotiable; violations = build rejected)
- FS time reversal: x(−t) ↔ c₋ₖ in general; = cₖ* ONLY for real x — state it that way.
- FT existence: "ROC contains jω axis" applies in the ordinary (absolutely integrable)
  sense; u(t), cos ω₀t, periodic signals have DISTRIBUTIONAL pairs (πδ(ω)+1/jω etc.) —
  present the table pairs as such, never as contradictions.
- Uncertainty: RMS bandwidth of rect/one-sided-exp DIVERGES — compare families with
  90%-energy or 3-dB widths; say "diverges" honestly where it does.
- Hilbert/beats: cos(ω₁t)+cos(ω₂t) has envelope 2|cos(Δω t/2)| whose AUDIBLE beat
  rate is Δω (period-halving by |·|); instantaneous frequency is meaningless for
  multicomponent signals — say so.
- DT periodicity: cos(Ω₀n) periodic iff Ω₀/2π rational — decide symbolically, never
  by float approximation. cos(0.5n) is NOT periodic.
- Impulse: δ is defined by sifting under an integral, never by a "value at 0";
  every limiting family must be unit-area.
- White noise: exam convention is CT analytic — PSD N₀/2 flat, R(τ)=(N₀/2)δ(τ) (an
  impulse, not a finite spike), output PSD (N₀/2)|H(jω)|², output power by integral.
  The sampled/estimated view (periodogram, Welch) is the MEASURED view — label it so.
- FVT: lim_{t→∞} f(t) = lim_{s→0} sF(s) VALID ONLY when all poles of sF(s) are in
  the open LHP — always include an illegal-application counterexample.
- Unilateral vs bilateral LT: unilateral carries initial conditions via
  sX(s) − x(0⁻); exams use 0⁻. Say which transform each statement is about.
- ROC: right-sided ⇒ right of rightmost pole; left-sided ⇒ left; two-sided ⇒ strip;
  z-domain: annulus; aⁿu[n] and −aⁿu[−n−1] share X(z) — ROC disambiguates.
- Nyquist: P = number of STRICTLY-RHP open-loop poles (axis poles handled by
  indentation); Z = N + P with clockwise-encirclement counting stated explicitly;
  trace through −1 ⇒ marginal, count undefined.
- Controllability/observability: the exam skill is the Kalman rank test computed by
  hand: rank[B AB (A²B)] = n, rank[C; CA; (CA²)] = n. Teach the hand computation.
- Bode: asymptotes ±20 dB/dec per pole/zero at corner; phase ±90° smeared over
  ±1 decade; GM at phase crossover, PM at gain crossover — with numeric reading drills.
- Gramian ellipse (if mentioned): the UNIT-INPUT-ENERGY reachable set — label it.
- Walsh–Hadamard: include the H₂ₙ = [[Hₙ,Hₙ],[Hₙ,−Hₙ]] recursion and a worked
  4-point coefficient computation (exams ask exactly this).
