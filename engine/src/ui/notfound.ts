import { el, clear } from './dom';
import type { App } from '../main';

export function renderNotFound(app: App) {
  clear(app.main).appendChild(
    el('div', { class: 'content' },
      el('h1', {}, 'Not here yet'),
      el('p', { class: 'muted' }, 'That page doesn’t exist (or isn’t built yet).'),
      el('a', { class: 'btn', href: '#/' }, 'Back to Today')),
  );
}
