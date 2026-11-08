import { Encabezado } from '../ui/Encabezado';
import { Icono, type NombreIcono } from '../ui/Icono';
import { Revelar } from '../ui/Revelar';

const PASOS: { t: string; d: string; cuando: string; icono: NombreIcono }[] = [
  { t: 'Explora nuestras viviendas', d: 'Recorre el catálogo, compara modelos y mira planos y precios.', cuando: 'Hoy', icono: 'casa' },
  { t: 'Encuentra una compatible con tus posibilidades', d: 'Usa el simulador para ver cómo se arma tu financiamiento.', cuando: '5 minutos', icono: 'calculadora' },
  { t: 'Solicita asesoría', d: 'Conversamos sin costo y resolvemos tus dudas sobre el DS1.', cuando: 'Semana 1 · sin costo', icono: 'persona' },
  { t: 'Revisamos antecedentes y condiciones', d: 'Certificado, ahorro, terreno y, si hace falta, financiamiento.', cuando: 'Semanas 1 y 2', icono: 'documento' },
  { t: 'Gestionamos la compraventa', d: 'Contrato, planos, permisos y trámites. Sigues el avance desde tu portal.', cuando: 'Meses 1 a 6', icono: 'escudo' },
  { t: 'Concreta tu casa propia', d: 'Recepción, entrega de llaves y atención de postventa.', cuando: '≈ mes 7', icono: 'llave' },
];

export default function Proceso() {
  return (
    <section id="proceso" aria-labelledby="t-proceso" className="relative overflow-hidden bg-marfil-50 py-24 sm:py-32">
      <div className="contenedor">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Encabezado id="t-proceso" antetitulo="Proceso de compra" titulo={<>Seis pasos. <em>Uno a la vez.</em></>}
            bajada="Un camino claro desde la primera visita a esta página hasta el día en que abres tu puerta. Siempre sabrás en qué etapa estás y qué viene después." />
          <Revelar><a href="#contacto" className="boton-bosque">Dar el primer paso<Icono nombre="flecha" className="h-4 w-4" /></a></Revelar>
        </div>

        <ol className="relative mt-16 grid gap-0 lg:grid-cols-6 lg:gap-6">
          {/* Línea guía */}
          <span aria-hidden="true" className="absolute left-[27px] top-2 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-bosque/40 via-bosque/20 to-transparent lg:left-0 lg:right-0 lg:top-[27px] lg:h-px lg:w-full lg:bg-gradient-to-r" />
          {PASOS.map((p, i) => (
            <Revelar como="li" key={p.t} retraso={i * 90} className="relative grid grid-cols-[56px_1fr] gap-5 pb-10 lg:flex lg:flex-col lg:gap-6 lg:pb-0">
              <span className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full ring-8 ring-marfil-50 ${i === PASOS.length - 1 ? 'bg-copihue text-white' : 'bg-bosque text-marfil'}`}>
                <Icono nombre={p.icono} className="h-6 w-6" />
              </span>
              <div className="flex flex-col gap-2 pt-1 lg:pt-0">
                <span className="cifras text-xs font-semibold uppercase tracking-[0.14em] text-copihue-600">{String(i + 1).padStart(2, '0')} · {p.cuando}</span>
                <h3 className="font-display text-[1.55rem] leading-tight text-bosque-950">{p.t}</h3>
                <p className="text-[0.95rem] leading-relaxed text-grafito-500">{p.d}</p>
              </div>
            </Revelar>
          ))}
        </ol>
        <p className="mt-6 text-xs text-grafito-400">Plazos referenciales para construcción en sitio propio. Dependen de permisos, aprobaciones y de cada caso.</p>
      </div>
    </section>
  );
}
