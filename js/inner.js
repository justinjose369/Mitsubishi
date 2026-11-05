/* Mitsubishi Motors Libya: inner pages.
 * One animation language: opacity/transform reveals, masked headline words, clip-path image reveals, scroll-linked parallax and
 * a pinned horizontal story. Transform/opacity/clip-path only. Everything honours prefers-reduced-motion and degrades with no GSAP. */
(() => {
  'use strict';
  const C = window.MMK_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const html = document.documentElement, body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desk = matchMedia('(min-width: 1024px)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const hasG = !!(window.gsap && window.ScrollTrigger);
  const motion = () => hasG && !reduce.matches;
  if (!hasG) html.classList.remove('ip');
  if (hasG) gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------ config wiring */
  const wa = 'https://wa.me/' + (C.whatsapp ? C.whatsapp.number : '218918804961') + '?text=' + encodeURIComponent(C.whatsapp ? C.whatsapp.text : 'Hello Mitsubishi Motors Libya, I would like to make an enquiry.');
  $$('[data-wa]').forEach(a => { a.href = wa; });
  $$('[data-brochure]').forEach(a => {
    const url = (C.brochures || {})[a.dataset.brochure];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.firstChild.textContent = a.dataset.label + ' '; const n = $('[data-brochure-note]'); if (n) n.hidden = true; }
  });

  /* ------------------------------------------------------------ header, menu, dock */
  const header = $('#header'), dock = $('#dock'), toggle = $('.header__toggle'), menu = $('#menu');
  const onScroll = () => { header.classList.toggle('is-solid', scrollY > 40); if (dock) dock.classList.toggle('is-on', scrollY > 500); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open; body.style.overflow = open ? 'hidden' : '';
    if (open && motion()) gsap.from($$('li', menu), { y: 40, opacity: 0, duration: .6, stagger: .05, ease: 'power3.out' });
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
  desk.addEventListener('change', () => { if (desk.matches) setMenu(false); });

  /* cars mega menu: four vehicles, photographs, names and Explore Model links */
  (function mega() {
    const nav = window.MMK_NAV || [], grid = $('#megaGrid'), li = $('#navCars'); if (!grid || !li) return;
    grid.innerHTML = nav.map(m => '<a class="mcard" href="' + m.slug + '.html"><span class="mcard__img"><img src="' + m.img + '" alt="" width="520" height="' + Math.round(520 * m.ar) + '" loading="lazy"></span><b>' + m.name + '</b><span class="mcard__kind">' + m.kind + '</span><span class="mcard__cta">Explore Model <svg class="ic"><use href="#i-arrow-right"/></svg></span></a>').join('');
    const link = $('a', li), mg = $('#mega'); let t;
    const open = () => { if (!desk.matches) return; clearTimeout(t); header.classList.add('mega-open'); link.setAttribute('aria-expanded', 'true'); };
    const close = (d = 0) => { clearTimeout(t); t = setTimeout(() => { header.classList.remove('mega-open'); link.setAttribute('aria-expanded', 'false'); }, d); };
    [li, mg].forEach(e => { e.addEventListener('mouseenter', open); e.addEventListener('mouseleave', () => close(180)); });
    li.addEventListener('focusin', open);
    header.addEventListener('focusout', e => { if (!e.relatedTarget || !(li.contains(e.relatedTarget) || mg.contains(e.relatedTarget))) close(0); });
    link.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); open(); $('.mcard', mg).focus(); } });
    addEventListener('keydown', e => { if (e.key === 'Escape' && header.classList.contains('mega-open')) { close(0); link.focus(); } });
    addEventListener('scroll', () => close(0), { passive: true });
  })();

  /* ------------------------------------------------------------ page transitions (short, never blocks navigation) */
  const pt = $('#pt');
  if (motion() && pt) {
    gsap.set(pt, { yPercent: 0 }); pt.classList.add('is-cover');
    gsap.to(pt, { yPercent: -101, duration: .55, ease: 'power3.inOut', delay: .05, onComplete: () => pt.classList.remove('is-cover') });
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash) || !/\.html$|\/$/.test(u.pathname)) return;
      e.preventDefault(); pt.classList.add('is-cover');
      gsap.fromTo(pt, { yPercent: 101 }, { yPercent: 0, duration: .42, ease: 'power3.in', onComplete: () => { location.href = a.href; } });
      setTimeout(() => { location.href = a.href; }, 900); // safety net
    });
    addEventListener('pageshow', e => { if (e.persisted) { gsap.set(pt, { yPercent: -101 }); pt.classList.remove('is-cover'); } });
  } else if (pt) pt.remove();

  /* ------------------------------------------------------------ headline words: masked line reveal */
  function splitWords(el) {
    const walk = node => Array.from(node.childNodes).forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(tok => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) frag.appendChild(document.createTextNode(' '));
          else { const w = document.createElement('span'); w.className = 'w'; const s = document.createElement('span'); s.textContent = tok; w.appendChild(s); frag.appendChild(w); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(el);
  }
  if (hasG) $$('[data-split]').forEach(splitWords);

  /* ------------------------------------------------------------ scroll motion */
  function initMotion() {
    const E = 'power3.out';
    const heroEls = $$('.vh [data-a], .ph [data-a]');
    // words
    $$('[data-split]').forEach(el => {
      const ws = $$('.w > span', el), inHero = !!el.closest('.vh, .ph, .nf');
      const vars = { y: 0, duration: 1.1, stagger: .07, ease: 'power4.out' };
      if (inHero) gsap.to(ws, Object.assign(vars, { delay: .45 }));
      else ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(ws, vars) });
    });
    // fade-ups
    heroEls.forEach((el, i) => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: E, delay: .8 + i * .1 }));
    ScrollTrigger.batch($$('[data-a]').filter(el => !heroEls.includes(el)), { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .9, ease: E, stagger: .1, overwrite: true }) });
    // clip-path image reveals
    $$('[data-clip]').forEach(f => {
      const img = $('img', f), hero = !!f.closest('.ph');
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut', duration: 1.3 } });
      tl.to(f, { clipPath: 'inset(0 0% 0 0)' }, 0).to(img, { scale: 1, duration: 1.8, ease: 'power3.out' }, 0);
      if (hero) tl.delay(.3).play(); else ScrollTrigger.create({ trigger: f, start: 'top 85%', once: true, onEnter: () => tl.play() });
    });
    // parallax (image wrapper moves less than the page)
    $$('[data-parallax]').forEach(w => {
      const im = $('img', w); if (!im) return;
      gsap.fromTo(im, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.vh__bg img').forEach(im => gsap.to(im, { scale: 1, duration: 2.2, ease: 'power2.out' }));
    $$('[data-ghost]').forEach(g => gsap.fromTo(g, { xPercent: 6 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: g.parentNode, start: 'top top', end: 'bottom top', scrub: true } }));
    // vehicle rows: car drives in
    $$('.vrow').forEach((row, i) => {
      const car = $('[data-car]', row), left = row.classList.contains('vrow--b'); if (!car) return;
      gsap.fromTo(car, { xPercent: left ? -40 : 40, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 70%', end: 'top 15%', scrub: .6 } });
      gsap.to(car, { xPercent: left ? 8 : -8, ease: 'none', scrollTrigger: { trigger: row, start: 'center center', end: 'bottom top', scrub: true } });
    });
    // marquee
    $$('[data-marquee]').forEach(m => gsap.to(m, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 }));
    // floating car + labels
    $$('[data-float]').forEach(c => { gsap.to(c, { y: -10, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }); gsap.fromTo(c, { xPercent: -14, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 85%', end: 'top 40%', scrub: .6 } }); });
    // counters
    $$('[data-count]').forEach(el => {
      const end = +el.dataset.count, suffix = el.dataset.suffix || '', o = { v: 0 };
      if (!end) return;
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-US') + suffix; } }) });
    });
    // brochure tilt
    if (fine.matches) $$('[data-tilt]').forEach(t => {
      const c = $('.bro__cover', t);
      t.addEventListener('mousemove', e => { const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = 'rotateY(' + (x * 22) + 'deg) rotateX(' + (-y * 16) + 'deg)'; });
      t.addEventListener('mouseleave', () => { c.style.transform = ''; });
    });
    // pinned horizontal storytelling (desktop)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      $$('[data-hs]').forEach(sec => {
        const track = $('[data-hs-track]', sec), bar = $('[data-hs-bar]', sec), now = $('[data-hs-now]', sec), n = track.children.length;
        const dist = () => Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft) * 2);
        gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: s => { if (bar) bar.style.transform = 'scaleX(' + s.progress + ')'; if (now) now.textContent = '0' + (Math.min(n, Math.floor(s.progress * n * .999) + 1)); } } });
      });
    });
    // scroll progress line
    const prog = document.createElement('div'); prog.className = 'prog'; prog.setAttribute('aria-hidden', 'true'); body.appendChild(prog);
    gsap.to(prog, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    // statement bands: words light up with scroll
    $$('[data-scrub]').forEach(el => {
      const words = el.textContent.trim().split(/\s+/); el.textContent = '';
      const sp = words.map(w => { const s = document.createElement('span'); s.className = 'sw'; s.textContent = w; el.append(s, ' '); return s; });
      gsap.fromTo(sp, { opacity: .16 }, { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true } });
    });
    // drive-by band: car crosses, outline word drifts the other way
    $$('.drive').forEach(d => {
      const car = $('[data-drive]', d), word = $('[data-drive-word]', d);
      gsap.fromTo(car, { x: () => -car.offsetWidth * 1.1 }, { x: () => d.clientWidth + car.offsetWidth * .1, ease: 'none', scrollTrigger: { trigger: d, start: 'top bottom', end: 'bottom top', scrub: .5, invalidateOnRefresh: true } });
      gsap.fromTo(word, { x: () => d.clientWidth * .1 }, { x: () => -word.offsetWidth * .35, ease: 'none', scrollTrigger: { trigger: d, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    });
    // list dividers draw in
    $$('.ben__list li, .why2__list li').forEach(li => gsap.to(li, { '--d': 1, duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: li, start: 'top 92%', once: true } }));
    // magnetic buttons
    if (fine.matches) $$('.btn').forEach(b => {
      const mx = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), my = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .18); my((e.clientY - r.top - r.height / 2) * .28); });
      b.addEventListener('mouseleave', () => { mx(0); my(0); });
    });
    // 404: the car drives across the road
    const car = $('.nf__car'); if (car) gsap.fromTo(car, { x: () => -car.offsetWidth }, { x: () => innerWidth, duration: 9, ease: 'none', repeat: -1 });
  }

  /* ------------------------------------------------------------ drag rails + custom cursor */
  const cur = document.createElement('div'); cur.className = 'cur'; cur.setAttribute('aria-hidden', 'true'); body.appendChild(cur);
  const useCur = fine.matches && motion();
  let cx = 0, cy = 0;
  if (useCur) {
    const mx = gsap.quickTo(cur, 'x', { duration: .35, ease: 'power3' }), my = gsap.quickTo(cur, 'y', { duration: .35, ease: 'power3' });
    addEventListener('mousemove', e => { mx(e.clientX); my(e.clientY); }, { passive: true });
  }
  $$('[data-drag]').forEach(r => {
    let down = false, sx = 0, sl = 0, moved = 0;
    if (useCur && r.dataset.cursor) { r.addEventListener('mouseenter', () => { cur.textContent = r.dataset.cursor; gsap.to(cur, { scale: 1, duration: .4, ease: 'power3.out' }); }); r.addEventListener('mouseleave', () => gsap.to(cur, { scale: 0, duration: .3 })); }
    r.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = r.scrollLeft; r.classList.add('is-drag'); });
    addEventListener('pointermove', e => { if (!down) return; const d = e.clientX - sx; moved = Math.max(moved, Math.abs(d)); r.scrollLeft = sl - d; });
    addEventListener('pointerup', () => { if (!down) return; down = false; r.classList.remove('is-drag'); });
    r.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    r.addEventListener('dragstart', e => e.preventDefault());
    const sec = r.closest('section'); if (sec) { const step = () => r.clientWidth * .6; const p = $('[data-prev]', sec), n = $('[data-next]', sec); if (p) p.addEventListener('click', () => r.scrollBy({ left: -step(), behavior: 'smooth' })); if (n) n.addEventListener('click', () => r.scrollBy({ left: step(), behavior: 'smooth' })); }
  });

  /* ------------------------------------------------------------ tabs (specifications) */
  $$('[data-tabs]').forEach(w => {
    const tabs = $$('[role=tab]', w), panels = $$('[role=tabpanel]', w);
    const select = (t, focus) => { tabs.forEach((x, i) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; panels[i].hidden = !on; if (on && motion()) gsap.from($$('div', panels[i]), { y: 18, opacity: 0, duration: .5, stagger: .05, ease: 'power3.out' }); }); if (focus) t.focus(); };
    tabs.forEach((t, i) => { t.addEventListener('click', () => select(t)); t.addEventListener('keydown', e => { const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); } }); });
  });

  /* ------------------------------------------------------------ parts composition */
  $$('[data-pstage]').forEach(s => {
    const btns = $$('[data-p]', s), figs = $$('[data-pv]', s);
    const show = i => { btns.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j))); figs.forEach((f, j) => f.classList.toggle('is-on', i === j)); };
    btns.forEach((b, i) => { b.addEventListener('click', () => show(i)); b.addEventListener('mouseenter', () => { if (fine.matches) show(i); }); b.addEventListener('focus', () => show(i)); });
  });

  /* ------------------------------------------------------------ forms */
  const rules = {
    name: v => v.trim().length >= 2 ? '' : 'Please enter your name.',
    phone: v => { const d = v.replace(/\D/g, ''); return /^\+?[\d\s\-()]+$/.test(v.trim()) && d.length >= 7 && d.length <= 15 ? '' : 'Enter a valid phone number (7 to 15 digits).'; },
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.',
    consent: (v, i) => i.checked ? '' : 'Please accept to continue.'
  };
  const base = n => n.replace(/^[a-z]{2}-/, '');
  $$('[data-form]').forEach(form => {
    const status = $('.form__status', form), btn = $('button[type=submit]', form);
    const chk = i => { const r = rules[base(i.name)]; if (!r) return true; const m = r(i.value, i), f = i.closest('.field'); $('.err', f).textContent = m; f.classList.toggle('is-invalid', !!m); i.setAttribute('aria-invalid', String(!!m)); return !m; };
    const setS = (m, k) => { status.textContent = m; status.className = 'form__status' + (k ? ' is-' + k : ''); };
    $$('input, select, textarea', form).forEach(i => { i.addEventListener('blur', () => chk(i)); i.addEventListener('input', () => { if (i.closest('.field').classList.contains('is-invalid')) chk(i); }); });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const req = $$('input[required], textarea[required]', form), ok = req.map(chk).every(Boolean);
      if (!ok) { setS('Please correct the highlighted fields.', 'err'); const bad = req.find(i => i.closest('.field').classList.contains('is-invalid')); if (bad) bad.focus(); return; }
      if (form.elements.website.value) { setS('Thank you. Your enquiry has been received.', 'ok'); form.reset(); return; }
      const g = k => { const el = $$('[name]', form).find(x => base(x.name) === k); return el ? el.value.trim() : ''; };
      const data = { name: g('name'), phone: g('phone'), email: g('email'), vehicle: g('vehicle'), part: g('part'), company: g('company'), size: g('size'), message: g('message'), type: form.dataset.type, source: location.href };
      const text = ['New enquiry (' + data.type + ')', 'Name: ' + data.name, 'Phone: ' + data.phone, 'Email: ' + data.email, data.company && 'Company: ' + data.company, data.vehicle && 'Vehicle: ' + data.vehicle, data.part && 'Part: ' + data.part, data.size && 'Fleet size: ' + data.size, data.message && 'Message: ' + data.message].filter(Boolean).join('\n');
      const enq = C.enquiry || {};
      btn.disabled = true; setS('Sending your enquiry...', '');
      try {
        if (enq.endpoint) {
          const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 12000);
          const res = await fetch(enq.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: ctl.signal }); clearTimeout(t);
          if (!res.ok) throw new Error('HTTP ' + res.status); setS('Thank you. Your enquiry has been sent and our team will be in touch.', 'ok'); form.reset();
        } else {
          const to = data.type === 'Parts' ? 'parts@middleeastgrp.com' : 'sales@middleeastgrp.com';
          location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Website enquiry: ' + (data.vehicle || data.type)) + '&body=' + encodeURIComponent(text);
          setS('Opening your email app with the enquiry ready to send. You can also message us on WhatsApp or call +218 918 804 961.', 'ok'); form.reset();
        }
      } catch (err) { setS('Sorry, we could not send your enquiry. Please call +218 918 804 961 or message us on WhatsApp.', 'err'); }
      finally { btn.disabled = false; }
    });
  });
  { const q = new URLSearchParams(location.search).get('vehicle'); const sel = $('#ct-vehicle'); if (q && sel) { const o = $$('option', sel).find(x => x.value.toLowerCase() === q.toLowerCase()); if (o) sel.value = o.value; } }

  /* ------------------------------------------------------------ compare */
  (function compare() {
    const data = window.MMK_COMPARE, mWrap = $('#cmpModels'); if (!data || !mWrap) return;
    const vWrap = $('#cmpVariants'), cards = $('#cmpCards'), table = $('#cmpTable'), diff = $('#cmpDiff'), MAX = 3;
    const qs = new URLSearchParams(location.search);
    let cur = data.find(m => m.slug === qs.get('m')) || data[1], sel = [];
    const rows = [['Trim', 'trim'], ['Engine', 'engine'], ['Fuel', 'fuel'], ['Transmission', 'trans'], ['Cylinders', 'cyl'], ['Drive', 'drive'], ['Body', 'body'], ['Power', 'power'], ['Torque', 'torque']];
    const TBC = 'On request', esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    function pick(id) { const i = sel.indexOf(id); if (i > -1) sel.splice(i, 1); else if (sel.length < MAX) sel.push(id); render(); }
    function render() {
      $$('button', mWrap).forEach(b => b.setAttribute('aria-selected', String(b.dataset.m === cur.slug)));
      vWrap.innerHTML = cur.variants.map(v => '<button type="button" data-v="' + v.id + '" aria-pressed="' + sel.includes(v.id) + '"' + (!sel.includes(v.id) && sel.length >= MAX ? ' disabled' : '') + '>' + esc(v.trim) + '</button>').join('');
      $$('button', vWrap).forEach(b => b.addEventListener('click', () => pick(b.dataset.v)));
      const vs = sel.map(id => cur.variants.find(v => v.id === id)).filter(Boolean);
      cards.style.setProperty('--n', Math.max(vs.length, 1));
      cards.innerHTML = vs.map(v => '<div class="ccard"><figure class="ccard__img' + (v.photo ? ' is-photo' : '') + '"><img src="' + v.img + '" alt="' + esc(cur.name + ' ' + v.trim) + '" loading="lazy"></figure><h3>' + esc(v.trim) + '</h3></div>').join('') || '<p class="note">Select at least one variant above.</p>';
      let t = '<thead><tr><th scope="col" class="sr">Specification</th>' + vs.map(v => '<th scope="col" class="sr">' + esc(v.trim) + '</th>').join('') + '</tr></thead><tbody>';
      const diffs = [];
      rows.forEach(([label, k]) => {
        const vals = vs.map(v => v[k]); const known = vals.filter(x => x && x !== TBC);
        const differs = k !== 'trim' && vs.length > 1 && new Set(known).size > 1;
        if (differs) diffs.push([label, vs.map((v, i) => [v.trim, vals[i]])]);
        t += '<tr' + (differs ? ' class="is-diff"' : '') + '><th scope="row">' + label + '</th>' + vals.map(x => '<td' + (x === TBC ? ' class="is-tbc"' : '') + '>' + esc(x || TBC) + '</td>').join('') + '</tr>';
      });
      table.innerHTML = '<caption class="sr">Specification comparison</caption>' + t + '</tbody>';
      diff.innerHTML = vs.length < 2 ? '<div class="dcard dcard--none"><h3>Select two or more variants</h3><ul><li>Differences will be highlighted here</li></ul></div>'
        : diffs.length ? diffs.map(([l, a]) => '<div class="dcard"><h3>' + l + '</h3><ul>' + a.map(([n, v]) => '<li>' + esc(v) + '<small>' + esc(n) + '</small></li>').join('') + '</ul></div>').join('')
        : '<div class="dcard dcard--none"><h3>No confirmed differences</h3><ul><li>These variants share the same confirmed specifications</li></ul></div>';
      if (motion()) { gsap.from($$('.ccard', cards), { y: 24, opacity: 0, duration: .5, stagger: .07, ease: 'power3.out' }); gsap.from($$('.dcard', diff), { y: 24, opacity: 0, duration: .5, stagger: .06, ease: 'power3.out' }); }
    }
    $$('button', mWrap).forEach(b => b.addEventListener('click', () => { cur = data.find(m => m.slug === b.dataset.m); sel = cur.variants.slice(0, 2).map(v => v.id); render(); }));
    const want = qs.get('v'); sel = want && cur.variants.some(v => v.id === want) ? [want, ...cur.variants.filter(v => v.id !== want).slice(0, 1).map(v => v.id)] : cur.variants.slice(0, 2).map(v => v.id);
    render();
  })();

  /* ------------------------------------------------------------ article page */
  (function article() {
    const box = $('#art'); if (!box) return;
    const q = new URLSearchParams(location.search), A = window.MMK_ARTICLES, kind = q.get('k') === 'blog' ? 'blog' : 'news';
    const a = (A[kind] || []).find(x => x.id === q.get('id')) || A[kind][0];
    document.title = a.title + ' | Mitsubishi Motors Libya';
    $('#artTitle').textContent = a.title; $('#artMeta').textContent = a.cat + (a.date ? '  ·  ' + a.date : '');
    $('#artBack').href = kind === 'blog' ? 'blog.html' : 'media.html';
    $('#artFig').innerHTML = '<img src="' + a.img + '" alt="" width="1200" height="800">';
    $('#artBody').innerHTML = '<p>' + a.ex + '</p>' + (a.cta ? '<p>' + a.cta + '</p>' : '') + '<p class="ph-note">The full article text is being prepared and will appear here. For details in the meantime, contact our team on +218 918 804 961.</p>';
  })();

  /* ------------------------------------------------------------ go */
  if (motion()) { try { initMotion(); } catch (e) { html.classList.remove('ip'); console.error(e); } }
  else if (hasG) { html.classList.remove('ip'); }
  addEventListener('load', () => hasG && ScrollTrigger.refresh());
})();
