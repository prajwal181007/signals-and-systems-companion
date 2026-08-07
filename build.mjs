// Build pipeline: content → data/*.js, engine → IIFE bundles, shell → dist/.
// The shipped artifact in dist/ is pure static files, openable via file://.
import * as esbuild from 'esbuild';
import { compileContent } from './compiler/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');

const t0 = Date.now();
const args = new Set(process.argv.slice(2));

// ---------- 1. Clean dist ----------
fs.rmSync(DIST, { recursive: true, force: true });
for (const d of ['app/styles', 'app/vendor', 'data/concepts', 'data/posters']) {
  fs.mkdirSync(path.join(DIST, d), { recursive: true });
}

// ---------- 2. Compile content (md/yaml → pre-rendered .js data files) ----------
const manifest = await compileContent({
  contentDir: path.join(ROOT, 'content'),
  outDir: path.join(DIST, 'data'),
});

// ---------- 3. Bundle engine + widgets as classic IIFE scripts ----------
const common = {
  bundle: true,
  format: 'iife',
  target: ['chrome100', 'safari15', 'firefox100'],
  minify: args.has('--minify'),
  sourcemap: false,
  logLevel: 'silent',
};
await esbuild.build({ ...common, entryPoints: [path.join(ROOT, 'engine/src/main.ts')], outfile: path.join(DIST, 'app/engine.js') });
await esbuild.build({ ...common, entryPoints: [path.join(ROOT, 'engine/src/widgets/index.ts')], outfile: path.join(DIST, 'app/widgets.js') });

// ---------- 4. App styles ----------
fs.copyFileSync(path.join(ROOT, 'engine/src/app.css'), path.join(DIST, 'app/styles/app.css'));

// ---------- 5. KaTeX: runtime JS (dynamic surfaces only) + CSS with fonts inlined as data URIs ----------
const katexDist = path.join(ROOT, 'node_modules/katex/dist');
fs.copyFileSync(path.join(katexDist, 'katex.min.js'), path.join(DIST, 'app/vendor/katex.min.js'));
let katexCss = fs.readFileSync(path.join(katexDist, 'katex.min.css'), 'utf8');
// Each @font-face src lists woff2,woff,ttf. Keep only woff2, embedded — no file requests, no
// file:// @font-face CORS failure mode, no FOUT.
katexCss = katexCss.replace(/src:[^;}]+/g, (srcDecl) => {
  const m = srcDecl.match(/url\((fonts\/[^)]+\.woff2)\)/);
  if (!m) return srcDecl;
  const fontFile = path.join(katexDist, m[1]);
  const b64 = fs.readFileSync(fontFile).toString('base64');
  return `src:url(data:font/woff2;base64,${b64}) format("woff2")`;
});
fs.writeFileSync(path.join(DIST, 'app/styles/katex.css'), katexCss);

// ---------- 6. Shell ----------
const shell = fs.readFileSync(path.join(ROOT, 'engine/src/shell.html'), 'utf8');
fs.writeFileSync(path.join(DIST, 'index.html'), shell);
fs.writeFileSync(path.join(DIST, 'README.txt'),
`Signals Companion — EC2102 Signals and Systems (offline learning app)

1. Open index.html in Chrome (recommended) or Safari. No internet needed, ever.
2. Your progress is stored by the BROWSER, not in this folder. Use the export
   button on the Today screen weekly (and before exams) to save a backup file.
3. To move to another computer: copy this folder, then import your backup there.
`);

// ---------- 7. No-network audit (structural guarantee #1) ----------
const { auditDist } = await import('./tooling/no-network-audit.mjs');
const violations = auditDist(DIST);
if (violations.length) {
  console.error('NO-NETWORK AUDIT FAILED:');
  for (const v of violations) console.error('  ' + v);
  process.exit(1);
}

console.log(`build ok — ${manifest.concepts.length} concepts, dist ready (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
