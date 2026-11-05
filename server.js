// Zero-dependency static server:  npm start  ->  http://localhost:8080
const http = require('http'), fs = require('fs'), path = require('path');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.mp4':'video/mp4', '.woff2':'font/woff2', '.ico':'image/x-icon' };
const root = __dirname, port = process.env.PORT || 8080;
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root) || /node_modules|server\.js/.test(p)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (e, st) => {
    if (e || !st.isFile()) { return fs.readFile(path.join(root, '404.html'), (e2, b) => { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(e2 ? 'Not found' : b); }); }
    const type = types[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const range = req.headers.range;
    if (range) { // needed for video seeking
      const [s, en] = range.replace('bytes=', '').split('-');
      let start, end;
      if (s === '') { start = Math.max(0, st.size - +en); end = st.size - 1; }      // suffix range: last N bytes
      else { start = +s; end = en ? Math.min(+en, st.size - 1) : st.size - 1; }
      if (!(start >= 0) || !(end >= start) || start >= st.size) { res.writeHead(416, { 'Content-Range': 'bytes */' + st.size }); return res.end(); }
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res);
    } else { res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Cache-Control': 'public, max-age=3600' }); fs.createReadStream(file).pipe(res); }
  });
}).listen(port, () => console.log('Mitsubishi Motors Libya site: http://localhost:' + port));
