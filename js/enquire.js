/* "Enquire now" popup: every Enquire button opens a short enquiry form in a dialog instead of leaving the page.
 * Sends the same way as the other forms: endpoint (if configured), else the sales mailbox, else WhatsApp. */
(() => {
  'use strict';
  const C = window.MMK_CONFIG || {}, enq = C.enquiry || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const VEHICLES = ['Destinator', 'L200', 'Outlander', 'Xpander', 'Pajero Sport'];
  const MAIL = 'sales@middleeastgrp.com', PHONE = '+218 918 804 961';
  let dlg, form, status, lastFocus;

  const isTrigger = a => {
    if (!a || a.tagName !== 'A') return false;
    if (a.matches('.header__enquire, .dock__enq, [data-enquiry]')) return true;
    const t = ((a.querySelector('b') || a).textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    return t === 'enquire now' || t === 'enquire' || t === 'make an enquiry';
  };
  const vehicleFrom = a => {
    try { const v = new URL(a.getAttribute('href') || '', location.href).searchParams.get('vehicle'); if (v) return v; } catch (e) { /* ignore */ }
    const m = location.pathname.match(/\/(destinator|l200|outlander|xpander|pajero-sport)\.html$/i);
    return m ? (VEHICLES.find(x => x.toLowerCase().replace(/\s+/g, '-') === m[1].toLowerCase()) || '') : '';
  };

  function field(name, label, type, auto, req, ph) {
    return '<div class="field"><label for="eq-' + name + '">' + label + (req ? ' <i>*</i>' : '') + '</label><input id="eq-' + name + '" name="' + name + '" type="' + type + '" autocomplete="' + auto + '"' + (req ? ' required' : '') + (ph ? ' placeholder="' + ph + '"' : '') + '><span class="err" aria-live="polite"></span></div>';
  }

  function build() {
    dlg = document.createElement('div'); dlg.className = 'eq'; dlg.hidden = true;
    dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-labelledby', 'eq-title');
    dlg.innerHTML = '<div class="eq__bg" data-eq-close></div><div class="eq__box">' +
      '<button type="button" class="eq__x" data-eq-close aria-label="Close"><svg class="ic" aria-hidden="true"><use href="#i-x"/></svg></button>' +
      '<p class="eyebrow">Mitsubishi Motors Libya</p><h2 class="eq__t" id="eq-title">Enquire now</h2>' +
      '<p class="eq__lede">Tell us what you are looking for and our team will get back to you.</p>' +
      '<form class="eq__form" novalidate>' +
      field('name', 'Name', 'text', 'name', true) + field('phone', 'Phone number', 'tel', 'tel', true, '+218 ...') + field('email', 'Email', 'email', 'email', true) +
      '<div class="field"><label for="eq-vehicle">Vehicle</label><select id="eq-vehicle" name="vehicle"><option value="">Select a vehicle</option>' + VEHICLES.map(v => '<option>' + v + '</option>').join('') + '</select></div>' +
      '<div class="field field--wide"><label for="eq-message">Message</label><textarea id="eq-message" name="message" rows="3"></textarea></div>' +
      '<div class="field field--wide eq__consent"><label><input type="checkbox" name="consent" required> <span>I agree to be contacted about my enquiry.</span></label><span class="err" aria-live="polite"></span></div>' +
      '<input class="eq__hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button class="btn btn--solid eq__send" type="submit"><span>Send enquiry</span></button><p class="form__status" role="status" aria-live="polite"></p></form></div>';
    document.body.appendChild(dlg);
    form = $('form', dlg); status = $('.form__status', dlg);
    dlg.addEventListener('click', e => { if (e.target.closest('[data-eq-close]')) close(); });
    document.addEventListener('keydown', e => { if (dlg.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'Tab') trap(e); });
    bind();
  }

  const rules = {
    name: v => v.trim().length >= 2 ? '' : 'Please enter your name.',
    phone: v => { const d = v.replace(/\D/g, ''); return /^\+?[\d\s\-()]+$/.test(v.trim()) && d.length >= 7 && d.length <= 15 ? '' : 'Enter a valid phone number (7 to 15 digits).'; },
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.',
    consent: (v, i) => i.checked ? '' : 'Please accept to continue.'
  };
  function check(i) {
    const r = rules[i.name]; if (!r) return true;
    const m = r(i.value, i), w = i.closest('.field');
    $('.err', w).textContent = m; w.classList.toggle('is-invalid', !!m); i.setAttribute('aria-invalid', String(!!m));
    return !m;
  }
  const say = (m, k) => { status.textContent = m; status.className = 'form__status' + (k ? ' is-' + k : ''); };

  function bind() {
    $$('input, select, textarea', form).forEach(i => {
      i.addEventListener('blur', () => check(i));
      i.addEventListener('input', () => { if (i.closest('.field').classList.contains('is-invalid')) check(i); });
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const req = $$('input[required]', form), ok = req.map(check).every(Boolean);
      if (!ok) { say('Please correct the highlighted fields.', 'err'); const bad = req.find(i => i.closest('.field').classList.contains('is-invalid')); if (bad) bad.focus(); return; }
      if (form.elements.website.value) { say('Thank you. Your enquiry has been received.', 'ok'); form.reset(); return; }
      const d = { name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(), email: form.elements.email.value.trim(), vehicle: form.elements.vehicle.value, message: form.elements.message.value.trim(), type: 'Enquiry', source: location.href };
      const text = ['New enquiry (popup)', 'Name: ' + d.name, 'Phone: ' + d.phone, 'Email: ' + d.email, d.vehicle && 'Vehicle: ' + d.vehicle, d.message && 'Message: ' + d.message, 'Page: ' + d.source].filter(Boolean).join('\n');
      const btn = $('.eq__send', form); btn.disabled = true; say('Sending your enquiry...', '');
      try {
        if (enq.endpoint) {
          const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 12000);
          const res = await fetch(enq.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d), signal: ctl.signal }); clearTimeout(t);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          say('Thank you. Your enquiry has been sent and our team will be in touch.', 'ok'); form.reset();
        } else {
          location.href = 'mailto:' + (enq.email || MAIL) + '?subject=' + encodeURIComponent('Website enquiry: ' + (d.vehicle || 'General')) + '&body=' + encodeURIComponent(text);
          say('Opening your email app with the enquiry ready to send. You can also call ' + PHONE + '.', 'ok'); form.reset();
        }
      } catch (err) { say('Sorry, we could not send your enquiry. Please call ' + PHONE + ' or message us on WhatsApp.', 'err'); }
      finally { btn.disabled = false; }
    });
  }

  function trap(e) {
    const f = $$('button, input, select, textarea, a[href]', dlg).filter(x => !x.disabled && x.tabIndex !== -1 && x.offsetParent !== null);
    if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
  function open(vehicle) {
    if (!dlg) build();
    lastFocus = document.activeElement; form.reset(); say('', '');
    $$('.field', form).forEach(w => { w.classList.remove('is-invalid'); const er = $('.err', w); if (er) er.textContent = ''; });
    if (vehicle) { const o = $$('option', form.elements.vehicle).find(x => x.value.toLowerCase() === vehicle.toLowerCase()); if (o) form.elements.vehicle.value = o.value; }
    dlg.hidden = false; document.documentElement.classList.add('eq-open');
    requestAnimationFrame(() => { dlg.classList.add('is-open'); $('input[name=name]', dlg).focus(); });
  }
  function close() {
    if (!dlg || dlg.hidden) return;
    dlg.classList.remove('is-open'); document.documentElement.classList.remove('eq-open');
    setTimeout(() => { dlg.hidden = true; }, 250);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a'); if (!isTrigger(a)) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault(); e.stopImmediatePropagation(); open(vehicleFrom(a));
  }, true);
})();
