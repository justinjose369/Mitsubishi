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
  // footer social icons are intentionally inert (no outbound redirects)
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
  if (C.enquiry.email) { const m = $('[data-mail]'); m.href = 'mailto:' + C.enquiry.email; m.textContent = C.enquiry.email; m.hidden = false; m.closest('li').hidden = false; $('[data-mail-fallback]').hidden = true; }

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
  const el = { no: $('#scNo'), name: $('#scName'), intro: $('#scIntro'), price: $('#scPrice'), specs: $('#details'), cta: $('.stage__cta'), idx: $('#scIndex'), enq: $('#scEnquire') };
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
    if (m.lift) inner.style.transform = 'translateY(' + (-m.lift / (m.scale * m.ar) * 100).toFixed(2) + '%)'; // raise cars whose tyres sit lower in their image so every car runs on the same ground line
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
    el.idx.textContent = pad(i + 1);
    el.enq.dataset.vehicle = m.id; dtShow(m);
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

  /* ------------------------------------------------------------------ explore details (tabs under the showcase) */
  const dt = { box: $('#details'), grid: $('#dtGrid'), panel: $('#dtPanel'), tabs: $$('[data-dt]') };
  let dtTab = 'design', dtTimer, dtReady = false;
  function dtFill(m) {
    const d = m.details[dtTab];
    dt.grid.innerHTML = d.rows.map(([k, v]) => '<div><dt>' + k + '</dt><dd' + (v === 'On request' ? ' class="is-na"' : '') + '>' + v + '</dd></div>').join('');
  }
  // smooth swap: fade the content out, fill it, fade back in (CSS handles the motion; instant when reduced motion)
  function dtShow(m) {
    clearTimeout(dtTimer);
    if (!dtReady || reduceMQ.matches) { dtFill(m); dtReady = true; return; }
    dt.box.classList.add('is-swap');
    dtTimer = setTimeout(() => { dtFill(m); dt.box.classList.remove('is-swap'); }, 240);
  }
  function initDetails() {
    const select = t => {
      dtTab = t.dataset.dt;
      dt.tabs.forEach(x => { const sel = x === t; x.setAttribute('aria-selected', String(sel)); x.tabIndex = sel ? 0 : -1; });
      dt.panel.setAttribute('aria-labelledby', t.id);
      dtShow(M[state.idx]);
    };
    dt.tabs.forEach(t => on(t, 'click', () => select(t)));
    on(dt.tabs[0].parentElement, 'keydown', e => {
      const i = dt.tabs.indexOf(document.activeElement); if (i < 0) return;
      const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'Home' ? -i : e.key === 'End' ? dt.tabs.length - 1 - i : 0; if (!k) return;
      e.preventDefault(); const t = dt.tabs[(i + k + dt.tabs.length) % dt.tabs.length]; t.focus(); select(t);
    });
  }

  /* ------------------------------------------------------------------ cars mega menu (desktop) + mobile sub list */
  const PAGES = { destinator: 'destinator.html', l200: 'l200.html', outlander: 'outlander.html', xpander: 'xpander.html', pajerosport: 'pajero-sport.html' };
  const pageFor = m => PAGES[String(m.name).toLowerCase().replace(/[ ]+/g, '')] || 'vehicles.html'; // model detail page, or the listing for models without one
  function initMega() {
    const mega = $('#mega'), navCars = $('#navCars'), link = $('a', navCars), desk = matchMedia('(min-width: 1024px)');
    $('#megaGrid').innerHTML = M.map((m, i) =>
      '<a class="mcard" href="' + pageFor(m) + '">' +
      '<span class="mcard__img"><img src="' + m.img + '" alt="" width="520" height="' + Math.round(520 * m.ar) + '" loading="lazy" decoding="async"></span>' +
      '<b>' + m.name + '</b><span class="mcard__cta">Explore vehicle <svg class="ic"><use href="#i-arrow-right"/></svg></span></a>').join('');
    $('#menuCars').innerHTML = M.map((m, i) => '<li><a href="' + pageFor(m) + '">' + m.name + '</a></li>').join('');
    let t;
    const open = () => { if (!desk.matches) return; clearTimeout(t); header.classList.add('mega-open'); link.setAttribute('aria-expanded', 'true'); };
    const close = (delay = 0) => { clearTimeout(t); t = setTimeout(() => { header.classList.remove('mega-open'); link.setAttribute('aria-expanded', 'false'); }, delay); };
    [navCars, mega].forEach(e => { on(e, 'mouseenter', open); on(e, 'mouseleave', () => close(180)); });
    on(navCars, 'focusin', open);
    on(header, 'focusout', e => { if (!e.relatedTarget || !(navCars.contains(e.relatedTarget) || mega.contains(e.relatedTarget))) close(0); });
    on(link, 'keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); open(); $('.mcard', mega).focus(); } });
    on(document, 'keydown', e => { if (e.key === 'Escape' && header.classList.contains('mega-open')) { close(0); link.focus(); } });
    on(window, 'scroll', () => { if (header.classList.contains('mega-open')) close(0); }, { passive: true });
    on(link, 'click', () => close(0));
    on($('[data-mega-close]', mega), 'click', () => close(0));
    // any vehicle link (mega menu, mobile menu, scroll showcase) selects that vehicle in the showcase and scrolls to it
    on(document, 'click', e => {
      const a = e.target.closest('[data-mega-i]'); if (!a) return;
      e.preventDefault(); close(0);
      go(+a.dataset.megaI, 0, true);
      $('#cars').scrollIntoView({ behavior: reduceMQ.matches ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ------------------------------------------------------------------ "Mitsubishi in Libya": pinned four-vehicle scroll showcase
   * The track is 400svh tall and the stage inside it is sticky, so the section stays pinned while the page scrolls through it.
   * Scroll progress p (0..1) picks the active vehicle and a local value q (0..1) that drives the slow drift of its photograph.
   * Photographs are placed so the vehicle always sits clear of the text (layout() below). Only transform and opacity animate. */
  function initStory() {
    const S = M.filter(m => m.story), n = S.length; // vehicles with a story photograph (appended showcase-only models are skipped)
    const track = $('#storyTrack'), root = $('#story'), stage = $('.story__sticky'), bg = $('#stBg'), copy = $('#stCopy'), ticks = $('#stTicks'), now = $('#stNow'); if (!track) return;
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    bg.innerHTML = S.map((m, i) => {
      const p = m.story.photo;
      return '<div class="story__bgl" data-s="' + (i ? 'next' : 'now') + '"><img src="' + p.src + '.webp" srcset="' + p.src + '-960.webp 1000w, ' + p.src + '.webp ' + (p.big || 2400) + 'w" sizes="100vw" alt="" width="' + Math.round(1000 * p.ar) + '" height="1000" decoding="async"' + (i ? ' loading="lazy"' : '') + '></div>';
    }).join('');
    copy.innerHTML = S.map((m, i) => {
      const s = m.story, sp = s.spec, last = i === n - 1;
      const words = s.name.split(' ').map((w, k) => '<span class="w"><span style="--w:' + k + '">' + esc(w) + '</span></span>').join(' ');
      return '<article class="story__item" data-s="' + (i ? 'next' : 'now') + '"' + (i ? ' inert' : '') + '>' +
        '<p class="story__kind">' + esc(s.kind) + '</p>' +
        '<h3 class="story__name" aria-label="' + esc(s.name) + '">' + words + '</h3>' +
        '<p class="story__spec" aria-label="' + sp.value + ' ' + esc(sp.unit) + '. ' + esc(sp.label) + '"><span class="story__num" data-to="' + sp.value + '" aria-hidden="true">' + sp.value + '</span><span class="story__unit" aria-hidden="true">' + esc(sp.unit) + '</span></p>' +
        '<p class="story__speclabel" aria-hidden="true">' + esc(sp.label) + '</p>' +
        '<div class="story__cta">' + (last
          ? '<a class="btn btn--solid" href="#cars">Explore all vehicles <svg class="ic"><use href="#i-arrow-right"/></svg></a>'
          : '<a class="btn btn--line" href="#cars" data-mega-i="' + i + '">Explore vehicle <svg class="ic"><use href="#i-arrow-right"/></svg></a>') + '</div></article>';
    }).join('');
    ticks.innerHTML = S.map((m, i) => '<button type="button" data-i="' + i + '" aria-label="Show ' + esc(m.story.name) + ' (' + pad(i + 1) + ' of ' + pad(n) + ')"' + (i ? '' : ' aria-current="true"') + '></button>').join('');
    const layers = $$('.story__bgl', bg), items = $$('.story__item', copy), nums = $$('.story__num', copy), tk = $$('button', ticks);

    // size and place each photograph so it covers the stage and the vehicle lands in the clear area (right on desktop, upper middle on mobile)
    function layout() {
      const w = stage.clientWidth, h = stage.clientHeight, wide = w >= 1024;
      layers.forEach((l, i) => {
        const p = S[i].story.photo, img = l.firstElementChild;
        const ih = Math.max(wide ? h * 1.05 : 0, (w + 140) / p.ar, (w * (wide ? .5 : .85) / p.cw) / p.ar), iw = ih * p.ar; // car ~half the screen wide on desktop, most of it on mobile
        const tx = wide ? w * .66 : w * .5, ty = wide ? h * .6 : h * .34;
        const bx = Math.min(-70, Math.max(w - iw + 70, tx - p.fx * iw)), by = (wide ? Math.min(0, Math.max(h - ih, ty - p.fy * ih)) : 0) + (p.dy || 0) * h; // dy: extra nudge down, as a share of the stage height
        img.style.maskImage = img.style.webkitMaskImage = p.dy ? 'linear-gradient(180deg, transparent 0, #000 16%)' : '';
        img.style.width = iw + 'px'; img.style.height = ih + 'px';
        img.style.setProperty('--bx', bx.toFixed(1) + 'px'); img.style.setProperty('--by', by.toFixed(1) + 'px');
      });
    }

    // the key figure counts up from 0 each time its vehicle comes into focus
    const counters = new Map();
    const countUp = el => {
      const to = +el.dataset.to; cancelAnimationFrame(counters.get(el));
      el.textContent = to; return; // no count-up: the figure shows its value straight away
      if (reduceMQ.matches) { el.textContent = to; return; }
      const t0 = performance.now(), dur = 1300;
      el.textContent = '0';
      (function tick(t) {
        const k = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) counters.set(el, requestAnimationFrame(tick));
      })(t0);
    };

    // auto slider: advances every few seconds, pauses on hover / focus / when off-screen / reduced motion, ticks jump to a slide
    const DWELL = 5000;
    let cur = 0, vis = false, focus = false, paused = false, timer = 0;
    const drift = (i, on) => { // slow settle of the photograph while its slide is showing
      const im = layers[i].firstElementChild; im.style.transition = 'none'; im.style.setProperty('--q', on ? '0' : '.5');
      if (!on || reduceMQ.matches) return;
      void im.offsetWidth; im.style.transition = 'transform ' + (DWELL + 1500) + 'ms linear'; im.style.setProperty('--q', '1');
    };
    const setActive = i => {
      cur = (i + n) % n; i = cur; now.textContent = pad(i + 1);
      const st = j => j === i ? 'now' : j < i ? 'past' : 'next';
      layers.forEach((f, j) => { f.dataset.s = st(j); if (j !== i) drift(j, false); });
      items.forEach((it, j) => { it.dataset.s = st(j); it.inert = j !== i; });
      tk.forEach((b, j) => { if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      drift(i, true); countUp(nums[i]);
    };
    const stop = () => { clearTimeout(timer); timer = 0; root.classList.remove('is-playing'); };
    const arm = () => { clearTimeout(timer); if (paused || !vis || focus || document.hidden) { root.classList.remove('is-playing'); return; } root.classList.add('is-playing'); timer = setTimeout(() => { setActive(cur + 1); restart(); }, DWELL); };
    const restart = () => { stop(); void root.offsetWidth; arm(); };
    on(ticks, 'click', e => { const b = e.target.closest('button'); if (!b) return; setActive(+b.dataset.i); restart(); });
    const total = $('#stTotal'); if (total) total.textContent = pad(n);
    on($('#stPrev'), 'click', () => { setActive(cur - 1); restart(); });
    on($('#stNext'), 'click', () => { setActive(cur + 1); restart(); });
    const play = $('#stPlay');
    on(play, 'click', () => { paused = !paused; play.setAttribute('aria-pressed', String(!paused)); play.setAttribute('aria-label', paused ? 'Start automatic sliding' : 'Pause automatic sliding'); restart(); });
    on(root, 'focusin', e => { if (!e.target.matches(':focus-visible')) return; focus = true; stop(); });
    on(root, 'focusout', () => { focus = false; restart(); });
    on(document, 'visibilitychange', () => { if (document.hidden) stop(); else restart(); });
    on(window, 'resize', layout);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) restart(); else stop(); }, { threshold: .35 }).observe(root);
      // heading: fade-up once the section is reached
      new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { root.classList.add('is-in'); countUp(nums[cur]); io.disconnect(); } }, { threshold: 0, rootMargin: '0px 0px -25% 0px' }).observe(root);
    } else { vis = true; root.classList.add('is-in'); restart(); }
    layout(); drift(0, true);
  }

  function setThumb(i) {
    $$('.thumb', thumbs).forEach((b, j) => { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    if (matchMedia("(max-width: 700px)").matches) thumbs.scrollTo({ left: thumbs.children[i].offsetLeft - thumbs.offsetLeft, behavior: "smooth" });
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
      carBox.replaceChildren(to.el); fillInfo(m, next); return afterGo();
    }
    state.busy = true;
    const dist = carBox.clientWidth * .6;
    carBox.appendChild(to.el);
    gsap.set(to.el, { x: dir * dist, opacity: 0 });
    const infoEls = [el.no, el.name, el.intro, el.price, el.cta, el.specs];
    const tl = gsap.timeline({ onComplete: () => { from.el.remove(); state.busy = false; afterGo(); } });
    tl.to(from.el, { x: -dir * dist * .7, opacity: 0, duration: .8, ease: 'power2.in', onUpdate: spinner(from) }, 0)
      .to(to.el, { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out', onUpdate: spinner(to) }, .3)
      .to(infoEls, { opacity: 0, y: -14, duration: .28, ease: 'power2.in', stagger: .025, overwrite: 'auto',
        onComplete: () => { fillInfo(m, next); gsap.fromTo(infoEls, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .06, overwrite: 'auto' }); } }, 0);
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
      '<img src="' + m.img + '" alt="" width="420" height="' + Math.round(420 * m.ar) + '" loading="lazy" decoding="async"><b>' + m.name + '</b><small>' + m.price + '</small></button>').join('');
    // vehicle select in form
    $('#f-vehicle').innerHTML = '<option value="">Select a vehicle</option>' + M.map(m => '<option value="' + m.name + '" data-id="' + m.id + '">' + m.name + '</option>').join('') + '<option value="Not sure yet">Not sure yet</option>';

    const first = buildCar(M[0]); carBox.appendChild(first.el); fillInfo(M[0], 0);
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

  /* ------------------------------------------------------------------ one-scroll snapping (desktop)
   * Every full-screen section is a stop; the pinned "Mitsubishi in Libya" showcase has one stop per vehicle and the fleet one per row.
   * One wheel flick / swipe / key press moves exactly one stop with a GSAP tween. "Why Mitsubishi" (#why) scrolls freely. */
  function initSnap() {
    const root = document.documentElement, footer = $('.footer'), mq = matchMedia('(min-width: 1024px) and (min-height: 600px)');
    const TOL = 4, GAP = 80;
    let points = [], free = { a: 0, b: 0 }, anim = null, lastEv = 0, lastAbs = 0, tStart = null, max = 0;
    const top = el => el.getBoundingClientRect().top + scrollY;
    const near = (a, b) => Math.abs(a - b) <= TOL;

    function measure() {
      root.classList.toggle('snap', mq.matches);
      if (!mq.matches) return;
      root.style.setProperty('--footer-h', footer.offsetHeight + 'px');
      const vh = innerHeight; max = Math.max(0, root.scrollHeight - vh);
      const pts = [0, top($('#cars')), top($('#story'))];
      free = { a: top($('#why')), b: top($('#fleet')) };
      pts.push(top($('#about')), free.a, free.b);
      $$('.frow__text').forEach(r => pts.push(top(r)));
      pts.push(top($('#parts')), top($('#media')), max);
      points = [...new Set(pts.map(p => Math.round(Math.min(max, Math.max(0, p)))))].sort((x, y) => x - y);
      free.a = Math.round(Math.min(free.a, max)); free.b = Math.round(Math.min(free.b, max));
    }

    function goTo(y) {
      y = Math.round(Math.min(max, Math.max(0, y)));
      if (anim) anim.kill();
      const o = { y: scrollY }, dist = Math.abs(y - o.y);
      if (reduceMQ.matches || !dist) { scrollTo(0, y); anim = null; return; }
      anim = gsap.to(o, { y, duration: Math.min(1.15, .55 + dist / innerHeight * .28), ease: 'power3.inOut', onUpdate: () => scrollTo(0, o.y), onComplete: () => { anim = null; lastEv = performance.now(); } });
    }

    // returns true when the input was consumed (the caller then prevents the native scroll)
    function step(dir, delta, gated) {
      if (!mq.matches) return false;
      if (anim) return true;
      const y = scrollY;
      const inFree = (y > free.a + TOL && y < free.b - TOL) || (near(y, free.a) && dir > 0) || (near(y, free.b) && dir < 0);
      if (inFree && free.b > free.a) {
        const pred = y + delta;
        if (dir > 0 && pred >= free.b - TOL) { goTo(free.b); return true; }
        if (dir < 0 && pred <= free.a + TOL) { goTo(free.a); return true; }
        return false; // native scrolling through the "Why" section
      }
      if (gated) return true;
      const t = dir > 0 ? points.find(p => p > y + TOL) : [...points].reverse().find(p => p < y - TOL);
      if (t != null) goTo(t);
      return true;
    }

    on(window, 'wheel', e => {
      if (!mq.matches || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.target.closest && e.target.closest('textarea, select, .menu')) return;
      const dir = Math.sign(e.deltaY); if (!dir) return;
      const now = performance.now(), abs = Math.abs(e.deltaY), gap = now - lastEv;
      const fresh = gap > GAP || abs > lastAbs * 1.6 + 4; // a new gesture, not the tail of the previous one's inertia
      lastEv = now; lastAbs = abs;
      if (step(dir, e.deltaY * (e.deltaMode === 1 ? 16 : 1), !fresh)) e.preventDefault();
    }, { passive: false });

    on(window, 'touchstart', e => { tStart = e.touches.length === 1 ? { y: e.touches[0].clientY, x: e.touches[0].clientX } : null; }, { passive: true });
    on(window, 'touchmove', e => {
      if (!mq.matches || !tStart || (e.target.closest && e.target.closest('textarea, select'))) return;
      if (!(scrollY > free.a + TOL && scrollY < free.b - TOL)) e.preventDefault();
    }, { passive: false });
    on(window, 'touchend', e => {
      const t = tStart; tStart = null; if (!t || !mq.matches || !e.changedTouches[0]) return;
      const dy = t.y - e.changedTouches[0].clientY, dx = t.x - e.changedTouches[0].clientX;
      if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx)) step(Math.sign(dy), dy, false);
    }, { passive: true });

    on(window, 'keydown', e => {
      if (!mq.matches || e.altKey || e.ctrlKey || e.metaKey) return;
      const tg = e.target; if (tg.closest && tg.closest('input, textarea, select, [contenteditable], [role="tab"], [role="tablist"]')) return;
      const k = e.key; let dir = 0;
      if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) dir = 1; else if (k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) dir = -1;
      else if (k === 'Home') { e.preventDefault(); goTo(0); return; } else if (k === 'End') { e.preventDefault(); goTo(max); return; }
      if (!dir) return;
      if (k === ' ' && tg.closest && tg.closest('button, a, summary')) return;
      if (step(dir, dir * innerHeight * .8, false)) e.preventDefault();
    });

    // in-page links travel with the same tween and land exactly on the section
    on(document, 'click', e => {
      if (e.defaultPrevented || !mq.matches || e.button || e.metaKey || e.ctrlKey) return;
      const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return;
      const el = $(a.getAttribute('href')); if (!el) return;
      e.preventDefault(); goTo(top(el));
    });

    // a scrollbar drag or other native scroll that comes to rest: settle on the nearest stop (never inside #why)
    let settle;
    on(window, 'scroll', () => {
      if (anim || !mq.matches) return;
      clearTimeout(settle);
      settle = setTimeout(() => {
        if (anim || !points.length) return;
        const y = scrollY; if (y > free.a - TOL && y < free.b + TOL) return;
        const t = points.reduce((b, p) => Math.abs(p - y) < Math.abs(b - y) ? p : b, points[0]);
        if (Math.abs(t - y) > TOL && Math.abs(t - y) < innerHeight * .5) goTo(t);
      }, 220);
    }, { passive: true });

    let rz; on(window, 'resize', () => { clearTimeout(rz); rz = setTimeout(measure, 120); });
    on(window, 'load', measure);
    if (mq.addEventListener) mq.addEventListener('change', measure);
    if (window.ScrollTrigger) ScrollTrigger.addEventListener('refresh', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => !destroyed && measure());
    measure();
  }

  /* ------------------------------------------------------------------ smooth wheel scrolling
   * The mouse wheel feeds a target position and the page eases toward it each frame, so a flick glides and
   * decelerates to a soft stop instead of halting abruptly. Keys, scrollbar drags, anchors and touch stay native. */
  function initSmooth() {
    const mq = matchMedia('(hover: hover) and (pointer: fine)');
    const EASE = .075; // lower = longer, softer glide
    let target = scrollY, cur = scrollY, raf = 0;
    const maxY = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const jump = y => scrollTo({ top: y, left: 0, behavior: 'instant' });

    function frame() {
      cur += (target - cur) * EASE;
      if (Math.abs(target - cur) < .4) { cur = target; raf = 0; jump(cur); return; }
      jump(cur);
      raf = requestAnimationFrame(frame);
    }
    on(window, 'wheel', e => {
      if (!mq.matches || reduceMQ.matches || e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.target.closest && e.target.closest('textarea, select, .menu, .thumbs')) return;
      e.preventDefault();
      if (!raf) { target = cur = scrollY; }
      const d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
      target = Math.min(maxY(), Math.max(0, target + d));
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: false });
    // any other scroll source (keys, scrollbar, anchors) takes over: drop the glide
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    on(window, 'keydown', stop); on(window, 'mousedown', stop); on(window, 'touchstart', stop, { passive: true });
    on(window, 'scroll', () => { if (!raf) target = cur = scrollY; }, { passive: true });
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
    initSmooth(); initShowcase(); initDetails(); initMega(); initStory(); initFleet(); initMedia(); initForm();
    if (hasGSAP) { ctx = gsap.context(initMotion); /* section snap-scrolling is switched off: the page scrolls normally. Call initSnap() here to bring it back. */ }
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
