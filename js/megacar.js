/* Cars mega menu: hover a car and it rolls slowly forward (wheels turning), eases to a stop and the brake lights come on.
 * Wheel discs reuse the car photo (same technique as the vehicle showcase); motion + wheel spin share one CSS transition so they stay in sync. */
(() => {
  'use strict';
  const grid = document.getElementById('megaGrid'); if (!grid) return;
  const K = 0.84; // rotating disc covers rim + inner tyre, outer tyre stays static
  // key = image file; ar = height/width; w = [frontX, rearX, frontCy, radius, rearCy]; l = brake lamp [cx, cy, width, height] (fractions of the image), p = lamp outline as polygon points in % of that box (traced from the real tail-lamp shape)
  const CARS = {
    'destinator-m-line': { ar: .444, w: [.200, .782, .744, .0715, .730], l: [.9246, .414, .032, .144], p: '0 0,60 4,100 30,100 80,75 100,40 100,30 50' },
    'l200-glx-diesel': { ar: .426, w: [.178, .739, .727, .0695, .735], l: [.937, .464, .035, .177], p: '8 0,90 0,100 12,100 100,0 100,10 40' },
    'outlander-sport-h-line': { ar: .382, w: [.191, .785, .770, .0788, .770], l: [.929, .333, .086, .075], p: '0 10,100 0,100 85,80 100,0 60' },
    'pajero-sport': { ar: .3925, w: [.191, .7716, .7506, .0816, .7506], l: [.935, .261, .08, .14], p: '0 51,62 2,96 45,100 96,56 78,2 60' },
    'xpander': { ar: .3505, w: [.2305, .7695, .773, .0625, .758], l: [.882, .244, .051, .168], p: '10 0,40 5,100 70,95 100,60 95,0 30' }
  };
  const DIST = 0.12; // roll distance as a fraction of the car's width

  function enhance(box) {
    const img = box.querySelector('img'); if (!img || box.querySelector('.mcar')) return;
    const m = (((img.getAttribute('src') || '').match(/([^/]+)\.webp/) || [])[1] || '').replace(/-hd$/, ''), c = CARS[m]; if (!c) return;
    const [fx, rx, cyF, r, cyR] = c.w, s = 2 * r * K, hr = c.ar;
    const wrap = document.createElement('span'); wrap.className = 'mcar';
    wrap.style.setProperty('--roll', (-DIST * 100) + '%');
    wrap.style.setProperty('--spin', (-(DIST / r) * 57.2958).toFixed(1) + 'deg');
    img.replaceWith(wrap); wrap.appendChild(img);
    [[fx, cyF], [rx, cyR]].forEach(([cx, cy]) => {
      const w = document.createElement('i'); w.className = 'mcar__wheel'; w.setAttribute('aria-hidden', 'true');
      w.style.cssText = 'left:' + cx * 100 + '%;top:' + cy * 100 + '%;width:' + s * 100 + '%;background-image:url(' + img.getAttribute('src') + ');background-size:' + 100 / s + '% auto;background-position:' + (s / 2 - cx) / (s - 1) * 100 + '% ' + (s / 2 - cy * hr) / (s - hr) * 100 + '%';
      wrap.appendChild(w);
    });
    const [lx, ly, lw, lh] = c.l, lamp = document.createElement('i');
    lamp.className = 'mcar__lamp'; lamp.setAttribute('aria-hidden', 'true');
    lamp.style.cssText = 'left:' + lx * 100 + '%;top:' + ly * 100 + '%;width:' + lw * 100 + '%;height:' + lh * 100 + '%';
    const lit = document.createElement('i'); lit.style.clipPath = 'polygon(' + c.p.split(',').map(q => q.trim().split(' ').map(v => v + '%').join(' ')).join(',') + ')';
    lamp.appendChild(lit); wrap.appendChild(lamp);
  }
  const run = () => grid.querySelectorAll('.mcard__img').forEach(enhance);
  run();
  new MutationObserver(run).observe(grid, { childList: true });
})();
