import gsap from 'gsap';
import { $, $$, tpl, type Tier } from '../core/env';

type Errors = Record<string, string>;
type FieldName = 'name' | 'email' | 'phone' | 'interest' | 'message' | 'consent';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ]{9,16}$/;

export function validateField(form: HTMLFormElement, name: FieldName): string {
  const errs: Errors = JSON.parse(form.dataset[`errors${name[0].toUpperCase()}${name.slice(1)}`] ?? '{}');
  const val = (n: string) => ((form.elements.namedItem(n) as HTMLInputElement | null)?.value ?? '').trim();
  switch (name) {
    case 'name':
      if (!val('name')) return errs.required;
      if (val('name').length < 2) return errs.tooShort;
      return '';
    case 'email':
      if (!val('email')) return errs.required;
      return EMAIL_RE.test(val('email')) ? '' : errs.invalid;
    case 'phone':
      return !val('phone') || PHONE_RE.test(val('phone')) ? '' : errs.invalid;
    case 'interest':
      return $$<HTMLInputElement>('input[name="interest"]', form).some((i) => i.checked) ? '' : errs.required;
    case 'message': {
      const m = val('message');
      if (!m) return errs.required;
      if (m.length < 10) return errs.tooShort;
      if (m.length > 2000) return errs.tooLong;
      return '';
    }
    case 'consent':
      return (form.elements.namedItem('consent') as HTMLInputElement).checked ? '' : errs.required;
  }
}

export function initForm(tier: Tier) {
  const form = $<HTMLFormElement>('.form')!;
  const panel = $('.form-panel')!;
  const done = $('.form-done')!;
  const alertBox = $('.form__alert', form)!;
  const submit = $<HTMLButtonElement>('.btn--submit', form)!;
  const label = $('.btn__label', submit)!;
  const fields: FieldName[] = ['name', 'email', 'phone', 'interest', 'message', 'consent'];
  const touched = new Set<FieldName>();
  const endpoint = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) || 'https://api.web3forms.com/submit';
  const key = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
  const contactEmail = $<HTMLAnchorElement>('.contact__big a[href^="mailto:"]')?.textContent ?? '';

  const show = (name: FieldName, msg: string) => {
    const wrap = form.querySelector<HTMLElement>(`[data-field="${name}"]`)!;
    const err = wrap.querySelector<HTMLElement>('.field__err');
    const inputs = $$<HTMLInputElement>('input, textarea, select', wrap);
    inputs.forEach((i) => (msg ? i.setAttribute('aria-invalid', 'true') : i.removeAttribute('aria-invalid')));
    wrap.classList.toggle('fieldset-invalid', !!msg && name === 'interest');
    if (!err) return;
    const wasHidden = err.hidden;
    err.querySelector('span')!.textContent = msg;
    err.hidden = !msg;
    if (msg && wasHidden && tier !== 'static') gsap.from(err, { y: -6, autoAlpha: 0, duration: 0.25 });
  };
  const check = (name: FieldName) => {
    const msg = validateField(form, name);
    show(name, msg);
    return msg;
  };

  fields.forEach((name) => {
    const els = $$<HTMLInputElement>(`[name="${name}"]`, form);
    els.forEach((el) => {
      const evt = el.type === 'checkbox' ? 'change' : 'blur';
      el.addEventListener(evt, () => {
        if (el.type !== 'checkbox' && !el.value.trim() && !touched.has(name)) return;
        touched.add(name);
        check(name);
      });
      el.addEventListener('input', () => touched.has(name) && check(name));
    });
  });

  const setBusy = (b: boolean) => {
    submit.disabled = b;
    submit.setAttribute('aria-busy', String(b));
    label.textContent = b ? submit.dataset.sending! : submit.dataset.label!;
  };

  const showError = (title: string, text: string, retry = true) => {
    alertBox.innerHTML = '';
    const s = document.createElement('strong');
    s.textContent = title;
    alertBox.append(s);
    if (text) {
      const p = document.createElement('p');
      const [a, b] = text.split('{email}');
      p.append(a ?? '');
      if (b !== undefined) {
        const link = document.createElement('a');
        link.href = `mailto:${contactEmail}`;
        link.textContent = contactEmail;
        p.append(link, b);
      }
      alertBox.append(p);
    }
    if (retry) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn--line';
      btn.textContent = form.dataset.retry ?? 'Skúsiť znova';
      btn.addEventListener('click', () => form.requestSubmit());
      alertBox.append(btn);
    }
  };

  const success = (name: string, demo: boolean) => {
    const first = name.trim().split(/\s+/)[0] || '';
    $('.form-done__text', done)!.textContent = tpl(done.dataset.tpl!, { name: first });
    $('.form-done__demo', done)!.hidden = !demo;
    form.hidden = true;
    done.hidden = false;
    panel.classList.add('is-done');
    if (tier !== 'static') {
      gsap.from($$('.form-done__bg path', done), { scale: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, transformOrigin: '50% 50%' });
      gsap.from($$('.form-done > :not(svg)', done), { y: 16, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' });
    }
    $('.form-done__title', done)!.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.innerHTML = '';
    fields.forEach((f) => touched.add(f));
    const bad = fields.filter((f) => check(f));
    if (bad.length) {
      showError(form.dataset.summary ?? '', '', false);
      const first = form.querySelector<HTMLElement>(`[data-field="${bad[0]}"] input, [data-field="${bad[0]}"] textarea`);
      first?.focus();
      return;
    }
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '');
    if (fd.get('botcheck')) return success(name, !key); // honeypot: pretend, send nothing
    if (!navigator.onLine) return showError(form.dataset.offline ?? '', '', false);

    const payload: Record<string, string> = {
      subject: form.dataset.subject ?? '',
      from_name: 'uboc.sk',
      name,
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      company: String(fd.get('company') ?? ''),
      interest: fd.getAll('interest').join(', '),
      budget: String(fd.get('budget') ?? ''),
      message: String(fd.get('message') ?? ''),
    };
    setBusy(true);
    try {
      if (!key) {
        // Demo mode: no endpoint configured — nothing leaves the browser.
        await new Promise((r) => setTimeout(r, 900));
        if (new URLSearchParams(location.search).get('form') === 'fail') throw new Error('simulated failure');
        console.info('[form] demo mode, payload not sent:', payload);
        setBusy(false);
        return success(name, true);
      }
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: key, ...payload }),
        signal: ctrl.signal,
      });
      clearTimeout(to);
      const json = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || json.success !== true) throw new Error(`HTTP ${res.status}`);
      setBusy(false);
      success(name, false);
    } catch {
      setBusy(false);
      showError(form.dataset.errTitle ?? '', form.dataset.errText ?? '');
    }
  });

  $('.form-done__again', done)?.addEventListener('click', () => {
    form.reset();
    touched.clear();
    fields.forEach((f) => show(f, ''));
    alertBox.innerHTML = '';
    done.hidden = true;
    form.hidden = false;
    panel.classList.remove('is-done');
    (form.elements.namedItem('name') as HTMLInputElement).focus();
  });
}
