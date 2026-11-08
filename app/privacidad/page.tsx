import type { Metadata } from 'next';
import Link from 'next/link';
import Cabecera from '@/components/sitio/Cabecera';
import Pie from '@/components/sitio/Pie';
import { CONTACTO, MARCA } from '@/lib/config';

export const metadata: Metadata = { title: 'Aviso legal y de privacidad', alternates: { canonical: '/privacidad' } };

/**
 * Plantilla base. Debe ser revisada por la asesoría legal de la empresa antes de publicar
 * (Ley N° 19.628 sobre protección de la vida privada y sus modificaciones).
 */
export default function Privacidad() {
  const bloques = [
    { t: 'Quién trata tus datos', d: `${CONTACTO.razonSocial} (${MARCA}), con domicilio en ${CONTACTO.direccion}. Puedes escribirnos a ${CONTACTO.email}.` },
    { t: 'Qué datos recogemos', d: 'Los que ingresas en nuestros formularios: nombre, teléfono, correo (opcional), comuna, vivienda de interés y tu situación respecto del subsidio y del terreno.' },
    { t: 'Para qué los usamos', d: 'Solo para responder tu consulta, asesorarte en la compra de tu vivienda y, si te conviertes en cliente, informarte el avance de tu proceso. No vendemos ni cedemos tus datos a terceros con fines comerciales.' },
    { t: 'Dónde se guardan', d: 'En servicios en la nube con acceso restringido al equipo autorizado. Los conservamos mientras sean necesarios para atender tu consulta o cumplir obligaciones legales.' },
    { t: 'Tus derechos', d: `Puedes pedir acceso, rectificación, cancelación u oposición al uso de tus datos escribiendo a ${CONTACTO.email}.` },
    { t: 'Información del sitio', d: 'Las imágenes son referenciales. Las viviendas, precios, disponibilidad y testimonios publicados en esta versión del sitio son de demostración. Los precios en pesos son aproximados y dependen del valor de la UF. Las simulaciones son referenciales y no constituyen oferta ni aprobación de subsidio o crédito.' },
    { t: 'Sobre el subsidio DS1', d: 'El subsidio habitacional DS1 es otorgado por el Ministerio de Vivienda y Urbanismo (MINVU). Su obtención, monto y condiciones dependen exclusivamente de los requisitos del programa y de cada llamado. Te recomendamos revisar la información oficial en minvu.gob.cl.' },
  ];
  return (
    <>
      <Cabecera />
      <main id="contenido" className="contenedor max-w-3xl pb-24 pt-36">
        <p className="antetitulo-cs">Aviso legal</p>
        <h1 className="mt-4 font-display text-display-lg text-bosque-950">Privacidad y condiciones de uso</h1>
        <div className="mt-12 flex flex-col divide-y divide-grafito/10">
          {bloques.map((b) => (
            <section key={b.t} className="py-7">
              <h2 className="font-display text-2xl text-bosque-950">{b.t}</h2>
              <p className="mt-3 leading-relaxed text-grafito-500">{b.d}</p>
            </section>
          ))}
        </div>
        <Link href="/" className="boton-bosque mt-8">Volver al inicio</Link>
      </main>
      <Pie />
    </>
  );
}
