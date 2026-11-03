/* Mitsubishi Motors Libya: interactions & animation
 * - One animation language: opacity/transform reveals (power3/power4 out), masked image reveals, controlled horizontal motion.
 * - GSAP + ScrollTrigger live inside a single gsap.context(); every DOM listener uses one AbortController.
 *   destroy() (called on pagehide) reverts the context, aborts listeners and clears timers.
 */
(() => {
  'use strict';

  const C = window.MMK_CONFIG, M = window.MMK_MODELS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const html = document.documentElement;
  const ac = new AbortController();
  const on = (t, e, f, o) => t.addEventListener(e, f, Object.assign({ signal: ac.signal }, o));
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const animate = () => hasGSAP && !reduceMQ.matches;
  if (!hasGSAP) html.classList.remove('js');

  /* ------------------------------------------------------------------ config wiring */
  const waUrl = text => 'https://wa.me/' + C.whatsapp.number + '?text=' + encodeURIComponent(text || C.whatsapp.text);
  $$('[data-tel]').forEach(a => { a.href = 'tel:' + C.phone.tel; });
  $$('[data-tel-text]').forEach(el => { el.textContent = C.phone.display; });
  $$('[data-wa]').forEach(a => { a.href = waUrl(); });
  $$('[data-parts-tel]').forEach(a => { a.href = 'tel:' + C.partsPhone.tel; a.textContent = C.partsPhone.display; });
  $$('[data-maps]').forEach(a => { a.href = C.mapsUrl; });
  $$('[data-address]').forEach(el => { el.innerHTML = C.address.map(l => '<span>' + l + '</span>').join('<br>'); });
  $$('[data-social]').forEach(a => { a.href = C.social[a.dataset.social] || '#'; });
  const offEl = $('[data-footer-offices]');
  if (offEl) offEl.innerHTML = C.footerOffices.map(o =>
    '<div class="office"><h4>' + o.name + '</h4><a class="office__addr" href="' + o.mapsUrl + '" target="_blank" rel="noopener"><address>' + o.address.join('<br>') + '</address></a>' +
    '<p>' + o.phones.map(p => '<a href="tel:' + p.tel + '">' + p.display + '</a>').join('') + '</p></div>').join('');
  const hoursEl = $('[data-hours]');
  const coEl = $('[data-contact-offices]');
  if (coEl) coEl.innerHTML = C.footerOffices.map((o, i) => '<div><h3 class="eyebrow">' + (i ? o.name : 'Libya phones') + '</h3>' + (i ? '<address class="co__addr">' + o.address.join('<br>') + '</address>' : '') + '<ul class="svc">' + o.phones.map(p => '<li><span>Phone</span><a href="tel:' + p.tel + '">' + p.display + '</a></li>').join('') + '</ul></div>').join('');
  if (hoursEl) hoursEl.innerHTML = C.hours.map(([d, t]) => '<div><dt>' + d + '</dt><dd>' + t + '</dd></div>').join('');
  const svcEl = $('[data-svc]');
  if (svcEl) svcEl.innerHTML = C.serviceCentres.map(s => '<li><span>' + s.name + '</span><a href="tel:' + s.tel + '">' + s.display + '</a></li>').join('');
  if (C.enquiry.email) { const m = $('[data-mail]'); m.href = 'mailto:' + C.enquiry.email; m.textContent = C.enquiry.email; m.hidden = false; $('[data-mail-fallback]').hidden = true; }

  const header = $('#header'), dock = $('#dock');
  let ctx, autoTween, destroyed = false;
  const cleanups = [];

  /* ------------------------------------------------------------------ mobile menu */
  const toggle = $('.header__toggle'), menu = $('#menu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    header.classList.toggle('is-solid', open || window.scrollY > 30);
    if (open) {
      menu.hidden = false;
      if (animate()) gsap.fromTo($$('li a', menu), { yPercent: 100 }, { yPercent: 0, duration: .8, ease: 'power4.out', stagger: .05 });
      $('a', menu).focus({ preventScroll: true });
    } else { menu.hidden = true; }
  }
  on(toggle, 'click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  on(menu, 'click', e => { if (e.target.closest('a')) setMenu(false); });
  on(document, 'keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
  on(window, 'resize', () => { if (innerWidth > 1023 && !menu.hidden) setMenu(false); });

  /* ------------------------------------------------------------------ helpers */
  function splitWords(el) {
    const nodes = Array.from(el.childNodes); el.textContent = '';
    nodes.forEach(n => {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(w => {
        if (!w.trim()) { el.appendChild(document.createTextNode(' ')); return; }
        const o = document.createElement('span'), i = document.createElement('span'); o.className = 'sw'; i.textContent = w; o.appendChild(i); el.appendChild(o);
      });
      else { const o = document.createElement('span'), i = document.createElement('span'); o.className = 'sw'; i.appendChild(n); o.appendChild(i); el.appendChild(o); }
    });
  }

  /* ------------------------------------------------------------------ showcase */
  const stage = $('#stage'), carBox = $('#scCar'), thumbs = $('#thumbs'), bar = $('#scBar');
  const el = { no: $('#scNo'), name: $('#scName'), intro: $('#scIntro'), price: $('#scPrice'), specs: $('#scSpecs'), cta: $('.stage__cta'), idx: $('#scIndex'), explore: $('#scExplore'), enq: $('#scEnquire') };
  const n = M.length;
  const state = { idx: 0, busy: false, pending: null, playing: !reduceMQ.matches, inView: false, hover: false, focus: false };
  const carCache = new Map();
  const pad = v => String(v).padStart(2, '0');
  const WHEEL_K = 0.84; // rotating disc covers the rim + inner tyre; outer tyre stays static so the arch/ground contact is untouched

  function buildCar(m) {
    if (carCache.has(m.id)) return carCache.get(m.id);
    const car = document.createElement('div'); car.className = 'car';
    car.style.width = (m.scale * 100) + '%';
    const inner = document.createElement('div'); inner.className = 'car__inner';
    const img = new Image(); img.className = 'car__img'; img.src = m.img; img.alt = m.name; img.decoding = 'async'; img.width = 1000; img.height = Math.round(1000 * m.ar);
    inner.appendChild(img);
    const [fx, rx, cyF, r, cyR] = m.wheels, s = 2 * r * WHEEL_K, hr = m.ar, wheels = [];
    [[fx, cyF], [rx, cyR == null ? cyF : cyR]].forEach(([cx, cy]) => {
      const w = document.createElement('i'); w.className = 'wheel'; w.setAttribute('aria-hidden', 'true');
      w.style.cssText = 'left:' + cx * 100 + '%;top:' + cy * 100 + '%;width:' + s * 100 + '%;background-image:url(' + m.img + ');background-size:' + 100 / s + '% auto;background-position:' + (s / 2 - cx) / (s - 1) * 100 + '% ' + (s / 2 - cy * hr) / (s - hr) * 100 + '%';
      inner.appendChild(w); wheels.push(w);
    });
    car.appendChild(inner);
    const o = { el: car, wheels, angle: 0, r };
    if (hasGSAP) { gsap.set(car, { xPercent: -50 }); gsap.set(wheels, { xPercent: -50, yPercent: -50 }); }
    carCache.set(m.id, o);
    return o;
  }
  // wheel rotation follows the car's travel (rolling without slip): angle += dx / R
  function spinner(c) {
    let last = gsap.getProperty(c.el, 'x');
    return () => { const x = gsap.getProperty(c.el, 'x'); c.angle += (x - last) / (c.r * c.el.offsetWidth) * 57.2958; last = x; gsap.set(c.wheels, { rotation: c.angle }); };
  }

  function fillInfo(m, i) {
    el.no.textContent = pad(i + 1); el.name.textContent = m.name; el.intro.textContent = m.intro; el.price.textContent = m.price;
    el.specs.innerHTML = m.specs.slice(0, 3).map(([k, v]) => '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>').join('');
    el.idx.textContent = pad(i + 1);
    el.enq.dataset.vehicle = m.id;
  }
  /* Trust strip: count up 0 -> value (e.g. "100+") once when scrolled into view */
  (function counters() {
    const items = $$('.trust__list strong'); if (!items.length) return;
    const parsed = items.map(e => { const t = e.textContent.trim(), m = t.match(/^(\d+)(.*)$/); return m ? { e, n: +m[1], suf: m[2] } : null; }).filter(Boolean);
    if (reduceMQ.matches || !('IntersectionObserver' in window)) return;
    parsed.forEach(p => { p.e.textContent = '0' + p.suf; p.e.setAttribute('aria-label', p.n + p.suf); });
    const run = p => {
      const t0 = performance.now(), dur = 1800 + p.n * 4;
      (function tick(now) {
        const k = Math.min(1, (now - t0) / dur), v = Math.round(p.n * (1 - Math.pow(1 - k, 3)));
        p.e.textContent = v + p.suf;
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    };
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; io.unobserve(en.target); run(parsed.find(p => p.e === en.target.querySelector('strong')));
    }), { threshold: .6 });
    items.forEach(e => io.observe(e.parentElement));
  })();

  /* Featured vehicle: 3 L200 slides + highlight tabs */
  (function featured() {
    const car = $('#ftCar'), stats = $('#ftStats'); if (!car) return;
    const SLIDES = [
      { id: 'l200-glx-diesel', body: 'Double Cab', fuel: 'Diesel', eng: [['Engine', '2442 cc'], ['Power', '147 hp'], ['Torque', '330 Nm']] },
      { id: 'l200-gl-single', body: 'Single Cab', fuel: 'Diesel', eng: [['Engine', '2442 cc'], ['Power', '147 hp'], ['Torque', '330 Nm']] },
      { id: 'l200-2wd-gl', body: 'Double Cab', fuel: 'Diesel', drive: '2WD', eng: [['Engine', '2442 cc'], ['Power', '147 hp'], ['Torque', '330 Nm']] }
    ].map(s => Object.assign({ m: M.find(v => v.id === s.id) }, s));
    const tabsD = (s) => ({
      highlights: s.eng,
      design: [['Body', s.body], ['Wheels', 'Alloy'], ['Tail lamps', 'LED']],
      performance: [['Drive', s.drive || '4WD'], ['Fuel', s.fuel], [s.eng[2][0], s.eng[2][1]]],
      safety: [['Braking', 'ABS + BA'], ['Stability', 'ESP + TCS'], ['Assist', 'Hill start']],
      comfort: [['Climate', 'Auto A/C'], ['Infotainment', 'Touchscreen'], ['Access', 'Keyless']]
    });
    const tabs = $$('[data-ft]'), thumbs = $$('#ftThumbs [data-slide]'), name = $('#ft-name');
    let cur = 0, tab = 'highlights';
    const fill = () => { stats.innerHTML = tabsD(SLIDES[cur])[tab].map(([k, v]) => '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>').join(''); };
    function show(i) {
      cur = (i + SLIDES.length) % SLIDES.length; const m = SLIDES[cur].m;
      car.src = m.img; car.alt = 'Mitsubishi ' + m.name + ', side view'; car.height = Math.round(1000 * m.ar);
      name.textContent = m.name; fill();
      thumbs.forEach((b, j) => b.setAttribute('aria-pressed', String(j === cur)));
      $('.ft__btn').dataset.vehicle = m.id;
    }
    tabs.forEach(t => t.addEventListener('click', () => { tab = t.dataset.ft; tabs.forEach(x => x.setAttribute('aria-selected', String(x === t))); fill(); }));
    thumbs.forEach(b => b.addEventListener('click', () => show(+b.dataset.slide)));
    $('#ftPrev').addEventListener('click', () => show(cur - 1));
    $('#ftNext').addEventListener('click', () => show(cur + 1));
    show(0);
  })();
  function fillFeatured() { /* Featured vehicle is fixed to the L200 GLX Diesel (static markup) */ }
  function setThumb(i) {
    $$('.thumb', thumbs).forEach((b, j) => { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    const b = thumbs.children[i];
    thumbs.scrollTo({ left: b.offsetLeft - (thumbs.clientWidth - b.offsetWidth) / 2, behavior: reduceMQ.matches ? 'auto' : 'smooth' });
  }

  function go(next, dir, byUser) {
    next = (next + n) % n;
    if (byUser && state.playing) setPlaying(false);
    if (state.busy) { state.pending = [next, dir]; return; }
    if (next === state.idx) return;
    dir = dir || (next > state.idx ? 1 : -1);
    const m = M[next], from = buildCar(M[state.idx]), to = buildCar(m);
    state.idx = next; setThumb(next);
    killTimer();

    if (!animate()) {
      carBox.replaceChildren(to.el); fillInfo(m, next); fillFeatured(m); return afterGo();
    }
    state.busy = true;
    const dist = carBox.clientWidth * .6;
    carBox.appendChild(to.el);
    gsap.set(to.el, { x: dir * dist, opacity: 0 });
    const infoEls = [el.no, el.name, el.intro, el.price, el.cta, el.specs];
    const featEls = [];
    const tl = gsap.timeline({ onComplete: () => { from.el.remove(); state.busy = false; afterGo(); } });
    tl.to(from.el, { x: -dir * dist * .7, opacity: 0, duration: .8, ease: 'power2.in', onUpdate: spinner(from) }, 0)
      .to(to.el, { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out', onUpdate: spinner(to) }, .3)
      .to(infoEls.concat(featEls), { opacity: 0, y: -14, duration: .28, ease: 'power2.in', stagger: .025, overwrite: 'auto',
        onComplete: () => { fillInfo(m, next); fillFeatured(m); gsap.fromTo(infoEls.concat(featEls), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .06, overwrite: 'auto' }); } }, 0);
  }
  function afterGo() {
    if (state.pending) { const [nx, d] = state.pending; state.pending = null; return go(nx, d); }
    refreshTimer(true);
  }

  /* autoplay: controlled, pauses on hover/focus/offscreen/hidden tab, and stops for good once the user navigates */
  const canRun = () => state.playing && state.inView && !state.hover && !state.focus && !document.hidden;
  function killTimer() { if (autoTween) { autoTween.kill(); autoTween = null; } if (hasGSAP) gsap.set(bar, { scaleX: 0 }); }
  function refreshTimer(restart) {
    if (!hasGSAP || state.busy) return;
    if (restart || (!autoTween && canRun())) {
      killTimer();
      if (!state.playing) return;
      autoTween = gsap.to(bar, { scaleX: 1, duration: 7, ease: 'none', paused: !canRun(), onComplete: () => { autoTween = null; go(state.idx + 1, 1); } });
    } else if (autoTween) { canRun() ? autoTween.resume() : autoTween.pause(); }
  }
  const playBtn = $('#scPlay');
  function setPlaying(v) {
    state.playing = v; playBtn.setAttribute('aria-pressed', String(v));
    playBtn.setAttribute('aria-label', v ? 'Pause automatic rotation' : 'Start automatic rotation');
    v ? refreshTimer(true) : killTimer();
  }

  function initShowcase() {
    $('#scTotal').textContent = pad(n);
    playBtn.setAttribute('aria-pressed', String(state.playing));
    playBtn.setAttribute('aria-label', state.playing ? 'Pause automatic rotation' : 'Start automatic rotation');
    // thumbnails
    thumbs.innerHTML = M.map((m, i) =>
      '<button class="thumb" role="tab" type="button" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-i="' + i + '">' +
      '<img src="' + m.img + '" alt="" width="214" height="' + Math.round(214 * m.ar) + '" loading="lazy" decoding="async"><b>' + m.name + '</b><small>' + m.price + '</small></button>').join('');
    // vehicle select in form
    $('#f-vehicle').innerHTML = '<option value="">Select a vehicle</option>' + M.map(m => '<option value="' + m.name + '" data-id="' + m.id + '">' + m.name + '</option>').join('') + '<option value="Not sure yet">Not sure yet</option>';

    const first = buildCar(M[0]); carBox.appendChild(first.el); fillInfo(M[0], 0); fillFeatured(M[0]);
    if (hasGSAP) gsap.set(first.el, { x: 0 });

    on(thumbs, 'click', e => { const b = e.target.closest('.thumb'); if (b) go(+b.dataset.i, 0, true); });
    on(thumbs, 'keydown', e => {
      const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return;
      e.preventDefault(); go(state.idx + k, k, true); thumbs.children[state.idx].focus({ preventScroll: true });
    });
    // thumbnail strip: arrow buttons replace the scrollbar (scroll by roughly one page of thumbnails)
    const thPrev = $('#thPrev'), thNext = $('#thNext');
    const thSync = () => {
      const max = thumbs.scrollWidth - thumbs.clientWidth, over = max > 2;
      thPrev.hidden = thNext.hidden = !over;
      thPrev.disabled = thumbs.scrollLeft <= 2; thNext.disabled = thumbs.scrollLeft >= max - 2;
    };
    const thStep = d => thumbs.scrollBy({ left: d * Math.max(thumbs.clientWidth * 0.8, 160), behavior: reduceMQ.matches ? 'auto' : 'smooth' });
    on(thPrev, 'click', () => thStep(-1));
    on(thNext, 'click', () => thStep(1));
    on(thumbs, 'scroll', thSync, { passive: true });
    on(window, 'resize', thSync);
    thSync(); requestAnimationFrame(thSync); on(window, 'load', thSync);
    on($('#scPrev'), 'click', () => go(state.idx - 1, -1, true));
    on($('#scNext'), 'click', () => go(state.idx + 1, 1, true));
    on(playBtn, 'click', () => setPlaying(!state.playing));
    on(stage, 'keydown', e => { if (e.target !== stage) return; if (e.key === 'ArrowRight') { e.preventDefault(); go(state.idx + 1, 1, true); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(state.idx - 1, -1, true); } });
    on(stage, 'mouseenter', () => { state.hover = true; refreshTimer(); });
    on(stage, 'mouseleave', () => { state.hover = false; refreshTimer(); });
    on(stage, 'focusin', () => { state.focus = true; refreshTimer(); });
    on(stage, 'focusout', () => { state.focus = false; refreshTimer(); });
    on(document, 'visibilitychange', () => refreshTimer());

    // swipe (horizontal intent only; vertical page scroll is never intercepted: touch-action: pan-y)
    let sx = 0, sy = 0, sid = null;
    on(stage, 'pointerdown', e => { if (e.target.closest('a,button')) return; sx = e.clientX; sy = e.clientY; sid = e.pointerId; });
    on(stage, 'pointerup', e => {
      if (sid !== e.pointerId) return; sid = null;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(state.idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1, true);
    });
    on(stage, 'pointercancel', () => { sid = null; });

    // enquire buttons pre-select the vehicle
    const pick = e => { const a = e.target.closest('[data-vehicle]'); if (a) setVehicle(a.dataset.vehicle); };
    on(document, 'click', pick);

    // warm the cache once the page is idle
    const idle = window.requestIdleCallback || (f => setTimeout(f, 1200));
    idle(() => M.forEach((m, i) => { const im = new Image(); im.decoding = 'async'; im.src = m.img; if (i < 3) im.decode && im.decode().catch(() => {}); }));
  }
  function setVehicle(id) { const m = M.find(x => x.id === id); if (m) $('#f-vehicle').value = m.name; }

  /* ------------------------------------------------------------------ fleet selector */
  function initFleet() {
    $$('[data-fleet-enquiry]').forEach(fe => on(fe, 'click', () => { const f = $('#f-msg'); if (!f.value) f.value = 'Fleet enquiry. Company name: \nSize of fleet: \nVehicles of interest: '; $('#enquiry').dataset.type = 'Fleet'; }));
    $$('[data-enquiry]').forEach(a => on(a, 'click', () => { delete $('#enquiry').dataset.type; }));
    // thin progress bar along the bottom while moving through the service rows
    const rows = $('#fleetRows'), prog = $('#fleetProg'), bar = prog && prog.firstElementChild; if (!rows || !bar) return;
    let tick = false;
    const texts = $$('.frow__text[data-row]', rows), figs = $$('.frow__img', rows), stick = $('#fleetStick');
    // image i wipes up over image i-1; the wipe edge follows the top edge of text row i
    const wipe = () => {
      const sr = stick.getBoundingClientRect(), sh = sr.height;
      figs.forEach((f, i) => {
        const t = i ? Math.min(sh, Math.max(0, texts[i].getBoundingClientRect().top - sr.top)) : 0;
        if (i) f.style.clipPath = 'inset(' + t + 'px 0 0 0)';
        const k = i ? 1 - t / sh : 1, im = f.firstElementChild;
        im.style.transform = 'scale(' + (1 + .12 * (1 - k)) + ')';
      });
    };
    const update = () => {
      tick = false;
      const r = rows.getBoundingClientRect(), vh = innerHeight, span = Math.max(1, r.height - vh);
      const live = r.top < vh * .5 && r.bottom > vh * .5;
      prog.classList.toggle('is-on', live);
      wipe();
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, (-r.top + vh * .5) / (r.height))) + ')';
    };
    on(window, 'scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    on(window, 'resize', update); update();
  }
  /* ------------------------------------------------------------------ media hover preview */
  function initMedia() {
    const prev = $$('#mediaPreview img'); if (!prev.length) return;
    const show = i => prev.forEach((im, j) => im.classList.toggle('is-on', j === i));
    show(0);
    $$('#mediaList a').forEach(a => { const i = +a.dataset.preview; on(a, 'mouseenter', () => show(i)); on(a, 'focus', () => show(i)); });
  }

  /* ------------------------------------------------------------------ enquiry form */
  function initForm() {
    const form = $('#enquiry'), status = $('#formStatus'), btn = $('button[type=submit]', form);
    const rules = {
      name: v => v.trim().length >= 2 ? '' : 'Please enter your name.',
      phone: v => { const d = v.replace(/\D/g, ''); return /^\+?[\d\s\-()]+$/.test(v.trim()) && d.length >= 7 && d.length <= 15 ? '' : 'Enter a valid phone number (7 to 15 digits).'; },
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.',
      consent: (v, i) => i.checked ? '' : 'Please accept to continue.'
    };
    function check(input) {
      const rule = rules[input.name]; if (!rule) return true;
      const msg = rule(input.value, input), wrap = input.closest('.field');
      $('#e-' + (input.name === 'consent' ? 'consent' : input.name)).textContent = msg;
      wrap.classList.toggle('is-invalid', !!msg); input.setAttribute('aria-invalid', String(!!msg));
      return !msg;
    }
    $$('input, select, textarea', form).forEach(i => { on(i, 'blur', () => check(i)); on(i, 'input', () => { if (i.closest('.field').classList.contains('is-invalid')) check(i); }); });

    function setStatus(msg, kind) { status.textContent = msg; status.className = 'form__status' + (kind ? ' is-' + kind : ''); }
    on(form, 'submit', async e => {
      e.preventDefault();
      const fields = ['name', 'phone', 'email', 'consent'].map(k => form.elements[k]);
      const ok = fields.map(check).every(Boolean);
      if (!ok) { setStatus('Please correct the highlighted fields.', 'err'); fields.find(f => f.closest('.field').classList.contains('is-invalid')).focus(); return; }
      if (form.elements.website.value) { setStatus('Thank you. Your enquiry has been received.', 'ok'); form.reset(); return; } // honeypot
      const data = { name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(), email: form.elements.email.value.trim(), vehicle: form.elements.vehicle.value, message: form.elements.message.value.trim(), type: form.dataset.type || 'General', source: location.href };
      const text = ['New enquiry (' + data.type + ')', 'Name: ' + data.name, 'Phone: ' + data.phone, 'Email: ' + data.email, 'Vehicle: ' + (data.vehicle || 'n/a'), data.message && 'Message: ' + data.message].filter(Boolean).join('\n');
      btn.disabled = true; btn.setAttribute('aria-busy', 'true'); setStatus('Sending your enquiry...', '');
      try {
        if (C.enquiry.endpoint) {
          const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 12000);
          const res = await fetch(C.enquiry.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: ctl.signal });
          clearTimeout(t); if (!res.ok) throw new Error('HTTP ' + res.status);
          setStatus('Thank you. Your enquiry has been sent and our team will be in touch.', 'ok'); form.reset();
        } else {
          const mailTo = data.type === 'Fleet' && C.enquiry.fleetEmail ? C.enquiry.fleetEmail : C.enquiry.email;
          if (mailTo) { location.href = 'mailto:' + mailTo + '?subject=' + encodeURIComponent('Website enquiry: ' + (data.vehicle || data.type)) + '&body=' + encodeURIComponent(text); setStatus('Opening your email app with the enquiry ready to send.', 'ok'); }
          else { window.open(waUrl(text), '_blank', 'noopener'); setStatus('Opening WhatsApp with your enquiry ready to send. You can also call ' + C.phone.display + '.', 'ok'); }
          form.reset();
        }
      } catch (err) {
        setStatus('Sorry, we could not send your enquiry. Please call ' + C.phone.display + ' or message us on WhatsApp.', 'err');
      } finally { btn.disabled = false; btn.removeAttribute('aria-busy'); }
    });
  }

  /* ------------------------------------------------------------------ GSAP: scroll & reveal system */
  function initMotion() {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // hero intro
      const title = $('[data-split]'); splitWords(title);
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .fromTo($$('.sw > span', title), { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: .1 }, .15)
        .fromTo($$('[data-hero]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: .12 }, .5);
      // hero depth
      gsap.to('.hero__video', { yPercent: 5, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__content', { y: -50, opacity: .25, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });
      // section reveals
      ScrollTrigger.batch('[data-rv]', { start: 'top 90%', once: true, onEnter: els => gsap.fromTo(els, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .09, overwrite: true }) });
      // masked image reveals
      $$('.mask').forEach(m => ScrollTrigger.create({ trigger: m, start: 'top 85%', once: true, onEnter: () => {
        gsap.to(m, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.inOut' });
        if (m.classList.contains('about__media')) gsap.to($('img', m), { scale: 1, duration: 2, ease: 'power3.out' });
      } }));
      // about: headline fills in letter by letter as you scroll, a red highlight leading the white
      const lead = $('[data-scrub]');
      if (lead) {
        const txt = lead.textContent; lead.setAttribute('aria-label', txt); lead.textContent = '';
        const chars = [];
        txt.split(' ').forEach((word, wi, all) => {
          const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
          Array.from(word).forEach(ch => { const s = document.createElement('span'); s.textContent = ch; w.appendChild(s); chars.push(s); });
          lead.appendChild(w); if (wi < all.length - 1) lead.appendChild(document.createTextNode(' '));
        });
        const tl = gsap.timeline({ scrollTrigger: { trigger: lead, start: 'top 82%', end: 'bottom 48%', scrub: .6 } });
        gsap.set(chars, { color: 'rgba(255,255,255,.18)' });
        const step = 1 / chars.length;
        chars.forEach((c, i) => tl.to(c, { color: '#ff5a44', duration: step * 4, ease: 'none' }, i * step).to(c, { color: '#ffffff', duration: step * 10, ease: 'none' }, i * step + step * 4));
        // photo: wipes open on entry, then drifts inside its frame as you scroll (the frame stays aligned with the text)
        const fig = $('#aboutFig'), fimg = $('img', fig);
        gsap.fromTo(fig, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power4.inOut', scrollTrigger: { trigger: fig, start: 'top 85%', once: true } });
        gsap.fromTo(fimg, { scale: 1.3 }, { scale: 1, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: fig, start: 'top 85%', once: true } });
        gsap.fromTo(fimg, { yPercent: -9 }, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
      // fleet rows: image eases from a slight zoom as each row scrolls through\n      ('.frow__img img').forEach(im => gsap.fromTo(im, { scale: 1.16 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom 40%', scrub: true } }));
      // showcase entrance
      gsap.from('.stage__car .car', { x: 120, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '#stage', start: 'top 75%', once: true } });
    });

    // header / dock state, active nav link, autoplay visibility: independent of motion preference
    // driven by scroll position (not isActive) so the very bottom of the page keeps the solid header and the dock
    const chrome = s => {
      const y = s.scroll();
      header.classList.toggle('is-solid', y > 30 || !menu.hidden);
      dock.classList.toggle('is-on', y > innerHeight * .6);
    };
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: chrome, onRefresh: chrome });
    ScrollTrigger.create({ trigger: stage, start: 'top 85%', end: 'bottom 15%', onToggle: s => { state.inView = s.isActive; refreshTimer(s.isActive && !autoTween); } });
    // hero video: starts on load and loops continuously. It is never paused on scroll; if it is ever
    // paused by the browser it resumes at once. A still image behind it covers a failed load.
    const v = $('#heroVideo');
    if (v && !reduceMQ.matches) {
      v.muted = true; v.loop = true; v.defaultMuted = true;
      v.src = v.dataset.src;
      const go = () => { if (!document.hidden && v.paused) v.play().catch(() => {}); };
      on(v, 'error', () => { v.style.display = 'none'; });
      on(v, 'ended', () => { v.currentTime = 0; go(); });
      on(v, 'pause', () => setTimeout(go, 60));
      on(v, 'canplay', go);
      on(document, 'visibilitychange', go);
      on(window, 'focus', go);
      on(window, 'pageshow', go);
      go();
    }    on(window, 'load', () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => !destroyed && ScrollTrigger.refresh());
  }

  /* ------------------------------------------------------------------ boot & teardown */
  function boot() {
    initShowcase(); initFleet(); initMedia(); initForm();
    if (hasGSAP) { ctx = gsap.context(initMotion); }
    $('#year') && ($('#year').textContent = new Date().getFullYear());
  }
  function destroy() {
    if (destroyed) return; destroyed = true;
    killTimer(); if (ctx) ctx.revert();
    if (hasGSAP) { ScrollTrigger.getAll().forEach(t => t.kill()); gsap.globalTimeline.clear(); } // also removes the transition tweens created outside the context
    ac.abort(); carCache.clear(); cleanups.forEach(f => f());
  }
  window.addEventListener('pagehide', destroy, { once: true });
  window.MMK_destroy = destroy;
  boot();
})();
