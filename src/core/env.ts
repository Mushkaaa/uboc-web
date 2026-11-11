export type Tier = 'static' | 'low' | 'high';

interface NavExtra {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

/** static = reduced motion, low = weak device / no WebGL2, high = everything. */
export function detectTier(): Tier {
  const root = document.documentElement;
  const forced = root.dataset.tier as Tier | undefined;
  if (forced === 'static' || forced === 'low' || forced === 'high') return forced;
  const nav = navigator as Navigator & NavExtra;
  let low =
    (nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 4) ||
    (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) ||
    nav.connection?.saveData === true;
  if (!low) {
    try {
      low = !document.createElement('canvas').getContext('webgl2');
    } catch {
      low = true;
    }
  }
  const tier: Tier = low ? 'low' : 'high';
  root.dataset.tier = tier;
  return tier;
}

export const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
export const isDesktop = () => matchMedia('(min-width: 1024px)').matches;
export const headerH = () => document.querySelector<HTMLElement>('.hdr')?.offsetHeight ?? 64;

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

export const tpl = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
