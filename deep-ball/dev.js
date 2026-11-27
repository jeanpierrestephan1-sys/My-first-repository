// Local play-testing only: `npm run dev` then open http://localhost:3000 (rooms live in memory).
process.env.DEEPBALL_DEV = '1';
const http = require('http');
const fs = require('fs');
const path = require('path');
const handler = require('./api/game');

http.createServer((req, res) => {
  if (req.url.startsWith('/api/game')) {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      req.body = body;
      res.status = (c) => { res.statusCode = c; return res; };
      res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); };
      handler(req, res);
    });
    return;
  }
  const file = path.join(__dirname, 'public', path.normalize(req.url.split('?')[0]).replace(/^\/+/, ''));
  if (file.endsWith('.woff2') && fs.existsSync(file)) { res.setHeader('Content-Type', 'font/woff2'); return res.end(fs.readFileSync(file)); }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(fs.readFileSync(path.join(__dirname, 'public', 'index.html')));
}).listen(process.env.PORT || 3000, () => console.log('Deep Ball on http://localhost:' + (process.env.PORT || 3000)));
