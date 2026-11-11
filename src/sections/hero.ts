import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, type Tier } from '../core/env';
import { startHeroGL, type HeroGL } from '../gl/hero';
import { stopScroll, startScroll } from '../core/scroll';

let gl: HeroGL | null = null;
let introVal = 0; // desired terrain rise, applied whenever the shader becomes ready

const visibleLines = () => $$('.hero__title .fit__in').filter((el) => el.offsetParent !== null);

function heroIn(tier: Tier) {
  const lines = visibleLines();
  if (tier === 'static') {
    introVal = 1;
    gl?.setIntro(1);
    return;
  }
  const tl = gsap.timeline();
  lines.forEach((el, i) => {
    const w = Number(el.dataset.wdth ?? 100);
    tl.fromTo(el, { '--wdth': '50%' }, { '--wdth': `${w}%`, duration: 1, ease: 'expo.out', onComplete: () => el.style.setProperty('--wdth', `${w}%`) }, i * 0.08);
  });
  const glProxy = { v: 0 };
  tl.to(glProxy, { v: 1, duration: 1.4, ease: 'power2.out', onUpdate: () => { introVal = glProxy.v; gl?.setIntro(introVal); } }, 0);
  tl.from(['.hero__lead', '.hero__actions', '.hero__note'], { y: 20, duration: 0.7, ease: 'power3.out', stagger: 0.07 }, 0.25);
}

/** Intro overlay (≤1.3 s, skippable) then the hero choreography. */
export function runIntro(tier: Tier) {
  const intro = $('.intro');
  const root = document.documentElement;
  if (!intro || tier === 'static' || root.classList.contains('no-intro') || getComputedStyle(intro).display === 'none') {
    intro?.remove();
    heroIn(tier);
    return;
  }
  stopScroll();
  const mark = $('.intro__mark', intro)!;
  const paths = $$<SVGPathElement>('.intro__rings path', intro);
  gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1, scale: 0.2, transformOrigin: '50% 50%' });
  const tl = gsap.timeline({
    onComplete: () => {
      intro.remove();
      startScroll();
      try { sessionStorage.setItem('uboc-intro', '1'); } catch { /* private mode */ }
      cleanup();
    },
  });
  tl.fromTo(mark, { fontStretch: '50%' }, { fontStretch: '150%', duration: 0.7, ease: 'expo.out' }, 0.15)
    .to(paths, { scale: 1, strokeDashoffset: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06 }, 0.15)
    .fromTo(intro, { clipPath: 'circle(150% at 50% 45%)' }, { clipPath: 'circle(0% at 50% 45%)', duration: 0.45, ease: 'power2.inOut' }, 0.85)
    .add(() => heroIn(tier), 0.85);
  const skip = () => tl.timeScale(6);
  const evs = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
  evs.forEach((ev) => addEventListener(ev, skip, { passive: true }));
  const cleanup = () => evs.forEach((ev) => removeEventListener(ev, skip));
  $('.intro__skip', intro)?.addEventListener('click', skip);
}

export function initHero(tier: Tier) {
  const hero = $('.hero')!;
  const canvas = $<HTMLCanvasElement>('.hero__gl')!;
  const text = [$('.hero__title')!, $('.hero__lead')!];
  const start = () => {
    gl = startHeroGL(canvas, tier, text);
    gl?.setIntro(tier === 'static' ? 1 : introVal);
  };
  // Never block LCP with shader compilation.
  requestAnimationFrame(() => {
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 300 });
    else setTimeout(start, 50);
  });

  if (tier === 'static') return;

  const hint = $('.hero__hint');
  const toUv = (x: number, y: number) => {
    const r = canvas.getBoundingClientRect();
    return [(x - r.left) / r.width, 1 - (y - r.top) / r.height] as const;
  };
  hero.addEventListener('pointermove', (e) => {
    const [x, y] = toUv(e.clientX, e.clientY);
    gl?.setTarget(x, y);
    hint?.classList.add('is-gone');
  });
  hero.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    const [x, y] = toUv(t.clientX, t.clientY);
    gl?.setTarget(x, y);
  }, { passive: true });
  hero.addEventListener('pointerdown', (e) => {
    if ((e.target as Element).closest('a,button')) return;
    const [x, y] = toUv(e.clientX, e.clientY);
    gl?.pulse(x, y);
  });

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => gl?.setScroll(self.progress),
  });

  const mm = gsap.matchMedia();
  mm.add(`(min-width: 1px)`, () => {
    if (tier !== 'high') return;
    gsap.to('.hero__content', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    const p = { v: 0 };
    gsap.to(p, {
      v: 1,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      onUpdate: () => {
        visibleLines().forEach((el) => {
          const w = Number(el.dataset.wdth ?? 100);
          el.style.setProperty('--wdth', `${w + (50 - w) * p.v}%`);
        });
      },
    });
  });
}
