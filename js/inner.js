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

  /* ------------------------------------------------------------ smooth wheel scrolling: eases toward a target so the page and the scrubbed car glide instead of stop-start */
  if (hasG) {
    const EASE = .08; let target = scrollY, cur = scrollY, raf = 0;
    const maxY = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const frame = () => {
      cur += (target - cur) * EASE;
      if (Math.abs(target - cur) < .4) { cur = target; raf = 0; scrollTo({ top: cur, behavior: 'instant' }); return; }
      scrollTo({ top: cur, behavior: 'instant' }); raf = requestAnimationFrame(frame);
    };
    addEventListener('wheel', e => {
      if (!fine.matches || reduce.matches || e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.target.closest && e.target.closest('textarea, select, .menu, .thumbs')) return;
      e.preventDefault();
      if (!raf) target = cur = scrollY;
      target = Math.min(maxY(), Math.max(0, target + e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1)));
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: false });
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    ['keydown', 'mousedown', 'touchstart'].forEach(t => addEventListener(t, stop, { passive: true }));
    addEventListener('scroll', () => { if (!raf) target = cur = scrollY; }, { passive: true });
  }

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
    const heroEls = $$('.vh [data-a], .ph [data-a], .xh [data-a]');
    // words
    $$('[data-split]').forEach(el => {
      const ws = $$('.w > span', el), inHero = !!el.closest('.vh, .ph, .nf, .xh');
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
    // model overview car: runs in from the right edge to the left and comes to rest in place
    $$('[data-runin]').forEach(f => {
      const im = $('img', f); if (!im) return;
      gsap.fromTo(im, { x: () => f.clientWidth * .75 + im.offsetWidth * .5 }, { x: 0, ease: 'power2.out',
        scrollTrigger: { trigger: f, start: 'top 90%', end: 'center 55%', scrub: 1, invalidateOnRefresh: true } });
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
      // wheels roll with the car's travel (cars face left: moving left rolls them forward); a ticker keeps them in sync with whatever moves the car
      const wheels = $$('.wheel', car), roll = () => { const x = gsap.getProperty(car, 'xPercent') * car.offsetWidth / 100; wheels.forEach(w => gsap.set(w, { rotation: (x / (w.offsetWidth / 1.68)) * 180 / Math.PI })); };
      if (wheels.length) gsap.ticker.add(roll);
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
        /* history timeline: a car drives along the red line. It starts as the previous-generation L200 (1.png), rolls to the centre where it hands over to the new L200 (2.png), then carries on to the end */
        let driveCar = null;
        const CW = 240; // car width in px (the photos are 847x360)
        if (bar && track.classList.contains('hs__track--tl')) {
          const barEl = bar.parentElement;
          const ERAS = [{ y: '2015', src: 'assets/img/hist-l200-1.webp' }, { y: 'Today', src: 'assets/img/hist-l200-2.webp' }];
          driveCar = document.createElement('div'); driveCar.className = 'hs__car'; driveCar.setAttribute('aria-hidden', 'true');
          driveCar.innerHTML = ERAS.map(e => `<span class="hs__era"><img src="${e.src}" alt="" width="847" height="360" decoding="async"><em>${e.y}</em></span>`).join('');
          barEl.appendChild(driveCar);
        }
        const eras = driveCar ? [...driveCar.children] : [];
        const drive = p => {
          driveCar.style.transform = 'translateX(' + p * (bar.parentElement.clientWidth - CW) + 'px)';
          const k = Math.max(0, Math.min(1, (p - .46) / .08)); // hand-over at the centre
          eras[0].style.opacity = 1 - k; eras[1].style.opacity = k;
        };
        if (driveCar) drive(0);
        gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: s => { if (bar) bar.style.transform = 'scaleX(' + s.progress + ')'; if (driveCar) drive(s.progress); if (now) now.textContent = '0' + (Math.min(n, Math.floor(s.progress * n * .999) + 1)); } } });
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
      // the cars face left, so scrolling down drives the car forward: right to left, wheels rolling with the distance
      const wheels = $$('.wheel', car), from = () => d.clientWidth + car.offsetWidth * .1;
      gsap.fromTo(car, { x: from }, { x: () => -car.offsetWidth * 1.1, ease: 'none',
        onUpdate: () => { const travel = from() - gsap.getProperty(car, 'x'); wheels.forEach(w => gsap.set(w, { rotation: -(travel / (w.offsetWidth / 1.68)) * 180 / Math.PI })); },
        scrollTrigger: { trigger: d, start: 'top bottom', end: 'bottom top', scrub: 1.2, invalidateOnRefresh: true } });
      gsap.fromTo(word, { x: () => -word.offsetWidth * .35 }, { x: () => d.clientWidth * .1, ease: 'none', scrollTrigger: { trigger: d, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });

      /* lights: scroll down = headlights blink, scroll stops = brake lights, scroll up = reverse light.
         Lamp boxes are [left, top, width, height] in % of the car image, per model (front lamp, rear lamp). */
      const LAMPS = {
        'destinator-m-line': [[5.4, 45, 3.4, 15], [90.6, 33, 3.8, 15]],
        'l200-glx-diesel': [[4.8, 40, 4.4, 9], [91.2, 37, 3.6, 18]],
        'outlander-sport-h-line': [[3.4, 38, 4.6, 22], [88.5, 29, 8.5, 9]],
        'xpander': [[9, 37, 6, 13], [85.5, 16, 5.5, 16]]
      };
      const key = (($('img', car) || {}).getAttribute('src') || '').split('/').pop().replace(/\.\w+$/, ''), lp = LAMPS[key];
      if (lp) {
        [['head', lp[0]], ['tail', lp[1]]].forEach(([k, b]) => {
          const l = document.createElement('i'); l.className = 'lamp lamp--' + k; l.setAttribute('aria-hidden', 'true');
          l.style.cssText = `left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%`; car.appendChild(l);
        });
        let last = scrollY, tBrake = 0, tOff = 0;
        const set = s => { d.dataset.lights = s; };
        addEventListener('scroll', () => {
          const dy = scrollY - last; last = scrollY;
          const r = d.getBoundingClientRect(); if (!dy || r.bottom < 0 || r.top > innerHeight) return;
          set(dy > 0 ? 'drive' : 'reverse');
          clearTimeout(tBrake); clearTimeout(tOff);
          tBrake = setTimeout(() => { set('brake'); tOff = setTimeout(() => set(''), 1800); }, 160);
        }, { passive: true });
      }
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

  /* explore pills: open the matching specification tab */
  $$('[data-spec-go]').forEach(a => a.addEventListener('click', () => { const t = $$('#specs [role=tab]')[+a.dataset.specGo]; if (t) t.click(); }));

  /* ------------------------------------------------------------ spec list: Show more */
  $$('[data-more-btn]').forEach(b => {
    const list = document.getElementById(b.getAttribute('aria-controls')); if (!list) return;
    if (list.scrollHeight <= 600) { b.hidden = true; list.classList.add('is-open'); return; }
    b.addEventListener('click', () => { const o = list.classList.toggle('is-open'); b.setAttribute('aria-expanded', String(o)); $('span', b).textContent = o ? 'Show less' : 'Show more'; });
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

  /* ------------------------------------------------------------ compare (add variants one by one) */
  (function compare() {
    const data = window.MMK_COMPARE, grid = $('#cmpTable'); if (!data || !grid) return;
    const only = $('#cmpDiffOnly'), none = $('#cmpNone'), MAX = 4, TBC = 'On request';
    const qs = new URLSearchParams(location.search);
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const rows = [['Engine', 'engine'], ['Fuel', 'fuel'], ['Cylinders', 'cyl'], ['Power', 'power'], ['Torque', 'torque'], ['Transmission', 'trans'], ['Drive', 'drive'], ['Body', 'body']];
    /* one model at a time; start with one variant, then add more with the + box */
    let cur = data.find(m => m.slug === qs.get('m')) || data.find(m => m.slug === 'l200') || data[0], chosen = [];
    const start = () => { chosen = [cur.variants.find(v => v.id === qs.get('v')) || cur.variants[0]]; };
    start();
    const opts = (list, sel, label) => (label ? '<option value="">' + label + '</option>' : '') + list.map(([val, text]) => '<option value="' + val + '"' + (val === sel ? ' selected' : '') + '>' + esc(text) + '</option>').join('');
    function render(anim) {
      const free = cur.variants.filter(v => !chosen.includes(v));
      const canAdd = chosen.length < MAX && free.length > 0;
      const shown = rows.map(([label, k]) => {
        const vals = chosen.map(v => v[k] || TBC);
        const known = vals.filter(x => x !== TBC);
        return { label, vals, differs: chosen.length > 1 && new Set(known).size > 1 };
      }).filter(r => !only.checked || r.differs);
      const blank = shown.map(() => '<div class="spec is-blank"></div>').join('');
      grid.style.setProperty('--rows', 4 + shown.length);
      let html = chosen.map((v, i) => {
        let h = '<article class="ccar"><div class="ccar__sel">' + (i === 0
          ? '<select data-model aria-label="Vehicle">' + opts(data.map(m => [m.slug, m.name]), cur.slug) + '</select>'
          : '<select disabled aria-label="Vehicle (set by the first column)">' + opts([[cur.slug, cur.name]], cur.slug) + '</select>')
          + '<select data-v="' + i + '" aria-label="Variant ' + (i + 1) + '">' + opts(cur.variants.filter(x => x === v || !chosen.includes(x)).map(x => [x.id, x.trim]), v.id) + '</select></div>';
        h += '<figure class="ccar__img' + (v.photo ? ' is-photo' : '') + '"><img src="' + v.img + '" alt="' + esc(cur.name + ' ' + v.trim) + '" loading="lazy"></figure><div class="ccar__name"><h3>' + esc(cur.name) + '</h3><p>' + esc(v.trim) + '</p></div><div class="ccar__act"><a class="btn btn--solid" href="contact.html?vehicle=' + encodeURIComponent(cur.name) + '">Enquire</a>' + (chosen.length > 1 ? '<button type="button" class="ccar__link" data-rm="' + i + '">Remove</button>' : '<a class="ccar__link" href="' + cur.slug + '.html">Discover ' + esc(cur.name) + '</a>') + '</div>';
        shown.forEach(r => { const x = r.vals[i]; h += '<div class="spec' + (r.differs ? ' is-diff' : '') + (x === TBC ? ' is-tbc' : '') + '"><small>' + r.label + '</small><b>' + esc(x) + '</b></div>'; });
        return h + '</article>';
      }).join('');
      if (canAdd) html += '<article class="ccar ccar--add"><div class="ccar__sel"><span class="ccar__ph"></span><span class="ccar__ph"></span></div>'
        + '<div class="ccar__img ccar__img--add"><span class="plus" aria-hidden="true">+</span><span>Add a variant</span>'
        + '<select data-add aria-label="Add a variant to compare">' + opts(free.map(x => [x.id, x.trim]), '', 'Add a variant') + '</select></div>'
        + '<div class="ccar__name"></div><div class="ccar__act"></div>' + blank + '</article>';
      grid.innerHTML = html;
      none.hidden = shown.length > 0;
      if (anim && motion()) gsap.from($$('.ccar', grid), { y: 24, opacity: 0, duration: .5, stagger: .07, ease: 'power3.out', clearProps: 'all' });
    }
    grid.addEventListener('change', e => {
      const t = e.target;
      if (t.hasAttribute('data-model')) { cur = data.find(m => m.slug === t.value) || cur; chosen = [cur.variants[0]]; render(true); const f = $('[data-model]', grid); if (f) f.focus(); return; }
      if (t.hasAttribute('data-add')) { const v = cur.variants.find(x => x.id === t.value); if (v) { chosen.push(v); render(false); const n = $$('[data-v]', grid).pop(); if (n) n.focus(); } return; }
      const vi = t.dataset.v; if (vi == null) return;
      const v = cur.variants.find(x => x.id === t.value); if (v) { chosen[+vi] = v; render(false); const again = $('[data-v="' + vi + '"]', grid); if (again) again.focus(); }
    });
    grid.addEventListener('click', e => {
      const b = e.target.closest('[data-rm]'); if (!b) return;
      chosen.splice(+b.dataset.rm, 1); render(false);
    });
    only.addEventListener('change', () => render(false));
    render(true);
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
    if (a.body) { $('#artBody').innerHTML = a.body.map(t => t.indexOf('## ') === 0 ? '<h3>' + t.slice(3) + '</h3>' : '<p>' + t + '</p>').join(''); return; }
    $('#artBody').innerHTML = '<p>' + a.ex + '</p>' + (a.cta ? '<p>' + a.cta + '</p>' : '') + '<p class="ph-note">The full article text is being prepared and will appear here. For details in the meantime, contact our team on +218 918 804 961.</p>';
  })();

  /* ------------------------------------------------------------ go */
  if (motion()) { try { initMotion(); } catch (e) { html.classList.remove('ip'); console.error(e); } }
  else if (hasG) { html.classList.remove('ip'); }
  /* keep trigger positions true when fonts, images, tabs or the viewport change, and rescue any text left hidden */
  if (hasG) {
    const refresh = () => ScrollTrigger.refresh();
    addEventListener('load', refresh);
    addEventListener('orientationchange', () => setTimeout(refresh, 300));
    addEventListener('pageshow', e => { if (e.persisted) refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(refresh, 250); });
    if (motion()) {
      const rescue = () => {
        const vh = innerHeight;
        $$('[data-a]').forEach(el => { if (el.getBoundingClientRect().top < vh * .98 && +gsap.getProperty(el, 'opacity') < .05 && !gsap.isTweening(el)) gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', overwrite: true }); });
        $$('[data-split]').forEach(el => { if (el.getBoundingClientRect().top < vh * .98) { const ws = $$('.w > span', el).filter(w => +gsap.getProperty(w, 'yPercent') > 5 || +gsap.getProperty(w, 'y') > 5); if (ws.length && !ws.some(w => gsap.isTweening(w))) gsap.to(ws, { y: 0, yPercent: 0, duration: .8, stagger: .04, ease: 'power4.out', overwrite: true }); } });
      };
      let st; const queue = () => { clearTimeout(st); st = setTimeout(rescue, 700); };
      addEventListener('scroll', queue, { passive: true }); addEventListener('resize', queue); addEventListener('load', () => setTimeout(rescue, 2500));
    }
  }
})();

/* Explore links open the matching specification tab */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[data-spec]'); if (!a) return;
  const tabs = document.querySelectorAll('.spec__tabs [role="tab"]'), t = tabs[+a.dataset.spec];
  if (t) t.click();
});

/* Variant tabs slider: drag with the mouse, and keep the selected tab in view */
document.querySelectorAll('.xf .trim__tabs').forEach(bar => {
  let down = false, sx = 0, sl = 0, moved = false;
  bar.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = bar.scrollLeft; });
  addEventListener('pointermove', e => { if (!down) return; const d = e.clientX - sx; if (Math.abs(d) > 4) { moved = true; bar.classList.add('is-drag'); } if (moved) bar.scrollLeft = sl - d; });
  addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => bar.classList.remove('is-drag'), 0); });
  bar.addEventListener('click', e => { const b = e.target.closest('[role="tab"]'); if (b) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); });
});

/* Variant tabs: arrow buttons on both sides scroll the slider */
document.querySelectorAll('.xf .trim__tabs').forEach(bar => {
  const wrap = document.createElement('div'); wrap.className = 'trim__slider';
  const mk = (dir, label) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'trim__arr trim__arr--' + dir; b.setAttribute('aria-label', label); b.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-arrow-' + dir + '"/></svg>'; return b; };
  const prev = mk('left', 'Previous variants'), next = mk('right', 'Next variants');
  bar.parentNode.insertBefore(wrap, bar); wrap.append(prev, bar, next);
  const tabs = () => Array.from(bar.querySelectorAll('[role="tab"]')), cur = () => Math.max(0, tabs().findIndex(t => t.getAttribute('aria-selected') === 'true'));
  const go = d => { const t = tabs(), i = Math.min(t.length - 1, Math.max(0, cur() + d)); t[i].click(); t[i].focus({ preventScroll: true }); };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  const sync = () => { const over = bar.scrollWidth > bar.clientWidth + 2; wrap.classList.toggle('has-arrows', over); prev.disabled = cur() <= 0; next.disabled = cur() >= tabs().length - 1; };
  bar.addEventListener('click', () => setTimeout(sync, 0));
  bar.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync(); setTimeout(sync, 400);
});

/* Variant tabs: the current car drives off to the left and the next one drives in from the right.
   Headlights blink while they move, the brake lights come on when the new car stops. */
(function () {
  if (!window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.xf .trim__tabs').forEach(bar => {
    const root = bar.closest('.trim') || document, state = { old: null, tl: null, ghost: null, timer: 0 };
    const visible = () => root.querySelector('.trim__panel:not([hidden])');
    const carOf = box => box && (box.querySelector('.tcar') || box.querySelector('img'));
    const spin = (car, x) => car.querySelectorAll('.wheel').forEach(w => gsap.set(w, { rotation: (x / (w.offsetWidth / 1.68)) * 180 / Math.PI }));
    bar.addEventListener('click', e => { // capture: runs before the tab switches, so the outgoing car can be copied
      const t = e.target.closest('[role="tab"]'); state.old = null;
      if (!t || t.getAttribute('aria-selected') === 'true') return;
      const box = (visible() || {}).querySelector && visible().querySelector('.trim__img'), c = carOf(box); if (!c) return;
      const b = box.getBoundingClientRect(), r = c.getBoundingClientRect();
      state.old = { node: c.cloneNode(true), l: r.left - b.left, t: r.top - b.top, w: r.width, h: r.height };
    }, true);
    bar.addEventListener('click', () => { // bubble: runs after the tab switched
      const o = state.old; state.old = null; if (!o) return;
      const box = visible() && visible().querySelector('.trim__img'), car = carOf(box); if (!box || !car) return;
      if (state.tl) state.tl.kill(); if (state.ghost) state.ghost.remove(); clearTimeout(state.timer);
      gsap.killTweensOf(box); gsap.set(box, { opacity: 1, y: 0 });
      const g = state.ghost = o.node; g.removeAttribute('data-tcar');
      g.style.cssText += ';position:absolute;margin:0;left:' + o.l + 'px;top:' + o.t + 'px;width:' + o.w + 'px;height:' + o.h + 'px;z-index:2';
      box.appendChild(g);
      const inX = (box.clientWidth + car.offsetWidth) / 2 + 24, outX = -(o.l + o.w + 24);
      gsap.set(car, { x: inX }); gsap.set(g, { x: 0 }); spin(car, inX);
      box.dataset.lights = 'drive';
      const tl = state.tl = gsap.timeline({ onComplete: () => {
        g.remove(); state.ghost = null; gsap.set(car, { x: 0 }); spin(car, 0);
        box.dataset.lights = 'brake'; state.timer = setTimeout(() => { box.dataset.lights = ''; }, 1700);
      } });
      tl.to(g, { x: outX, duration: .55, ease: 'power2.in', onUpdate: () => spin(g, gsap.getProperty(g, 'x')) }, 0)
        .to(car, { x: 0, duration: .85, ease: 'power2.out', onUpdate: () => spin(car, gsap.getProperty(car, 'x')) }, '>');
    });
  });
})();

/* Car detail pages: banner photos drift and ease in as you scroll (parallax + slow zoom) */
(function () {
  if (!window.gsap || !window.ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.xf .xb__bg img, .xf .xh--r .xh__bg img, .xf .x50__img img').forEach(img => {
    const sec = img.closest('section'); if (!sec) return;
    gsap.fromTo(img, { yPercent: -6, scale: 1.22 }, { yPercent: 6, scale: 1.14, ease: 'none', transformOrigin: '50% 50%',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  });
})();
