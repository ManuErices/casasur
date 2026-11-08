/**
 * Punto único de acceso al catálogo. Hoy lee los datos locales de lib/viviendas.ts.
 *
 * Para administrar viviendas desde Firebase (precios, fotos y disponibilidad):
 *   1. Crea la colección `viviendas` en Firestore con documentos del tipo `Vivienda`
 *      (id del documento = slug) y sube las fotos a Storage.
 *   2. Reemplaza el cuerpo de `obtenerViviendas` por:
 *        const snap = await adminDb().collection('viviendas').where('publicada', '==', true).get();
 *        return snap.docs.map((d) => ({ slug: d.id, ...d.data() }) as Vivienda);
 *   3. Agrega a firestore.rules: match /viviendas/{id} { allow read: if true; allow write: if esAdmin(); }
 *   4. Cambia `export const revalidate` en app/page.tsx para refrescar el catálogo cada cierto tiempo.
 * Ningún componente necesita cambiar: todos reciben `Vivienda[]`.
 */
import { VIVIENDAS_DEMO, type Vivienda } from './viviendas';

export async function obtenerViviendas(): Promise<Vivienda[]> {
  return VIVIENDAS_DEMO;
}

export async function obtenerVivienda(slug: string): Promise<Vivienda | undefined> {
  return (await obtenerViviendas()).find((v) => v.slug === slug);
}

/** Lista liviana para formularios (validación en el servidor y selector de vivienda). */
export function opcionesVivienda(): { slug: string; nombre: string; comuna: string }[] {
  return VIVIENDAS_DEMO.map((v) => ({ slug: v.slug, nombre: v.nombre, comuna: v.comuna }));
}
