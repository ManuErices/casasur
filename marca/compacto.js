const { chromium } = require('playwright'); const { svg } = require('./simbolos.js'); const fs = require('fs');
const L = '#F2B33D', B = '#0F2A22', M = '#FBF6EC';
const compacto = (sup, color, txt) => `<div class="cmp"><div class="sym">${svg('C', color)}<span class="sup" style="color:${txt}">${sup}</span></div><div class="ll" style="color:${txt}">llave</div></div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=block" rel="stylesheet"><style>
body{margin:0;background:#EDE6D8;font-family:'Plus Jakarta Sans';padding:36px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.pan{border-radius:22px;height:300px;display:flex;align-items:center;justify-content:center}.o{background:${B}}.c{background:${M}}
.t{grid-column:span 1;font-weight:800;color:${B};font-size:20px;text-align:center;margin-top:-6px}
.lock{display:flex;align-items:center;gap:20px}.lock .s{width:64px}.bar{width:2px;height:84px;background:${L}55}.w{font-weight:800;font-size:40px;line-height:1.02;letter-spacing:-.02em;color:${M}}
.cmp{display:flex;flex-direction:column;align-items:center;gap:6px}.sym{position:relative;width:96px}.sup{position:absolute;left:92px;top:2px;font-weight:800;font-size:34px;letter-spacing:-.02em;line-height:1}
.ll{font-weight:800;font-size:40px;letter-spacing:-.02em;line-height:1}
</style></head><body>
<div class="pan o"><div class="lock"><div class="s">${svg('C', L)}</div><div class="bar"></div><div class="w">Primera<br>Llave</div></div></div>
<div class="pan o">${compacto('ra', L, M)}</div>
<div class="pan o">${compacto('ª', L, M)}</div>
<div class="t">Logo principal</div><div class="t">Compacto “1ra llave”</div><div class="t">Compacto “1ª llave”</div>
</body></html>`;
fs.writeFileSync('compacto.html', html);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 420 }, deviceScaleFactor: 2 });
  await p.goto('file://' + __dirname + '/compacto.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
  await p.screenshot({ path: 'compacto.png', fullPage: true }); await b.close(); })();
