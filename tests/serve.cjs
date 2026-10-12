const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
http.createServer((req, res) => {
  let requested;
  try { requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  requested = requested.replace(/^\/jvfaraco-portifolio\//, '/');
  const file = path.resolve(root, '.' + (requested === '/' ? '/index.html' : requested));
  if (!file.startsWith(root + path.sep) || requested.includes('/.')) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(4173, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4173/jvfaraco-portifolio/'));
