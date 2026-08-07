// Convolution. Direct O(N·M) when teaching (matches the on-screen story and is
// exact); CT convolution as Riemann sum on a shared grid — the dt scaling and
// the support bookkeeping (t_y0 = t_x0 + t_h0) live HERE so no widget can get
// them wrong. A missing dt is the #1 silent bug in student-facing CT demos.

export interface Sampled { t0: number; dt: number; y: Float64Array }

export function convDT(x: ArrayLike<number>, h: ArrayLike<number>): Float64Array {
  const n = x.length + h.length - 1;
  const y = new Float64Array(n);
  for (let i = 0; i < x.length; i++) {
    const xi = x[i];
    if (xi === 0) continue;
    for (let j = 0; j < h.length; j++) y[i + j] += xi * h[j];
  }
  return y;
}

export function convCT(x: Sampled, h: Sampled): Sampled {
  if (Math.abs(x.dt - h.dt) > 1e-12) throw new Error('convCT needs a shared grid');
  const y = convDT(x.y, h.y);
  for (let i = 0; i < y.length; i++) y[i] *= x.dt;
  return { t0: x.t0 + h.t0, dt: x.dt, y };
}

// Sample a function on [t0, t1] with n points (n ≥ 1000 per shortest feature so
// piecewise shapes look like the ideal shapes students must draw by hand).
export function sample(f: (t: number) => number, t0: number, t1: number, n: number): Sampled {
  const dt = (t1 - t0) / (n - 1);
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) y[i] = f(t0 + i * dt);
  return { t0, dt, y };
}
