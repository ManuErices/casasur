const { chromium } = require('playwright'); const { svg } = require('./simbolos.js'); const fs = require('fs');
const L = '#F2B33D', B = '#0F2A22', M = '#FBF6EC';
const fila = (k, nota) => `
<div class="fila"><div class="k">${k}</div>
 <div class="pan osc"><div class="lock"><div class="s">${svg(k, L)}</div><div class="bar" style="background:${L}55"></div><div class="w" style="color:${M}">Primera<br>Llave</div></div></div>
 <div class="pan cla"><div class="lock"><div class="s">${svg(k, B)}</div><div class="bar" style="background:${B}44"></div><div class="w" style="color:${B}">Primera<br>Llave</div></div></div>
 <div class="pan cla ic"><div class="app">${svg(k, L)}</div><div class="app sm">${svg(k, L)}</div><div class="fav">${svg(k, L)}</div></div>
 <p class="nota">${nota}</p></div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=block" rel="stylesheet"><style>
body{margin:0;background:#EDE6D8;font-family:'Plus Jakarta Sans';padding:36px}
.fila{display:grid;grid-template-columns:40px 1fr 1fr 300px;gap:16px;align-items:stretch;margin-bottom:22px}
.k{font:800 28px 'Plus Jakarta Sans';color:${B};align-self:center}
.pan{border-radius:20px;height:230px;display:flex;align-items:center;justify-content:center}
.osc{background:${B}}.cla{background:${M}}
.lock{display:flex;align-items:center;gap:22px}.s{width:74px}.bar{width:2px;height:96px}
.w{font-weight:800;font-size:44px;line-height:1.02;letter-spacing:-.02em}
.ic{gap:22px}.app{width:110px;height:110px;border-radius:26px;background:${B};display:flex;align-items:center;justify-content:center}.app svg{height:72%}
.app.sm{width:56px;height:56px;border-radius:14px}.fav{width:24px;height:24px;border-radius:6px;background:${B};display:flex;align-items:center;justify-content:center}.fav svg{height:80%}
.nota{grid-column:2/5;margin:-4px 0 0;color:#3a403e;font-size:16px;font-weight:700}
</style></head><body>
${fila('A', 'A · Fiel a tu propuesta 3: dos dientes limpios (ya no se lee una "E") y argolla más grande, visible incluso en el favicon.')}
${fila('B', 'B · Más esbelta: tres dientes escalonados como una llave real; más técnica y fina.')}
${fila('C', 'C · El hueco es un ojo de cerradura: el 1, la llave y la puerta de la casa en un solo signo.')}
</body></html>`;
fs.writeFileSync('preview.html', html);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 860 }, deviceScaleFactor: 2 });
  await p.goto('file://' + __dirname + '/preview.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
  await p.screenshot({ path: 'variantes-logo.png', fullPage: true }); await b.close(); })();
