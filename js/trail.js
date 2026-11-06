/* Compare hero: car photos trail the pointer; they also play a short intro along a gentle path and drift when idle.
   With reduced motion they sit still as a static spread. */
(function () {
  var host = document.getElementById('fgTrail'); if (!host) return;
  var hero = host.parentNode, items = [].slice.call(host.children), n = 0, last = null, lastT = -1e9, t0 = performance.now();
  function place(el, x, y) {
    var r = host.getBoundingClientRect();
    el.style.left = (x - r.left - el.offsetWidth / 2) + 'px';
    el.style.top = (y - r.top - el.offsetHeight / 2) + 'px';
  }
  function path(t) { var r = host.getBoundingClientRect(); return [r.left + r.width * (0.5 + 0.34 * Math.sin(t * 0.7)), r.top + r.height * (0.4 + 0.2 * Math.sin(t * 1.1 + 1))]; }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function (el, i) {
      var r = host.getBoundingClientRect(), a = i / items.length;
      place(el, r.left + r.width * (0.1 + 0.8 * a), r.top + r.height * (0.2 + 0.12 * ((i % 3) - 1)));
      el.style.opacity = 1; el.style.transform = 'rotate(' + ((i % 2 ? 1 : -1) * 3) + 'deg)';
    });
    return;
  }

  function drop(x, y, dx, dy) {
    var el = items[n++ % items.length], rt = ' rotate(' + Math.max(-6, Math.min(6, dx * 0.12)) + 'deg)';
    el.getAnimations().forEach(function (a) { a.cancel(); });
    place(el, x, y); el.style.zIndex = n;
    el.animate([
      { opacity: 0, transform: 'scale(.7)' + rt },
      { opacity: 1, transform: 'scale(1)' + rt, offset: 0.2 },
      { opacity: 1, transform: 'scale(1)' + rt, offset: 0.72 },
      { opacity: 0, transform: 'scale(.92) translateY(' + (dy > 0 ? 24 : -24) + 'px)' + rt }
    ], { duration: 1400, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  function move(x, y) {
    if (last && Math.hypot(x - last.x, y - last.y) < 100) return;
    drop(x, y, last ? x - last.x : 0, last ? y - last.y : 0);
    last = { x: x, y: y };
  }
  hero.addEventListener('pointermove', function (e) { lastT = performance.now(); move(e.clientX, e.clientY); });
  // intro: a quick run of cards along the path so the banner is never empty on load
  for (var k = 0; k < 7; k++) (function (k) { setTimeout(function () { if (performance.now() - lastT > 2500) { var p = path(k * 0.9); move(p[0], p[1]); } }, 300 + k * 220); })(k);
  (function loop() {
    var now = performance.now();
    if (now - lastT > 2500 && now - t0 > 2200) { var p = path((now - t0) / 1000); move(p[0], p[1]); }
    requestAnimationFrame(loop);
  })();
})();
