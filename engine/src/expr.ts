// Expression checker: parses a typed math expression and tests numerical
// equivalence against the reference at random sample points. No CAS — exam
// answers like "(1-e^(-2t))u(t)" are checked as functions, so any
// algebraically-equivalent form is accepted.
//
// Grammar: numbers, variables (t, n, w, s, tau, T, a, b, k), constants (pi, e),
// + - * / ^, parentheses, |x| via abs(), functions: sin cos tan exp ln log
// sqrt abs u (unit step), r (unit ramp), sinc, sgn. Implicit multiplication is
// supported: "2t", "t e^-t", "(t+1)(t-1)".

type Env = Record<string, number>;
type Fn = (env: Env) => number;

const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  exp: Math.exp, ln: Math.log, log: Math.log, log10: Math.log10,
  sqrt: Math.sqrt, abs: Math.abs,
  u: (x) => (x > 0 ? 1 : x === 0 ? 0.5 : 0),
  r: (x) => (x > 0 ? x : 0),
  sgn: (x) => Math.sign(x),
  sinc: (x) => (x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)),
};
const CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E };

interface Tok { kind: 'num' | 'name' | 'op' | 'lp' | 'rp'; v: string }

function lex(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  const s = src.replace(/\s+/g, ' ').replace(/π/g, 'pi').replace(/τ/g, 'tau').replace(/ω/g, 'w');
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      toks.push({ kind: 'num', v: s.slice(i, j) });
      i = j;
    } else if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-zA-Z0-9_]/.test(s[j])) j++;
      let name = s.slice(i, j);
      // Greedy name could swallow implicit products like "tw"; split known
      // functions/consts first, else split into single-char variables.
      toks.push(...splitName(name));
      i = j;
    } else if ('+-*/^'.includes(c)) { toks.push({ kind: 'op', v: c }); i++; }
    else if (c === '(') { toks.push({ kind: 'lp', v: c }); i++; }
    else if (c === ')') { toks.push({ kind: 'rp', v: c }); i++; }
    else if (c === ',') { toks.push({ kind: 'op', v: ',' }); i++; }
    else throw new Error(`unexpected character "${c}"`);
  }
  return toks;
}

function splitName(name: string): Tok[] {
  const known = [...Object.keys(FUNCS), ...Object.keys(CONSTS), 'tau'];
  if (known.includes(name)) return [{ kind: 'name', v: name }];
  // longest known prefix first (e.g. "usinc" unlikely, but "tsin" → t, sin)
  for (const k of known.sort((a, b) => b.length - a.length)) {
    if (name.startsWith(k)) return [{ kind: 'name', v: k }, ...splitName(name.slice(k.length))];
    if (name.endsWith(k)) return [...splitName(name.slice(0, name.length - k.length)), { kind: 'name', v: k }];
  }
  return name.split('').map((ch) => ({ kind: 'name', v: ch } as Tok));
}

export function parseExpr(src: string): Fn {
  const toks = lex(src);
  let pos = 0;
  const peek = () => toks[pos];
  const next = () => toks[pos++];

  function parseSum(): Fn {
    let left = parseProduct();
    while (peek()?.kind === 'op' && (peek().v === '+' || peek().v === '-')) {
      const op = next().v;
      const right = parseProduct();
      const l = left;
      left = op === '+' ? (env) => l(env) + right(env) : (env) => l(env) - right(env);
    }
    return left;
  }
  function parseProduct(): Fn {
    let left = parseUnary();
    for (;;) {
      const t = peek();
      if (t?.kind === 'op' && (t.v === '*' || t.v === '/')) {
        const op = next().v;
        const right = parseUnary();
        const l = left;
        left = op === '*' ? (env) => l(env) * right(env) : (env) => l(env) / right(env);
      } else if (t && (t.kind === 'num' || t.kind === 'name' || t.kind === 'lp')) {
        // implicit multiplication
        const right = parseUnary();
        const l = left;
        left = (env) => l(env) * right(env);
      } else break;
    }
    return left;
  }
  function parseUnary(): Fn {
    const t = peek();
    if (t?.kind === 'op' && t.v === '-') { next(); const f = parseUnary(); return (env) => -f(env); }
    if (t?.kind === 'op' && t.v === '+') { next(); return parseUnary(); }
    return parsePower();
  }
  function parsePower(): Fn {
    const base = parseAtom();
    if (peek()?.kind === 'op' && peek().v === '^') {
      next();
      const exp = parseUnary(); // right-assoc, allows e^-t
      return (env) => Math.pow(base(env), exp(env));
    }
    return base;
  }
  function parseAtom(): Fn {
    const t = next();
    if (!t) throw new Error('unexpected end of expression');
    if (t.kind === 'num') { const v = parseFloat(t.v); return () => v; }
    if (t.kind === 'lp') {
      const inner = parseSum();
      if (next()?.kind !== 'rp') throw new Error('missing )');
      return inner;
    }
    if (t.kind === 'name') {
      if (t.v in CONSTS) return () => CONSTS[t.v];
      if (t.v in FUNCS) {
        const fn = FUNCS[t.v];
        // function application: u(t-2), sin t, e already handled as const
        if (peek()?.kind === 'lp') {
          next();
          const arg = parseSum();
          if (next()?.kind !== 'rp') throw new Error('missing )');
          return (env) => fn(arg(env));
        }
        const arg = parseUnary();
        return (env) => fn(arg(env));
      }
      const name = t.v;
      return (env) => {
        if (!(name in env)) throw new Error(`unknown variable "${name}"`);
        return env[name];
      };
    }
    throw new Error(`unexpected "${t.v}"`);
  }

  const fn = parseSum();
  if (pos !== toks.length) throw new Error(`unexpected "${toks[pos].v}"`);
  return fn;
}

// Numerical equivalence at sample points. Variables sampled in teaching-
// relevant ranges; NaN/Infinity at a point is only fatal if the reference is
// finite there (and vice versa).
export function checkEquivalent(student: string, reference: string, vars: string[] = ['t']): { ok: boolean; error?: string } {
  let f: Fn, g: Fn;
  try { f = parseExpr(student); } catch (e: any) { return { ok: false, error: 'Could not read that expression: ' + e.message }; }
  try { g = parseExpr(reference); } catch (e: any) { return { ok: false, error: 'internal: bad reference expression' }; }
  const samples = [-2.7, -1.3, -0.5, -0.1, 0.1, 0.37, 0.9, 1.6, 2.2, 3.8];
  let checked = 0;
  for (const base of samples) {
    const env: Env = {};
    vars.forEach((v, i) => { env[v] = base + i * 0.311; });
    let fv: number, gv: number;
    try { gv = g(env); } catch { continue; }
    try { fv = f(env); } catch (e: any) { return { ok: false, error: e.message }; }
    if (!isFinite(gv)) continue;
    if (!isFinite(fv)) return { ok: false };
    if (Math.abs(fv - gv) > 1e-6 * Math.max(1, Math.abs(gv))) return { ok: false };
    checked++;
  }
  return { ok: checked >= 4 };
}
