import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, finePointer, headerH, type Tier } from '../core/env';
import { scrollToEl, startScroll, stopScroll } from '../core/scroll';

/* ───────── header: theme follows the section underneath, hides on scroll down ───────── */
export function initHeader(tier: Tier) {
  const hdr = $('.hdr')!;
  const sections = $$('main > section, .ftr');
  sections.forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: () => `top top+=${headerH() / 2}`,
      end: () => `bottom top+=${headerH() / 2}`,
      onToggle: (self) => {
        if (self.isActive) hdr.dataset.theme = sec.dataset.theme ?? 'ultra';
      },
    });
  });
  const hero = $('.hero')!;
  let pastHero = false;
  let hidden = false;
  const show = (v: boolean) => {
    if (hidden === !v) return;
    hidden = !v;
    if (tier === 'static') hdr.style.transform = v ? '' : 'translateY(-100%)';
    else gsap.to(hdr, { yPercent: v ? 0 : -100, duration: 0.35, ease: 'power3.out' });
  };
  ScrollTrigger.create({
    trigger: hero,
    start: () => `bottom top+=${headerH()}`,
    onEnter: () => { pastHero = true; hdr.classList.add('is-solid'); },
    onLeaveBack: () => { pastHero = false; hdr.classList.remove('is-solid'); show(true); },
  });
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      if (!pastHero || document.documentElement.classList.contains('menu-open')) return show(true);
      show(self.direction < 0);
    },
  });
  hdr.addEventListener('focusin', () => show(true));
}

/* ───────── mobile menu ───────── */
export function initMenu(tier: Tier) {
  const btn = $<HTMLButtonElement>('.hdr__menu')!;
  const menu = $('#menu')!;
  const root = document.documentElement;
  const focusables = () => [btn, ...$$<HTMLElement>('a', menu)];
  let open = false;

  const set = (v: boolean, returnFocus = true) => {
    if (open === v) return;
    open = v;
    btn.setAttribute('aria-expanded', String(v));
    btn.textContent = v ? btn.dataset.close! : btn.dataset.open!;
    root.classList.toggle('menu-open', v);
    document.dispatchEvent(new CustomEvent('overlay', { detail: v }));
    if (v) {
      menu.hidden = false;
      stopScroll();
      if (tier !== 'static') {
        gsap.fromTo(menu, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.5, ease: 'expo.out' });
        gsap.fromTo($$('.menu__list li', menu), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'expo.out', delay: 0.05 });
      }
      $$<HTMLElement>('a', menu)[0]?.focus();
    } else {
      menu.hidden = true;
      startScroll();
      if (returnFocus) btn.focus();
    }
  };
  btn.addEventListener('click', () => set(!open));
  menu.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) set(false, false);
  });
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') set(false);
    if (e.key === 'Tab') {
      const f = focusables();
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  matchMedia('(min-width: 1280px)').addEventListener('change', (m) => m.matches && set(false, false));
}

/* ───────── sticky CTA bar on mobile ───────── */
export function initCtaBar(tier: Tier) {
  const bar = $('.cta-bar')!;
  const heroCta = $('.hero__cta')!;
  const contact = $('#kontakt')!;
  const st = { heroOut: false, contactIn: false, overlay: false, formFocus: false };
  let shown = false;
  const update = () => {
    const v = st.heroOut && !st.contactIn && !st.overlay && !st.formFocus;
    if (v === shown) return;
    shown = v;
    if (v) {
      bar.hidden = false;
      if (tier !== 'static') gsap.fromTo(bar, { yPercent: 100 }, { yPercent: 0, duration: 0.4, ease: 'expo.out' });
    } else if (tier !== 'static') {
      gsap.to(bar, { yPercent: 100, duration: 0.3, ease: 'power2.in', onComplete: () => { if (!shown) bar.hidden = true; } });
    } else bar.hidden = true;
  };
  new IntersectionObserver(([e]) => {
    st.heroOut = !e.isIntersecting && e.boundingClientRect.top < 0;
    update();
  }).observe(heroCta);
  new IntersectionObserver(([e]) => {
    st.contactIn = e.isIntersecting;
    update();
  }, { threshold: 0.15 }).observe(contact);
  document.addEventListener('overlay', (e) => {
    st.overlay = (e as CustomEvent<boolean>).detail;
    update();
  });
  const form = $('.form')!;
  form.addEventListener('focusin', () => { st.formFocus = true; update(); });
  form.addEventListener('focusout', () => { st.formFocus = false; update(); });
}

/* ───────── custom cursor (desktop, high tier) ───────── */
export function initCursor(tier: Tier) {
  if (tier !== 'high' || !finePointer()) return;
  const root = document.documentElement;
  const cur = $('.cursor')!;
  const dot = $('.cursor__dot', cur)!;
  const ring = $('.cursor__ring', cur)!;
  const label = $('.cursor__label', cur)!;
  root.classList.add('has-cursor');
  const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
  const views: Record<string, string> = { view: cur.dataset.view ?? '', drag: cur.dataset.drag ?? '' };
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    gsap.set(dot, { x: e.clientX, y: e.clientY });
    rx(e.clientX);
    ry(e.clientY);
    cur.classList.remove('is-hidden');
    const t = e.target as Element;
    if (t.closest('input, textarea, select')) {
      cur.classList.add('is-hidden');
      return;
    }
    const c = t.closest<HTMLElement>('[data-cursor]');
    const inHero = !c && !!t.closest('.hero');
    const state = c?.dataset.cursor ?? (inHero ? 'hero' : '');
    if (cur.dataset.state !== state) {
      cur.dataset.state = state;
      label.textContent = views[state] ?? '';
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));
}

/* ───────── magnetic buttons ───────── */
export function initMagnetic(tier: Tier) {
  if (tier !== 'high' || !finePointer()) return;
  $$('[data-magnetic]').forEach((el) => {
    const inner = el.querySelector<HTMLElement>('span') ?? el;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    const ixTo = gsap.quickTo(inner, 'x', { duration: 0.4, ease: 'power3.out' });
    const iyTo = gsap.quickTo(inner, 'y', { duration: 0.4, ease: 'power3.out' });
    let active = false;
    const reset = () => {
      active = false;
      gsap.to([el, inner], { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)', overwrite: true });
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || el.matches(':focus-visible')) return;
      const r = el.getBoundingClientRect();
      const pad = 40;
      const inside = e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad;
      if (!inside) {
        if (active) reset();
        return;
      }
      active = true;
      const dx = e.clientX - (r.left + r.width / 2 - (gsap.getProperty(el, 'x') as number));
      const dy = e.clientY - (r.top + r.height / 2 - (gsap.getProperty(el, 'y') as number));
      xTo(dx * 0.35); yTo(dy * 0.35); ixTo(dx * 0.15); iyTo(dy * 0.15);
    }, { passive: true });
  });
}

export function initBackToTop() {
  $('.ftr__top-btn')?.addEventListener('click', () => {
    scrollToEl(0);
    ($('.hdr__mark') as HTMLElement | null)?.focus({ preventScroll: true });
  });
}
