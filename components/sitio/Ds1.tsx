import { ANTECEDENTES, FUENTE_OFICIAL, GENERAL_VS_ESPECIFICO, QUE_APORTAS, QUE_ES, TIPOS_VIVIENDA } from '@/lib/ds1';
import { Encabezado } from '../ui/Encabezado';
import { Icono, type NombreIcono } from '../ui/Icono';
import { Revelar } from '../ui/Revelar';

/** La "ecuación" de la casa: diagrama conceptual, sin montos. */
function Ecuacion() {
  const partes: { t: string; d: string; color: string; icono: NombreIcono; ancho: string }[] = [
    { t: 'Tu ahorro', d: 'En tu cuenta de ahorro para la vivienda', color: 'bg-arena-300 text-bosque-950', icono: 'llave', ancho: 'sm:flex-[1]' },
    { t: 'Subsidio DS1', d: 'El aporte del Estado según tu tramo', color: 'bg-bosque text-marfil', icono: 'escudo', ancho: 'sm:flex-[3]' },
    { t: 'Crédito o aporte', d: 'Solo si queda una diferencia', color: 'bg-white text-bosque-950 border border-dashed border-bosque/40', icono: 'documento', ancho: 'sm:flex-[1.4]' },
  ];
  return (
    <Revelar className="rounded-4xl bg-white p-6 shadow-suave sm:p-10">
      <p className="text-sm font-semibold text-grafito-500">La ecuación de tu casa</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        {partes.map((p, i) => (
          <div key={p.t} className="flex items-center gap-3 sm:contents">
            <div className={`flex flex-1 flex-col justify-between gap-6 rounded-3xl p-5 ${p.color} ${p.ancho}`}>
              <Icono nombre={p.icono} className="h-6 w-6 opacity-80" />
              <div>
                <p className="font-display text-2xl leading-tight">{p.t}</p>
                <p className="mt-1 text-sm opacity-75">{p.d}</p>
              </div>
            </div>
            <span aria-hidden="true" className="hidden self-center font-display text-3xl text-grafito-400 sm:block">{i < partes.length - 1 ? '+' : '='}</span>
          </div>
        ))}
        <div className="flex flex-col justify-between gap-6 rounded-3xl bg-copihue p-5 text-white sm:flex-[1.3]">
          <Icono nombre="casa" className="h-6 w-6" />
          <div>
            <p className="font-display text-2xl leading-tight">Tu casa</p>
            <p className="mt-1 text-sm text-white/80">El precio total de la vivienda</p>
          </div>
        </div>
      </div>
      <p className="mt-5 text-xs text-grafito-400">Diagrama conceptual: las proporciones son ilustrativas y no representan montos reales.</p>
    </Revelar>
  );
}

function Tarjeta({ numero, titulo, children, retraso = 0 }: { numero: string; titulo: string; children: React.ReactNode; retraso?: number }) {
  return (
    <Revelar retraso={retraso} className="flex flex-col gap-4 rounded-4xl bg-marfil-50 p-7 ring-1 ring-grafito/5">
      <span className="cifras font-display text-lg text-copihue">{numero}</span>
      <h3 className="font-display text-[1.7rem] leading-tight text-bosque-950">{titulo}</h3>
      <div className="text-[0.97rem] leading-relaxed text-grafito-500">{children}</div>
    </Revelar>
  );
}

export default function Ds1() {
  return (
    <section id="ds1" aria-labelledby="t-ds1" className="bg-arena-100 py-24 sm:py-32">
      <div className="contenedor flex flex-col gap-14">
        <Encabezado id="t-ds1" antetitulo="Subsidio DS1, sin letra chica" titulo={<>Entiende el DS1 antes de dar <em>el primer paso.</em></>}
          bajada="Lo esencial del subsidio, explicado en simple. Así llegas a tu primera conversación con nosotros sabiendo qué preguntar." />

        <Ecuacion />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Tarjeta numero="01" titulo="Qué es">{QUE_ES.texto}</Tarjeta>
          <Tarjeta numero="02" titulo="Qué viviendas" retraso={80}>
            <ul className="flex flex-col gap-3">
              {TIPOS_VIVIENDA.map((t) => <li key={t.titulo}><strong className="font-semibold text-grafito">{t.titulo}.</strong> {t.texto}</li>)}
            </ul>
          </Tarjeta>
          <Tarjeta numero="03" titulo="Qué aportas" retraso={160}>
            <ul className="flex flex-col gap-3">
              {QUE_APORTAS.map((t) => <li key={t.titulo}><strong className="font-semibold text-grafito">{t.titulo}.</strong> {t.texto}</li>)}
            </ul>
          </Tarjeta>
          <Tarjeta numero="04" titulo="Qué necesitas" retraso={240}>
            <ul className="flex flex-col gap-2">
              {ANTECEDENTES.map((a) => (
                <li key={a} className="flex gap-2"><Icono nombre="check" className="mt-1 h-4 w-4 flex-none text-bosque-500" trazo={2.2} />{a}</li>
              ))}
            </ul>
          </Tarjeta>
        </div>

        {/* Programa vs. operación: la distinción que genera confianza */}
        <Revelar className="grid overflow-hidden rounded-4xl ring-1 ring-grafito/10 md:grid-cols-2">
          <div className="bg-white p-7 sm:p-10">
            <p className="flex items-center gap-2 text-sm font-semibold text-grafito-500"><Icono nombre="documento" className="h-5 w-5" />Lo define el programa (MINVU)</p>
            <ul className="mt-5 flex flex-col gap-3 text-grafito-700">
              {GENERAL_VS_ESPECIFICO.programa.map((x) => <li key={x} className="border-b border-grafito/10 pb-3 last:border-0">{x}</li>)}
            </ul>
          </div>
          <div className="bg-bosque p-7 text-marfil sm:p-10">
            <p className="flex items-center gap-2 text-sm font-semibold text-arena-200"><Icono nombre="persona" className="h-5 w-5" />Lo revisamos contigo, caso a caso</p>
            <ul className="mt-5 flex flex-col gap-3 text-marfil/90">
              {GENERAL_VS_ESPECIFICO.operacion.map((x) => <li key={x} className="border-b border-white/10 pb-3 last:border-0">{x}</li>)}
            </ul>
          </div>
        </Revelar>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex max-w-2xl gap-2 text-sm text-grafito-500">
            <Icono nombre="info" className="mt-0.5 h-4 w-4 flex-none" />
            <span>Montos, tramos y requisitos cambian según cada llamado. Revisa siempre la información vigente en{' '}
              <a href={FUENTE_OFICIAL.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-bosque-700 underline underline-offset-4">{FUENTE_OFICIAL.nombre}</a>.</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#simulador" className="boton-bosque">Simular mi compra<Icono nombre="calculadora" className="h-4 w-4" /></a>
            <a href="#proceso" className="boton-linea">Ver el proceso</a>
          </div>
        </div>
      </div>
    </section>
  );
}
