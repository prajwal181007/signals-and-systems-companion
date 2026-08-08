// Study timer: 25 minutes of focus, then a 5-minute break, chimes at each
// turn, cycling until stopped. Lives in the sidebar; state survives
// navigation (module singleton). The chime is synthesized — no audio files,
// and the AudioContext is created on the Start click (autoplay-safe).
import { el } from './dom';

const FOCUS_MS = 25 * 60_000;
const BREAK_MS = 5 * 60_000;

type Phase = 'focus' | 'break';
let running = false;
let phase: Phase = 'focus';
let endsAt = 0;
let ticker: ReturnType<typeof setInterval> | null = null;
let audio: AudioContext | null = null;

function chime(times: number) {
  try {
    audio = audio || new AudioContext();
    audio.resume();
    for (let i = 0; i < times; i++) {
      const t0 = audio.currentTime + i * 0.4;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
      osc.connect(gain).connect(audio.destination);
      osc.start(t0);
      osc.stop(t0 + 0.4);
    }
  } catch {}
}

function fmt(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function paint() {
  const display = document.getElementById('sc-timer-display');
  const label = document.getElementById('sc-timer-phase');
  const btn = document.getElementById('sc-timer-btn');
  if (display) display.textContent = running ? fmt(endsAt - Date.now()) : fmt(FOCUS_MS);
  if (label) {
    label.textContent = !running ? 'focus timer' : phase === 'focus' ? 'focus' : 'break — stand up';
    (label as HTMLElement).style.color = running && phase === 'break' ? 'var(--accent)' : 'var(--ink-faint)';
  }
  if (btn) btn.textContent = running ? 'Stop' : 'Start';
  // The tab title carries the countdown — glanceable from any window.
  document.title = running ? `${fmt(endsAt - Date.now())} ${phase === 'break' ? '· break' : ''} — Signals Companion` : 'Signals Companion';
}

function tick() {
  if (!running) return;
  if (Date.now() >= endsAt) {
    if (phase === 'focus') {
      phase = 'break';
      endsAt = Date.now() + BREAK_MS;
      chime(1); // one chime: 25 minutes done — take the break
    } else {
      phase = 'focus';
      endsAt = Date.now() + FOCUS_MS;
      chime(2); // two chimes: break over — back to it
    }
  }
  paint();
}

function start() {
  running = true;
  phase = 'focus';
  endsAt = Date.now() + FOCUS_MS;
  chime(1); // also unlocks the AudioContext on this user gesture
  if (!ticker) ticker = setInterval(tick, 500);
  paint();
}

function stop() {
  running = false;
  if (ticker) { clearInterval(ticker); ticker = null; }
  paint();
}

// Sidebar section; rebuilt on every sidebar refresh, reads the live state.
export function renderTimerSection(): HTMLElement {
  const section = el('div', { style: 'margin-top:auto;padding: 1rem 1.5rem 0;border-top:1px solid var(--line)' },
    el('div', { id: 'sc-timer-phase', class: 'muted', style: 'font-size:.72rem;letter-spacing:.05em;text-transform:uppercase' }, 'focus timer'),
    el('div', { style: 'display:flex;align-items:center;gap:.7rem;margin-top:.15rem' },
      el('span', { id: 'sc-timer-display', style: 'font-family:var(--mono);font-size:1.05rem' }, '25:00'),
      el('button', { id: 'sc-timer-btn', class: 'btn btn-quiet', style: 'padding:.15rem .6rem;font-size:.8rem', onclick: () => (running ? stop() : start()) }, 'Start')),
  );
  queueMicrotask(paint);
  return section;
}
