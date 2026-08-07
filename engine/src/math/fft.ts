// Iterative in-place radix-2 Cooley–Tukey FFT. Twiddles + bit-reversal cached
// per size. Sizes 256–65536.
const cache = new Map<number, { rev: Uint32Array; cos: Float64Array; sin: Float64Array }>();

function tables(n: number) {
  let t = cache.get(n);
  if (t) return t;
  const rev = new Uint32Array(n);
  const bits = Math.log2(n) | 0;
  for (let i = 0; i < n; i++) {
    let r = 0;
    for (let b = 0; b < bits; b++) r = (r << 1) | ((i >> b) & 1);
    rev[i] = r;
  }
  const cos = new Float64Array(n / 2), sin = new Float64Array(n / 2);
  for (let i = 0; i < n / 2; i++) {
    cos[i] = Math.cos((-2 * Math.PI * i) / n);
    sin[i] = Math.sin((-2 * Math.PI * i) / n);
  }
  t = { rev, cos, sin };
  cache.set(n, t);
  return t;
}

// In-place FFT of interleaved-free separate re/im arrays. inverse=true for IFFT
// (includes the 1/N scaling).
export function fft(re: Float64Array, im: Float64Array, inverse = false) {
  const n = re.length;
  if ((n & (n - 1)) !== 0) throw new Error('fft size must be a power of two');
  const { rev, cos, sin } = tables(n);
  for (let i = 0; i < n; i++) {
    const r = rev[i];
    if (r > i) {
      let t = re[i]; re[i] = re[r]; re[r] = t;
      t = im[i]; im[i] = im[r]; im[r] = t;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const half = len >> 1, step = n / len;
    for (let i = 0; i < n; i += len) {
      for (let j = 0; j < half; j++) {
        const k = j * step;
        const wr = cos[k], wi = inverse ? -sin[k] : sin[k];
        const xr = re[i + j + half], xi = im[i + j + half];
        const tr = xr * wr - xi * wi, ti = xr * wi + xi * wr;
        re[i + j + half] = re[i + j] - tr;
        im[i + j + half] = im[i + j] - ti;
        re[i + j] += tr;
        im[i + j] += ti;
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  }
}

export function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}
