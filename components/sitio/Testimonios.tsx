import Image from 'next/image';
import { CONTACTO, COMUNAS, MARCA } from '@/lib/config';
import { Encabezado } from '../ui/Encabezado';
import { Revelar } from '../ui/Revelar';

/** ⚠️ Testimonios FICTICIOS de demostración. Reemplazar por testimonios reales con autorización. */
const TESTIMONIOS = [
  { cita: 'Teníamos el subsidio hace meses y no sabíamos por dónde empezar. Nos explicaron todo con calma y siempre supimos qué venía.', nombre: 'Familia de ejemplo', lugar: 'Paillaco', modelo: 'Calle-Calle' },
  { cita: 'Lo que más valoro es ver las fotos de la obra desde el celular. Trabajo todo el día y igual sentía que estaba ahí.', nombre: 'Compradora de ejemplo', lugar: 'Valdivia', modelo: 'Ranco' },
  { cita: 'Pensábamos que el trámite iba a ser eterno. Fue ordenado y la casa es abrigada: el primer invierno se notó.', nombre: 'Familia de ejemplo', lugar: 'La Unión', modelo: 'Niebla' },
];

export default function Testimonios() {
  return (
    <section id="confianza" aria-labelledby="t-test" className="bg-arena-100 py-24 sm:py-32">
      <div className="contenedor flex flex-col gap-16">
        <Encabezado id="t-test" antetitulo="Familias y confianza" titulo={<>La parte más importante <em>no se construye con madera.</em></>}
          bajada="Se construye con claridad, cumplimiento y cercanía. Esto es lo que buscamos que cada familia diga de nosotros." />

        <ul className="grid gap-5 md:grid-cols-3">
          {TESTIMONIOS.map((t, i) => (
            <Revelar como="li" key={i} retraso={i * 100} className={`relative flex flex-col justify-between gap-10 rounded-4xl p-8 ${i === 1 ? 'bg-bosque text-marfil md:-mt-6 md:mb-6' : 'bg-white text-grafito'}`}>
              <span className={`absolute right-6 top-6 etiqueta-cs border border-dashed ${i === 1 ? 'border-white/30 text-marfil/70' : 'border-grafito/25 text-grafito-400'}`}>Testimonio demo</span>
              <span aria-hidden="true" className={`font-display text-7xl leading-none ${i === 1 ? 'text-arena-300' : 'text-copihue'}`}>“</span>
              <blockquote className="-mt-8 font-display text-[1.45rem] leading-snug">{t.cita}</blockquote>
              <footer className={`flex items-center gap-3 border-t pt-5 text-sm ${i === 1 ? 'border-white/15 text-marfil/75' : 'border-grafito/10 text-grafito-500'}`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-lg ${i === 1 ? 'bg-white/10' : 'bg-arena-100 text-bosque-900'}`}>{t.lugar[0]}</span>
                <span><strong className={`block font-semibold ${i === 1 ? 'text-marfil' : 'text-grafito'}`}>{t.nombre}</strong>{t.lugar} · Modelo {t.modelo}</span>
              </footer>
            </Revelar>
          ))}
        </ul>

        {/* Proyectos y antecedentes de la empresa */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Revelar className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4" >
            <figure className="relative col-span-2 row-span-2 min-h-[280px] overflow-hidden rounded-4xl">
              <Image src="/fotos/ranco-terraza.jpg" alt="Terraza de madera del modelo Ranco" fill sizes="(min-width:1024px) 40vw, 66vw" className="object-cover" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/35 px-3 py-1 text-[0.7rem] text-white backdrop-blur">Modelo Ranco · imagen referencial</figcaption>
            </figure>
            <figure className="relative overflow-hidden rounded-3xl"><Image src="/fotos/ranco-acceso.jpg" alt="Acceso con revestimiento de madera" fill sizes="22vw" className="object-cover" /></figure>
            <figure className="relative overflow-hidden rounded-3xl"><Image src="/fotos/ranco-volcan.jpg" alt="Paisaje de bosque y volcán del sur de Chile" fill sizes="22vw" className="object-cover" /></figure>
          </Revelar>
          <Revelar retraso={120} className="flex flex-col gap-6 rounded-4xl bg-white p-8 sm:p-10">
            <p className="font-display text-3xl leading-tight text-bosque-950">Una empresa del sur, con papeles en regla.</p>
            <dl className="flex flex-col divide-y divide-grafito/10 text-sm">
              {[
                { t: 'Razón social', d: CONTACTO.razonSocial },
                { t: 'Registro de Contratistas MINVU', d: CONTACTO.registroMinvu },
                { t: 'Entidad Patrocinante', d: CONTACTO.egis },
                { t: 'Cobertura', d: `${COMUNAS.length} comunas de la Región de Los Ríos` },
              ].map((x) => (
                <div key={x.t} className="flex flex-col gap-0.5 py-3 first:pt-0 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-grafito-500">{x.t}</dt><dd className="font-semibold text-grafito sm:text-right">{x.d}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-grafito-400">Testimonios de demostración: no corresponden a clientes reales de {MARCA}. Los datos de la empresa se configuran en las variables del sitio.</p>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
