// Pure helpers used at build time (vite.config.ts) — no DOM APIs here.

export const esc = (s: string | number): string =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const t = (tpl: string, vars: Record<string, string | number>): string =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));

/** Deterministic PRNG (mulberry32) seeded from a string. */
export function rng(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let r = Math.imul(a ^ (a >>> 15), 1 | a);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const f1 = (n: number) => Math.round(n * 10) / 10;

export interface RingOpts {
  seed: string;
  count: number;
  cx: number;
  cy: number;
  rMax: number;
  rMin?: number;
  points?: number;
  wobble?: number;
  /** drift of each ring centre, gives a hill-like asymmetric shape */
  drift?: [number, number];
}

/** Nested closed "contour line" paths, outermost first. */
export function rings(o: RingOpts): string[] {
  const r = rng(o.seed);
  const k = 2 + Math.floor(r() * 3);
  const m = 3 + Math.floor(r() * 3);
  const phi = r() * Math.PI * 2;
  const psi = r() * Math.PI * 2;
  const wob = o.wobble ?? 0.12;
  const pts = o.points ?? 48;
  const rMin = o.rMin ?? o.rMax * 0.08;
  const [dx, dy] = o.drift ?? [0, 0];
  const out: string[] = [];
  for (let i = 0; i < o.count; i++) {
    const p = o.count === 1 ? 0 : i / (o.count - 1);
    const r0 = o.rMax - (o.rMax - rMin) * p;
    const a = wob * (1 - p * 0.5) + r() * 0.03;
    const b = wob * 0.6 * (1 - p * 0.4);
    const cx = o.cx + dx * p;
    const cy = o.cy + dy * p;
    const ph = phi + p * 0.9;
    let d = '';
    for (let j = 0; j < pts; j++) {
      const th = (j / pts) * Math.PI * 2;
      const rr = r0 * (1 + a * Math.sin(k * th + ph) + b * Math.sin(m * th + psi + p));
      const x = cx + rr * Math.cos(th);
      const y = cy + rr * Math.sin(th);
      d += `${j ? 'L' : 'M'}${f1(x)} ${f1(y)}`;
    }
    out.push(d + 'Z');
  }
  return out;
}

/** Point on the same parametric ring (used for the process marker). */
export function ringPoint(o: RingOpts, index: number, theta: number): [number, number] {
  const r = rng(o.seed);
  const k = 2 + Math.floor(r() * 3);
  const m = 3 + Math.floor(r() * 3);
  const phi = r() * Math.PI * 2;
  const psi = r() * Math.PI * 2;
  const wob = o.wobble ?? 0.12;
  const rMin = o.rMin ?? o.rMax * 0.08;
  const [dx, dy] = o.drift ?? [0, 0];
  let a = 0;
  for (let i = 0; i <= index; i++) a = wob * (1 - (i / (o.count - 1)) * 0.5) + r() * 0.03;
  const p = index / (o.count - 1);
  const r0 = o.rMax - (o.rMax - rMin) * p;
  const b = wob * 0.6 * (1 - p * 0.4);
  const rr = r0 * (1 + a * Math.sin(k * theta + phi + p * 0.9) + b * Math.sin(m * theta + psi + p));
  return [f1(o.cx + dx * p + rr * Math.cos(theta)), f1(o.cy + dy * p + rr * Math.sin(theta))];
}

export function contourSvg(o: RingOpts & { cls?: string; viewBox: string }): string {
  return `<svg class="${o.cls ?? ''}" viewBox="${o.viewBox}" aria-hidden="true" focusable="false" fill="none">${rings(o)
    .map((d) => `<path d="${d}"/>`)
    .join('')}</svg>`;
}

const RIDGES = [
  'M0 120V78C120 60 210 36 330 40C470 45 520 92 660 88C790 84 850 22 990 18C1120 14 1210 70 1310 74C1370 76 1410 66 1440 58V120Z',
  'M0 120V64C90 40 200 20 310 34C430 50 470 96 610 96C760 96 820 52 930 46C1060 40 1150 90 1270 82C1350 77 1400 50 1440 40V120Z',
  'M0 120V90C110 86 170 50 280 38C400 26 470 60 560 70C680 84 760 30 880 24C1000 18 1080 64 1190 76C1300 88 1380 72 1440 66V120Z',
  'M0 120V56C70 52 160 74 250 80C360 88 420 40 540 30C670 20 740 70 850 84C960 98 1050 60 1150 44C1260 28 1360 48 1440 70V120Z',
];

export function ridge(i: number, flip = false): string {
  return `<svg class="ridge${flip ? ' ridge--flip' : ''}" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${RIDGES[i % RIDGES.length]}"/></svg>`;
}
