import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { $, $$, finePointer, isDesktop, tpl, type Tier } from '../core/env';
import { scrollToEl, startScroll, stopScroll } from '../core/scroll';
import { site } from '../data/site';

/* ───────── shared: section headings + ridges ───────── */
export function initHeadings(tier: Tier) {
  if (tier === 'static') return;
  $$('.sec .h2').forEach((h) => {
    SplitText.create(h, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: 'expo.out',
          stagger: tier === 'low' ? 0 : 0.08,
          scrollTrigger: { trigger: h, start: 'top 80%', once: true },
        }),
    });
    const lead = h.parentElement?.querySelector('.lead');
    if (lead) gsap.from(lead, { y: 24, autoAlpha: 0, duration: 0.7, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 80%', once: true } });
  });
  if (tier !== 'high') return;
  $$('.ridge').forEach((r) => {
    const flip = r.classList.contains('ridge--flip') ? -1 : 1;
    gsap.fromTo(r, { scaleY: 0.35, scaleX: flip }, {
      scaleY: 1, scaleX: flip, ease: 'none',
      scrollTrigger: { trigger: r.parentElement, start: 'top bottom', end: 'top 60%', scrub: true },
    });
  });
}

/* ───────── services accordion ───────── */
export function initServices(tier: Tier) {
  const list = $('.svc-list')!;
  const rows = $$('.svc', list);
  const playVisual = (row: HTMLElement) => {
    if (tier === 'static') return;
    const vis = row.querySelector('.svc-vis');
    if (!vis || getComputedStyle(vis).display === 'none') return;
    const rects = vis.querySelectorAll('rect:not(.frame)');
    gsap.fromTo(rects, { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.15 });
    const curve = vis.querySelector('.curve');
    if (curve) gsap.fromTo(curve, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, delay: 0.3, ease: 'power2.out' });
  };
  const setOpen = (row: HTMLElement, open: boolean) => {
    row.classList.toggle('is-open', open);
    row.dataset.theme = open ? 'ultra' : 'frost';
    const btn = row.querySelector('.svc__btn')!;
    btn.setAttribute('aria-expanded', String(open));
    row.querySelector('.svc__btn .sr-only')!.textContent = open ? list.dataset.close! : list.dataset.open!;
    if (open) playVisual(row);
  };
  rows.forEach((row) => {
    row.querySelector('.svc__btn')!.addEventListener('click', () => {
      const wasOpen = row.classList.contains('is-open');
      rows.forEach((r) => setOpen(r, false));
      // exactly one open at a time: clicking the open one keeps it open
      setOpen(row, true);
      if (wasOpen) return;
      // after the height transition, refresh triggers below
      setTimeout(() => ScrollTrigger.refresh(), 650);
    });
  });
  if (tier !== 'static') {
    gsap.from(rows, { y: 40, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: list, start: 'top 75%', once: true } });
  }
}

/* ───────── works: carousel, previews, detail dialog ───────── */
export function initWorks(tier: Tier) {
  const grid = $('.works__grid')!;
  const cards = $$('.work', grid);
  const count = $('.works__count')!;
  const dots = $$('.dot');

  // mobile carousel position
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.intersectionRatio < 0.6) return;
        const i = cards.indexOf(e.target as HTMLElement);
        count.textContent = tpl(count.dataset.tpl!, { current: i + 1, total: cards.length });
        dots.forEach((d, j) => d.classList.toggle('is-on', j === i));
      });
    },
    { root: grid, threshold: [0.6] },
  );
  cards.forEach((c) => io.observe(c));
  dots.forEach((d, i) =>
    d.addEventListener('click', () => grid.scrollTo({ left: cards[i].offsetLeft - grid.offsetLeft - parseFloat(getComputedStyle(grid).paddingLeft), behavior: tier === 'static' ? 'auto' : 'smooth' })),
  );

  // previews: hover/focus on desktop, ≥60 % in view on touch
  if (tier !== 'static') {
    const pv = (c: HTMLElement) => c.querySelector('.pv')!;
    if (finePointer()) {
      cards.forEach((c) => {
        c.addEventListener('pointerenter', () => pv(c).classList.add('is-playing'));
        c.addEventListener('pointerleave', () => pv(c).classList.remove('is-playing'));
        c.addEventListener('focusin', () => pv(c).classList.add('is-playing'));
        c.addEventListener('focusout', () => pv(c).classList.remove('is-playing'));
      });
    } else {
      const vio = new IntersectionObserver(
        (entries) => entries.forEach((e) => pv(e.target as HTMLElement).classList.toggle('is-playing', e.intersectionRatio >= 0.6)),
        { threshold: [0, 0.6, 1] },
      );
      cards.forEach((c) => vio.observe(c));
    }
    cards.forEach((c) => {
      const media = c.querySelector('.work__media')!;
      const text = c.querySelector('.work__text')!;
      gsap.fromTo(media, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 85%', once: true } });
      gsap.from(text, { y: 24, autoAlpha: 0, duration: 0.8, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 85%', once: true } });
    });
    if (tier === 'high') {
      gsap.matchMedia().add('(min-width: 1280px)', () => {
        $$('.work--narrow', grid).forEach((c) =>
          gsap.fromTo(c, { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: grid, start: 'top bottom', end: 'bottom top', scrub: true } }),
        );
      });
    }
  }

  // detail dialog
  const dlg = $<HTMLDialogElement>('.wd')!;
  let opener: HTMLElement | null = null;
  const fill = (i: number) => {
    const it = site.works.items[i];
    $('.wd__meta', dlg)!.textContent = `${it.services}, ${it.place}, ${it.year}`;
    $('.wd__title', dlg)!.textContent = it.client;
    $('.wd__sum', dlg)!.textContent = it.summary;
    $('.wd__challenge', dlg)!.textContent = it.challenge;
    $('.wd__solution', dlg)!.textContent = it.solution;
    const ul = $('.wd__results', dlg)!;
    ul.replaceChildren(...it.results.map((r) => Object.assign(document.createElement('li'), { textContent: r })));
    const media = $('.wd__media', dlg)!;
    const src = cards[i].querySelector('.pv')!.cloneNode(true) as HTMLElement;
    src.classList.toggle('is-playing', tier !== 'static');
    media.replaceChildren(src);
  };
  const from = () => (isDesktop() ? { xPercent: 100 } : { yPercent: 100 });
  const open = (i: number, btn: HTMLElement) => {
    opener = btn;
    fill(i);
    dlg.showModal();
    $('.wd__inner', dlg)!.scrollTop = 0;
    stopScroll();
    document.dispatchEvent(new CustomEvent('overlay', { detail: true }));
    if (tier !== 'static') gsap.fromTo(dlg, from(), { xPercent: 0, yPercent: 0, duration: 0.5, ease: 'expo.out' });
    $<HTMLElement>('.wd__close', dlg)!.focus();
  };
  let closing = false;
  const close = (after?: () => void) => {
    if (closing || !dlg.open) return;
    closing = true;
    const finish = () => {
      dlg.close();
      gsap.set(dlg, { clearProps: 'transform' });
      closing = false;
      startScroll();
      document.dispatchEvent(new CustomEvent('overlay', { detail: false }));
      if (after) after();
      else opener?.focus();
    };
    if (tier === 'static') finish();
    else gsap.to(dlg, { ...from(), duration: 0.35, ease: 'power2.in', onComplete: finish });
  };
  $$('.work__open').forEach((b) => b.addEventListener('click', () => open(Number(b.dataset.work), b)));
  $('.wd__close', dlg)!.addEventListener('click', () => close());
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  $('.wd__cta', dlg)!.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    close(() => {
      const k = $('#kontakt')!;
      scrollToEl(k);
      setTimeout(() => ($<HTMLInputElement>('#f-name')!).focus({ preventScroll: true }), 900);
    });
  });
}

/* ───────── process ───────── */
export function initProcess(tier: Tier) {
  const sec = $('.process')!;
  const steps = $$('.step', sec);
  const btns = steps.map((s) => s.querySelector<HTMLButtonElement>('.step__btn')!);
  const rings = $$<SVGPathElement>('.hill__r', sec);
  const marker = $<SVGCircleElement>('.hill__marker', sec)!;
  const marks: [number, number][] = JSON.parse(marker.dataset.pts ?? '[]');
  const num = $('.hill__num span', sec)!;
  let active = 0;

  const setActive = (i: number) => {
    if (i === active) return;
    const prev = active;
    active = i;
    steps.forEach((s, j) => {
      s.classList.toggle('is-active', j === i);
      btns[j].setAttribute('aria-current', j === i ? 'step' : 'false');
    });
    gsap.to(marker, { attr: { cx: marks[i][0], cy: marks[i][1] }, duration: 0.6, ease: 'power3.inOut' });
    gsap.timeline()
      .to(num, { yPercent: i > prev ? -110 : 110, duration: 0.2, ease: 'power2.in' })
      .add(() => { num.textContent = String(i + 1); })
      .fromTo(num, { yPercent: i > prev ? 110 : -110 }, { yPercent: 0, duration: 0.3, ease: 'expo.out' });
  };

  const mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 1024px)', mob: '(max-width: 1023px)' }, (ctx) => {
    const { desk } = ctx.conditions as { desk: boolean };
    if (desk && tier === 'high') {
      const n = rings.length;
      const st = ScrollTrigger.create({
        trigger: sec,
        pin: $('.process__pin', sec),
        start: 'top top',
        end: () => `+=${innerHeight * 0.7 * 4}`,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          const shown = 3 + p * (n - 3) * 1.05; // first step already shows the outer three contours
          rings.forEach((r, i) => {
            const k = Math.min(1, Math.max(0, shown - i));
            r.style.setProperty('--off', String(1 - k));
            r.style.opacity = k > 0 ? '1' : '0';
          });
          rings[n - 1].classList.toggle('is-top', p > 0.97);
          setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
        },
      });
      rings.forEach((r, i) => { r.style.setProperty('--off', i < 3 ? '0' : '1'); r.style.opacity = i < 3 ? '1' : '0'; });
      const go = (i: number) => scrollToEl(st.start + ((i + 0.5) / steps.length) * (st.end - st.start));
      const handlers = btns.map((b, i) => {
        const h = () => go(i);
        b.addEventListener('click', h);
        return h;
      });
      const focusHandlers = steps.map((s, i) => {
        const h = () => setActive(i);
        s.addEventListener('focusin', h);
        return h;
      });
      return () => {
        btns.forEach((b, i) => b.removeEventListener('click', handlers[i]));
        steps.forEach((s, i) => s.removeEventListener('focusin', focusHandlers[i]));
        rings.forEach((r) => { r.style.removeProperty('--off'); r.style.opacity = ''; });
      };
    }
    // mobile / low / static: plain list, progress line fills while scrolling
    const ol = $('.steps', sec)!;
    if (tier === 'static') return;
    gsap.fromTo(ol, { '--prog': 0 }, { '--prog': 1, ease: 'none', scrollTrigger: { trigger: ol, start: 'top 75%', end: 'bottom 60%', scrub: true } });
    steps.forEach((s) => {
      gsap.from(s.querySelector('.step__dot'), { scale: 0, duration: 0.4, ease: 'back.out(2)', scrollTrigger: { trigger: s, start: 'top 80%', once: true } });
      gsap.from(s.querySelectorAll('.step__btn, .step__more'), { x: 16, autoAlpha: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 80%', once: true } });
    });
  });
}

/* ───────── results: count up ───────── */
export function initResults(tier: Tier) {
  if (tier === 'static') return;
  const nums = $$('.stat__n');
  const fmt = (v: number, d: number) => new Intl.NumberFormat('sk-SK', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v).replace(/\u00a0/g, ' ');
  ScrollTrigger.create({
    trigger: '.stats',
    start: 'top 78%',
    once: true,
    onEnter: () => {
      nums.forEach((el, i) => {
        const v = Number(el.dataset.value);
        const d = Number(el.dataset.dec);
        const suf = el.dataset.suffix ?? '';
        const o = { v: 0, w: 60 };
        gsap.to(o, {
          v, w: 110, duration: 1.6, delay: i * 0.12, ease: 'expo.out',
          onUpdate: () => {
            el.textContent = fmt(o.v, d) + suf;
            if (tier === 'high') el.style.fontStretch = `${o.w}%`;
          },
        });
      });
    },
  });
  if (tier === 'high')
    gsap.fromTo('.results__bg', { rotate: -4 }, { rotate: 4, ease: 'none', scrollTrigger: { trigger: '.results', start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ───────── team ───────── */
export function initTeam(tier: Tier) {
  if (tier === 'static') return;
  const members = $$('.member');
  gsap.from(members.map((m) => m.querySelector('.por')), { scale: 0.6, rotate: -20, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.members', start: 'top 80%', once: true } });
  gsap.from(members.map((m) => m.querySelectorAll('h3, p')), { y: 20, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.05, scrollTrigger: { trigger: '.members', start: 'top 80%', once: true } });
  if (tier !== 'high' || !finePointer()) return;
  members.forEach((m) => {
    const rs = m.querySelectorAll('.por__r');
    const on = () => gsap.to(rs, { rotate: (i) => (i % 2 ? -12 : 12), scale: 1.04, duration: 0.8, ease: 'expo.out', stagger: 0.03, overwrite: true });
    const off = () => gsap.to(rs, { rotate: 0, scale: 1, duration: 0.8, ease: 'expo.out', stagger: 0.03, overwrite: true });
    m.addEventListener('pointerenter', on);
    m.addEventListener('pointerleave', off);
    m.addEventListener('focusin', on);
    m.addEventListener('focusout', off);
  });
}

/* ───────── testimonials ───────── */
export function initTestimonials(tier: Tier) {
  const stage = $('.testi__stage')!;
  const box = $('.testi__quotes', stage)!;
  const figs = $$('.quote', box);
  const count = $('.testi__count', stage)!;
  const bg = $('.testi__bg');
  let i = 0;
  let busy = false;
  let turns = 0;
  const go = (dir: number) => {
    if (busy) return;
    const next = (i + dir + figs.length) % figs.length;
    const out = figs[i];
    const inn = figs[next];
    i = next;
    count.textContent = tpl(count.dataset.tpl!, { current: i + 1, total: figs.length });
    turns += dir;
    if (bg && tier !== 'static') bg.style.transform = `rotate(${turns * 90}deg)`;
    if (tier === 'static') {
      out.hidden = true;
      inn.hidden = false;
      return;
    }
    busy = true;
    const h0 = box.offsetHeight;
    if (tier === 'low') {
      gsap.to(out, { autoAlpha: 0, duration: 0.3, onComplete: () => {
        out.hidden = true; gsap.set(out, { clearProps: 'all' });
        inn.hidden = false;
        gsap.from(inn, { autoAlpha: 0, duration: 0.3, onComplete: () => { busy = false; } });
      } });
      return;
    }
    const so = SplitText.create(out.querySelector('.quote__text'), { type: 'lines', mask: 'lines', linesClass: 'line' });
    gsap.to(so.lines, {
      yPercent: -110, duration: 0.4, ease: 'power2.in', stagger: 0.03,
      onComplete: () => {
        so.revert();
        out.hidden = true;
        inn.hidden = false;
        const h1 = box.offsetHeight;
        gsap.fromTo(box, { height: h0 }, { height: h1, duration: 0.5, ease: 'power3.out', clearProps: 'height' });
        const si = SplitText.create(inn.querySelector('.quote__text'), { type: 'lines', mask: 'lines', linesClass: 'line' });
        gsap.from(si.lines, { yPercent: 110, duration: 0.7, ease: 'expo.out', stagger: 0.05, onComplete: () => { si.revert(); busy = false; } });
        gsap.from(inn.querySelector('figcaption'), { autoAlpha: 0, y: 10, duration: 0.5, delay: 0.2 });
      },
    });
  };
  $$('[data-dir]', stage).forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.dir))));
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });
  let x0 = 0;
  let y0 = 0;
  stage.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; });
  stage.addEventListener('pointerup', (e) => {
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(e.clientY - y0) && !(e.target as Element).closest('button')) go(dx < 0 ? 1 : -1);
  });
}

/* ───────── footer wordmark + contact entrance ───────── */
export function initFooterAndContact(tier: Tier) {
  if (tier === 'static') return;
  gsap.fromTo('.form-panel', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.form-panel', start: 'top 85%', once: true } });
  gsap.from('.form > *', { y: 16, duration: 0.6, ease: 'power3.out', stagger: 0.04, scrollTrigger: { trigger: '.form-panel', start: 'top 85%', once: true } });
  if (tier !== 'high') return;
  const mark = $('.ftr__mark .fit__in')!;
  const p = { v: 0 };
  gsap.to(p, {
    v: 1, ease: 'none',
    scrollTrigger: { trigger: '.ftr', start: 'top bottom', end: 'bottom bottom', scrub: true },
    onUpdate: () => {
      const w = Number(mark.dataset.wdth ?? 110);
      mark.style.setProperty('--wdth', `${50 + (w - 50) * p.v}%`);
    },
  });
}
