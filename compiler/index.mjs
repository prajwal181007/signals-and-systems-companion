// Content compiler: content/**/concept.md + yaml sidecars → dist/data/*.js
// Content is data; a schema violation fails the BUILD, never the student's session.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { renderMarkdown, renderInlineMath } from './render.mjs';

const REQUIRED_FACETS = ['intuition', 'definition', 'derivation', 'examples', 'exam', 'summary'];
const OPTIONAL_FACETS = ['visual', 'applications', 'interview', 'code', 'history', 'research', 'whatif', 'misconceptions'];
const ALL_FACETS = new Set([...REQUIRED_FACETS, ...OPTIONAL_FACETS]);
const TIERS = new Set(['core', 'supplementary', 'enrichment']);

export async function compileContent({ contentDir, outDir }) {
  const errors = [];
  const warn = (msg) => console.warn('  [content] ' + msg);
  const fail = (msg) => errors.push(msg);

  // ---------- modules & glossary ----------
  const modulesPath = path.join(contentDir, 'modules.yaml');
  const modules = fs.existsSync(modulesPath)
    ? yaml.load(fs.readFileSync(modulesPath, 'utf8'))
    : { modules: [], exams: {} };
  const glossaryPath = path.join(contentDir, 'glossary.yaml');
  const glossary = fs.existsSync(glossaryPath)
    ? yaml.load(fs.readFileSync(glossaryPath, 'utf8'))
    : { synonyms: [] };

  // ---------- discover concepts ----------
  const conceptDirs = [];
  for (const group of fs.readdirSync(contentDir)) {
    const gdir = path.join(contentDir, group);
    if (!fs.statSync(gdir).isDirectory()) continue;
    for (const c of fs.readdirSync(gdir)) {
      const cdir = path.join(gdir, c);
      if (fs.statSync(cdir).isDirectory() && fs.existsSync(path.join(cdir, 'concept.md'))) {
        conceptDirs.push({ group, name: c, dir: cdir });
      }
    }
  }

  const strictMode = process.argv.includes('--strict');
  const concepts = [];
  for (const { group, name, dir } of conceptDirs) {
    try {
      concepts.push(await compileConcept({ group, name, dir, fail }));
    } catch (e) {
      // Construction mode: a broken concept is skipped (app still builds with
      // the healthy subset). --strict (final hardening) fails the build.
      (strictMode ? fail : warn)(`${group}/${name}: ${e.message}${strictMode ? '' : ' — SKIPPED'}`);
    }
  }

  // ---------- cross-validation ----------
  // During construction a forward reference (prereq/crosslink to a concept not
  // yet written) warns and is dropped from the emitted unit — the runtime never
  // sees a dead link. `--strict` (final hardening) turns these into errors.
  const strict = process.argv.includes('--strict');
  const ids = new Set(concepts.map((c) => c.id));
  for (const c of concepts) {
    for (const p of c.prereqs.slice()) {
      if (!ids.has(p)) {
        (strict ? fail : warn)(`${c.id}: prereq "${p}" does not resolve${strict ? '' : ' (dropped for now)'}`);
        c.prereqs = c.prereqs.filter((x) => x !== p);
      }
    }
    for (const l of c.crossLinks.slice()) {
      if (!ids.has(l.target)) {
        (strict ? fail : warn)(`${c.id}: crossLink "${l.target}" does not resolve${strict ? '' : ' (dropped for now)'}`);
        c.crossLinks = c.crossLinks.filter((x) => x !== l);
      }
    }
  }
  // Stable-ID registry: removing an id strands SRS state — hard error unless tombstoned.
  const regPath = path.join(contentDir, '..', 'tooling', 'id-registry.json');
  const prevIds = fs.existsSync(regPath) ? JSON.parse(fs.readFileSync(regPath, 'utf8')) : [];
  const tombstones = new Set(modules.tombstones || []);
  for (const old of prevIds) {
    if (!ids.has(old) && !tombstones.has(old)) fail(`concept id "${old}" was removed — add it to modules.yaml tombstones or restore it (SRS state keys on ids)`);
  }

  if (errors.length) {
    console.error('CONTENT BUILD FAILED:');
    for (const e of errors) console.error('  ✗ ' + e);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(regPath), { recursive: true });
  fs.writeFileSync(regPath, JSON.stringify([...ids].sort(), null, 1));

  // ---------- order concepts per modules.yaml ----------
  const orderIndex = new Map();
  let i = 0;
  for (const m of modules.modules || []) for (const id of m.concepts || []) orderIndex.set(id, i++);
  for (const c of concepts) if (!orderIndex.has(c.id) && c.tier !== 'enrichment') warn(`${c.id} not listed in modules.yaml ordering`);
  concepts.sort((a, b) => (orderIndex.get(a.id) ?? 9e9) - (orderIndex.get(b.id) ?? 9e9));

  // ---------- emit per-concept data files ----------
  const conceptsOut = path.join(outDir, 'concepts');
  fs.mkdirSync(conceptsOut, { recursive: true });
  for (const c of concepts) {
    fs.writeFileSync(
      path.join(conceptsOut, c.slug + '.js'),
      `SC.register("concept",${JSON.stringify(stripCompileOnly(c))});\n`
    );
  }

  // ---------- manifest ----------
  const manifest = {
    v: 1,
    course: modules.course || { code: 'EC2102', name: 'Signals and Systems' },
    modules: (modules.modules || []).map((m) => ({
      num: m.num, title: m.title, short: m.short || `Module ${m.num}`,
      concepts: (m.concepts || []).filter((id) => ids.has(id)),
    })),
    exams: modules.exams || {},
    concepts: concepts.map((c) => ({
      id: c.id, slug: c.slug, title: c.title, short: c.short || c.title,
      module: c.module, tier: c.tier, outcomes: c.outcomes,
      prereqs: c.prereqs, heroes: c.hero || false,
      cards: c.flashcards.length, quiz: c.quiz.length,
    })),
  };
  fs.writeFileSync(path.join(outDir, 'manifest.js'), `SC.register("manifest",${JSON.stringify(manifest)});\n`);

  // ---------- search index ----------
  const index = buildSearchIndex(concepts, glossary);
  fs.writeFileSync(path.join(outDir, 'search-index.js'), `SC.register("searchIndex",${JSON.stringify(index)});\n`);

  return manifest;
}

// ---------------------------------------------------------------- concept
async function compileConcept({ group, name, dir, fail }) {
  const raw = fs.readFileSync(path.join(dir, 'concept.md'), 'utf8');
  const { fm, body } = splitFrontmatter(raw);
  const id = fm.id || `${group}/${name}`;
  const slug = id.replace(/\//g, '--');

  if (!fm.title) throw new Error('missing title');
  if (!TIERS.has(fm.tier)) throw new Error(`tier must be one of core|supplementary|enrichment (got "${fm.tier}")`);
  if (!Number.isInteger(fm.module) && group !== 'primers') throw new Error('missing module number');

  // ---- facet splitting: "## @facetname" delimiters ----
  const facetSrc = {};
  const parts = body.split(/^##\s*@([a-z-]+)\s*$/m);
  for (let i = 1; i < parts.length; i += 2) {
    const fname = parts[i].replace(/-/g, '');
    if (!ALL_FACETS.has(fname)) throw new Error(`unknown facet "@${parts[i]}"`);
    facetSrc[fname] = parts[i + 1].trim();
  }
  const waived = new Set(fm.waived || []);
  for (const w of waived) {
    if (REQUIRED_FACETS.includes(w)) throw new Error(`facet "${w}" is required and cannot be waived`);
  }
  for (const req of REQUIRED_FACETS) {
    if (!facetSrc[req] || !facetSrc[req].trim()) throw new Error(`missing required facet "@${req}"`);
  }

  // ---- widgets sidecar ----
  const widgets = loadYaml(dir, 'widgets.yaml')?.widgets || [];
  for (const w of widgets) {
    if (!w.id || !w.type) throw new Error(`widget entries need id and type`);
  }
  const widgetIds = new Set(widgets.map((w) => w.id));

  // ---- render facets (KaTeX at build time; widget slots resolved) ----
  const facets = {};
  for (const [fname, src] of Object.entries(facetSrc)) {
    if (fname === 'intuition') {
      // Structured: blocks split on "---" lines; each block may pin a widget state
      // via a leading line "@viz widgetId {json-params}".
      facets.intuition = { blocks: await renderIntuitionBlocks(src, widgetIds, id) };
    } else if (fname === 'derivation') {
      facets.derivation = await renderDerivationSteps(src, id); // { preambleHtml, list }
    } else if (fname === 'misconceptions') {
      facets.misconceptions = await renderMisconceptions(src, id);
    } else {
      facets[fname] = { html: await renderWithWidgetSlots(src, widgetIds, id) };
    }
  }

  // ---- practice sidecar ----
  const practice = loadYaml(dir, 'practice.yaml') || {};
  const quiz = [];
  for (const q of practice.quiz || []) {
    if (!q.id || !q.kind) throw new Error(`quiz items need id and kind`);
    quiz.push({
      id: `${id}#${q.id}`, kind: q.kind,
      promptHtml: await renderMarkdown(q.prompt || ''),
      choices: q.choices ? await Promise.all(q.choices.map((c) => renderMarkdown(String(c)))) : undefined,
      answer: q.answer, tolerance: q.tolerance,
      vars: q.vars, predicate: q.predicate, widgetRef: q.widget,
      explanationHtml: await renderMarkdown(q.explanation || ''),
      tags: q.tags || [], blueprint: q.blueprint || [],
    });
  }
  const predictSrc = practice.predict;
  const predict = predictSrc
    ? {
        promptHtml: await renderMarkdown(predictSrc.prompt),
        kind: predictSrc.kind || 'choice',
        choices: predictSrc.choices ? await Promise.all(predictSrc.choices.map((c) => renderMarkdown(String(c)))) : undefined,
        answer: predictSrc.answer,
        widgetRef: predictSrc.widget,
        resolutionHtml: await renderMarkdown(predictSrc.resolution || ''),
      }
    : null;

  // ---- flashcards sidecar ----
  const cardsRaw = loadYaml(dir, 'flashcards.yaml')?.cards || [];
  const flashcards = [];
  for (const c of cardsRaw) {
    if (!c.id) throw new Error('flashcards need ids');
    flashcards.push({
      id: `${id}#${c.id}`,
      frontHtml: await renderMarkdown(c.front),
      backHtml: await renderMarkdown(c.back),
    });
  }

  return {
    v: 1, id, slug,
    title: fm.title, short: fm.short,
    titleHtml: await renderInlineMath(fm.title),
    module: fm.module ?? 0, tier: fm.tier, hero: !!fm.hero,
    outcomes: fm.outcomes || [], prereqs: fm.prereqs || [],
    aliases: fm.aliases || [], exam: fm.exam || {},
    facets, widgets, quiz, predict, flashcards,
    crossLinks: (fm.crosslinks || []).map((l) =>
      typeof l === 'string' ? { target: l, relation: '' } : { target: l.target, relation: l.relation || '' }),
    _facetSrc: facetSrc, // compile-only: used by the search indexer, stripped before emit
  };
}

async function renderIntuitionBlocks(src, widgetIds, cid) {
  const blocks = [];
  for (const chunk of src.split(/^---$/m)) {
    const text = chunk.trim();
    if (!text) continue;
    let vizState = null;
    let body = text;
    const m = text.match(/^@viz\s+(\S+)(?:\s+(\{.*\}))?\s*\n?/);
    if (m) {
      if (!widgetIds.has(m[1])) throw new Error(`${cid}: intuition block pins unknown widget "${m[1]}"`);
      vizState = { widget: m[1], params: m[2] ? JSON.parse(m[2]) : {} };
      body = text.slice(m[0].length);
    }
    blocks.push({ html: await renderWithWidgetSlots(body, widgetIds, cid), vizState });
  }
  if (!blocks.length) throw new Error(`${cid}: intuition facet is empty`);
  return blocks;
}

async function renderDerivationSteps(src, cid) {
  const steps = [];
  const parts = src.split(/^###\s*Step:\s*/m);
  const preamble = parts[0].trim();
  for (const part of parts.slice(1)) {
    const lines = part.split('\n');
    const claim = lines[0].trim();
    let why = '';
    let bodyLines = lines.slice(1);
    if (bodyLines[0]?.startsWith('?why:')) {
      why = bodyLines[0].slice(5).trim();
      bodyLines = bodyLines.slice(1);
    }
    steps.push({
      claim: await renderInlineMath(claim),
      why: await renderInlineMath(why),
      html: await renderMarkdown(bodyLines.join('\n').trim()),
    });
  }
  if (!steps.length) throw new Error(`${cid}: derivation facet has no "### Step:" entries`);
  return { preambleHtml: preamble ? await renderMarkdown(preamble) : '', list: steps };
}

async function renderMisconceptions(src, cid) {
  // Authored as a YAML list inside the facet for structure.
  const items = yaml.load(src);
  if (!Array.isArray(items)) throw new Error(`${cid}: @misconceptions must be a YAML list (wrong / tempting / correction)`);
  const out = [];
  for (const it of items) {
    if (!it.wrong || !it.correction) throw new Error(`${cid}: misconception entries need "wrong" and "correction"`);
    out.push({
      wrongHtml: await renderMarkdown(it.wrong),
      temptingHtml: await renderMarkdown(it.tempting || ''),
      correctionHtml: await renderMarkdown(it.correction),
      probe: it.probe || null,
    });
  }
  return out;
}

async function renderWithWidgetSlots(src, widgetIds, cid) {
  // {{widget:id}} → placeholder div the runtime mounts into.
  const withSlots = src.replace(/\{\{widget:([a-zA-Z0-9_-]+)\}\}/g, (_, wid) => {
    if (!widgetIds.has(wid)) throw new Error(`${cid}: references unknown widget "${wid}"`);
    return `<div data-widget-slot="${wid}"></div>`;
  });
  return renderMarkdown(withSlots);
}

// ---------------------------------------------------------------- search index
function buildSearchIndex(concepts, glossary) {
  const synonyms = {};
  for (const row of glossary.synonyms || []) {
    const toks = row.map((t) => t.toLowerCase());
    for (const t of toks) synonyms[t] = toks.filter((x) => x !== t);
  }
  const docs = [];
  const postings = {}; // token -> [docIdx, weight] pairs (flattened)
  const addTokens = (text, docIdx, weight) => {
    for (const tok of tokenize(text)) {
      (postings[tok] ||= []).push(docIdx, weight);
    }
  };
  const FACET_TITLES = {
    intuition: 'Intuition', definition: 'Definition & formulas', derivation: 'Derivation',
    examples: 'Worked examples', misconceptions: 'Misconceptions', exam: 'Exam lens',
    summary: 'Quick reference', applications: 'Applications', interview: 'Interview lens',
    code: 'Code', history: 'History', research: 'Research', whatif: 'What if…', visual: 'Visual',
  };
  for (const c of concepts) {
    for (const [fname, src] of Object.entries(c._facetSrc)) {
      const docIdx = docs.length;
      docs.push({
        ref: `${c.id}@${fname}`, concept: c.id, facet: fname,
        title: c.title, facetTitle: FACET_TITLES[fname] || fname, tier: c.tier, module: c.module,
        snippet: makeSnippet(src),
      });
      addTokens(c.title, docIdx, fname === 'definition' ? 10 : 8);
      for (const a of c.aliases) addTokens(a, docIdx, 6);
      addTokens(src, docIdx, fname === 'misconceptions' ? 4 : 1);
    }
    // widget docs
    for (const w of c.widgets) {
      const docIdx = docs.length;
      docs.push({ ref: `${c.id}@visual#${w.id}`, concept: c.id, facet: 'visual', title: c.title, facetTitle: w.title || w.type, tier: c.tier, module: c.module, snippet: w.title || '' });
      addTokens((w.title || '') + ' ' + w.type, docIdx, 7);
      addTokens(c.title, docIdx, 5);
    }
  }
  // prefix map over titles + aliases for instant-as-you-type
  const prefixes = {};
  for (const c of concepts) {
    const names = [c.title, ...(c.aliases || [])];
    for (const n of names) {
      const low = n.toLowerCase();
      for (let len = 2; len <= Math.min(8, low.length); len++) {
        const pre = low.slice(0, len);
        (prefixes[pre] ||= []);
        if (!prefixes[pre].includes(c.id)) prefixes[pre].push(c.id);
      }
    }
  }
  return { v: 1, docs, postings, prefixes, synonyms };
}

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/[^a-z0-9αβδπωζστφθμ]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1)
    .map((t) => (t.endsWith('s') && t.length > 4 ? t.slice(0, -1) : t)); // light stemming
}

function makeSnippet(src) {
  return src
    .replace(/^@viz.*$/gm, ' ')
    .replace(/\{\{widget:[^}]+\}\}/g, ' ')
    .replace(/[#>*_`$\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
}

// ---------------------------------------------------------------- utils
function splitFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) throw new Error('missing YAML frontmatter');
  return { fm: yaml.load(m[1]), body: raw.slice(m[0].length) };
}

function loadYaml(dir, file) {
  const p = path.join(dir, file);
  return fs.existsSync(p) ? yaml.load(fs.readFileSync(p, 'utf8')) : null;
}

function stripCompileOnly(c) {
  const { _facetSrc, ...rest } = c;
  return rest;
}
