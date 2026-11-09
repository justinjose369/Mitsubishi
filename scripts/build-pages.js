/* Generates the inner pages (static HTML) from scripts/content.js.   Run:  node scripts/build-pages.js */
const fs = require('fs'), path = require('path');
const C = require('./content.js');
const root = path.join(__dirname, '..');
const { MODELS, ORDER, NEWS, BLOG, PARTS, OFFICES, SOCIAL, TBC } = C;
const { LEGAL } = require('./legal.js');
const ASSET_V = Date.now().toString(36); // cache-busting query for local css/js so browsers never keep stale files
const model = s => MODELS.find(m => m.slug === s);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/* ---------- icons: reuse the home page sprite + a few extras ---------- */
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let sprite = home.match(/<svg width="0"[\s\S]*?<\/svg>\s*(?=<!-- 1\. HEADER)/)[0];
sprite = sprite.replace('</defs>', `<symbol id="i-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></symbol>
      <symbol id="i-linkedin" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></symbol>
      <symbol id="i-plus" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></symbol>
      <symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></symbol>
    </defs>`);
const ic = n => `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const btn = (href, label, cls = 'btn--solid', extra = '') => `<a class="btn ${cls}" href="${href}"${extra ? ' ' + extra : ''}>${label} ${ic('arrow-right')}</a>`;
const eyebrow = (t, extra = '') => `<p class="eyebrow" data-a${extra ? ' ' + extra : ''}>${t}</p>`;
const split = (tag, cls, t, extra = '') => `<${tag} class="${cls}" data-split${extra ? ' ' + extra : ''}>${t}</${tag}>`;
const img = (src, alt = '', w, h, extra = '') => `<img src="${src}" alt="${esc(alt)}"${w ? ` width="${w}" height="${h}"` : ''} loading="lazy" decoding="async"${extra ? ' ' + extra : ''}>`;
/* Spinning wheel discs for the drive-by band. Same calibrated hub data and technique as the home-page showcase (js/data.js,
   js/main.js buildCar): a disc covering rim + inner tyre, cropped from the same image, centred on each hub. */
const WHEEL_K = 0.84;
const WHEEL_DATA = (() => { const ctx = { window: {} }; require('vm').runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8'), ctx); return ctx.window.MMK_MODELS; })();
const wheelDiscs = m => {
  const e = WHEEL_DATA.find(x => x.img === m.cut.replace('-hd.webp', '.webp')); if (!e) return '';
  const [fx, rx, cyF, r, cyR] = e.wheels, sz = 2 * r * WHEEL_K, hr = e.ar, f = n => +n.toFixed(4);
  return [[fx, cyF], [rx, cyR == null ? cyF : cyR]].map(([cx, cy]) => `<i class="wheel" aria-hidden="true" style="left:${f((cx - sz / 2) * 100)}%;top:${f((cy * hr - sz / 2) / hr * 100)}%;width:${f(sz * 100)}%;background-image:url(${m.cut});background-size:${f(100 / sz)}% auto;background-position:${f((sz / 2 - cx) / (sz - 1) * 100)}% ${f((sz / 2 - cy * hr) / (sz - hr) * 100)}%"></i>`).join('');
};
/* Variant car with rolling wheels + head/tail lamps, driven by js/inner.js when the variant tab changes. Lamp boxes: [left, top, width, height] in % of the image. */
const EXTRA_WHEELS = { // wheel data for images that are not in js/data.js: { ar: height/width, wheels: [frontX, rearX, frontCy, tyreR, rearCy] }
  'assets/cars/l200-4wd-gl-petrol': { ar: 0.358, wheels: [0.165, 0.752, 0.796, 0.075, 0.791] },
  'assets/cars/destinator-m-line-red': { ar: 0.444, wheels: [0.200, 0.782, 0.744, 0.0715, 0.730] },
  'assets/cars/outlander-sport-p-line': { ar: 0.4113, wheels: [0.2021, 0.8064, 0.759, 0.0738, 0.738] },
  'assets/cars/l200-sportero': { ar: 0.4286, wheels: [0.178, 0.767, 0.727, 0.068, 0.737] }
};
// every car image listed in js/data.js (including ones not shown on the home page) carries measured wheel positions
for (const m of fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8').matchAll(/img: '(assets[/]cars[/][^']+)[.]webp', ar: ([0-9.]+), wheels: [[]([^\]]*)[\]]/g)) if (!EXTRA_WHEELS[m[1]]) EXTRA_WHEELS[m[1]] = { ar: +m[2], wheels: m[3].split(',').map(Number) };
const CAR_LAMPS = { // [head, tail]
  'destinator-p-line': [[10, 44, 5.5, 17], [84.5, 18.5, 5.2, 15.8]],
  'destinator-m-line': [[5.4, 45, 3.4, 15], [90.6, 33, 3.8, 15]],
  'l200-glx-diesel': [[4.8, 40, 4.4, 9], [91.2, 37, 3.6, 18]],
  'l200-4wd-gl': [[2.4, 37, 6.4, 7], [93.5, 32.8, 4, 21]],
  'l200-2wd-gl': [[10.5, 38.9, 6.5, 6.5], [89, 32.5, 3.2, 19.2]],
  'l200-gl-single': [[3.8, 38.8, 6.2, 11.6], [94.5, 33.6, 3.2, 20.7]],
  'l200-gls-petrol': [[2.5, 37.9, 8.5, 10.8], [90.5, 33.3, 7, 15.4]],
  'l200-4wd-gl-petrol': [[2.2, 41.3, 6.3, 13], [93.5, 31.3, 3.7, 23.2]],
  'destinator-m-line-red': [[5.4, 45, 3.4, 15], [90.6, 33, 3.8, 15]],
  'outlander-sport-p-line': [[3.2, 42, 4.5, 19], [91, 28.4, 5.7, 16.4]],
  'l200-sportero': [[4.2, 39.5, 6.5, 7], [94.5, 35.7, 4, 18.6]],
  'pajero-sport': [[2.5, 36, 10, 6.5], [89.5, 19.1, 8, 14]],
  'outlander-sport-m-line': [[3, 41.2, 5, 18], [90.5, 28.6, 6, 17.4]],
  'outlander-sport-h-line': [[3.4, 38, 4.6, 22], [88.5, 29, 8.5, 9]],
  'xpander': [[9, 37, 6, 13], [85.5, 16, 5.5, 16]]
};
const carFx = (src, alt, w, h) => {
  const base = src.replace(/.(png|webp)$/, ''), name = base.split('/').pop();
  const e = WHEEL_DATA.find(x => x.img === base + '.webp') || EXTRA_WHEELS[base];
  let wheels = '';
  if (e) { const [fx, rx, cyF, r, cyR] = e.wheels, sz = 2 * r * WHEEL_K, hr = e.ar, f = n => +n.toFixed(4);
    wheels = [[fx, cyF], [rx, cyR == null ? cyF : cyR]].map(([cx, cy]) => `<i class="wheel" aria-hidden="true" style="left:${f((cx - sz / 2) * 100)}%;top:${f((cy * hr - sz / 2) / hr * 100)}%;width:${f(sz * 100)}%;background-image:url(${src});background-size:${f(100 / sz)}% auto;background-position:${f((sz / 2 - cx) / (sz - 1) * 100)}% ${f((sz / 2 - cy * hr) / (sz - hr) * 100)}%"></i>`).join(''); }
  const lp = CAR_LAMPS[name], lamps = lp ? [['head', lp[0]], ['tail', lp[1]]].map(([k, b]) => `<i class="lamp lamp--${k}" aria-hidden="true" style="left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%"></i>`).join('') : '';
  return `<span class="tcar" data-tcar>${img(src, alt, w, h)}${wheels}${lamps}</span>`;
};
const clip = (src, alt, w, h, cls = '', extra = '') => `<figure class="clip ${cls}" data-clip${extra ? ' ' + extra : ''}>${img(src, alt, w, h)}</figure>`;

/* ---------- shared header / footer ---------- */
const NAV = [['Home', 'index.html', 'home'], ['About Us', 'about.html', 'about'], ['Cars', 'vehicles.html', 'cars'], ['Parts', 'parts.html', 'parts'], ['Fleet', 'fleet.html', 'fleet'], ['Media', 'media.html', 'media'], ['Contact Us', 'contact.html', 'contact']];
const header = active => `
  <header class="header" id="header">
    <div class="header__inner">
      <div class="header__brand"><a class="header__logo header__logo--main" href="index.html" aria-label="Mitsubishi Motors Libya, home"><img src="assets/img/logo-main.png" alt="Mitsubishi Motors, Drive your Ambition" width="201" height="186"></a></div>
      <nav class="nav" aria-label="Primary"><ul>
        ${NAV.map(([t, h, k]) => k === 'cars'
          ? `<li class="nav__mega" id="navCars"><a href="${h}" data-nav="cars"${active === 'cars' ? ' class="is-active" aria-current="page"' : ''} aria-haspopup="true" aria-expanded="false" aria-controls="mega">${t}<svg class="ic nav__chev" aria-hidden="true"><use href="#i-chevron-down"/></svg></a></li>`
          : `<li><a href="${h}" data-nav="${k}"${active === k ? ' class="is-active" aria-current="page"' : ''}>${t}</a></li>`).join('\n        ')}
      </ul></nav>
      <div class="header__right">
        <a class="header__call" href="tel:+218918804961" aria-label="Call +218 918 804 961">${ic('phone')}<span>+218 918 804 961</span></a>
        <span class="header__sep" aria-hidden="true"></span>
        <a class="btn btn--solid header__enquire" href="contact.html">Enquire now</a>
      </div>
      <button class="header__toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><svg class="ic ic--open"><use href="#i-menu"/></svg><svg class="ic ic--close"><use href="#i-x"/></svg></button>
    </div>
    <div class="mega" id="mega" aria-label="Mitsubishi vehicles"><div class="mega__inner"><div class="mega__grid" id="megaGrid"></div><p class="mega__foot"><a href="vehicles.html">View the full range ${ic('arrow-right')}</a></p></div></div>
  </header>
  <div class="menu" id="menu" hidden>
    <nav aria-label="Mobile"><ul>
      ${NAV.map(([t, h, k]) => `<li><a href="${h}">${t}</a>${k === 'cars' ? `<ul class="menu__sub">${ORDER.map(s => `<li><a href="${s}.html">${model(s).name}</a></li>`).join('')}</ul>` : ''}</li>`).join('\n      ')}
    </ul></nav>
    <div class="menu__foot"><a href="tel:+218918804961">${ic('phone')}<span>+218 918 804 961</span></a><a href="#" data-wa target="_blank" rel="noopener">${ic('whatsapp')}WhatsApp</a></div>
  </div>`;

const social = () => `<ul class="ft__social" aria-label="Social media">
  <li><a href="${SOCIAL.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ic('facebook')}</a></li>
  <li><a href="${SOCIAL.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ic('instagram')}</a></li>
  <li><a href="${SOCIAL.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ic('linkedin')}</a></li></ul>`;

const footer = () => `
  <footer class="footer">
    <div class="wrap">
      <div class="footer__main">
        <div class="footer__id">
          <div class="footer__brand"><a class="footer__logo footer__logo--main" href="index.html" aria-label="Mitsubishi Motors Libya"><img src="assets/img/logo-main.png" alt="Mitsubishi Motors, Drive your Ambition" width="201" height="186" loading="lazy"></a></div>
          <ul class="footer__social" aria-label="Social media">
            <li><a data-social="facebook" aria-disabled="true" aria-label="Facebook"><svg class="ic"><use href="#i-facebook"/></svg></a></li>
            <li><a data-social="instagram" aria-disabled="true" aria-label="Instagram"><svg class="ic"><use href="#i-instagram"/></svg></a></li>
            <li><a data-social="x" aria-disabled="true" aria-label="X (Twitter)"><svg class="ic"><use href="#i-x-social"/></svg></a></li>
            <li><a data-social="youtube" aria-disabled="true" aria-label="YouTube"><svg class="ic"><use href="#i-youtube"/></svg></a></li>
          </ul>
        </div>
        <nav class="footer__grid" aria-label="Footer">
          <div class="footer__col">
            <h3>Explore</h3>
            <ul>
              <li><a href="vehicles.html">Cars</a></li>
              <li><a href="parts.html">Parts</a></li>
              <li><a href="fleet.html">Fleet</a></li>
              <li><a href="media.html">Media</a></li>
            </ul>
          </div>
          <div class="footer__col">
            <h3>Company</h3>
            <ul>
              <li><a href="about.html">About Us</a></li>
              <li><a href="compare.html">Compare</a></li>
              <li><a href="contact.html">Contact Us</a></li>
            </ul>
          </div>
          <div class="footer__col">
            <h3>Legal information</h3>
            <ul>
              <li><a href="privacy-policy.html">Privacy Policy</a></li>
              <li><a href="terms-and-conditions.html">Terms and Conditions</a></li>
              <li><a href="data-protection.html">Data Protection</a></li>
              <li><a href="legal-disclaimer.html">Legal Disclaimer</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <div class="footer__base">
        <p>&copy; Mitsubishi Motors Corporation 2026. All rights reserved.</p>
        
        <p class="footer__credit">Designed by: <img src="assets/img/inter.png" alt="" width="10" height="13" loading="lazy"><b>iNTERSMART</b></p>
      </div>
    </div>
  </footer>
  <nav class="dock" id="dock" aria-label="Quick contact"><a href="#" data-wa target="_blank" rel="noopener" class="dock__wa">${ic('whatsapp')}<span>WhatsApp</span></a><a href="tel:+218918804961" class="dock__call">${ic('phone')}<span>Call us</span></a><a href="contact.html" class="dock__enq">${ic('mail')}<span>Enquire</span></a></nav>`;

/* ---------- page shell ---------- */
function page(file, { title, desc, active, hdr = 'dark', body, preload = '', after = '', bodyClass = '' }) {
  const out = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)} | Mitsubishi Motors Libya</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#0b0b0c">
  <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
  <script>document.documentElement.classList.add('js','ip');</script>
  <link rel="preload" href="assets/fonts/barlow-condensed-600.woff2" as="font" type="font/woff2" crossorigin>${preload}
  <link rel="stylesheet" href="css/styles.css?v=${ASSET_V}">
  <link rel="stylesheet" href="css/inner.css?v=${ASSET_V}">
</head>
<body class="inner${bodyClass ? ' ' + bodyClass : ''}" data-header="${hdr}">
  <a class="skip" href="#main">Skip to content</a>
  ${sprite}
  <div class="pt" id="pt" aria-hidden="true"><i></i></div>
  ${header(active)}
  <main id="main">${body}</main>
  ${footer()}
  <script>window.MMK_NAV=${JSON.stringify(ORDER.map(s => ({ slug: s, name: model(s).name, kind: model(s).kind, img: model(s).cut, ar: model(s).cutAr })))};</script>
  <script src="vendor/gsap.min.js"></script>
  <script src="vendor/ScrollTrigger.min.js"></script>
  <script src="js/config.js?v=${ASSET_V}"></script>
  ${after}
  <script src="js/inner.js?v=${ASSET_V}"></script>
  <script src="js/megacar.js?v=${ASSET_V}"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(root, file), out);
  console.log('wrote', file);
}

/* ---------- reusable sections ---------- */
const ctaBand = ({ title = 'Ready to drive?', text = 'Tell us what you are looking for and our team will get back to you.', imgSrc = 'assets/img/about-bg.webp', href = 'contact.html', label = 'Enquire now' } = {}) => `
<section class="cta" aria-labelledby="cta-t">
  <div class="cta__bg" data-parallax>${img(imgSrc, '', 1400, 875)}</div><div class="cta__shade"></div>
  <div class="wrap cta__in">${eyebrow('Get in touch')}${split('h2', 'big cta__t', title, 'id="cta-t"')}<p class="lede" data-a>${text}</p><div data-a>${btn(href, label)}</div></div>
</section>`;

const field = (id, label, type = 'text', o = {}) => `<div class="field${o.wide ? ' field--wide' : ''}"><label for="${id}">${label}${o.req ? ' <i>*</i>' : ''}</label>${
  type === 'textarea' ? `<textarea id="${id}" name="${id}" rows="${o.rows || 3}"${o.req ? ' required' : ''}></textarea>`
  : type === 'select' ? `<select id="${id}" name="${id}">${o.opts.map(x => `<option value="${esc(x[0] ?? x)}">${esc(x[1] ?? x)}</option>`).join('')}</select>`
  : `<input id="${id}" name="${id}" type="${type}"${o.req ? ' required' : ''}${o.auto ? ` autocomplete="${o.auto}"` : ''}${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${type === 'tel' ? ' inputmode="tel"' : ''}>`}<span class="err" id="e-${id}" role="alert"></span></div>`;
const vehicleOpts = [['', 'Select a vehicle'], ...MODELS.map(m => [m.name, m.name])];
const form = (type, fields, submit = 'Submit enquiry') => `
<form class="form form--inner" data-form data-type="${type}" novalidate>
  ${fields}
  <div class="field field--check field--wide"><input id="consent-${type}" name="consent" type="checkbox" required><label for="consent-${type}">I agree to the use of my personal data for this enquiry and have read the <a href="privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a>.</label><span class="err" id="e-consent-${type}" role="alert"></span></div>
  <input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
  <div class="form__submit field--wide"><button class="btn btn--solid btn--block" type="submit"><span>${submit}</span> ${ic('send')}</button><p class="form__status" role="status" aria-live="polite"></p></div>
</form>`;
const baseFields = (p = '') => field(p + 'name', 'Name', 'text', { req: 1, auto: 'name' }) + field(p + 'phone', 'Phone number', 'tel', { req: 1, auto: 'tel', ph: '+218 ...' }) + field(p + 'email', 'Email', 'email', { req: 1, auto: 'email' });

/* ======================================================================== VEHICLES ===== */
const rowThemes = ['a', 'b', 'c', 'd'];
page('vehicles.html', {
  title: 'Discover Our Vehicles', desc: 'See the full lineup of Mitsubishi vehicles in Libya and find the one that best fits you: Destinator, L200, Outlander and Xpander.', active: 'cars',
  body: `
<section class="ph ph--vehicles">
  <div class="drift" aria-hidden="true"><i></i><i></i></div>
  <div class="marq" aria-hidden="true"><div data-marquee><span>Destinator</span><span>L200</span><span>Outlander</span><span>Xpander</span><span>Destinator</span><span>L200</span><span>Outlander</span><span>Xpander</span></div></div>
  <div class="wrap ph__in">
    ${eyebrow('Mitsubishi Motors Libya')}
    ${split('h1', 'big ph__title', 'Discover Our <span class="accent">Vehicles</span>')}
    <div class="ph__row"><p class="lede" data-a>See our full lineup of vehicles and find the one that best fits you.</p>
    <ul class="ph__index" data-a>${ORDER.map((s, i) => `<li><a href="#v-${s}"><span>0${i + 1}</span>${model(s).name}</a></li>`).join('')}</ul></div>
  </div>
  <a class="scrollcue" href="#v-destinator" aria-label="Scroll to vehicles"><span>Scroll</span><i></i></a>
</section>
${ORDER.map((s, i) => { const m = model(s); return `
<section class="vrow vrow--${rowThemes[i]}" id="v-${s}" style="--ac:${m.accent}" aria-labelledby="vr-${s}">
  <div class="vrow__bg" data-parallax>${img(m.hero, '', 1600, 900)}</div><div class="vrow__shade"></div>
  <div class="wrap vrow__in">
    <p class="vrow__no" data-a>0${i + 1} / 0${ORDER.length}</p>
    ${split('h2', 'big vrow__name', m.name, `id="vr-${s}"`)}
    <p class="vrow__tag" data-a>${m.tag}</p>
    <ul class="chips" data-a><li>${m.kind}</li>${m.variants[0].engine !== TBC ? `<li>${m.variants[0].engine.replace('Petrol', 'petrol').replace('Diesel', 'diesel')}</li>` : ''}<li>${m.variants.length} ${m.variants.length > 1 ? 'variants' : 'variant'}</li></ul>
    <div class="vrow__cta" data-a>${btn(s + '.html', 'Explore Model')} ${btn('contact.html?vehicle=' + encodeURIComponent(model(s).name), 'Download brochure', 'btn--line', `data-brochure="${s}" data-label="Download brochure"`)}</div>
  </div>
  ${i === 2 ? `<figure class="vrow__car" data-car>${img(m.cut, m.name, 520, Math.round(520 * m.cutAr))}${wheelDiscs(m)}</figure>` : ""}
</section>`; }).join('')}
<section class="strip">
  <div class="wrap strip__in"><div>${eyebrow('Find your fit')}${split('h2', 'h2', 'Compare the variants')}<p class="lede" data-a>Put engines, drivetrains and trims side by side before you decide.</p></div><div data-a>${btn('compare.html', 'Compare variants')}</div></div>
</section>
${ctaBand({ title: 'Test the range', text: 'Speak to our team about the vehicle that suits you.', imgSrc: 'assets/img/drive.webp' })}`
});

/* ======================================================================== VEHICLE DETAIL ===== */
/* Layout follows the Mitsubishi Motors Kuwait model page: hero, Drive hero, Exterior / Interior banners,
   50/50 Safety block, text block, tabbed trim + specification table, legal note, key buying actions. */
ORDER.forEach((s, mi) => {
  const m = model(s), next = model(ORDER[(mi + 1) % ORDER.length]);
  const tabs = Object.keys(m.specs);
  const enq = 'contact.html?vehicle=' + encodeURIComponent(m.name);
  const F = [0, 1, 2, 3].map(i => m.features[i % m.features.length]), bg = i => (F[i] && F[i][3]) || m.photo2 || m.hero;
  const banner = (i, label) => `<section class="xb" id="${label}" aria-labelledby="xb-${i}"><div class="xb__bg">${img(bg(i), '', 1600, 900)}</div><div class="xb__shade"></div>
  <div class="xb__in"><div class="xb__txt"><p class="xk" data-a>${F[i][0]}</p><h2 class="xh2" id="xb-${i}" data-a>${F[i][1]}</h2><p class="xp" data-a>${F[i][2]}</p><div class="xb__btn" data-a><a class="btn" href="#specs" data-spec="${label === 'exterior' ? 0 : 3}">Explore ${label}</a></div></div></div></section>`;
  page(s + '.html', {
    title: m.name, desc: `Mitsubishi ${m.name} in Libya: ${m.tag}`, active: 'cars', bodyClass: 'vd xf pg-' + s,
    preload: `\n  <link rel="preload" href="${m.hero}" as="image">`,
    body: `
<section class="xh xh--c" style="--ac:${m.accent}" aria-labelledby="xh-t">
  <div class="xh__bg" data-parallax data-hero-img>${img(m.hero, '', 1600, 900).replace('loading="lazy"', 'fetchpriority="high"')}</div><div class="xh__shade"></div>
  <div class="xh__in">
    <nav class="crumb" aria-label="Breadcrumb" data-a><a href="index.html">Home</a><span>/</span><a href="vehicles.html">Cars</a><span>/</span><b>${m.name}</b></nav>
    <p class="xk" data-a>${m.kind} &middot; Mitsubishi Motors Libya</p>
    <h1 class="xh1" id="xh-t" data-a>${m.name}</h1>
    <p class="xp" data-a>${m.tag}</p>
    <ul class="xh__feat" data-a>${m.labels.slice(0, 3).map(l => `<li>${l}</li>`).join('')}</ul>
    <div class="xh__cta" data-a><a class="btn btn--solid" href="${enq}">Book a test drive</a></div>
  </div>
</section>

<section class="xh xh--r" id="drive" aria-labelledby="xd-t">
  <div class="xh__bg">${img(bg(0), '', 1600, 900)}</div><div class="xh__shade"></div>
  <div class="xh__in xh__in--r"><div class="xh__box">
    <p class="xk" data-a>Drive</p><h2 class="xh2" id="xd-t" data-a>${F[0][1]}</h2><p class="xp" data-a>${F[0][2]}</p>
    <div data-a><a class="btn" href="#specs" data-spec="1">Explore drive</a></div></div></div>
</section>

${banner(1, 'exterior')}
${m.features.length > 2 ? banner(2, 'interior') : ''}

${m.features.length > 3 ? `<section class="x50" id="safety" aria-labelledby="xs-t">
  <div class="x50__txt"><div><p class="xk" data-a>Safety</p><h2 class="xh2 xh2--dk" id="xs-t" data-a>${F[3][1]}</h2><p class="xp xp--dk" data-a>${F[3][2]}</p><div class="xb__btn" data-a><a class="btn btn--dk" href="#specs" data-spec="2">Explore safety</a></div></div></div>
  <div class="x50__img">${img(bg(3), m.name, 1200, 900)}</div>
</section>` : ''}

<section class="xtx" aria-labelledby="xo-t">
  <div class="wrap xtx__in"><p class="xk" data-a>Model overview</p><h2 class="xh2 xh2--dk" id="xo-t" data-a>${m.tag}</h2><p class="xp xp--dk" data-a>${m.intro}</p></div>
</section>

<section class="xs" id="variants" aria-labelledby="var-t">
  <div class="wrap">
    <h2 class="xh2 xh2--dk" id="var-t" data-a>${m.variants.length > 1 ? 'Choose your ' + m.name : 'The ' + m.name}</h2>
    <div class="trim" data-tabs>
      <div class="trim__tabs" role="tablist" aria-label="${m.name} variants">${m.variants.map((v, i) => `<button type="button" role="tab" id="tt-${v.id}" aria-controls="tp-${v.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}>${esc(v.trim)}</button>`).join('')}</div>
      ${m.variants.map((v, i) => `<div class="trim__panel" role="tabpanel" id="tp-${v.id}" aria-labelledby="tt-${v.id}"${i ? ' hidden' : ''}>
        <div class="trim__img${v.photo ? ' is-photo' : ''}">${v.img.indexOf('assets/cars/') === 0 ? carFx(v.photo ? v.img : v.img.replace(/.webp$/, '.png'), m.name + ' ' + v.trim, 900, 600) : img(v.img, m.name + ' ' + v.trim, 900, 600)}</div>
        <div class="trim__info"><h3>${esc(v.trim)}</h3>
          <dl class="trim__facts"><div><dt>Engine</dt><dd>${v.engine}</dd></div><div><dt>Transmission</dt><dd>${v.trans}</dd></div><div><dt>Drive</dt><dd>${v.drive}</dd></div></dl>
          <a class="btn btn--solid" href="compare.html?m=${s}&v=${v.id}">Compare this variant</a></div></div>`).join('')}
    </div>

    <div class="xs__spec" id="specs">
      <h3 class="xh3" data-a>Specifications</h3>
      <div data-tabs class="spec__x">
        <div class="spec__tabs" role="tablist" aria-label="${m.name} specifications">${tabs.map((t, i) => `<button type="button" role="tab" id="st-${s}-${i}" aria-controls="sp-${s}-${i}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}>${t}</button>`).join('')}</div>
        <div class="spec__list" id="spl">${tabs.map((t, i) => `<dl class="spec__panel" role="tabpanel" id="sp-${s}-${i}" aria-labelledby="st-${s}-${i}"${i ? ' hidden' : ''}>${m.specs[t].map(r => `<div${r[1] === TBC ? ' class="is-tbc"' : ''}><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl>`).join('')}</div>
      </div>
      <button class="spec__more" type="button" data-more-btn aria-controls="spl" aria-expanded="false"><span>Show more</span> ${ic('plus')}</button>
    </div>
  </div>
</section>

<section class="xl" aria-label="Legal"><div class="wrap"><p class="note note--dark">Note: Equipment may vary by market. Please consult Mitsubishi Motors Libya for details. Items marked &ldquo;${TBC}&rdquo; are being confirmed.</p></div></section>

<section class="xka" id="brochure" aria-labelledby="xka-t">
  <div class="wrap"><h2 class="xh2 xh2--dk" id="xka-t" data-a>Take the next step</h2>
    <ul class="xka__list">
      <li data-a><a href="${enq}"><b>Book a test drive</b><span>Experience the ${m.name} for yourself.</span></a></li>
      <li data-a><a href="${enq}" data-brochure="${s}" data-label="Download brochure"><b>Download brochure</b><span>Request the ${m.name} brochure.</span></a></li>
      <li data-a><a href="compare.html?m=${s}"><b>Compare variants</b><span>See the variants side by side.</span></a></li>
      <li data-a><a href="contact.html"><b>Contact us</b><span>Talk to our team about availability.</span></a></li>
    </ul>
    <p class="note note--dark" data-brochure-note>The downloadable brochure is being prepared. Request it from our team in the meantime.</p>
  </div>
</section>

<a class="nextm" href="${next.slug}.html" data-a><span>Next vehicle</span><b>${next.name}</b>${ic('arrow-right')}</a>`
  });
});

/* ======================================================================== COMPARE ===== */
const compareData = MODELS.map(m => ({ slug: m.slug, name: m.name, variants: m.variants.filter(v => !v.photo).map(v => ({ id: v.id, trim: v.trim, img: v.img.replace(/^(assets\/cars\/.*)\.webp$/, '$1.png'), photo: !!v.photo, engine: v.engine, trans: v.trans, cyl: v.cyl, drive: v.drive, fuel: v.fuel, body: v.body, power: v.power || TBC, torque: v.torque || TBC })) }));
page('compare.html', {
  title: 'Compare Variants', desc: 'Compare Mitsubishi variants in Libya side by side: engine, transmission, drivetrain and body.', active: 'cars', hdr: 'solid',
  body: `
<section class="ph ph--forge" id="cmpHero">
  <div class="fg__trail" id="fgTrail" aria-hidden="true">${["story-l200.webp","story-outlander.webp","story-xpander.webp","story-destinator.webp","l200-ext.webp","l200-hill.webp","drive.webp","web/Destinator.jpg","web/Sportero.jpg"].map(f => `<div class="fg__item">${img('assets/img/' + f, '', 216, 270, 'loading="eager" draggable="false"')}</div>`).join('')}</div>
  <h2 class="fg__mid" data-a>We don&rsquo;t just sell cars<br>We help you choose</h2>
  <div class="fg__foot wrap">
    ${split('h1', 'big ph__title', 'Compare <span class="accent">variants</span>')}
    <p class="fg__lede" data-a>Choose up to four vehicles or variants and see exactly what changes, side by side.</p>
  </div>
</section>
<section class="cmp sec sec--paper" id="compare" aria-label="Vehicle comparison">
  <div class="wrap">
    <div class="cmp__bar"><div><h2 class="cmp__t">Variant comparison</h2><p class="lede">Pick a vehicle, then press + to add up to four of its variants side by side.</p></div>
      <label class="tog"><input type="checkbox" id="cmpDiffOnly"><span>Display the differences only</span></label></div>
    <div class="cmp__wrap"><div class="cmp__grid" id="cmpTable"></div></div>
    <p class="cmp__none" id="cmpNone" hidden>No confirmed differences between the selected vehicles.</p>
    <p class="note" data-a>Only confirmed specifications are compared. &ldquo;${TBC}&rdquo; means the figure is being confirmed.</p>
  </div>
</section>
${ctaBand({ title: 'Found your variant?', text: 'Tell us which one you prefer and we will take it from there.', imgSrc: 'assets/img/drive.webp' })}`,
  after: `<script>window.MMK_COMPARE=${JSON.stringify(compareData)};</script>
<script src="js/trail.js?v=${ASSET_V}"></script>`
});

/* ======================================================================== PARTS ===== */
page('parts.html', {
  title: 'Genuine Mitsubishi Parts', desc: '100% genuine Mitsubishi parts and accessories for all vehicles supplied by Middle East Group in Libya.', active: 'parts', bodyClass: 'pg-parts',
  body: `
<section class="ph ph--parts">
  <div class="ph__bg" data-parallax data-reveal-bg>${img('assets/img/parts-bg.jpg', '', 1920, 1080).replace('loading="lazy"', 'loading="eager"')}</div><div class="ph__shade"></div>
  <div class="wrap ph__in">${eyebrow('Spare parts')}${split('h1', 'big ph__title', 'Genuine Mitsubishi <span class="accent">Parts</span>')}
    <div class="ph__row"><p class="lede" data-a>Keep your Mitsubishi performing at its best, with parts engineered to Mitsubishi&rsquo;s exact quality standards.</p><div data-a>${btn('#parts-form', 'Request a part')}</div></div></div>
</section>

<section class="intro sec sec--paper" aria-labelledby="pi-t">
  <div class="wrap intro__grid">
    ${clip('assets/img/web/L200-SCDC.jpg', 'Mitsubishi L200 pickup', 501, 579, 'intro__img')}
    <div>${eyebrow('Genuine parts')}${split('h2', 'h2', 'Built for your vehicle, tested to Mitsubishi standards', 'id="pi-t"')}
      <p class="lede" data-a>When you need service or repair you can purchase Mitsubishi parts with confidence. Our parts department provides 100% genuine parts for all the vehicles supplied by Middle East Group.</p>
      <div class="intro__facts" data-a><div><b data-count="100" data-suffix="%">100%</b><span>Genuine parts</span></div><div><b data-count="25000">25,000</b><span>sq m central warehouse</span></div></div></div>
  </div>
</section>

<section class="stmt stmt--red" aria-label="Quality"><div class="wrap"><p class="eyebrow" data-a>Quality you can fit</p><p class="stmt__t" data-scrub>Every genuine part is engineered to meet Mitsubishi’s exact quality standards, ensuring a precise fit and long-lasting durability. Whether it’s routine maintenance or a major repair, our experienced team is ready to provide the right parts and expert support.</p></div></section>

<section class="pcomp sec sec--ink" aria-labelledby="pc-t">
  <div class="wrap pcomp__head">${eyebrow('Parts &amp; accessories')}${split('h2', 'h2 h2--xl', 'Everything your car needs', 'id="pc-t"')}</div>
  <div class="pcomp__stage" data-pstage>
    <ul class="pcomp__list">${PARTS.map((p, i) => `<li><button type="button" data-p="${i}" aria-pressed="${i === 0}"><span>0${i + 1}</span><b>${p.n}</b><small>${p.d}</small></button></li>`).join('')}</ul>
    <div class="pcomp__view" aria-live="polite">${PARTS.map((p, i) => `<figure data-pv="${i}"${i ? '' : ' class="is-on"'}>${img(p.img, p.n, 600, 600)}</figure>`).join('')}<div class="pcomp__glow" aria-hidden="true"></div></div>
  </div>
</section>

<section class="ben sec sec--paper" aria-labelledby="bn-t">
  <div class="wrap">${eyebrow('Why genuine')}${split('h2', 'h2 h2--xl', 'Benefits of genuine parts', 'id="bn-t"')}
    <ol class="ben__list">
      <li data-a><span>01</span><h3>Precise fit</h3><p>Engineered to Mitsubishi&rsquo;s exact standards so each part fits your vehicle as intended.</p></li>
      <li data-a><span>02</span><h3>Lasting durability</h3><p>Built to perform for years, so you can drive with confidence.</p></li>
      <li data-a><span>03</span><h3>Performance and safety</h3><p>Genuine parts maintain the performance, safety and reliability of your vehicle.</p></li>
      <li data-a><span>04</span><h3>Expert support</h3><p>Our experienced team helps you find the right part, from routine maintenance to a major repair.</p></li>
    </ol></div>
</section>

<section class="pform sec sec--graphite" id="parts-form" aria-labelledby="pf-t">
  <div class="wrap pform__grid">
    <div>${eyebrow('Parts enquiry')}${split('h2', 'h2', 'Request a part', 'id="pf-t"')}<p class="lede" data-a>Tell us what you need and our parts team will get back to you.</p>
      <ul class="clist" data-a><li>${ic('phone')}<a href="tel:+218925818264">+218 925 818 264</a></li><li>${ic('mail')}<a href="mailto:parts@middleeastgrp.com">parts@middleeastgrp.com</a></li></ul></div>
    ${form('Parts', baseFields('pp-') + field('pp-vehicle', 'Vehicle model', 'select', { opts: vehicleOpts }) + field('pp-part', 'Part requirement', 'text', { ph: 'e.g. cabin air filter' }) + field('pp-message', 'Message', 'textarea', { wide: 1, rows: 3 }), 'Send part enquiry')}
  </div>
</section>
${ctaBand({ title: 'Need advice on a part?', text: 'Our parts team is ready to help you find the right fit.', imgSrc: 'assets/img/story-l200.webp', href: 'contact.html', label: 'Contact parts team' })}`
});

/* ======================================================================== FLEET ===== */
page('fleet.html', {
  title: 'Fleet Solutions', desc: 'Fleet solutions from Mitsubishi Motors Libya: tailored business plans, the right vehicle for your business and help financing your fleet.', active: 'fleet', bodyClass: 'pg-fleet',
  body: `
<section class="ph ph--fleet">
  <div class="ph__bg" data-parallax>${img('assets/img/dev-dunes-single-cab.webp', 'Black Mitsubishi L200 single cab kicking up dust in the mountains', 1942, 809).replace('loading="lazy"', 'loading="eager"')}</div><div class="ph__shade"></div>
  <div class="wrap ph__in ph__in--end">${eyebrow('Fleet solutions')}${split('h1', 'big ph__title', 'Driving your business <span class="accent">further</span>')}
    <div class="ph__row"><p class="lede" data-a>Whether there&rsquo;s just one employee in your company or 500, there is something in the range to suit.</p><div data-a>${btn('#fleet-form', 'Start your enquiry')}</div></div></div>
</section>

<section class="fsv fsv--stack sec sec--paper" aria-labelledby="fs-t">
  <div class="wrap">${eyebrow('How we help')}${split('h2', 'h2 h2--xl', 'Fleet service', 'id="fs-t"')}
    <div class="fsv__grid">
      <article data-a><span>01</span><h3>Tailored business solutions</h3><p>Our hand-picked fleet professionals bring experience, know-how and service skills, with expert knowledge of every car and finance option, plus personalised plans and exclusive deals.</p></article>
      <article data-a><span>02</span><h3>The right car for your business</h3><p>Whether you need a hatchback, SUV, pickup truck or electric car, the team is trained to help you find the best vehicles to create your ideal fleet.</p></article>
      <article data-a><span>03</span><h3>Finance your fleet</h3><p>The team will guide you through the options to find the best way to finance your fleet, so the whole experience stays simple.</p></article>
    </div></div>
</section>

<section class="ffv sec sec--ink" aria-labelledby="ff-t">
  <div class="wrap sec-head"><div>${eyebrow('Featured fleet vehicles')}${split('h2', 'h2', 'Choose your fleet', 'id="ff-t"')}</div><div class="ctrl2" data-a><button type="button" data-prev aria-label="Previous">${ic('arrow-left')}</button><button type="button" data-next aria-label="Next">${ic('arrow-right')}</button></div></div>
  <div class="ffv__rail" data-drag data-cursor="Drag"><ul>${['l200', 'outlander', 'xpander', 'destinator'].map(s => { const m = model(s); return `<li class="fcard" style="--ac:${m.accent}"><a href="${s}.html"><figure>${img(m.hero, m.name, 1200, 700)}</figure><div><span>${m.kind}</span><h3>${m.name}</h3><p>${m.tag}</p><em>Explore Model ${ic('arrow-right')}</em></div></a></li>`; }).join('')}</ul></div>
</section>

<section class="pform sec sec--graphite" id="fleet-form" aria-labelledby="ft-t">
  <div class="wrap pform__grid">
    <div>${eyebrow('Fleet enquiry')}${split('h2', 'h2', 'Start your fleet enquiry', 'id="ft-t"')}<p class="lede" data-a>Tell us about your business and what you need.</p></div>
    ${form('Fleet', field('fl-company', 'Company name', 'text', { auto: 'organization' }) + baseFields('fl-') + field('fl-size', 'Fleet size', 'text', { ph: 'e.g. 10 vehicles' }) + field('fl-vehicle', 'Vehicle type', 'select', { opts: vehicleOpts }) + field('fl-message', 'Message', 'textarea', { wide: 1, rows: 3 }), 'Send fleet enquiry')}
  </div>
</section>
${ctaBand({ title: 'The right car for your business', text: 'Talk to the fleet team about the vehicles that fit your work.', imgSrc: 'assets/img/story-l200.webp' })}`
});

/* ======================================================================== ABOUT ===== */
page('about.html', {
  title: 'About Us', desc: 'Middle East Group is one of Libya\'s leading automobile distributors, associated with Mitsubishi Motors Corporation for more than 25 years.', active: 'about',
  body: `
<section class="ph ph--about">
  <div class="wrap ph__in">${eyebrow('About us &middot; Distributors over 25 years')}${split('h1', 'big ph__title', 'More than <span class="accent">25 years</span> with Mitsubishi')}</div>
  <div class="ph__layers" aria-hidden="true"><figure data-clip>${img('assets/img/dev-lineup.webp', 'Mitsubishi L200, Xforce and L200 single cab on a mountain road at sunset', 1942, 809).replace('loading="lazy"', 'loading="eager"')}</figure></div>
</section>

<section class="biz sec sec--paper" aria-labelledby="bz-t">
  <div class="wrap biz__grid">
    <div>${eyebrow('Our business')}${split('h2', 'h2', 'A leading automobile distributor in Libya', 'id="bz-t"')}</div>
    <div><p class="lede" data-a>Middle East Group is one of Libya&rsquo;s leading automobile distributors today, became associated with Mitsubishi Motors Corporation for more than 25 years.</p>
      <div data-a>${btn('vehicles.html', 'Explore vehicles')}</div></div>
  </div>
  <ul class="stats wrap">
    <li data-a><b data-count="25">25</b><span>Years creating innovative vehicles</span></li>
    <li data-a><b data-count="100" data-suffix="%">100%</b><span>Genuine Mitsubishi parts and accessories</span></li>
    <li data-a><b>24/7</b><span>Customer support and assistance</span></li>
    <li data-a><b data-count="25000">25,000</b><span>sq m central parts warehouse</span></li>
  </ul>
</section>

<section class="stmt" aria-label="Our offer"><div class="wrap"><p class="eyebrow" data-a>What we offer</p><p class="stmt__t" data-scrub>Middle East Group offers an unbeaten choice of Mitsubishi passenger cars, SUVs and commercial vehicles, backed by professional customer service and a growing network of hi-tech service centres.</p></div></section>

<section class="hist" data-hs aria-labelledby="hi-t">
  <div class="hs__pin">
    <div class="wrap hs__head">${eyebrow('Our story')}${split('h2', 'h2', 'Our history', 'id="hi-t"')}<p class="hs__count"><b data-hs-now>01</b> / 06</p></div>
    <div class="hs__track hs__track--tl" data-hs-track>
      <article class="tl"><i></i><p class="hs__k">1976</p><h3>A founder&rsquo;s first venture</h3><p>Our Founder, a pioneer and a visionary in business, started his business venture with a humble background in the construction industry.</p></article>
      <article class="tl"><i></i><p class="hs__k">1977</p><h3>Middle East Group is established</h3><p>Established with its financial headquarters in Dubai, the group grew into one of the leading and respected business houses in Libya.</p></article>
      <article class="tl"><i></i><p class="hs__k">Heritage</p><h3>Associated with Mitsubishi Motors Corporation for more than 25 years</h3><p>Middle East Group became associated with Mitsubishi Motors Corporation and has been creating innovative vehicles for Libya for more than 25 years.</p></article>
      <article class="tl"><i></i><p class="hs__k">Distribution</p><h3>One of Libya&rsquo;s leading distributors</h3><p>An unbeaten choice of Mitsubishi passenger cars, SUVs and commercial vehicles.</p></article>
      <article class="tl"><i></i><p class="hs__k">Parts</p><h3>A central parts warehouse</h3><p>Fully automated and air-conditioned, covering some 25,000 sq meters, the highest parts facility in the North Africa Region.</p></article>
      <article class="tl"><i></i><p class="hs__k">Service</p><h3>A growing service network</h3><p>Professional customer service and a growing network of hi-tech service centres.</p></article>
    </div>
    <div class="hs__bar" aria-hidden="true"><i data-hs-bar></i></div>
  </div>
</section>

<section class="grp sec sec--ink" aria-labelledby="gp-t">
  <div class="grp__ghost" aria-hidden="true">1977</div>
  <div class="wrap grp__grid">
    <div class="grp__copy">${eyebrow('The group')}${split('h2', 'h2 h2--xl', 'Middle East <span class="accent">Group</span>', 'id="gp-t"')}
      <p class="lede" data-a>Middle East Group proudly represents Mitsubishi Motors in Libya. Established in 1977 with financial headquarters in Dubai, we are one of the leading and respected business houses in Libya.</p>
      <p data-a>Our Founder is a pioneer and a visionary in business. The group has expanded into a range of sectors, each built on the same market leadership.</p>
      <blockquote class="grp__quote" data-a>The Middle East Group family may be diverse, but is united by a shared theme of opening up a world of opportunities to the people who work and associate with us.</blockquote>
    </div>
    <ul class="grp__sectors" aria-label="Business sectors"><li data-a>Automotive</li><li data-a>Industrial Equipment</li><li data-a>Oil and Gas</li><li data-a>Insurance</li><li data-a>Leasing and Rental</li><li data-a>Banking &amp; Finance</li><li data-a>Education</li><li data-a>General Trading</li><li data-a>Agriculture</li></ul>
  </div>
</section>

<section class="why2 sec sec--ink" aria-labelledby="wy-t">
  <div class="wrap">${eyebrow('Why Mitsubishi Motors Libya')}${split('h2', 'h2 h2--xl', 'What drives us', 'id="wy-t"')}
    <ul class="why2__list">
      <li data-a><span>01</span><h3>Innovative engineering</h3><p>Mitsubishi combines advanced engineering, intelligent technology, and reliable performance to deliver a confident driving experience.</p></li>
      <li data-a><span>02</span><h3>Versatile vehicle lineup</h3><p>From compact cars and family SUVs to powerful pickups, Mitsubishi offers vehicles designed for every lifestyle and adventure.</p></li>
      <li data-a><span>03</span><h3>Proven reliability</h3><p>Built with exceptional quality and durability, Mitsubishi vehicles are engineered to perform reliably for years to come.</p></li>
      <li data-a><span>04</span><h3>Dedicated customer care</h3><p>Our experienced team is committed to providing outstanding service, from vehicle selection to comprehensive after-sales support.</p></li>
    </ul></div>
</section>

<section class="dealer" aria-labelledby="dl-t">
  <div class="dealer__bg" data-parallax>${img('assets/img/dev-bridge-suv.webp', 'Red Mitsubishi SUV driving across an iron bridge', 1942, 809)}</div><div class="dealer__shade"></div>
  <div class="wrap dealer__in">${eyebrow('Authorized distributor')}${split('h2', 'big dealer__t', 'Leading Mitsubishi <span class="accent">dealer</span> in Libya', 'id="dl-t"')}
    <p class="lede" data-a>Middle East Group is the authorized distributor of Mitsubishi Motors in Libya, delivering trusted vehicles and exceptional customer service.</p>
    <p data-a>We have proudly served customers with a commitment to quality, genuine Mitsubishi vehicles, expert after-sales support, and modern showroom and service facilities.</p>
    <div class="dealer__cta" data-a>${btn('vehicles.html', 'Explore vehicles')} ${btn('contact.html', 'Contact us', 'btn--line')}</div></div>
</section>

<section class="fac sec sec--paper" aria-labelledby="fc-t">
  <div class="wrap">${eyebrow('Our facility')}${split('h2', 'h2', 'Visit us in Tripoli', 'id="fc-t"')}</div>
  <div class="fac__rail" data-drag data-cursor="Drag">${[1, 2, 3, 4, 5].map(n => `<figure class="gal__i">${img('assets/img/web/facility' + n + '.jpeg', 'Mitsubishi showroom and facility in Libya', 1296, 864)}</figure>`).join('')}</div>
</section>

<section class="faq sec sec--paper" aria-labelledby="fq-t">
  <div class="wrap faq__grid">
    <div>${eyebrow('Genuine parts')}${split('h2', 'h2', 'Frequently asked <span class="accent">questions</span>', 'id="fq-t"')}<p class="lede" data-a>Quick answers about Mitsubishi Genuine Parts. Need more help? Our parts team is ready.</p><div data-a>${btn('parts.html', 'Spare parts', 'btn--ghost')}</div></div>
    <div class="faq__list"><details data-a><summary>Why should I choose Mitsubishi Genuine Parts over aftermarket parts?</summary><p>Mitsubishi Genuine Parts are designed to meet factory specifications, ensuring optimal performance, reliability, and long-term durability for your vehicle.</p></details><details data-a><summary>How can I identify the correct genuine part for my Mitsubishi?</summary><p>Simply provide your vehicle&rsquo;s VIN or model details, and our parts specialists will help you find the exact part you need.</p></details><details data-a><summary>Are Mitsubishi Genuine Parts covered by a warranty?</summary><p>Yes. Genuine Mitsubishi Parts are backed by the manufacturer&rsquo;s warranty, giving you added confidence and peace of mind.</p></details><details data-a><summary>Can I order Mitsubishi Genuine Parts if they are not currently in stock?</summary><p>Yes. If a required part is unavailable, our team can arrange a special order and notify you as soon as it arrives.</p></details></div>
  </div>
</section>
${ctaBand({ title: 'Let’s talk cars', text: 'Visit our team in Tripoli or get in touch online.', imgSrc: 'assets/img/web/facility5.jpeg' })}`
});

/* ======================================================================== MEDIA / BLOG / ARTICLE ===== */
const card = (a, kind) => `<li class="ncard" data-a><a href="article.html?id=${a.id}&amp;k=${kind}"><figure>${img(a.img, a.title, 600, 400)}</figure><p class="ncard__m"><span>${a.cat}</span>${a.date ? `<time>${a.date}</time>` : ''}</p><h3>${a.title}</h3><em>Read more ${ic('arrow-right')}</em></a></li>`;
const feat = (a, kind) => `<article class="featn"><a href="article.html?id=${a.id}&amp;k=${kind}">${clip(a.img, a.title, 1200, 800, 'featn__img')}<div><p class="ncard__m" data-a><span>Featured</span>${a.date ? `<time>${a.date}</time>` : ''}</p>${split('h2', 'h2', a.title)}<p class="lede" data-a>${a.ex}</p><em class="btn btn--solid" data-a>Read more ${ic('arrow-right')}</em></div></a></article>`;
page('media.html', {
  title: 'News & Events', desc: 'News and events from Mitsubishi Motors Libya.', active: 'media', hdr: 'solid',
  body: `
<section class="ph ph--editorial"><div class="wrap ph__in">${eyebrow('Media')}${split('h1', 'big ph__title', 'News &amp; <span class="accent">Events</span>')}<p class="lede" data-a>What&rsquo;s new at Mitsubishi.</p></div></section>
<section class="news sec sec--paper"><div class="wrap">
  ${feat(NEWS[0], 'news')}
  <div class="sec-head sec-head--sp"><h2 class="h2" data-a>Latest news</h2><div data-a>${btn('blog.html', 'Read the blog', 'btn--ghost')}</div></div>
  <ul class="ngrid">${NEWS.slice(1).map(a => card(a, 'news')).join('')}</ul>
  <div class="sec-head sec-head--sp"><h2 class="h2" data-a>From the blog</h2><div data-a>${btn('blog.html', 'All articles', 'btn--ghost')}</div></div>
  <ul class="ngrid">${BLOG.slice(-3).map(a => card(a, 'blog')).join('')}</ul>
</div></section>
${ctaBand({ title: 'Stay in the loop', text: 'Ask our team about the latest offers and vehicles.', imgSrc: 'assets/img/dev-forest.webp' })}`
});
page('blog.html', {
  title: 'Blog', desc: 'Articles from Mitsubishi Motors Libya.', active: 'media', hdr: 'solid',
  body: `
<section class="ph ph--editorial ph--blog"><div class="wrap ph__in">${eyebrow('Blog')}${split('h1', 'big ph__title', 'Latest <span class="accent">Articles</span>')}<p class="lede" data-a>Guides, ideas and stories for Mitsubishi drivers in Libya.</p></div></section>
<section class="news sec sec--paper"><div class="wrap">
  ${feat(BLOG[0], 'blog')}
  <div class="sec-head sec-head--sp"><h2 class="h2" data-a>More articles</h2></div>
  <ul class="ngrid">${BLOG.slice(1).map(a => card(a, 'blog')).join('')}</ul>
</div></section>
${ctaBand({ title: 'Have a question?', text: 'Our team is happy to help you choose.', imgSrc: 'assets/img/story-outlander.webp' })}`
});
page('article.html', {
  title: 'Article', desc: 'News and articles from Mitsubishi Motors Libya.', active: 'media', hdr: 'solid',
  body: `
<article class="art" id="art">
  <header class="art__hero"><div class="wrap"><a class="back" href="media.html" id="artBack">${ic('arrow-left')} Back</a><p class="eyebrow" id="artMeta" data-a></p><h1 class="big art__t" id="artTitle">Article</h1></div></header>
  <div class="art__figure wrap"><figure class="clip" data-clip id="artFig"></figure></div>
  <div class="art__body wrap"><div class="prose" id="artBody"></div></div>
</article>
<section class="strip strip--light"><div class="wrap strip__in"><div>${eyebrow('Keep reading')}<h2 class="h2">More from Mitsubishi</h2></div><div>${btn('media.html', 'News &amp; events')} ${btn('blog.html', 'Blog', 'btn--ghost')}</div></div></section>`,
  after: `<script>window.MMK_ARTICLES=${JSON.stringify({ news: NEWS, blog: BLOG })};</script>`
});

/* ======================================================================== CONTACT ===== */
const office = o => `<article class="office2" data-a><h3>${o.name}</h3><address>${o.lines.join('<br>')}</address><ul>${o.phones.map(p => `<li>${ic('phone')}<a href="tel:${p[1]}">${p[0]}</a></li>`).join('')}${o.emails.map(e => `<li>${ic('mail')}<a href="mailto:${e}">${e}</a></li>`).join('')}</ul><a class="office2__map" href="${o.map}" target="_blank" rel="noopener">${ic('map-pin')} View on map</a></article>`;
page('contact.html', {
  title: 'Contact Us', desc: 'Contact Mitsubishi Motors Libya: head office, phone numbers, email and enquiry form.', active: 'contact', hdr: 'solid',
  body: `
<section class="ph ph--contact"><div class="wrap ph__in">${eyebrow('Contact us')}${split('h1', 'big ph__title', 'Let&rsquo;s talk <span class="accent">cars</span>')}<p class="lede" data-a>We would love to hear from you. Visit, call or send us a message.</p></div></section>
<section class="cn sec sec--paper" aria-labelledby="cn-t"><div class="wrap">
  <h2 class="sr" id="cn-t">Offices and enquiry form</h2>
  <div class="cn__three">
    <div class="cn__box">${office(OFFICES.libya)}<div class="cn__soc" data-a><h3>Follow us</h3>${social()}<a class="wa" href="#" data-wa target="_blank" rel="noopener">${ic('whatsapp')}Chat on WhatsApp</a></div></div>
    <div class="cn__box cn__form"><h2 class="h2" data-a>Make an enquiry</h2>${form('Contact', baseFields('ct-') + field('ct-vehicle', 'Vehicle of interest', 'select', { opts: vehicleOpts }) + field('ct-message', 'Message', 'textarea', { wide: 1, rows: 4 }))}</div>
  </div>
</div></section>
<section class="mapx"><iframe title="Mitsubishi Motors Libya office location" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Swani+Road+Al+Fallah+Street+Tripoli+Libya&amp;output=embed"></iframe></section>`
});

/* ======================================================================== BROCHURES ===== */
page('brochures.html', {
  title: 'Explore Our Brochures', desc: 'Download Mitsubishi brochures for the Destinator, L200, Outlander and Xpander.', active: 'cars',
  body: `
<section class="ph ph--bro"><div class="drift" aria-hidden="true"><i></i><i></i></div><div class="wrap ph__in">${eyebrow('Brochures')}${split('h1', 'big ph__title', 'Explore Our <span class="accent">Brochures</span>')}<p class="lede" data-a>Everything you need to know about each vehicle, in one place.</p></div></section>
<section class="brl sec sec--ink"><div class="wrap">
  <ul class="brl__list">${ORDER.map((s, i) => { const m = model(s); return `<li class="brc" style="--ac:${m.accent}" data-a><div class="bro__mock" data-tilt><div class="bro__cover">${img(m.hero, '', 700, 900)}<span class="bro__logo"><img src="assets/img/logo.svg" alt="" width="60" height="42"></span><b>${m.name}</b><small>${m.kind}</small></div></div><h2>${m.name}</h2><p>${m.tag}</p><a class="btn btn--solid" href="contact.html?vehicle=${encodeURIComponent(m.name)}" data-brochure="${s}" data-label="Download brochure">Request brochure ${ic('download')}</a></li>`; }).join('')}</ul>
  <p class="note note--dark" data-a>Brochure downloads are being prepared. Request a brochure from our team in the meantime. Specifications and equipment may vary by trim; please confirm details with our showroom team.</p>
</div></section>
${ctaBand({ title: 'Talk to the team', text: 'Questions about a model? We are here to help.', imgSrc: 'assets/img/web/facility2.jpeg' })}`
});

/* ======================================================================== 404 ===== */
/* ======================================================================== LEGAL ===== */
const legalPara = x => typeof x === 'string' ? `<p>${esc(x)}</p>` : `<ul>${x.list.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
const legalSection = sec => `<h2 data-a>${sec.h}</h2>${sec.p.map(legalPara).join('')}`;
LEGAL.forEach(L => page(L.file, {
  title: L.title, desc: L.desc, active: '', hdr: 'solid',
  body: `
<section class="ph ph--editorial"><div class="wrap ph__in">${eyebrow('Legal information')}${split('h1', 'big ph__title', L.title)}<p class="lede" data-a>${L.intro}</p></div></section>
<section class="legal sec sec--paper"><div class="wrap">
  <div class="legal__body">
    ${L.sections.map(legalSection).join('')}
    <nav class="legal__more" aria-label="Legal information"><h2>Legal information</h2><ul>${LEGAL.filter(o => o !== L).map(o => `<li><a href="${o.file}">${o.title}</a></li>`).join('')}</ul></nav>
  </div>
</div></section>`
}));

page('404.html', {
  title: 'Page not found', desc: 'The page you are looking for could not be found.', active: '', hdr: 'solid',
  body: `
<section class="nf">
  <div class="drift" aria-hidden="true"><i></i><i></i></div>
  <p class="nf__no" aria-hidden="true"><span>4</span><span class="nf__o"><i></i></span><span>4</span></p>
  <div class="wrap nf__in">${eyebrow('Error 404')}<h1 class="h2 nf__t" data-split>Wrong turn</h1><p class="lede" data-a>We couldn&rsquo;t find the page you were looking for. It may have moved, or the address may be incorrect.</p>
    <div class="nf__cta" data-a>${btn('index.html', 'Back to Home')}${btn('vehicles.html', 'Explore vehicles', 'btn--line')}</div></div>
  <div class="nf__road" aria-hidden="true"><figure class="nf__car">${img(model('xpander').cut, '', 520, 182, 'loading="eager"')}</figure><i></i></div>
</section>`
});
