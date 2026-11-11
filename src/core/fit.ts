/** Stretch each `.fit__in` along the font's width axis until it fills its line.
 *  The width axis does not change vertical metrics, so this causes no layout shift. */
export function fitLines(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.fit__in').forEach((inner) => {
    const line = inner.parentElement!;
    if (!line.offsetParent && getComputedStyle(line).display === 'none') return;
    const target = line.clientWidth;
    if (!target) return;
    inner.style.fontSize = '';
    inner.style.fontStretch = '';
    const measure = (w: number) => {
      inner.style.setProperty('--wdth', `${w}%`);
      return inner.getBoundingClientRect().width;
    };
    const w50 = measure(50);
    if (w50 > target) {
      // even the narrowest cut overflows: shrink the size in 2 % steps
      let scale = 1;
      while (measure(50) > target && scale > 0.4) {
        scale -= 0.02;
        inner.style.fontSize = `${scale}em`;
      }
      inner.dataset.wdth = '50';
      return;
    }
    // Width grows ~linearly with the wdth axis: interpolate, then correct (3–5 reflows instead of ~10).
    const w100 = measure(100);
    let lo = Math.min(150, Math.max(50, 50 + ((target - w50) / Math.max(1, w100 - w50)) * 50));
    for (let i = 0; i < 3; i++) {
      const cur = measure(lo);
      if (cur <= target && target - cur < 2) break;
      const slope = (w100 - w50) / 50;
      lo = Math.min(150, Math.max(50, lo + (target - cur) / slope - (cur > target ? 0.15 : 0)));
    }
    while (lo > 50 && measure(lo) > target) lo -= 0.3;
    const w = Math.floor(lo * 10) / 10;
    inner.style.setProperty('--wdth', `${w}%`);
    inner.dataset.wdth = String(w);
  });
}

export function watchFit(cb: () => void) {
  let t = 0;
  let lastW = innerWidth;
  const ro = new ResizeObserver(() => {
    if (innerWidth === lastW) return; // ignore mobile URL-bar height changes
    lastW = innerWidth;
    clearTimeout(t);
    t = window.setTimeout(cb, 150);
  });
  ro.observe(document.documentElement);
}
