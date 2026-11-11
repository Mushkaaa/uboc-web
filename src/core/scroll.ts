import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { headerH, type Tier } from './env';

let lenis: Lenis | null = null;

export function initScroll(tier: Tier) {
  if (tier !== 'static') {
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true, allowNestedScroll: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis?.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // In-page anchors: account for the fixed header, move focus for keyboard/screen-reader users.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href')!.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    history.replaceState(null, '', `#${id}`);
    if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT)$/.test(target.tagName)) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

export function scrollToEl(el: HTMLElement | number) {
  if (lenis) {
    // Lenis already honours html { scroll-padding-top } (= header height), so no extra offset here.
    lenis.scrollTo(el, { duration: 1.2 });
  } else {
    const y = typeof el === 'number' ? el : el.getBoundingClientRect().top + scrollY - headerH() + 1;
    scrollTo({ top: y, behavior: 'auto' });
  }
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
