// Flashcard review session: two-button FSRS grading, capped humane sessions.
import { el, clear } from './dom';
import type { App } from '../main';
import { dueCards, SESSION_CAP } from '../srs';
import { gradeCard } from '../quiz';
import { conceptHash } from '../router';

export function renderReview(app: App) {
  const { registry, store, main } = app;
  const content = el('div', { class: 'content' });
  clear(main).appendChild(content);
  content.appendChild(el('h1', {}, 'Review'));

  const allDue = dueCards(store.state, registry);
  if (!allDue.length) {
    content.appendChild(el('div', { class: 'panel' },
      el('p', {}, 'Nothing due. Cards join this queue when you pass a concept’s checkpoint.'),
      el('a', { class: 'btn', href: '#/' }, 'Back to Today')));
    return;
  }
  const session = allDue.slice(0, SESSION_CAP);
  if (allDue.length > SESSION_CAP) {
    content.appendChild(el('p', { class: 'muted' },
      `${allDue.length} cards are due; today’s session is the ${SESSION_CAP} most valuable (exam proximity × how fragile the memory is). The rest reschedule automatically — no backlog guilt.`));
  }

  // Card lookup across loaded concepts (loads on demand).
  let idx = 0, done = 0, again = 0;
  const holder = el('div', {});
  content.appendChild(holder);

  const showCard = async () => {
    clear(holder);
    if (idx >= session.length) {
      holder.appendChild(el('div', { class: 'panel' },
        el('strong', {}, 'Session complete. '),
        el('span', {}, `${done} cards — ${again} to revisit soon.`),
        el('div', { style: 'margin-top:.6rem' }, el('a', { class: 'btn btn-primary', href: '#/' }, 'Back to Today'))));
      return;
    }
    const cardId = session[idx];
    const conceptId = cardId.split('#')[0];
    let card: any = null;
    try {
      const c = await app.registry.loadConcept(conceptId);
      card = c.flashcards.find((f: any) => f.id === cardId);
    } catch {}
    if (!card) {
      // Content update removed this card: park it silently (tombstone), move on.
      idx++;
      showCard();
      return;
    }
    holder.appendChild(el('div', { class: 'muted', style: 'margin-bottom:.4rem' }, `${idx + 1} / ${session.length}`));
    const panel = el('div', { class: 'panel', style: 'min-height:9rem' },
      el('div', { class: 'prose', html: card.frontHtml }));
    holder.appendChild(panel);
    const reveal = el('button', { class: 'btn btn-primary', onclick: () => {
      reveal.remove();
      panel.appendChild(el('hr', { style: 'border:none;border-top:1px solid var(--line);margin:.8rem 0' }));
      panel.appendChild(el('div', { class: 'prose', html: card.backHtml }));
      panel.appendChild(el('div', { class: 'muted', style: 'margin-top:.5rem' },
        el('a', { href: conceptHash(conceptId) }, 'open the concept')));
      holder.appendChild(el('div', { style: 'display:flex;gap:.6rem;margin-top:.8rem' },
        el('button', { class: 'btn', style: 'border-color:var(--bad);color:var(--bad)', onclick: () => { gradeCard(app, cardId, false); again++; done++; idx++; showCard(); } }, 'Again'),
        el('button', { class: 'btn', style: 'border-color:var(--good);color:var(--good)', onclick: () => { gradeCard(app, cardId, true); done++; idx++; showCard(); } }, 'Good')));
    } }, 'Show answer');
    holder.appendChild(reveal);
  };
  showCard();
}
