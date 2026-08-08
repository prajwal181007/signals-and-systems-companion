# Third-party notices

This project is MIT-licensed (see LICENSE). It stands on the following
third-party work, listed here so redistribution is clean.

## Shipped with the application

### KaTeX
The only third-party code included in the built application
(`app/vendor/katex.min.js`, `app/styles/katex.css`, and the KaTeX web fonts
embedded in that CSS as data URIs).

- Project: https://github.com/KaTeX/KaTeX
- License: MIT

> MIT License
>
> Copyright (c) 2013-2020 Khan Academy and other contributors
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
> FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
> IN THE SOFTWARE.

The KaTeX fonts (derived from Computer Modern) are distributed by the KaTeX
project under the same MIT license.

## Build-time only (never shipped)

Used by the compiler/bundler; none of their code appears in the built app:

- **esbuild** (MIT) — bundling. https://github.com/evanw/esbuild
- **marked** (MIT) — Markdown parsing at build time. https://github.com/markedjs/marked
- **js-yaml** (MIT) — YAML parsing at build time. https://github.com/nodeca/js-yaml
- **katex** npm package (MIT) — server-side math rendering at build time.

## Algorithms implemented from published descriptions

No code was copied from these; the implementations in `engine/src/` are
original, written against the published algorithm descriptions:

- **FSRS** (Free Spaced Repetition Scheduler) — the review scheduler in
  `engine/src/srs.ts` implements the FSRS-4.5 formulas and default weights
  published by the open-spaced-repetition project (MIT).
  https://github.com/open-spaced-repetition/fsrs4anki
- **Cooley–Tukey radix-2 FFT** (Cooley & Tukey, 1965) — `engine/src/math/fft.ts`.
- **Durand–Kerner (Weierstrass) simultaneous root finding** —
  `engine/src/math/zpk.ts`.
- **CRC-32** (standard polynomial 0xEDB88320) — `engine/src/store.ts`.
- **xorshift32 PRNG** (Marsaglia, 2003) — seeded noise in the widgets.
- **Smith's algorithm** for overflow-safe complex division —
  `engine/src/math/complex.ts`.

## Course content

All explanatory prose, examples, quiz items, and flashcards in `content/` were
written for this project. The topic structure follows the EC2102 course
syllabus (Mahindra University). The mathematical results presented are the
standard, long-established material of every signals-and-systems curriculum;
the canonical textbook treatments consulted as references are:

- A. V. Oppenheim, A. S. Willsky, S. H. Nawab, *Signals & Systems*, 2nd ed., PHI.
- S. Haykin, B. Van Veen, *Signals and Systems*, 2nd ed., Wiley.

No text from these books is reproduced.
