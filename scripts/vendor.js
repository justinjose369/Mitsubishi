// Copies runtime vendor files out of node_modules so the site runs with no build step.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const copy = (from, to) => { fs.mkdirSync(path.dirname(path.join(root, to)), { recursive: true }); fs.copyFileSync(path.join(root, from), path.join(root, to)); };
copy('node_modules/gsap/dist/gsap.min.js', 'vendor/gsap.min.js');
copy('node_modules/gsap/dist/ScrollTrigger.min.js', 'vendor/ScrollTrigger.min.js');
[['barlow-condensed', [500, 600, 700]], ['barlow', [400, 500, 600]]].forEach(([f, ws]) =>
  ws.forEach(w => copy(`node_modules/@fontsource/${f}/files/${f}-latin-${w}-normal.woff2`, `assets/fonts/${f}-${w}.woff2`)));
console.log('vendor files copied');
