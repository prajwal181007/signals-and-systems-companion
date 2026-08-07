// Markdown + math rendering at BUILD time. Shipped pages contain final HTML —
// zero runtime KaTeX on static content.
import { marked } from 'marked';
import katex from 'katex';

marked.setOptions({ gfm: true, breaks: false });

const katexOpts = { throwOnError: true, strict: 'warn', trust: false, output: 'htmlAndMathml' };

// Placeholders delimited by Unicode private-use chars (written as explicit
// escapes) — cannot collide with real prose and survive marked untouched.
const P0 = '\uE000';
const P1 = '\uE001';

// Extract math before markdown parsing (so _ and * inside math survive), render
// with KaTeX, re-insert afterwards via placeholders.
export async function renderMarkdown(src) {
  if (!src) return '';
  const slots = [];
  let text = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    slots.push(katex.renderToString(tex.trim(), { ...katexOpts, displayMode: true }));
    return P0 + (slots.length - 1) + P1;
  });
  text = text.replace(/(?<![\\$])\$([^$\n]+?)\$(?!\$)/g, (_, tex) => {
    slots.push(katex.renderToString(tex.trim(), { ...katexOpts, displayMode: false }));
    return P0 + (slots.length - 1) + P1;
  });
  let html = marked.parse(text);
  html = html.replace(new RegExp(P0 + '(\\d+)' + P1, 'g'), (_, i) => slots[+i]);
  return html.trim();
}

// Inline-only variant for titles/claims (no <p> wrapper).
export async function renderInlineMath(src) {
  if (!src) return '';
  const html = await renderMarkdown(src);
  return html.replace(/^<p>([\s\S]*)<\/p>$/, '$1');
}
