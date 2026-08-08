// Settings: exam dates, backup export/import, storage status, diagnostics.
import { el, clear, fmtDate, download } from './dom';
import type { App } from '../main';
import { applyAppearance } from '../appearance';

export function renderSettings(app: App) {
  const { store, main } = app;
  const content = el('div', { class: 'content' });
  clear(main).appendChild(content);
  content.appendChild(el('h1', {}, 'Settings'));

  // ---- appearance ----
  const appearancePanel = el('div', { class: 'panel' }, el('strong', {}, 'Appearance'));
  const themeSel = el('select', {},
    el('option', { value: 'light' }, 'Light'),
    el('option', { value: 'dark' }, 'Dark'),
    el('option', { value: 'system' }, 'System')) as HTMLSelectElement;
  themeSel.value = (store.state.settings.theme as string) || 'light';
  themeSel.addEventListener('change', () => {
    store.update((st) => { st.settings.theme = themeSel.value; });
    applyAppearance(store);
    app.router.dispatch(); // re-render so plots repaint in the new palette
  });
  const fontSel = el('select', {},
    el('option', { value: 'system' }, 'San Francisco (system)'),
    el('option', { value: 'helvetica' }, 'Helvetica Neue'),
    el('option', { value: 'palatino' }, 'Palatino')) as HTMLSelectElement;
  fontSel.value = (store.state.settings.font as string) || 'system';
  fontSel.addEventListener('change', () => {
    store.update((st) => { st.settings.font = fontSel.value; });
    applyAppearance(store);
  });
  appearancePanel.appendChild(el('div', { style: 'display:flex;gap:1rem;align-items:center;margin:.5rem 0' },
    el('span', { style: 'width:8rem' }, 'Theme'), themeSel));
  appearancePanel.appendChild(el('div', { style: 'display:flex;gap:1rem;align-items:center;margin:.5rem 0' },
    el('span', { style: 'width:8rem' }, 'Typeface'), fontSel));
  appearancePanel.appendChild(el('p', { class: 'muted' },
    'Three faces, all already on your machine: the system face, the Helvetica the Mac grew up on, and the Palatino from the calligraphy class that started it all.'));
  content.appendChild(appearancePanel);

  // ---- exam dates ----
  const examPanel = el('div', { class: 'panel' }, el('strong', {}, 'Exam dates'),
    el('p', { class: 'muted' }, 'The review scheduler plans around these: cards are pulled forward so nothing is scheduled past an exam that covers it. Scope per exam is set by the instructor — adjust here if the announced scope differs.'));
  const dates: Array<['minor1' | 'minor2' | 'major', string]> = [['minor1', 'Minor I'], ['minor2', 'Minor II'], ['major', 'Major (final)']];
  for (const [key, label] of dates) {
    const input = el('input', { type: 'date', value: store.state.exams[key] || '' });
    input.addEventListener('change', () => {
      store.update((st) => { st.exams[key] = (input as HTMLInputElement).value || null; });
    });
    examPanel.appendChild(el('div', { style: 'display:flex;gap:1rem;align-items:center;margin:.4rem 0' },
      el('span', { style: 'width:8rem' }, label), input));
  }
  content.appendChild(examPanel);

  // ---- backup ----
  const importInput = el('input', { type: 'file', accept: '.json,application/json', style: 'display:none' });
  importInput.addEventListener('change', () => {
    const file = (importInput as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = store.importText(String(reader.result));
      alert(res.message);
      if (res.ok) location.reload();
    };
    reader.readAsText(file);
  });
  content.appendChild(el('div', { class: 'panel' },
    el('strong', {}, 'Backup & restore'),
    el('p', { class: 'muted' },
      `Your progress lives in the browser, not in the app folder. Storage mode: ${store.storageMode === 'full' ? 'normal' : 'SESSION ONLY — export before closing!'}. ` +
      `Last export: ${store.state.lastExportAt ? fmtDate(store.state.lastExportAt.slice(0, 10)) : 'never'}.`),
    el('div', { style: 'display:flex;gap:.6rem;flex-wrap:wrap' },
      el('button', { class: 'btn btn-primary', onclick: () => { const { name, blob } = store.exportBlob(); download(name, blob); } }, 'Export backup file'),
      el('button', { class: 'btn', onclick: () => (importInput as HTMLInputElement).click() }, 'Import backup file'),
      importInput)));

  // ---- about ----
  content.appendChild(el('div', { class: 'panel' },
    el('strong', {}, 'About'),
    el('p', { class: 'muted' },
      'Signals Companion — an offline Signals & Systems course companion (EC2102 syllabus). Fully offline — this app never touches the network. ' +
      'Built around the official syllabus; standard treatment follows Oppenheim & Willsky, Signals & Systems (2e).')));
}
