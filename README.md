# Signals Companion

A fully-offline learning companion for a university Signals & Systems course
(EC2102). One folder; open `index.html`; no internet, no install, no account —
for a whole semester.

Built around a simple conviction: intuition before mathematics. Every concept
opens with the engineering problem it exists to solve, asks you to commit to a
prediction before showing the answer, teaches through a live interactive
laboratory, and only then presents the formalism — followed by worked examples,
the misconceptions that actually cost marks, and an exam-focused summary.

## What's inside

- **54 concepts** covering the full course: five bridge primers (complex
  numbers, integration patterns, partial fractions, linear algebra,
  expectation) plus all five modules — signals & LTI systems, Fourier analysis
  & noise, Laplace & Z transforms, sampling & interconnection, state-space &
  stability.
- **27 hand-built interactive laboratories** on a custom canvas kernel:
  a convolution machine (flip-and-slide *and* superposition-of-echoes views),
  a Fourier series builder with a Gibbs magnifier, an ROC explorer, a sampling
  & aliasing lab with audio A/B, a Bode workbench with live margins, a Nyquist
  voyage with count-before-reveal, phase portraits with a controllability
  steering game, and more.
- **315 quiz items** (including free-form expression answers checked by
  numerical equivalence — any algebraically equivalent form is accepted),
  **231 flashcards** on an exam-aware FSRS scheduler, drill generators, and
  printable mock exams.
- **⌘K search** across every explanation, formula, and misconception; a
  concept atlas; printable formula sheets; exam countdowns with honest triage.

## Run it

Open `dist/index.html` in Chrome (or unzip a release and open `index.html`).
That's the entire installation procedure. Progress is stored by the browser —
use the export button on the Today screen to back it up or move machines.

## Build from source

```bash
npm install
node build.mjs --strict --minify
```

The compiler turns `content/**/concept.md` + YAML sidecars into pre-rendered
data files (math typeset at build time — the running app does no LaTeX
parsing), bundles the engine to classic IIFE scripts (no ES modules, no
`fetch` — everything works from `file://`), and fails the build on any schema
violation, dangling cross-reference, or external network reference.

## Architecture in one paragraph

Content is data: each concept is a Markdown file with structured facets
(intuition → definition → derivation → examples → misconceptions → exam lens →
summary) plus YAML sidecars for widgets, quizzes, and flashcards
(`CONTENT-GUIDE.md` is the authoring contract). The engine is dependency-free
TypeScript — hash router, layered persistence (localStorage with CRC + backup
ring → IndexedDB mirror → file export/import), FSRS scheduler, quiz runner,
search over a prebuilt index, and a small canvas plotting kernel that all
widgets share. The only third-party code that ships is KaTeX.

## License

MIT — see [LICENSE](LICENSE). Third-party attributions (KaTeX, build tools,
and the published algorithms implemented here) are in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
