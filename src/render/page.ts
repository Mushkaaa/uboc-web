// Renders the whole page from site.ts into static HTML at build time.
import type { Site } from '../data/site.ts';
import { esc, t, rings, ringPoint, contourSvg, ridge, type RingOpts } from './util.ts';
import { preview } from './previews.ts';

const icon = {
  plus: '<span class="pm" aria-hidden="true"><i></i><i></i></span>',
  close:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  alert:
    '<svg class="ico" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="9" fill="currentColor"/><path d="M10 5v6M10 14.2v.1" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
};

function wordmark(): string {
  return 'Úboč';
}

function intro(s: Site): string {
  const r = rings({ seed: 'intro', count: 5, cx: 200, cy: 200, rMax: 190, rMin: 50, wobble: 0.1 });
  return `<div class="intro" data-theme="ultra">
  <div class="intro__inner">
    <svg class="intro__rings" viewBox="0 0 400 400" aria-hidden="true" focusable="false" fill="none">${r
      .map((d, i) => `<path pathLength="1" style="--i:${i}" d="${d}"/>`)
      .join('')}</svg>
    <p class="intro__mark" aria-hidden="true">${wordmark()}</p>
  </div>
  <button class="intro__skip btn btn--ghost" type="button">${esc(s.ui.skipIntro)}</button>
</div>`;
}

function header(s: Site): string {
  const links = s.nav.map((n) => `<li><a href="${n.href}" data-cursor="link">${esc(n.label)}</a></li>`).join('');
  return `<header class="hdr" data-theme="ultra">
  <a class="hdr__mark" href="#top" aria-label="${esc(s.brand.name)}, na začiatok stránky" data-cursor="link">${wordmark()}</a>
  <nav class="hdr__nav" aria-label="${esc(s.ui.menuLabel)}"><ul>${links}</ul></nav>
  <a class="hdr__cta btn btn--line" href="${s.cta.href}" data-magnetic data-cursor="link"><span>${esc(s.cta.short)}</span></a>
  <button class="hdr__menu" type="button" aria-expanded="false" aria-controls="menu" data-open="${esc(s.ui.menuOpen)}" data-close="${esc(s.ui.menuClose)}">${esc(s.ui.menuOpen)}</button>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="${esc(s.ui.menuLabel)}" data-theme="pink" hidden>
  <ul class="menu__list">${s.nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}</ul>
  <div class="menu__foot">
    <a class="btn btn--primary" href="${s.cta.href}">${esc(s.cta.primary)}</a>
    <a href="mailto:${s.contact.email}">${esc(s.contact.email)}</a>
    <a href="${s.contact.phone.href}">${esc(s.contact.phone.display)}</a>
  </div>
</div>`;
}

function fitLines(lines: readonly string[], bp: 'mobile' | 'desktop'): string {
  return `<span class="fit fit--${bp}" aria-hidden="true">${lines
    .map((l) => `<span class="fit__line"><span class="fit__in">${esc(l)}</span></span>`)
    .join('')}</span>`;
}

function hero(s: Site): string {
  const h = s.hero;
  return `<section class="hero" id="top" data-theme="ultra" aria-labelledby="hero-title">
  <div class="hero__bg" aria-hidden="true">
    ${contourSvg({ seed: 'hero-fallback', count: 7, cx: 1100, cy: 520, rMax: 520, rMin: 60, viewBox: '0 0 1440 900', cls: 'hero__lines', drift: [60, -40] })}
    <canvas class="hero__gl"></canvas>
  </div>
  <div class="hero__content wrap">
    <h1 class="hero__title" id="hero-title" aria-label="${esc(h.title)}">${fitLines(h.titleLines.mobile, 'mobile')}${fitLines(h.titleLines.desktop, 'desktop')}</h1>
    <div class="hero__row">
      <p class="hero__lead">${esc(h.lead)}</p>
      <div class="hero__actions">
        <a class="btn btn--primary btn--xl hero__cta" href="${s.cta.href}" data-magnetic data-cursor="link"><span>${esc(s.cta.primary)}</span></a>
        <a class="link-u" href="${h.secondaryCta.href}" data-cursor="link">${esc(h.secondaryCta.label)}</a>
      </div>
      <p class="hero__note">${esc(h.note)}</p>
    </div>
  </div>
  <p class="hero__hint" aria-hidden="true"><span class="hint-p">${esc(h.hintPointer)}</span><span class="hint-t">${esc(h.hintTouch)}</span></p>
</section>`;
}

function serviceVisual(kind: string): string {
  if (kind === 'bars')
    return `<svg class="svc-vis svc-vis--bars" viewBox="0 0 240 160" aria-hidden="true" focusable="false"><g class="bars">${[38, 56, 70, 92, 118]
      .map((h, i) => `<rect x="${18 + i * 44}" y="${150 - h}" width="28" height="${h}" style="--i:${i}"/>`)
      .join('')}</g><path class="curve" pathLength="1" d="M20 118C70 108 100 92 130 74S200 30 230 20" fill="none"/></svg>`;
  if (kind === 'wireframe')
    return `<svg class="svc-vis svc-vis--wire" viewBox="0 0 240 160" aria-hidden="true" focusable="false" fill="none"><rect class="frame" x="6" y="6" width="228" height="148" rx="6"/><rect style="--i:0" x="20" y="22" width="80" height="12"/><rect style="--i:1" x="20" y="46" width="200" height="40"/><rect style="--i:2" x="20" y="98" width="60" height="42"/><rect style="--i:3" x="90" y="98" width="60" height="42"/><rect style="--i:4" x="160" y="98" width="60" height="42"/></svg>`;
  return `<svg class="svc-vis svc-vis--tiles" viewBox="0 0 240 160" aria-hidden="true" focusable="false">${[0, 1, 2]
    .map((i) => `<rect style="--i:${i}" x="${16 + i * 74}" y="34" width="62" height="92" rx="6"/>`)
    .join('')}</svg>`;
}

function services(s: Site): string {
  const sv = s.services;
  const rows = sv.items
    .map((it, i) => {
      const open = i === 0;
      return `<li class="svc${open ? ' is-open' : ''}" data-theme="${open ? 'ultra' : 'frost'}">
      <h3 class="svc__h"><button class="svc__btn" type="button" id="svc-b-${it.id}" aria-expanded="${open}" aria-controls="svc-p-${it.id}" data-cursor="link">
        <span class="svc__title">${esc(it.title)}</span>
        <span class="svc__sum">${esc(it.summary)}</span>
        <span class="svc__price">${esc(it.price)}</span>
        ${icon.plus}<span class="sr-only">${esc(open ? sv.toggleClose : sv.toggleOpen)}</span>
      </button></h3>
      <div class="svc__panel" id="svc-p-${it.id}" role="region" aria-labelledby="svc-b-${it.id}">
        <div class="svc__body">
          <p class="svc__desc">${esc(it.description)}</p>
          <ul class="svc__list">${it.list.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
          <p class="svc__price-m">${esc(it.price)}</p>
          ${serviceVisual(it.visual)}
        </div>
      </div>
    </li>`;
    })
    .join('');
  return `<section class="sec services" id="${sv.id}" data-theme="frost" aria-labelledby="h-${sv.id}">
  ${ridge(0)}
  <div class="wrap">
    <div class="sec__head"><h2 class="h2" id="h-${sv.id}">${esc(sv.title)}</h2><p class="lead">${esc(sv.lead)}</p></div>
    <ul class="svc-list" data-open="${esc(sv.toggleOpen)}" data-close="${esc(sv.toggleClose)}">${rows}</ul>
    <p class="note">${esc(sv.priceNote)}</p>
  </div>
</section>`;
}

function works(s: Site): string {
  const w = s.works;
  const total = w.items.length;
  const cards = w.items
    .map(
      (it, i) => `<li class="work work--${i % 4 === 0 || i % 4 === 3 ? 'wide' : 'narrow'}" style="--pv-bg:${it.palette.bg}">
      <article class="work__card">
        <div class="work__media">${preview(it.preview, it.palette)}</div>
        <div class="work__text">
          <p class="work__metric"><span class="work__num">${esc(it.metric.value)}</span> <span class="work__mlabel">${esc(it.metric.label)}</span></p>
          <h3 class="work__client">${esc(it.client)}</h3>
          <p class="work__meta">${esc(`${it.services}, ${it.place}, ${it.year}`)}</p>
        </div>
        <button class="work__open" type="button" data-work="${i}" data-cursor="view" aria-haspopup="dialog"><span class="sr-only">${esc(t(w.openLabel, { client: it.client }))}</span></button>
      </article>
    </li>`,
    )
    .join('');
  const dots = w.items
    .map((it, i) => `<button type="button" class="dot${i === 0 ? ' is-on' : ''}" data-dot="${i}" aria-label="${esc(it.client)}"></button>`)
    .join('');
  return `<section class="sec works" id="${w.id}" data-theme="ink" aria-labelledby="h-${w.id}">
  ${ridge(1, true)}
  <div class="wrap">
    <div class="sec__head"><h2 class="h2" id="h-${w.id}">${esc(w.title)}</h2><p class="lead">${esc(w.lead)}</p></div>
  </div>
  <ul class="works__grid" aria-label="${esc(w.carouselLabel)}" data-lenis-prevent-touch tabindex="0">${cards}</ul>
  <div class="works__pager wrap"><div class="dots">${dots}</div><p class="works__count" aria-live="polite" data-tpl="${esc(w.counter)}">${esc(t(w.counter, { current: 1, total }))}</p></div>
</section>
<dialog class="wd" data-theme="frost" aria-labelledby="wd-title">
  <div class="wd__inner">
    <button class="wd__close" type="button" data-cursor="link"><span class="sr-only">${esc(s.ui.close)}</span>${icon.close}</button>
    <p class="wd__meta"></p>
    <h3 class="wd__title" id="wd-title"></h3>
    <p class="wd__sum lead"></p>
    <div class="wd__media"></div>
    <h4>${esc(w.detail.challengeTitle)}</h4><p class="wd__challenge"></p>
    <h4>${esc(w.detail.solutionTitle)}</h4><p class="wd__solution"></p>
    <h4>${esc(w.detail.resultsTitle)}</h4><ul class="wd__results"></ul>
    <a class="btn btn--primary wd__cta" href="#kontakt">${esc(w.detail.cta)}</a>
  </div>
</dialog>`;
}

export const HILL: RingOpts = { seed: 'proces-kopec', count: 12, cx: 210, cy: 215, rMax: 185, rMin: 16, wobble: 0.11, drift: [18, -30] };

function processSec(s: Site): string {
  const p = s.process;
  const hill = rings(HILL);
  const marks = [2, 5, 8, 11].map((i) => ringPoint(HILL, i, -2.3));
  const steps = p.steps
    .map(
      (st, i) => `<li class="step${i === 0 ? ' is-active' : ''}" data-step="${i}">
      <span class="step__dot" aria-hidden="true"></span>
      <button class="step__btn" type="button" data-cursor="link" aria-current="${i === 0 ? 'step' : 'false'}"><span class="step__n">${i + 1}</span><span class="step__title">${esc(st.title)}</span></button>
      <div class="step__more"><div><p class="step__dur">${esc(st.duration)}</p><p class="step__text">${esc(st.text)}</p></div></div>
    </li>`,
    )
    .join('');
  return `<section class="sec process" id="${p.id}" data-theme="ultra" aria-labelledby="h-${p.id}">
  ${ridge(2)}
  <div class="process__pin">
  <div class="wrap">
    <div class="sec__head"><h2 class="h2" id="h-${p.id}">${esc(p.title)}</h2><p class="lead">${esc(p.lead)}</p></div>
    <div class="process__grid">
      <div class="process__vis" aria-hidden="true">
        <svg class="hill" viewBox="0 0 420 420" fill="none" focusable="false">${hill
          .map((d, i) => `<path class="hill__r" style="--i:${i}" pathLength="1" d="${d}"/>`)
          .join('')}<circle class="hill__marker" r="10" cx="${marks[0][0]}" cy="${marks[0][1]}" data-pts='${JSON.stringify(marks)}'/></svg>
        <span class="hill__num"><span>1</span></span>
      </div>
      <ol class="steps">${steps}</ol>
    </div>
  </div>
  </div>
</section>`;
}

function results(s: Site): string {
  const r = s.results;
  const fmt = (v: number, d: number) =>
    new Intl.NumberFormat('sk-SK', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v).replace(/\u00a0/g, ' ');
  const items = r.items
    .map((it) => {
      const final = fmt(it.value, it.decimals) + it.suffix;
      return `<div class="stat"><dt>${esc(it.label)}</dt><dd><span class="stat__n" data-value="${it.value}" data-dec="${it.decimals}" data-suffix="${esc(it.suffix)}" aria-label="${esc(final)}">${esc(final)}</span></dd></div>`;
    })
    .join('');
  return `<section class="sec results" id="${r.id}" data-theme="sun" aria-labelledby="h-${r.id}">
  ${ridge(3, true)}
  ${contourSvg({ seed: 'vysledky', count: 10, cx: 900, cy: 520, rMax: 560, rMin: 40, viewBox: '0 0 1200 800', cls: 'results__bg', drift: [-80, 40] })}
  <div class="wrap">
    <div class="sec__head"><h2 class="h2" id="h-${r.id}">${esc(r.title)}</h2></div>
    <dl class="stats">${items}</dl>
    <p class="note">${esc(r.note)}</p>
  </div>
</section>`;
}

function portrait(name: string, initials: string, colors: readonly string[], alt: string): string {
  const r = rings({ seed: name, count: 8, cx: 100, cy: 100, rMax: 92, rMin: 28, wobble: 0.13 });
  const paths = r
    .map((d, i) => {
      const fill = i === r.length - 1 ? '#FFD84A' : colors[i % 2];
      return `<path class="por__r" style="--i:${i}" d="${d}" fill="${fill}"/>`;
    })
    .join('');
  return `<svg class="por" viewBox="0 0 200 200" role="img" aria-label="${esc(alt)}" focusable="false">${paths}<text x="100" y="100" dy=".36em" text-anchor="middle">${esc(initials)}</text></svg>`;
}

function team(s: Site): string {
  const tm = s.team;
  const members = tm.members
    .map(
      (m) => `<li class="member" tabindex="0">
      ${portrait(m.name, m.initials, m.colors, t(tm.portraitAlt, { name: m.name }))}
      <h3 class="member__name">${esc(m.name)}</h3>
      <p class="member__role">${esc(m.role)}</p>
      <p class="member__bio">${esc(m.bio)}</p>
    </li>`,
    )
    .join('');
  return `<section class="sec team" id="${tm.id}" data-theme="frost" aria-labelledby="h-${tm.id}">
  ${ridge(0, true)}
  <div class="wrap">
    <div class="sec__head"><h2 class="h2" id="h-${tm.id}">${esc(tm.title)}</h2><p class="lead">${esc(tm.lead)}</p></div>
    <ul class="members">${members}</ul>
  </div>
</section>`;
}

function testimonials(s: Site): string {
  const ts = s.testimonials;
  const total = ts.items.length;
  const figs = ts.items
    .map(
      (q, i) => `<figure class="quote"${i ? ' hidden' : ''} data-q="${i}">
      <blockquote><p class="quote__text">„${esc(q.quote)}“</p></blockquote>
      <figcaption><span class="quote__name">${esc(q.name)}</span><span class="quote__role">${esc(`${q.role}, ${q.company}`)}</span></figcaption>
    </figure>`,
    )
    .join('');
  return `<section class="sec testi" id="${ts.id}" data-theme="pink" aria-labelledby="h-${ts.id}">
  ${ridge(1)}
  ${contourSvg({ seed: 'citat', count: 8, cx: 300, cy: 300, rMax: 280, rMin: 30, viewBox: '0 0 600 600', cls: 'testi__bg', wobble: 0.16 })}
  <div class="wrap">
    <div class="sec__head"><h2 class="h2" id="h-${ts.id}">${esc(ts.title)}</h2></div>
    <div class="testi__stage" role="region" aria-roledescription="carousel" aria-label="${esc(ts.regionLabel)}" data-cursor="drag">
      <div class="testi__quotes" aria-live="polite">${figs}</div>
      <div class="testi__ctrl">
        <button class="btn btn--line" type="button" data-dir="-1">${esc(ts.prev)}</button>
        <button class="btn btn--line" type="button" data-dir="1">${esc(ts.next)}</button>
        <p class="testi__count" data-tpl="${esc(ts.counter)}">${esc(t(ts.counter, { current: 1, total }))}</p>
      </div>
    </div>
  </div>
</section>`;
}

function contact(s: Site): string {
  const c = s.contact;
  const f = c.form;
  const fl = f.fields;
  const err = (id: string) => `<p class="field__err" id="${id}-error" hidden>${icon.alert}<span></span></p>`;
  const input = (name: string, label: string, type: string, extra: string, required: boolean) => `<div class="field" data-field="${name}">
      <label for="f-${name}">${esc(label)}</label>
      <input id="f-${name}" name="${name}" type="${type}" ${extra}${required ? ' required aria-required="true"' : ''} aria-describedby="f-${name}-error">
      ${err(`f-${name}`)}
    </div>`;
  const interest = fl.interest.options
    .map(
      (o, i) =>
        `<label class="pill"><input type="checkbox" name="interest" value="${esc(o)}"${i === 0 ? ' aria-describedby="f-interest-error"' : ''}><span>${esc(o)}</span></label>`,
    )
    .join('');
  const budget = fl.budget.options.map((o) => `<option>${esc(o)}</option>`).join('');
  const errs = (o: Record<string, string>) => esc(JSON.stringify(o));
  return `<section class="sec contact" id="${c.id}" data-theme="ultra" aria-labelledby="h-${c.id}">
  ${ridge(2, true)}
  ${contourSvg({ seed: 'kontakt', count: 9, cx: 200, cy: 650, rMax: 520, rMin: 40, viewBox: '0 0 1200 900', cls: 'contact__bg', drift: [60, -60] })}
  <div class="wrap contact__grid">
    <div class="contact__info">
      <h2 class="h2" id="h-${c.id}">${esc(c.title)}</h2>
      <p class="lead">${esc(c.lead)}</p>
      <p class="contact__big"><a class="link-draw" href="mailto:${c.email}" data-cursor="link">${esc(c.email)}</a></p>
      <p class="contact__big"><a class="link-draw" href="${c.phone.href}" data-cursor="link">${esc(c.phone.display)}</a></p>
      <address>${esc(c.address.street)}<br>${esc(c.address.zip)} ${esc(c.address.city)}<br>${esc(c.hours)}</address>
    </div>
    <div class="form-panel" data-theme="frost">
      <form class="form" novalidate aria-label="${esc(f.legend)}"
        data-summary="${esc(f.errorSummary)}" data-offline="${esc(f.offline)}" data-err-title="${esc(f.error.title)}" data-err-text="${esc(f.error.text)}" data-retry="${esc(f.error.retry)}" data-subject="${esc(f.emailSubject)}"
        data-errors-name="${errs(fl.name.errors)}" data-errors-email="${errs(fl.email.errors)}" data-errors-phone="${errs(fl.phone.errors)}"
        data-errors-interest="${errs(fl.interest.errors)}" data-errors-message="${errs(fl.message.errors)}" data-errors-consent="${errs(fl.consent.errors)}">
        <p class="form__req">${esc(f.requiredNote)}</p>
        ${input('name', fl.name.label, 'text', 'autocomplete="name" minlength="2"', true)}
        <div class="form__two">
          ${input('email', fl.email.label, 'email', 'autocomplete="email" inputmode="email"', true)}
          ${input('phone', fl.phone.label, 'tel', 'autocomplete="tel" inputmode="tel"', false)}
        </div>
        ${input('company', fl.company.label, 'text', 'autocomplete="organization"', false)}
        <fieldset class="field field--pills" data-field="interest">
          <legend>${esc(fl.interest.label)}</legend>
          <div class="pills">${interest}</div>
          ${err('f-interest')}
        </fieldset>
        <div class="field" data-field="budget">
          <label for="f-budget">${esc(fl.budget.label)}</label>
          <select id="f-budget" name="budget"><option value="">${esc(fl.budget.placeholder)}</option>${budget}</select>
        </div>
        <div class="field" data-field="message">
          <label for="f-message">${esc(fl.message.label)}</label>
          <textarea id="f-message" name="message" rows="5" maxlength="2000" required aria-required="true" placeholder="${esc(fl.message.placeholder)}" aria-describedby="f-message-error"></textarea>
          ${err('f-message')}
        </div>
        <div class="field field--check" data-field="consent">
          <label class="check"><input type="checkbox" name="consent" required aria-required="true" aria-describedby="f-consent-error"><span>${esc(fl.consent.label)} <a href="${s.footer.privacy.href}">${esc(fl.consent.policyLink)}</a></span></label>
          ${err('f-consent')}
        </div>
        <label class="hp" aria-hidden="true">Nevypĺňajte<input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></label>
        <div class="form__alert" role="alert"></div>
        <button class="btn btn--submit" type="submit" data-magnetic data-cursor="link" data-label="${esc(f.submit)}" data-sending="${esc(f.sending)}"><span class="btn__label">${esc(f.submit)}</span><span class="btn__dots" aria-hidden="true"><i></i><i></i><i></i></span></button>
      </form>
      <div class="form-done" role="status" hidden data-tpl="${esc(f.success.text)}">
        ${contourSvg({ seed: 'hotovo', count: 7, cx: 300, cy: 200, rMax: 320, rMin: 30, viewBox: '0 0 600 400', cls: 'form-done__bg' })}
        <h3 class="form-done__title" tabindex="-1">${esc(f.success.title)}</h3>
        <p class="form-done__text"></p>
        <p class="form-done__demo" hidden>${esc(f.demoNote)}</p>
        <button class="btn btn--line form-done__again" type="button">${esc(f.success.again)}</button>
      </div>
    </div>
  </div>
</section>`;
}

function footer(s: Site): string {
  const ft = s.footer;
  const c = s.contact;
  return `<footer class="ftr" data-theme="ink">
  ${ridge(3)}
  <div class="wrap">
    <div class="ftr__top">
      <p class="ftr__line">${esc(ft.line)}</p>
      <div class="ftr__col"><h2 class="ftr__h">${esc(ft.contactTitle)}</h2>
        <p><a href="mailto:${c.email}" data-cursor="link">${esc(c.email)}</a><br><a href="${c.phone.href}" data-cursor="link">${esc(c.phone.display)}</a><br>${esc(c.address.street)}, ${esc(c.address.city)}</p></div>
      <div class="ftr__col"><h2 class="ftr__h">${esc(ft.socialTitle)}</h2>
        <ul>${ft.social.map((x) => `<li><a href="${x.href}" rel="noopener" data-cursor="link">${esc(x.label)}</a></li>`).join('')}</ul></div>
    </div>
    <p class="ftr__mark fit" aria-hidden="true"><span class="fit__line"><span class="fit__in">${wordmark()}</span></span></p>
    <div class="ftr__bottom">
      <p>${esc(ft.copyright)}</p><p>${esc(ft.noCookies)}</p>
      <p><a href="${ft.privacy.href}" data-cursor="link">${esc(ft.privacy.label)}</a></p>
      <button class="btn btn--line ftr__top-btn" type="button" data-magnetic data-cursor="link"><span>${esc(s.ui.backToTop)}</span></button>
    </div>
  </div>
</footer>`;
}

function ctaBar(s: Site): string {
  return `<div class="cta-bar" data-theme="ink" hidden><p>${esc(s.cta.barText)}</p><a class="btn btn--primary" href="${s.cta.href}">${esc(s.cta.barButton)}</a></div>`;
}

export function renderBody(s: Site): string {
  return `<a class="skip" href="#obsah">${esc(s.ui.skipToContent)}</a>
${intro(s)}
${header(s)}
<main id="obsah" tabindex="-1">
${hero(s)}
${services(s)}
${works(s)}
${processSec(s)}
${results(s)}
${team(s)}
${testimonials(s)}
${contact(s)}
</main>
${footer(s)}
${ctaBar(s)}
<div class="cursor" aria-hidden="true" data-view="${esc(s.ui.cursorView)}" data-drag="${esc(s.ui.cursorDrag)}"><span class="cursor__ring"><span class="cursor__label"></span></span><span class="cursor__dot"></span></div>`;
}

export function renderHead(s: Site): string {
  const m = s.meta;
  const url = m.url + '/';
  const og = m.url + m.ogImage;
  return `<title>${esc(m.title)}</title>
<meta name="description" content="${esc(m.description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="${m.themeColor}">
<meta property="og:type" content="website">
<meta property="og:locale" content="sk_SK">
<meta property="og:site_name" content="${esc(s.brand.name)}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(m.ogTitle)}">
<meta property="og:description" content="${esc(m.ogDescription)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(m.ogImageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(m.ogTitle)}">
<meta name="twitter:description" content="${esc(m.ogDescription)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">${JSON.stringify(jsonLd(s))}</script>`;
}

function jsonLd(s: Site) {
  const c = s.contact;
  const url = s.meta.url + '/';
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': url + '#organizacia',
    name: s.brand.name,
    legalName: s.brand.legalName,
    description: s.meta.description,
    url,
    image: s.meta.url + s.meta.ogImage,
    logo: s.meta.url + '/favicon.svg',
    email: c.email,
    telephone: c.phone.href.replace('tel:', ''),
    foundingDate: String(s.brand.founded),
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.address.street,
      postalCode: c.address.zip,
      addressLocality: c.address.city,
      addressRegion: 'Žilinský kraj',
      addressCountry: 'SK',
    },
    areaServed: ['Liptov', 'Orava', 'Žilinský kraj', 'Slovensko'],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Služby',
      itemListElement: s.services.items.map((it) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: it.title, description: it.summary },
      })),
    },
  };
}
