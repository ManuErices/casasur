'use client';
import { useEffect, useId, useState } from 'react';
import { AHORRO_MINIMO_UF, SUBSIDIO_UF } from '@/lib/config';
import type { Vivienda } from '@/lib/viviendas';
import { Icono } from '../ui/Icono';
import { Revelar } from '../ui/Revelar';
import { EnPesos, useUF } from './UF';
import { useInteres } from './Interes';

const fmt = (n: number) => Math.round(n).toLocaleString('es-CL');

/** Campo numérico en UF con deslizador sincronizado. */
function CampoUF({ etiqueta, ayuda, valor, cambiar, max, paso = 5 }: {
  etiqueta: string; ayuda: string; valor: number; cambiar: (v: number) => void; max: number; paso?: number;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-3 border-b border-white/10 pb-6 last:border-0 last:pb-0">
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-[0.95rem] font-medium text-marfil">{etiqueta}</label>
        <div className="flex items-baseline gap-1.5 rounded-xl bg-white/[0.06] px-3 py-1.5 ring-1 ring-white/10 focus-within:ring-arena-300">
          <input id={id} type="number" inputMode="numeric" min={0} max={9999} step={paso} value={Number.isFinite(valor) ? valor : 0}
            onChange={(e) => cambiar(Math.max(0, Math.min(9999, Number(e.target.value) || 0)))}
            className="cifras w-20 bg-transparent text-right font-display text-2xl text-marfil outline-none" aria-describedby={`${id}-ayuda`} />
          <span className="text-sm text-marfil/60">UF</span>
        </div>
      </div>
      <input type="range" min={0} max={max} step={paso} value={Math.min(valor, max)} onChange={(e) => cambiar(Number(e.target.value))}
        className="rango-cs !bg-white/15" aria-label={`${etiqueta} (deslizador)`} aria-valuetext={`${valor} UF`} />
      <p id={`${id}-ayuda`} className="text-xs leading-relaxed text-marfil/55">{ayuda}</p>
    </div>
  );
}

export default function Simulador({ viviendas }: { viviendas: Vivienda[] }) {
  const { vivienda, elegir } = useInteres();
  const { valor: valorUF, delDia } = useUF();
  const [origen, setOrigen] = useState(viviendas[0]?.slug ?? '');
  const [precio, setPrecio] = useState(viviendas[0]?.precioUF ?? 1000);
  const [ahorro, setAhorro] = useState(AHORRO_MINIMO_UF);
  const [subsidio, setSubsidio] = useState(SUBSIDIO_UF);
  const [credito, setCredito] = useState(0);

  // Si el visitante eligió una vivienda en el catálogo, el simulador la usa.
  useEffect(() => {
    const v = viviendas.find((x) => x.slug === vivienda);
    if (v) { setOrigen(v.slug); setPrecio(v.precioUF); }
  }, [vivienda, viviendas]);

  const cubierto = ahorro + subsidio + credito;
  const saldo = Math.max(0, precio - cubierto);
  const excedente = Math.max(0, cubierto - precio);
  const base = Math.max(precio, cubierto) || 1;
  const pct = (v: number) => (precio > 0 ? (v / precio) * 100 : 0);

  const partes = [
    { t: 'Ahorro', v: ahorro, color: 'bg-arena-300', punto: 'bg-arena-300' },
    { t: 'Subsidio estimado', v: subsidio, color: 'bg-bosque-300', punto: 'bg-bosque-300' },
    { t: 'Financiamiento adicional', v: credito, color: 'bg-marfil', punto: 'bg-marfil' },
    { t: 'Saldo por financiar', v: saldo, color: 'bg-laton bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgba(255,255,255,.12)_6px_12px)]', punto: 'bg-laton' },
  ];

  return (
    <section id="simulador" aria-labelledby="t-sim" className="grano relative overflow-hidden bg-bosque-950 py-24 text-marfil sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-bosque-500/20 blur-3xl" />
      <div className="contenedor relative">
        <Revelar className="flex max-w-3xl flex-col gap-5">
          <span className="antetitulo-cs !text-laton">Simulador de compra</span>
          <h2 id="t-sim" className="equilibrar font-display text-display-lg">¿Cuánto de tu casa ya está <em className="text-laton">resuelto?</em></h2>
          <p className="max-w-2xl text-lg text-marfil/70">Ingresa el precio de la vivienda y tus montos estimados. Verás al instante cómo se arma el financiamiento y qué saldo quedaría.</p>
        </Revelar>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
          {/* Entradas */}
          <Revelar className="flex flex-col gap-6 rounded-4xl bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur sm:p-8">
            <label className="flex flex-col gap-2 text-sm text-marfil/70">Partir desde una vivienda del catálogo
              <select value={origen} onChange={(e) => { setOrigen(e.target.value); const v = viviendas.find((x) => x.slug === e.target.value); if (v) setPrecio(v.precioUF); }}
                className="control-cs !border-white/15 !bg-white/[0.06] !text-marfil [&>option]:text-grafito">
                {viviendas.map((v) => <option key={v.slug} value={v.slug}>{v.nombre} · {v.comuna} · {fmt(v.precioUF)} UF</option>)}
                <option value="">Otro precio</option>
              </select>
            </label>
            <CampoUF etiqueta="Precio de la vivienda" ayuda="Precio total en UF." valor={precio} cambiar={(v) => { setPrecio(v); setOrigen(''); }} max={2500} paso={1} />
            <CampoUF etiqueta="Ahorro disponible" ayuda="Lo que tienes en tu cuenta de ahorro para la vivienda." valor={ahorro} cambiar={setAhorro} max={500} />
            <CampoUF etiqueta="Subsidio estimado" ayuda="Valor de ejemplo. Usa el monto de tu certificado o el que te indique tu asesor: depende de tu tramo, la comuna y el llamado." valor={subsidio} cambiar={setSubsidio} max={1500} />
            <CampoUF etiqueta="Financiamiento adicional" ayuda="Crédito hipotecario u otro aporte, si corresponde. Déjalo en 0 si no lo tienes." valor={credito} cambiar={setCredito} max={1500} />
          </Revelar>

          {/* Resultado */}
          <Revelar retraso={120} className="flex flex-col gap-8 rounded-4xl bg-marfil p-6 text-grafito shadow-elevada sm:p-10" >
            <div aria-live="polite" className="flex flex-col gap-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-grafito-500">Precio total</p>
                  <p className="cifras font-display text-6xl leading-none text-bosque-950">{fmt(precio)}<span className="ml-2 text-2xl">UF</span></p>
                  <p className="cifras mt-2 text-grafito-500">≈ <EnPesos uf={precio} /></p>
                </div>
                <div className={`rounded-3xl px-5 py-4 text-right ${saldo > 0 ? 'bg-laton-50' : 'bg-bosque-50'}`}>
                  <p className={`text-sm font-semibold ${saldo > 0 ? 'text-laton-800' : 'text-bosque-700'}`}>Saldo por financiar</p>
                  <p className={`cifras font-display text-4xl leading-tight ${saldo > 0 ? 'text-laton-800' : 'text-bosque-700'}`}>{fmt(saldo)} UF</p>
                  <p className="cifras text-sm text-grafito-500">≈ <EnPesos uf={saldo} /></p>
                </div>
              </div>

              {/* Barra proporcional */}
              <div>
                <div className="flex h-14 overflow-hidden rounded-2xl bg-arena-100 ring-1 ring-grafito/10" role="img"
                  aria-label={`Ahorro ${pct(ahorro).toFixed(0)}%, subsidio ${pct(subsidio).toFixed(0)}%, financiamiento ${pct(credito).toFixed(0)}%, saldo ${pct(saldo).toFixed(0)}%`}>
                  {partes.map((p) => (
                    <div key={p.t} className={`${p.color} h-full transition-[width] duration-700 ease-suave ${p.color === 'bg-marfil' ? 'border-x border-grafito/10' : ''}`} style={{ width: `${(p.v / base) * 100}%` }} />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-grafito-400"><span>0</span><span>Precio de la vivienda</span></div>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                {partes.map((p) => (
                  <div key={p.t} className="flex flex-col gap-1">
                    <dt className="flex items-center gap-2 text-xs font-medium text-grafito-500"><span className={`h-2.5 w-2.5 flex-none rounded-full ring-1 ring-grafito/10 ${p.punto}`} />{p.t}</dt>
                    <dd className="cifras font-display text-2xl text-bosque-950">{fmt(p.v)} <span className="text-base">UF</span></dd>
                    <dd className="cifras text-sm text-grafito-500">{pct(p.v).toFixed(1).replace('.', ',')}% del precio</dd>
                  </div>
                ))}
              </dl>

              <p className="rounded-3xl bg-arena-100 p-5 text-[0.97rem] leading-relaxed text-grafito-700">
                {saldo > 0 ? (
                  <>Con estos montos cubres el <strong className="cifras text-bosque-900">{pct(cubierto).toFixed(0)}%</strong> del precio. El saldo de{' '}
                    <strong className="cifras text-bosque-900">{fmt(saldo)} UF</strong> (≈ <EnPesos uf={saldo} compacto />) podría resolverse con un crédito hipotecario,
                    un mayor ahorro o un aporte propio. Lo revisamos contigo.</>
                ) : (
                  <>Con estos montos <strong className="text-bosque-900">el precio quedaría cubierto</strong>. El siguiente paso es confirmar que tu certificado y tu caso calzan con esta vivienda.</>
                )}
              </p>

              {excedente > 0 && (
                <p className="flex gap-2 rounded-2xl bg-bosque-50 p-4 text-sm text-bosque-800">
                  <Icono nombre="info" className="h-5 w-5 flex-none" />
                  Tus montos superan el precio en {fmt(excedente)} UF. Revisa los valores: en una operación real no se financia más que el precio.
                </p>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-4 border-t border-grafito/10 pt-6">
              <button type="button" onClick={() => (origen ? elegir(origen, 'contacto') : document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }))} className="boton-accion w-full sm:w-auto sm:self-start">
                Revisar mi caso con un asesor<Icono nombre="flecha" className="h-4 w-4" />
              </button>
              <p className="text-xs leading-relaxed text-grafito-400">
                Simulación referencial. No constituye una oferta ni una aprobación. La adjudicación del subsidio y del financiamiento depende de la evaluación
                del MINVU/SERVIU y de la entidad financiera. Pesos calculados con 1 UF = ${fmt(valorUF)}{delDia ? ' (valor del día)' : ' (valor de referencia)'}.
              </p>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
