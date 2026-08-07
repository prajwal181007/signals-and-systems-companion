// FSRS scheduler (v4.5 weights), two-button grading (Again / Good), with an
// exam-horizon rule: a card is never scheduled past an upcoming exam that
// covers its module — surplus interval resumes after the exam passes.
import type { State, CardState } from './store';

const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031,
  1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const DECAY = -0.5;
const FACTOR = Math.pow(0.9, 1 / DECAY) - 1; // ≈ 19/81 — R(S, S) = 0.9
const TARGET_R = 0.9;
const MAX_IVL = 180; // semester scale — nothing schedules half a year out

export const GRADE = { again: 1, good: 3 } as const;

export function retrievability(card: CardState, now = new Date()): number {
  if (!card.last || card.state === 'new') return 0;
  const days = Math.max(0, (+now - +new Date(card.last)) / 86400000);
  return Math.pow(1 + (FACTOR * days) / card.s, DECAY);
}

function initCard(): CardState {
  return { s: 0, d: 0, due: new Date().toISOString(), reps: 0, lapses: 0, last: null, state: 'new', hist: [] };
}

function nextInterval(s: number): number {
  const ivl = (s / FACTOR) * (Math.pow(TARGET_R, 1 / DECAY) - 1);
  return Math.min(MAX_IVL, Math.max(1, Math.round(ivl)));
}

function clampD(d: number) { return Math.min(10, Math.max(1, d)); }

// Apply a review. grade: 1 = Again, 3 = Good.
export function review(card: CardState | undefined, grade: number, now = new Date()): CardState {
  const c: CardState = card ? { ...card, hist: [...card.hist] } : initCard();
  const g = grade;
  if (c.state === 'new') {
    c.s = W[g - 1];
    c.d = clampD(W[4] - (g - 3) * W[5]);
    c.state = g === 1 ? 'learning' : 'review';
  } else {
    const r = retrievability(c, now);
    const d0_3 = W[4];
    let d = c.d - W[6] * (g - 3);
    d = clampD(W[7] * d0_3 + (1 - W[7]) * d);
    if (g === 1) {
      c.s = Math.max(0.1, W[11] * Math.pow(c.d, -W[12]) * (Math.pow(c.s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
      c.lapses += 1;
      c.state = 'relearning';
    } else {
      const bonus = Math.exp(W[8]) * (11 - c.d) * Math.pow(c.s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1);
      c.s = c.s * (1 + bonus);
      c.state = 'review';
    }
    c.d = d;
  }
  c.reps += 1;
  c.last = now.toISOString();
  const ivl = g === 1 ? 0.5 : nextInterval(c.s); // Again → later today
  c.due = new Date(+now + ivl * 86400000).toISOString();
  c.hist.push({ at: c.last, grade: g });
  if (c.hist.length > 10) c.hist = c.hist.slice(-10);
  return c;
}

// ---------------- exam horizon ----------------
function upcomingExamFor(state: State, registry: any, conceptId: string, now = new Date()): Date | null {
  const meta = registry.conceptMeta(conceptId);
  if (!meta) return null;
  const exams = registry.manifest.exams || {};
  let best: Date | null = null;
  for (const key of ['minor1', 'minor2', 'major'] as const) {
    const dateStr = state.exams[key];
    const covers = exams[key]?.modules || [];
    if (!dateStr || !covers.includes(meta.module)) continue;
    const d = new Date(dateStr + 'T00:00:00');
    if (+d > +now && (!best || +d < +best)) best = d;
  }
  return best;
}

export function applyExamHorizon(state: State, registry: any, cardId: string, card: CardState, now = new Date()): CardState {
  const conceptId = cardId.split('#')[0];
  const exam = upcomingExamFor(state, registry, conceptId, now);
  if (!exam) return card;
  const dayBefore = +exam - 86400000;
  if (+new Date(card.due) > dayBefore) {
    // Pull into the pre-exam window, jittered so whole modules don't land on one day.
    const jitter = (hashCode(cardId) % 3) * 86400000;
    const due = Math.max(+now + 12 * 3600000, dayBefore - jitter);
    return { ...card, due: new Date(due).toISOString() };
  }
  return card;
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ---------------- session building (backlog amnesty built in) ----------------
// Returns due card ids sorted by value: exam proximity → low retrievability →
// overdue-ness. The review UI takes a capped session from the top, so a bad
// fortnight produces a prioritized session, never a "312 overdue" wall.
export function dueCards(state: State, registry: any, now = new Date()): string[] {
  const out: Array<{ id: string; score: number }> = [];
  for (const [id, card] of Object.entries(state.srs.cards)) {
    if (+new Date(card.due) > +now) continue;
    const r = retrievability(card, now);
    const exam = upcomingExamFor(state, registry, id.split('#')[0], now);
    const examDays = exam ? Math.max(1, (+exam - +now) / 86400000) : 999;
    const overdueDays = (+now - +new Date(card.due)) / 86400000;
    out.push({ id, score: (1 - r) * 10 + 30 / examDays + Math.min(5, overdueDays / 7) });
  }
  return out.sort((a, b) => b.score - a.score).map((x) => x.id);
}

export const SESSION_CAP = 40;
