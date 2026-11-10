/* Builds scripts/sheet-specs.json (keyed by variant id) from "Mitsubishi Specs.xlsx". Usage: node scripts/import-sheet.js <parsed-sheet.txt> */
const fs = require('fs');
const t = fs.readFileSync(process.argv[2], 'utf8');
const rows = t.split(/\n(?=\d+\| )/).map(r => { const m = r.match(/^(\d+)\| ([\s\S]*)$/), o = {}; m[2].split(/ \| (?=[A-Z]{1,2}:)/).forEach(p => { const i = p.indexOf(':'); o[p.slice(0, i)] = p.slice(i + 1); }); return o; });
const FIX = [[/Tansmission/g, 'Transmission'], [/adjstable/g, 'adjustable'], [/pockdts/g, 'pockets'], [/botton/g, 'button'], [/infomration/g, 'information'], [/whith/g, 'with'], [/spakers/g, 'speakers'], [/puch /g, 'push '], [/hight/g, 'height'], [/^High constrast/, 'High contrast']];
const lines = s => { const seen = new Set(); return (s || '').replace(/\)(?=[A-Z])/g, ')\n').replace(/\. (?=[A-Z])/g, '\n').split(/\n/).map(l => l.replace(/^["\s]+|["\s]+$/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean).map(l => FIX.reduce((a, [re, to]) => a.replace(re, to), l)).filter(l => !seen.has(l) && seen.add(l)); };
/* sheet title -> site variant id */
const ID = [[/Destinator M Line/, 'destinator-m'], [/Destinator H Line/, 'destinator-h'], [/Destinator P Line/, 'destinator-p'], [/Outlander Sport M Line/, 'outlander-m'], [/Outlander Sport H Line/, 'outlander-h'], [/Outlander Sport P Line/, 'outlander-p'],
  [/L200 Sportero/, 'l200-sportero'], [/L200 4WD GL Petrol/, 'l200-gl-p'], [/L200 4WD GLS Petrol/, 'l200-gls-p'], [/L200 4WD GL Diesel Scabin/, 'l200-gls'], [/L200 2WD GL Diesel Dcabin/, 'l200-gl2'], [/L200 4WD GL Diesel Dcabin/, 'l200-gl4'], [/L200 4WD GLX Diesel Dcabin/, 'l200-glx']];
const out = {};
rows.slice(1).forEach(r => {
  const a = (r.A || '').replace(/\s+/g, ' '), hit = ID.find(([re]) => re.test(a)); if (!hit || !r.B) return;
  const eng = r.B.replace(/\s+/g, ' ').replace('PTRL', 'petrol').replace('DSL', 'diesel').replace(/ Engine/i, '').trim(), size = eng.split(' ')[0];
  const lists = { Safety: lines(r.L), Utility: lines(r.M), Interior: lines(r.N), Exterior: lines(r.O) };
  Object.keys(lists).forEach(k => { if (!lists[k].length) delete lists[k]; });
  out[hit[1]] = {
    facts: [
      ['Engine', size + ' ' + eng.slice(size.length).trim() + ', ' + (+r.D) + ' cylinders'], ['Displacement', Math.round(+r.C).toLocaleString('en-US') + ' cc'], ['Fuel', r.E.trim()], ['Fuel tank', r.F.trim().replace(/L$/, ' L')],
      ['Transmission', { AT: 'Automatic', MT: 'Manual' }[r.G.trim()] || r.G.trim()], ['Drive', r.H.trim()], ['Wheels', r.I.trim().replace(/\s+/g, ' ')], ['Steering position', r.J.trim()], ['Seats', String(+r.K)]
    ],
    lists
  };
});
fs.writeFileSync(__dirname + '/sheet-specs.json', JSON.stringify(out, null, 1));
console.log(Object.keys(out).map(k => k + ': ' + Object.values(out[k].lists).map(a => a.length).join('/')).join('\n'));
