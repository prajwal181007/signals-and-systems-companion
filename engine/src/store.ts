// Persistence. On file:// browser storage is legally a cache, so durability is
// layered: L1 localStorage (CRC + backup ring) → L2 IndexedDB mirror → L3
// export/import file. Never a silent blank slate: boot walks the layers.

const KEY = 'sc:ec2102:state';
const BAK = (i: number) => `sc:ec2102:bak:${i}`;
const SCHEMA_V = 1;

export interface State {
  v: number;
  createdAt: string;
  lastExportAt: string | null;
  progress: Record<string, ConceptProgress>;
  srs: { cards: Record<string, CardState>; lastSession: string | null };
  quiz: { attempts: QuizAttempt[]; aggregates: Record<string, { n: number; correct: number }> };
  predictions: Record<string, { given: any; at: string }>;
  exams: { minor1: string | null; minor2: string | null; major: string | null };
  settings: Record<string, any>;
}
export interface ConceptProgress {
  status: 'untouched' | 'seen' | 'learned' | 'secure' | 'mastered';
  facetsSeen: string[];
  checkpointPassedAt: string | null;
  secondsSpent: number;
  lastVisit: string | null;
}
export interface CardState {
  // FSRS: stability (days), difficulty (1..10), due ISO date, state
  s: number; d: number; due: string; reps: number; lapses: number;
  last: string | null; state: 'new' | 'learning' | 'review' | 'relearning';
  hist: Array<{ at: string; grade: number }>;
}
export interface QuizAttempt { qid: string; at: string; correct: boolean; ms: number }

function freshState(): State {
  return {
    v: SCHEMA_V,
    createdAt: new Date().toISOString(),
    lastExportAt: null,
    progress: {},
    srs: { cards: {}, lastSession: null },
    quiz: { attempts: [], aggregates: {} },
    predictions: {},
    exams: { minor1: null, minor2: null, major: null },
    settings: {},
  };
}

// CRC32 (small, standard) — detects torn/corrupted localStorage writes.
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
export function crc32(str: string): string {
  let c = 0xffffffff;
  for (let i = 0; i < str.length; i++) c = crcTable[(c ^ str.charCodeAt(i)) & 0xff] ^ (c >>> 8);
  return ((c ^ 0xffffffff) >>> 0).toString(16);
}

export class Store {
  state: State;
  storageMode: 'full' | 'session-only' = 'full';
  bootNote: string | null = null;
  private listeners = new Set<() => void>();
  private flushTimer: any = null;
  private idb: IDBDatabase | null = null;

  constructor() {
    this.state = this.boot();
    this.openIdb();
    // Flush on tab hide/close — the debounce must not eat the last write.
    addEventListener('visibilitychange', () => { if (document.hidden) this.flushNow(); });
    addEventListener('pagehide', () => this.flushNow());
  }

  // ---------------- boot: L1 → ring → (L2 async upgrade) → fresh ----------------
  private boot(): State {
    const tryParse = (raw: string | null): State | null => {
      if (!raw) return null;
      try {
        const { crc, data } = JSON.parse(raw);
        if (crc32(data) !== crc) return null;
        const st = JSON.parse(data);
        if (typeof st.v !== 'number') return null;
        return this.migrate(st);
      } catch { return null; }
    };
    let raw: string | null = null;
    try { raw = localStorage.getItem(KEY); } catch { this.storageMode = 'session-only'; }
    let st = tryParse(raw);
    if (!st) {
      for (let i = 0; i < 3 && !st; i++) {
        try { st = tryParse(localStorage.getItem(BAK(i))); } catch {}
        if (st) this.bootNote = 'Recovered progress from a backup copy (the primary save was missing or corrupted).';
      }
    }
    if (!st && raw !== null) this.bootNote = 'Saved progress could not be read — starting fresh. If you have an export file, import it from Settings.';
    return st || freshState();
  }

  private migrate(st: any): State {
    // v1 is current; future migrations chain here.
    return { ...freshState(), ...st, v: SCHEMA_V };
  }

  private openIdb() {
    try {
      const req = indexedDB.open('signals-companion', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('kv');
      req.onsuccess = () => {
        this.idb = req.result;
        // If L1 was empty but IDB has state (e.g. localStorage-only wipe), offer it.
        if (Object.keys(this.state.progress).length === 0 && this.state.srs.lastSession === null) {
          const tx = this.idb.transaction('kv', 'readonly').objectStore('kv').get(KEY);
          tx.onsuccess = () => {
            try {
              if (tx.result) {
                const st = this.migrate(JSON.parse(tx.result));
                if (Object.keys(st.progress).length > 0) {
                  this.state = st;
                  this.bootNote = 'Progress restored from the browser database (local storage had been cleared).';
                  this.emit();
                  this.flushNow();
                }
              }
            } catch {}
          };
        }
      };
      req.onerror = () => {};
    } catch {}
  }

  // ---------------- mutation ----------------
  update(fn: (st: State) => void) {
    fn(this.state);
    this.emit();
    this.scheduleFlush();
  }
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private emit() { this.listeners.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } }); }

  private scheduleFlush() {
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => this.flushNow(), 500);
  }
  flushNow() {
    if (this.flushTimer) { clearTimeout(this.flushTimer); this.flushTimer = null; }
    const data = JSON.stringify(this.state);
    const wrapped = JSON.stringify({ crc: crc32(data), data });
    try {
      localStorage.setItem(KEY, wrapped);
      // Daily backup ring: rotate one slot per calendar day.
      const day = new Date().toISOString().slice(0, 10);
      const slot = Math.abs(day.split('-').reduce((a, b) => a + +b, 0)) % 3;
      const marker = `sc:ec2102:bakday:${slot}`;
      if (localStorage.getItem(marker) !== day) {
        localStorage.setItem(BAK(slot), wrapped);
        localStorage.setItem(marker, day);
      }
    } catch {
      this.storageMode = 'session-only';
    }
    if (this.idb) {
      try {
        this.idb.transaction('kv', 'readwrite').objectStore('kv').put(data, KEY);
      } catch {}
    }
  }

  // ---------------- L3: export / import ----------------
  exportBlob(): { name: string; blob: Blob } {
    this.state.lastExportAt = new Date().toISOString();
    this.flushNow();
    const payload = { app: 'signals-companion', schema: SCHEMA_V, exportedAt: this.state.lastExportAt, state: this.state };
    const data = JSON.stringify(payload);
    return {
      name: `signals-companion-backup-${new Date().toISOString().slice(0, 10)}.json`,
      blob: new Blob([JSON.stringify({ crc: crc32(data), data })], { type: 'application/json' }),
    };
  }

  importText(text: string): { ok: boolean; message: string } {
    try {
      const { crc, data } = JSON.parse(text);
      if (crc32(data) !== crc) return { ok: false, message: 'Backup file failed its integrity check.' };
      const payload = JSON.parse(data);
      if (payload.app !== 'signals-companion') return { ok: false, message: 'Not a Signals Companion backup file.' };
      const incoming = this.migrate(payload.state);
      this.state = mergeStates(this.state, incoming);
      this.emit();
      this.flushNow();
      return { ok: true, message: 'Backup imported and merged. Restoring never loses newer local work.' };
    } catch (e: any) {
      return { ok: false, message: 'Could not read that file: ' + e.message };
    }
  }

  daysSinceExport(): number | null {
    if (!this.state.lastExportAt) return null;
    return Math.floor((Date.now() - +new Date(this.state.lastExportAt)) / 86400000);
  }
}

// Merge semantics (restore must never regress): progress = furthest status +
// set-union of facets; SRS = per-card LAST-REVIEW timestamp wins (newer-due
// would erase lapses); attempts = append + dedupe.
const STATUS_ORDER = ['untouched', 'seen', 'learned', 'secure', 'mastered'];
export function mergeStates(a: State, b: State): State {
  const out: State = JSON.parse(JSON.stringify(a));
  for (const [id, bp] of Object.entries(b.progress)) {
    const ap = out.progress[id];
    if (!ap) { out.progress[id] = bp; continue; }
    out.progress[id] = {
      status: STATUS_ORDER.indexOf(bp.status) > STATUS_ORDER.indexOf(ap.status) ? bp.status : ap.status,
      facetsSeen: [...new Set([...ap.facetsSeen, ...bp.facetsSeen])],
      checkpointPassedAt: latest(ap.checkpointPassedAt, bp.checkpointPassedAt),
      secondsSpent: Math.max(ap.secondsSpent, bp.secondsSpent),
      lastVisit: latest(ap.lastVisit, bp.lastVisit),
    };
  }
  for (const [id, bc] of Object.entries(b.srs.cards)) {
    const ac = out.srs.cards[id];
    if (!ac || (bc.last && (!ac.last || bc.last > ac.last))) out.srs.cards[id] = bc;
  }
  const seen = new Set(out.quiz.attempts.map((x) => x.qid + x.at));
  for (const at of b.quiz.attempts) if (!seen.has(at.qid + at.at)) out.quiz.attempts.push(at);
  for (const [k, v] of Object.entries(b.predictions)) if (!out.predictions[k]) out.predictions[k] = v;
  for (const k of ['minor1', 'minor2', 'major'] as const) out.exams[k] = out.exams[k] || b.exams[k];
  out.lastExportAt = latest(a.lastExportAt, b.lastExportAt);
  return out;
}
function latest(a: string | null, b: string | null) {
  if (!a) return b; if (!b) return a; return a > b ? a : b;
}
