// Atlas: the cumulative concept map. Modules as columns, concepts as nodes
// tinted by mastery, prereq/crosslink edges as SVG curves. Click navigates.
import { el, clear } from './dom';
import type { App } from '../main';
import { conceptHash } from '../router';

export function renderAtlas(app: App) {
  const { registry, store, main } = app;
  const content = el('div', { class: 'content content-wide' });
  clear(main).appendChild(content);
  content.appendChild(el('h1', {}, 'Atlas'));
  content.appendChild(el('p', { class: 'muted' },
    'The course as one connected object. Solid edges: prerequisites (what feeds what). Dotted: deep connections across modules. Node color = your mastery. The through-line of the whole course: LTI + impulse → convolution → frequency domain → transforms → sampling → feedback → stability.'));

  const mods = registry.manifest.modules.filter((m: any) => m.concepts.length);
  const colW = 190, rowH = 46, pad = 18;
  const width = mods.length * colW + pad * 2;
  const height = Math.max(...mods.map((m: any) => m.concepts.length)) * rowH + 70;

  const pos = new Map<string, { x: number; y: number }>();
  mods.forEach((m: any, ci: number) => {
    m.concepts.forEach((cid: string, ri: number) => {
      pos.set(cid, { x: pad + ci * colW + colW / 2, y: 56 + ri * rowH });
    });
  });

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.style.cssText = 'width:100%;height:auto;border:1px solid var(--line);border-radius:6px';

  // edges
  const edges: Array<{ from: string; to: string; kind: 'prereq' | 'cross' }> = [];
  for (const meta of registry.manifest.concepts) {
    for (const p of meta.prereqs || []) edges.push({ from: p, to: meta.id, kind: 'prereq' });
  }
  for (const c of registry.concepts.values()) {
    for (const l of c.crossLinks || []) edges.push({ from: c.id, to: l.target, kind: 'cross' });
  }
  for (const e of edges) {
    const a = pos.get(e.from), b = pos.get(e.to);
    if (!a || !b) continue;
    const path = document.createElementNS(svgNS, 'path');
    const mx = (a.x + b.x) / 2;
    path.setAttribute('d', `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--line)');
    path.setAttribute('stroke-width', e.kind === 'prereq' ? '1.5' : '1');
    if (e.kind === 'cross') path.setAttribute('stroke-dasharray', '3 4');
    path.setAttribute('opacity', '0.6');
    svg.appendChild(path);
  }

  // column headers
  mods.forEach((m: any, ci: number) => {
    const t = document.createElementNS(svgNS, 'text');
    t.setAttribute('x', String(pad + ci * colW + colW / 2));
    t.setAttribute('y', '24');
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('fill', 'var(--ink-soft)');
    t.setAttribute('font-size', '13');
    t.setAttribute('font-weight', '650');
    t.textContent = m.short;
    svg.appendChild(t);
  });

  // nodes
  // One accent carries progress; monochrome otherwise (matches the sidebar dots).
  const STATUS_COLOR: Record<string, string> = {
    untouched: 'var(--line)', seen: 'var(--ink-faint)', learned: 'var(--accent)',
    secure: 'var(--accent)', mastered: 'var(--accent)',
  };
  for (const meta of registry.manifest.concepts) {
    const p = pos.get(meta.id);
    if (!p) continue;
    const status = store.state.progress[meta.id]?.status || 'untouched';
    const g = document.createElementNS(svgNS, 'a');
    g.setAttribute('href', conceptHash(meta.id));
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', String(p.x - colW / 2 + 14));
    rect.setAttribute('y', String(p.y - 14));
    rect.setAttribute('width', String(colW - 28));
    rect.setAttribute('height', '30');
    rect.setAttribute('rx', '7');
    rect.setAttribute('fill', 'var(--bg)');
    rect.setAttribute('stroke', STATUS_COLOR[status]);
    rect.setAttribute('stroke-width', meta.heroes ? '2.4' : '1.4');
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', String(p.x));
    label.setAttribute('y', String(p.y + 5));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', 'var(--ink)');
    label.setAttribute('font-size', '11');
    label.textContent = (meta.short || meta.title).slice(0, 24);
    const title = document.createElementNS(svgNS, 'title');
    title.textContent = `${meta.title} — ${status}`;
    g.append(rect, label, title);
    svg.appendChild(g);
  }
  const scroller = el('div', { style: 'overflow-x:auto' });
  scroller.appendChild(svg as any);
  content.appendChild(scroller);
  content.appendChild(el('p', { class: 'muted', style: 'margin-top:.6rem' },
    'Bold outlines are the hero concepts — the load-bearing ideas each module hangs from.'));
}
