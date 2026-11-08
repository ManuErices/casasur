import { Revelar } from '../ui/Revelar';
import { Icono } from '../ui/Icono';

const PREGUNTAS = [
  { p: '¿Tengo que pagar algo para empezar?', r: 'No. La primera conversación y la revisión de tu caso no tienen costo. Los pagos se acuerdan por escrito recién al firmar.' },
  { p: '¿Todas las viviendas sirven con mi subsidio?', r: 'No necesariamente. Depende de tu certificado, tu tramo, el precio de la vivienda y, si construyes, de tu terreno. Por eso revisamos cada caso antes de cualquier compromiso.' },
  { p: '¿Mi certificado de subsidio vence?', r: 'Sí, los certificados tienen vigencia. Revisamos la fecha del tuyo en la primera conversación para planificar a tiempo.' },
  { p: '¿Por qué los precios están en UF?', r: 'Porque el subsidio y los créditos se expresan en UF. Siempre te mostramos también el valor aproximado en pesos.' },
  { p: '¿Cómo sé cómo va mi casa?', r: 'Te entregamos un código para entrar a tu portal desde el celular. Ahí ves la etapa de tu casa y las fotos del avance.' },
  { p: '¿Quién responde si algo falla después?', r: 'Nosotros. Las viviendas tienen garantía y atención de postventa según la ley.' },
];

export default function Preguntas() {
  return (
    <section aria-labelledby="t-faq" className="bg-marfil py-24 sm:py-32">
      <div className="contenedor grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <Revelar className="flex flex-col gap-5">
          <span className="antetitulo-cs">Preguntas frecuentes</span>
          <h2 id="t-faq" className="font-display text-display-md text-bosque-950">Lo que todos preguntan <em>(y está bien preguntar).</em></h2>
          <a href="#contacto" className="mt-2 inline-flex items-center gap-2 font-semibold text-bosque-700 underline-offset-4 hover:underline">¿Otra duda? Pregúntanos directamente<Icono nombre="flecha" className="h-4 w-4" /></a>
        </Revelar>
        <Revelar retraso={100} className="flex flex-col">
          {PREGUNTAS.map((q) => (
            <details key={q.p} className="group border-b border-grafito/10 py-1 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold text-grafito transition-colors hover:text-bosque-700">
                {q.p}
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-grafito/15 transition-transform duration-300 group-open:rotate-45 group-open:border-bosque group-open:bg-bosque group-open:text-marfil">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-grafito-500">{q.r}</p>
            </details>
          ))}
        </Revelar>
      </div>
    </section>
  );
}
