// Genera los archivos vectoriales de la marca Primera Llave (node marca/generar.mjs).
// Las letras se convierten a trazos con Instrument Serif (licencia OFL), la misma tipografía de los títulos del sitio. Así los SVG
// se ven idénticos en cualquier equipo, imprenta o programa de diseño.
import fs from 'node:fs';
import opentype from 'opentype.js';

const COLOR = { laton: '#F2B33D', bosque: '#0F2A22', marfil: '#FBF6EC' };
const fuente = opentype.loadSync(new URL('./fuente/InstrumentSerif-Regular.ttf', import.meta.url).pathname);
const r = (n) => Math.round(n * 100) / 100;

/**
 * Símbolo: el "1" que es una llave, con ojo de cerradura.
 * Una sola forma continua (sin piezas superpuestas). Remate del 1 a 45° con bordes paralelos.
 * Caja: x 12–88, y 6–146.
 */
const CUERPO = [
  'M40 6 H68 Q72 6 72 10',
  'V100 H86 Q88 100 88 102 V110 Q88 112 86 112 H72', // diente 1
  'V122 H82 Q84 122 84 124 V132 Q84 134 82 134 H72', // diente 2
  'V142 Q72 146 68 146 H44 Q40 146 40 142',
  'V38 L12 66 V34 Z', // remate del 1
].join(' ');
// Ojo de cerradura: círculo + ranura en un solo contorno (se resta con evenodd).
const yCorte = 29 + Math.sqrt(81 - 16);
const CERRADURA = `M60 ${r(yCorte)} L63 50 H49 L52 ${r(yCorte)} A9 9 0 1 1 60 ${r(yCorte)} Z`;
export const SIMBOLO = `${CUERPO} ${CERRADURA}`;
const CAJA = { x: 12, y: 6, w: 76, h: 140 };

/** Convierte texto a trazos con interletraje y kerning. */
function texto(str, x, y, size, tracking = -0.01) {
  const glyphs = fuente.stringToGlyphs(str);
  const escala = size / fuente.unitsPerEm;
  let cx = x;
  let d = '';
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, y, size).toPathData(2);
    const kern = i < glyphs.length - 1 ? fuente.getKerningValue(g, glyphs[i + 1]) : 0;
    cx += (g.advanceWidth + kern) * escala + (i < glyphs.length - 1 ? tracking * size : 0);
  });
  return { d, ancho: cx - x };
}
const alturaMayus = (size) => (fuente.tables.os2.sCapHeight / fuente.unitsPerEm) * size;
const alturaX = (size) => (fuente.tables.os2.sxHeight / fuente.unitsPerEm) * size;

const svg = (vb, cuerpo, titulo) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(r).join(' ')}" role="img" aria-label="${titulo}"><title>${titulo}</title>${cuerpo}</svg>\n`;
const simbolo = (color) => `<path fill-rule="evenodd" fill="${color}" d="${SIMBOLO}"/>`;

// --- Logo horizontal (oficial): símbolo | Primera / Llave ---
function horizontal(cSimbolo, cTexto, cBarra) {
  const S = 78, interlineado = 0.92;
  const cap = alturaMayus(S);
  const centro = CAJA.y + CAJA.h / 2;
  const base1 = centro + (cap - interlineado * S) / 2;
  const xBarra = CAJA.x + CAJA.w + 24;
  const xTexto = xBarra + 26;
  const l1 = texto('Primera', xTexto, base1, S);
  const l2 = texto('Llave', xTexto, base1 + interlineado * S, S);
  const ancho = xTexto + Math.max(l1.ancho, l2.ancho) - CAJA.x;
  const cuerpo = simbolo(cSimbolo)
    + `<rect x="${xBarra}" y="${r(centro - 52)}" width="2.5" height="104" fill="${cBarra}"/>`
    + `<path fill="${cTexto}" d="${l1.d}${l2.d}"/>`;
  return { svg: svg([CAJA.x, CAJA.y, ancho, CAJA.h], cuerpo, 'Primera Llave'), datos: { ancho, d: l1.d + l2.d, xBarra, yBarra: r(centro - 52) } };
}

// --- Logo compacto: 1ra / llave ---
function compacto(cSimbolo, cTexto) {
  const Sra = 54, Sll = 80;
  const ra = texto('ra', 80, CAJA.y + alturaX(Sra) + 2, Sra);
  const ll0 = texto('llave', 0, 0, Sll);
  const xll = CAJA.x + CAJA.w / 2 - ll0.ancho / 2 + 6;
  const asc = (fuente.charToGlyph('l').getBoundingBox().y2 / fuente.unitsPerEm) * Sll;
  const yll = CAJA.y + CAJA.h + 22 + asc;
  const ll = texto('llave', xll, yll, Sll);
  const minX = Math.min(CAJA.x, xll) - 2;
  const maxX = Math.max(80 + ra.ancho, xll + ll.ancho) + 2;
  const cuerpo = simbolo(cSimbolo) + `<path fill="${cTexto}" d="${ra.d}${ll.d}"/>`;
  return svg([minX, CAJA.y, maxX - minX, yll - CAJA.y + 2], cuerpo, 'Primera Llave');
}

// --- Escritura de archivos ---
const dir = new URL('../public/marca/', import.meta.url).pathname;
fs.mkdirSync(dir, { recursive: true });
const sim = (c) => svg([CAJA.x, CAJA.y, CAJA.w, CAJA.h], simbolo(c), 'Primera Llave');
fs.writeFileSync(dir + 'simbolo-laton.svg', sim(COLOR.laton));
fs.writeFileSync(dir + 'simbolo-bosque.svg', sim(COLOR.bosque));
fs.writeFileSync(dir + 'simbolo-marfil.svg', sim(COLOR.marfil));
const hOsc = horizontal(COLOR.laton, COLOR.marfil, 'rgba(242,179,61,.45)');
fs.writeFileSync(dir + 'logo-horizontal-fondo-oscuro.svg', hOsc.svg);
fs.writeFileSync(dir + 'logo-horizontal-fondo-claro.svg', horizontal(COLOR.bosque, COLOR.bosque, 'rgba(15,42,34,.3)').svg);
fs.writeFileSync(dir + 'logo-compacto-fondo-oscuro.svg', compacto(COLOR.laton, COLOR.marfil));
fs.writeFileSync(dir + 'logo-compacto-fondo-claro.svg', compacto(COLOR.bosque, COLOR.bosque));

// Favicon e ícono de app: símbolo latón en cuadrado bosque redondeado.
const pad = 30, lado = CAJA.h + pad * 2;
const icono = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}"><rect width="${lado}" height="${lado}" rx="${r(lado * 0.22)}" fill="${COLOR.bosque}"/><g transform="translate(${r(lado / 2 - (CAJA.x + CAJA.w / 2) - 2)} ${pad - CAJA.y})">${simbolo(COLOR.laton)}</g></svg>\n`;
fs.writeFileSync(new URL('../public/icon.svg', import.meta.url).pathname, icono);
fs.writeFileSync(dir + 'icono-app.svg', icono);

// Datos para el componente React del sitio.
fs.writeFileSync(new URL('../components/ui/logo-datos.ts', import.meta.url).pathname,
`// Archivo generado por marca/generar.mjs. No editar a mano.
export const SIMBOLO = ${JSON.stringify(SIMBOLO)};
export const CAJA = ${JSON.stringify(CAJA)};
export const TEXTO = ${JSON.stringify(hOsc.datos.d)};
export const HORIZONTAL = ${JSON.stringify({ ancho: r(hOsc.datos.ancho), xBarra: hOsc.datos.xBarra, yBarra: hOsc.datos.yBarra })};
`);
console.log('Marca generada en public/marca/');
