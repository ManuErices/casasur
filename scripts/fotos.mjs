// Genera variantes optimizadas de las fotografías base (node scripts/fotos.mjs).
// Reemplaza public/ranco.jpg por la fotografía o render real y vuelve a ejecutar.
import sharp from 'sharp';
const src = 'public/ranco.jpg';
const out = (n) => `public/fotos/${n}`;
const jpg = { quality: 82, progressive: true, mozjpeg: true };

// Hero: gradación cálida y levemente más contrastada.
await sharp(src).linear([1.05, 1.02, 0.96], [-4, -4, -2]).modulate({ saturation: 1.02 }).jpeg(jpg).toFile(out('ranco-hero.jpg'));
// Atardecer: más oscuro y ámbar para el cierre emocional.
await sharp(src).linear([1.0, 0.9, 0.76], [0, -4, -6]).modulate({ saturation: 0.95, brightness: 0.8 }).jpeg(jpg).toFile(out('ranco-atardecer.jpg'));
// Recortes de detalle.
await sharp(src).extract({ left: 160, top: 470, width: 980, height: 420 }).resize(1200).jpeg(jpg).toFile(out('ranco-terraza.jpg'));
await sharp(src).extract({ left: 700, top: 230, width: 460, height: 560 }).resize(900).jpeg(jpg).toFile(out('ranco-acceso.jpg'));
await sharp(src).extract({ left: 1180, top: 120, width: 492, height: 600 }).resize(900).jpeg(jpg).toFile(out('ranco-volcan.jpg'));
await sharp(src).extract({ left: 360, top: 270, width: 400, height: 270 }).resize(1000).jpeg(jpg).toFile(out('ranco-ventanas.jpg'));
// Imagen para compartir en redes (1200×630).
await sharp(src).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg(jpg).toFile(out('og.jpg'));
console.log('Listo');
