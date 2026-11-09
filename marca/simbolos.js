// Variantes del símbolo "1-llave" (viewBox 0 0 100 150). Exporta paths para SVG.
const V = {
  A: { // Fiel a la propuesta 3, con 2 dientes y argolla más grande
    cuerpo: 'M40 8 H70 a4 4 0 0 1 4 4 V140 a4 4 0 0 1 -4 4 H48 a4 4 0 0 1 -4 -4 V58 L18 66 a3 3 0 0 1 -4 -3 V48 a4 4 0 0 1 3 -4 Z',
    hueco: { cx: 58, cy: 32, r: 10 },
    dientes: [[74, 98, 16, 12], [74, 120, 10, 12]],
  },
  B: { // Más esbelta: dientes escalonados en un solo bloque
    cuerpo: 'M42 8 H68 a4 4 0 0 1 4 4 V140 a4 4 0 0 1 -4 4 H50 a4 4 0 0 1 -4 -4 V56 L20 64 a3 3 0 0 1 -4 -3 V49 a4 4 0 0 1 3 -4 Z',
    hueco: { cx: 57, cy: 30, r: 9 },
    dientes: [[72, 96, 18, 10], [72, 106, 11, 10], [72, 124, 14, 10]],
  },
  C: { // Hueco en forma de ojo de cerradura: guiño a la casa/puerta
    cuerpo: 'M40 8 H70 a4 4 0 0 1 4 4 V140 a4 4 0 0 1 -4 4 H48 a4 4 0 0 1 -4 -4 V58 L18 66 a3 3 0 0 1 -4 -3 V48 a4 4 0 0 1 3 -4 Z',
    cerradura: true,
    dientes: [[74, 98, 16, 12], [74, 120, 10, 12]],
  },
};
function svg(k, color, fondo) {
  const v = V[k];
  const huecoColor = fondo || '#0000';
  const dientes = v.dientes.map(([x, y, w, h]) => `<rect x="${x - 2}" y="${y}" width="${w + 2}" height="${h}" rx="2.5" fill="${color}"/>`).join('');
  const mascara = v.cerradura
    ? `<circle cx="58" cy="28" r="9" fill="black"/><path d="M53 32 L50 48 H66 L63 32 Z" fill="black"/>`
    : `<circle cx="${v.hueco.cx}" cy="${v.hueco.cy}" r="${v.hueco.r}" fill="black"/>`;
  return `<svg viewBox="0 0 100 152" xmlns="http://www.w3.org/2000/svg"><defs><mask id="m${k}${color.slice(1)}"><rect width="100" height="152" fill="white"/>${mascara}</mask></defs><g mask="url(#m${k}${color.slice(1)})"><path d="${v.cuerpo}" fill="${color}"/>${dientes}</g></svg>`;
}
module.exports = { svg, V };
