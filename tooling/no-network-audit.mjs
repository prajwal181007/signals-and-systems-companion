// Structural no-network guarantee: nothing in dist/ may reference a remote resource.
// Scans every shipped text file for URL patterns in any position — attributes, CSS,
// string literals — because a network reference that "probably never fires" is still
// a network reference.
import fs from 'node:fs';
import path from 'node:path';

const TEXT_EXT = new Set(['.html', '.js', '.css', '.txt', '.json', '.svg']);

// Allowed: data: URIs, file-relative paths, fragment/hash refs, xml namespaces (inert
// identifiers in svg/html), and the W3C namespace URIs that appear inside KaTeX's MathML
// output as attribute identifiers (never fetched).
const INERT = [
  /^data:/,
  /xmlns/,
  /www\.w3\.org/,
  /registry\.npmjs\.org/, // package-lock style refs never ship, but be explicit
];

const PATTERNS = [
  /https?:\/\/[^\s"'`<>)]+/g, // absolute URLs
  /url\(\s*\/\//g,            // protocol-relative in CSS
  /src\s*=\s*["']\/\//g,      // protocol-relative in HTML
  /\bimport\s*\(\s*["'`]https?/g,
  /new\s+WebSocket\s*\(/g,
  /navigator\.sendBeacon/g,
  /XMLHttpRequest/g,
  // Global fetch only — KaTeX defines/calls an internal .fetch() tokenizer
  // method, so exclude call sites preceded by a dot AND method definitions
  // (which appear as `}fetch(){` or `;fetch(){` in minified class bodies).
  /(?<![.\w])fetch\s*\((?!\s*\)\s*\{)/g,
];

export function auditDist(dist) {
  const violations = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) { walk(p); continue; }
      if (!TEXT_EXT.has(path.extname(name))) continue;
      const text = fs.readFileSync(p, 'utf8');
      for (const pat of PATTERNS) {
        pat.lastIndex = 0;
        let m;
        while ((m = pat.exec(text)) !== null) {
          const hit = m[0];
          const ctx = text.slice(Math.max(0, m.index - 40), m.index + hit.length + 20).replace(/\n/g, ' ');
          if (INERT.some((rx) => rx.test(hit) || rx.test(ctx))) continue;
          violations.push(`${path.relative(dist, p)}: ${hit.slice(0, 80)}  …${ctx.slice(0, 100)}`);
        }
      }
    }
  };
  walk(dist);
  return violations;
}

// CLI use: node tooling/no-network-audit.mjs [distPath]
if (process.argv[1] && process.argv[1].endsWith('no-network-audit.mjs')) {
  const dist = process.argv[2] || path.join(path.dirname(process.argv[1]), '..', 'dist');
  const v = auditDist(dist);
  if (v.length) { console.error(v.join('\n')); process.exit(1); }
  console.log('no-network audit: clean');
}
