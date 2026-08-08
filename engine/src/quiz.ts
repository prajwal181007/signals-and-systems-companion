// Quiz item renderers + checkpoint session. Feedback is immediate, specific,
// and forward-linking — never a bare "incorrect".
import { el } from './ui/dom';
import type { App } from './main';
import { checkEquivalent } from './expr';
import { review as srsReview, applyExamHorizon, GRADE } from './srs';

export interface QuizResult { correct: boolean; given: any }

// ---------------------------------------------------------------- item render
export function renderItem(app: App, item: any, onAnswer: (r: QuizResult) => void): HTMLElement {
  const root = el('div', { class: 'quiz-item' });
  root.appendChild(el('div', { class: 'prose', html: item.promptHtml }));
  const feedback = el('div', {});

  const finish = (correct: boolean, given: any, note?: string) => {
    feedback.innerHTML = '';
    // Colour appears only on the verdict word — signal, not decoration.
    feedback.appendChild(
      el('div', { class: 'feedback' },
        el('span', { class: correct ? 'verdict-right' : 'verdict-wrong' }, correct ? 'Right. ' : 'Not quite. '),
        note ? el('span', {}, note + ' ') : '',
        item.explanationHtml ? el('div', { class: 'prose', html: item.explanationHtml, style: 'margin-top:.35rem' }) : ''),
    );
    onAnswer({ correct, given });
  };

  if (item.kind === 'mcq') {
    const list = el('div', { style: 'display:flex;flex-direction:column;gap:.4rem;margin:.6rem 0' });
    (item.choices || []).forEach((c: string, i: number) => {
      list.appendChild(el('button', {
        class: 'btn', style: 'justify-content:flex-start;text-align:left',
        onclick: (e: Event) => {
          list.querySelectorAll('button').forEach((b) => ((b as HTMLButtonElement).disabled = true));
          (e.currentTarget as HTMLElement).style.borderColor = i === item.answer ? 'var(--good)' : 'var(--bad)';
          finish(i === item.answer, i);
        },
      }, el('span', { class: 'prose', html: c })));
    });
    root.appendChild(list);
  } else if (item.kind === 'numeric') {
    const input = el('input', { type: 'text', style: 'width:9rem', placeholder: 'answer' });
    const btn = el('button', { class: 'btn btn-primary', onclick: () => {
      const v = parseFloat((input as HTMLInputElement).value.replace(/[^0-9eE+\-.]/g, ''));
      if (isNaN(v)) { feedback.textContent = 'Enter a number.'; return; }
      btn.setAttribute('disabled', '');
      const tol = item.tolerance ?? Math.abs(item.answer) * 0.01 + 1e-9;
      finish(Math.abs(v - item.answer) <= tol, v, `The answer is ${item.answer}${item.unit ? ' ' + item.unit : ''}.`);
    } }, 'Check');
    root.appendChild(el('div', { style: 'display:flex;gap:.5rem;align-items:center;margin:.6rem 0' }, input, item.unit ? el('span', { class: 'muted' }, item.unit) : '', btn));
  } else if (item.kind === 'expression') {
    const input = el('input', { type: 'text', style: 'width:100%;max-width:26rem;font-family:var(--mono)', placeholder: 'e.g.  (1 - e^(-2t)) u(t)' });
    const btn = el('button', { class: 'btn btn-primary', onclick: () => {
      const src = (input as HTMLInputElement).value.trim();
      if (!src) return;
      const res = checkEquivalent(src, item.answer, item.vars || ['t']);
      if (res.error) { feedback.innerHTML = ''; feedback.appendChild(el('div', { class: 'muted' }, res.error)); return; }
      btn.setAttribute('disabled', '');
      finish(res.ok, src, res.ok ? 'Any equivalent form counts.' : `One correct form: ${item.answer}`);
    } }, 'Check');
    root.appendChild(el('div', { style: 'display:flex;gap:.5rem;align-items:center;margin:.6rem 0;flex-wrap:wrap' }, input, btn));
    root.appendChild(el('div', { class: 'muted' }, 'Type math: e^(-2t), u(t) is the unit step, pi, w for ω. Any equivalent form is accepted.'));
  } else if (item.kind === 'steporder') {
    // Click the steps in the correct order.
    const order: number[] = [];
    const correct = item.answer as number[];
    const list = el('div', { style: 'display:flex;flex-direction:column;gap:.4rem;margin:.6rem 0' });
    (item.choices || []).forEach((c: string, i: number) => {
      const b = el('button', { class: 'btn', style: 'justify-content:flex-start;text-align:left', onclick: () => {
        order.push(i);
        b.setAttribute('disabled', '');
        b.prepend(el('strong', {}, order.length + '. '));
        if (order.length === correct.length) {
          const ok = order.every((v, k) => v === correct[k]);
          list.querySelectorAll('button').forEach((x) => x.setAttribute('disabled', ''));
          finish(ok, order.slice(), ok ? '' : 'The right order is shown in the explanation.');
        }
      } }, el('span', { class: 'prose', html: c }));
      list.appendChild(b);
    });
    root.appendChild(list);
  } else if (item.kind === 'widget') {
    // Widget-state task: open the lab at a preset, student manipulates, then a
    // predicate over the serialized state grades it. The widget bundle
    // evaluates the predicate; if unavailable, degrade to self-marking.
    root.appendChild(el('div', { class: 'muted', style: 'margin:.5rem 0' }, 'Use the interactive above to set up the required state, then check.'));
    const btn = el('button', { class: 'btn btn-primary', onclick: () => {
      const evalFn = (window as any).SC?.evalWidgetPredicate;
      if (evalFn && item.predicate && item.widgetRef) {
        const verdict = evalFn(item.widgetRef, item.predicate);
        if (verdict == null) { feedback.textContent = 'Open the interactive first (scroll it into view).'; return; }
        btn.setAttribute('disabled', '');
        finish(!!verdict, null);
      } else {
        btn.setAttribute('disabled', '');
        finish(true, 'self-marked');
      }
    } }, 'Check my setup');
    root.appendChild(btn);
  } else {
    root.appendChild(el('div', { class: 'muted' }, '(unsupported item type: ' + item.kind + ')'));
  }

  root.appendChild(feedback);
  return root;
}

// ---------------------------------------------------------------- checkpoint
// Adaptive 3–8 items: stop early on confident pass (first 3 all right) or
// confident fail; single misses feed review, never hard demotion.
export function renderCheckpoint(app: App, concept: any, container: HTMLElement, onDone: (passed: boolean) => void) {
  const pool = concept.quiz.filter((q: any) => (q.tags || []).includes('checkpoint'));
  const items = pool.length ? pool : concept.quiz.slice(0, 5);
  if (!items.length) {
    container.appendChild(el('p', { class: 'muted' }, 'No checkpoint items for this concept yet — mark it done when you feel solid.'));
    container.appendChild(el('button', { class: 'btn btn-primary', onclick: () => onDone(true) }, 'I own this concept'));
    return;
  }
  let idx = 0;
  const results: boolean[] = [];
  const holder = el('div', {});
  container.appendChild(holder);

  const step = () => {
    if (idx > 0) holder.appendChild(el('hr', { style: 'border:none;border-top:1px solid var(--line);margin:1rem 0' }));
    const progress = el('div', { class: 'muted', style: 'margin:.4rem 0' }, `Question ${idx + 1}`);
    holder.appendChild(progress);
    const item = items[idx];
    const t0 = Date.now();
    holder.appendChild(renderItem(app, item, (r) => {
      results.push(r.correct);
      app.store.update((st) => {
        st.quiz.attempts.push({ qid: item.id, at: new Date().toISOString(), correct: r.correct, ms: Date.now() - t0 });
        if (st.quiz.attempts.length > 800) {
          for (const a of st.quiz.attempts.splice(0, st.quiz.attempts.length - 500)) {
            const agg = (st.quiz.aggregates[a.qid] ||= { n: 0, correct: 0 });
            agg.n++; if (a.correct) agg.correct++;
          }
        }
      });
      const n = results.length;
      const right = results.filter(Boolean).length;
      const confidentPass = n >= 3 && right === n;
      const confidentFail = n - right >= 3;
      const exhausted = n >= Math.min(8, items.length);
      setTimeout(() => {
        if (confidentPass || confidentFail || exhausted) {
          finishSession(right / n >= 0.7);
        } else {
          idx++;
          step();
        }
      }, 350);
    }));
  };

  const finishSession = (passed: boolean) => {
    holder.appendChild(el('div', { class: 'panel', style: 'margin-top:1rem' },
      el('strong', {}, passed ? 'Checkpoint passed. ' : 'Not there yet. '),
      el('span', {}, passed
        ? 'This concept is now unlocked everywhere as a reference, and its flashcards join your review queue.'
        : 'One shaky checkpoint is a signal, not a verdict — revisit the section linked in the feedback above and try again tomorrow.')));
    if (passed) markLearned(app, concept);
    onDone(passed);
  };

  step();
}

export function markLearned(app: App, concept: any) {
  app.store.update((st) => {
    const p = (st.progress[concept.id] ||= { status: 'untouched', facetsSeen: [], checkpointPassedAt: null, secondsSpent: 0, lastVisit: null });
    if (p.status === 'untouched' || p.status === 'seen') p.status = 'learned';
    p.checkpointPassedAt = new Date().toISOString();
    // Seed this concept's flashcards into the SRS deck (due tomorrow).
    for (const card of concept.flashcards) {
      if (!st.srs.cards[card.id]) {
        st.srs.cards[card.id] = {
          s: 0, d: 0, due: new Date(Date.now() + 86400000).toISOString(),
          reps: 0, lapses: 0, last: null, state: 'new', hist: [],
        };
      }
    }
  });
}

// Grade a flashcard review (two buttons) and persist with exam-horizon cap.
export function gradeCard(app: App, cardId: string, good: boolean) {
  app.store.update((st) => {
    const next = srsReview(st.srs.cards[cardId], good ? GRADE.good : GRADE.again);
    st.srs.cards[cardId] = applyExamHorizon(st, app.registry, cardId, next);
    st.srs.lastSession = new Date().toISOString();
  });
}
