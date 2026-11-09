'use client';
import { useMemo, useState, type ReactNode } from 'react';
import type { Vivienda } from '@/lib/viviendas';
import TarjetaVivienda from './TarjetaVivienda';
import { Icono } from '../ui/Icono';
import { Revelar } from '../ui/Revelar';

type Orden = 'relevancia' | 'precio-asc' | 'precio-desc' | 'superficie';
type Filtros = {
  comuna: string; dormitorios: number; banos: number; precioMax: number; superficieMin: number;
  soloDisponibles: boolean; soloDS1: boolean;
};

function Segmentado({ etiqueta, opciones, valor, cambiar }: { etiqueta: string; opciones: { v: number; t: string }[]; valor: number; cambiar: (v: number) => void }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-semibold text-grafito-700">{etiqueta}</legend>
      <div className="flex rounded-2xl border border-grafito/15 bg-white p-1">
        {opciones.map((o) => (
          <label key={o.v} className="relative flex-1">
            <input type="radio" className="peer sr-only" checked={valor === o.v} onChange={() => cambiar(o.v)} name={etiqueta} />
            <span className="flex min-h-[42px] cursor-pointer items-center justify-center rounded-xl px-3 text-sm font-medium text-grafito-500 transition-all peer-checked:bg-bosque peer-checked:text-marfil peer-focus-visible:ring-2 peer-focus-visible:ring-laton">
              {o.t}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Interruptor({ children, activo, cambiar }: { children: ReactNode; activo: boolean; cambiar: (v: boolean) => void }) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm font-medium text-grafito-700">
      <input type="checkbox" className="peer sr-only" checked={activo} onChange={(e) => cambiar(e.target.checked)} />
      <span className="relative h-6 w-11 flex-none rounded-full bg-grafito/15 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-bosque peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-laton" />
      {children}
    </label>
  );
}

export default function Catalogo({ viviendas }: { viviendas: Vivienda[] }) {
  const comunas = useMemo(() => [...new Set(viviendas.map((v) => v.comuna))].sort(), [viviendas]);
  const precioTope = useMemo(() => Math.ceil(Math.max(...viviendas.map((v) => v.precioUF)) / 10) * 10, [viviendas]);
  const precioPiso = useMemo(() => Math.floor(Math.min(...viviendas.map((v) => v.precioUF)) / 10) * 10, [viviendas]);
  const inicial: Filtros = { comuna: '', dormitorios: 0, banos: 0, precioMax: precioTope, superficieMin: 0, soloDisponibles: false, soloDS1: false };

  const [f, setF] = useState<Filtros>(inicial);
  const [orden, setOrden] = useState<Orden>('relevancia');
  const [masFiltros, setMasFiltros] = useState(false);
  const poner = <K extends keyof Filtros>(k: K, v: Filtros[K]) => setF((x) => ({ ...x, [k]: v }));

  const resultado = useMemo(() => {
    const r = viviendas.filter((v) =>
      (!f.comuna || v.comuna === f.comuna) &&
      v.dormitorios >= f.dormitorios &&
      v.banos >= f.banos &&
      v.precioUF <= f.precioMax &&
      v.superficieM2 >= f.superficieMin &&
      (!f.soloDisponibles || v.disponibilidad === 'disponible' || v.disponibilidad === 'ultimas') &&
      (!f.soloDS1 || v.ds1.estado === 'compatible'));
    if (orden === 'precio-asc') r.sort((a, b) => a.precioUF - b.precioUF);
    if (orden === 'precio-desc') r.sort((a, b) => b.precioUF - a.precioUF);
    if (orden === 'superficie') r.sort((a, b) => b.superficieM2 - a.superficieM2);
    return r;
  }, [viviendas, f, orden]);

  const activos = (Object.keys(inicial) as (keyof Filtros)[]).filter((k) => f[k] !== inicial[k]).length;
  const sinFiltros = activos === 0 && orden === 'relevancia';

  return (
    <div>
      {/* Buscador: se monta sobre el borde inferior del hero */}
      <Revelar id="viviendas" className="relative z-10 -mt-24 rounded-4xl bg-marfil-50 p-5 shadow-elevada ring-1 ring-grafito/5 sm:-mt-28 sm:p-7">
        <form role="search" aria-label="Buscar viviendas" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <h2 id="t-viviendas" className="font-display text-2xl text-bosque-950 sm:text-3xl">Encuentra tu casa</h2>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="cifras text-sm text-grafito-500" aria-live="polite">
                <strong className="text-bosque-900">{resultado.length}</strong> de {viviendas.length} viviendas
              </p>
              {activos > 0 && (
                <button type="button" onClick={() => setF(inicial)} className="min-h-[40px] text-sm font-semibold text-laton-700 underline-offset-4 hover:underline">
                  Limpiar ({activos})
                </button>
              )}
              <label className="flex items-center gap-2 text-sm text-grafito-500"><span className="sr-only sm:not-sr-only">Ordenar</span>
                <select className="control-cs !min-h-[40px] !w-auto !rounded-full !py-0 !text-sm" value={orden} onChange={(e) => setOrden(e.target.value as Orden)} aria-label="Ordenar resultados">
                  <option value="relevancia">Destacadas</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="superficie">Mayor superficie</option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1.3fr]">
            <label className="campo-cs">Ubicación
              <select className="control-cs" value={f.comuna} onChange={(e) => poner('comuna', e.target.value)}>
                <option value="">Todas las comunas</option>
                {comunas.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <Segmentado etiqueta="Dormitorios" valor={f.dormitorios} cambiar={(v) => poner('dormitorios', v)} opciones={[{ v: 0, t: 'Todos' }, { v: 2, t: '2+' }, { v: 3, t: '3+' }]} />
            <Segmentado etiqueta="Baños" valor={f.banos} cambiar={(v) => poner('banos', v)} opciones={[{ v: 0, t: 'Todos' }, { v: 1, t: '1+' }, { v: 2, t: '2+' }]} />
            <label className="campo-cs">
              <span className="flex justify-between">Precio hasta <span className="cifras font-display text-lg font-normal text-bosque-900">{f.precioMax.toLocaleString('es-CL')} UF</span></span>
              <span className="flex min-h-[52px] items-center">
                <input type="range" className="rango-cs" min={precioPiso} max={precioTope} step={10} value={f.precioMax} onChange={(e) => poner('precioMax', Number(e.target.value))} aria-valuetext={`${f.precioMax} UF`} />
              </span>
            </label>
          </div>

          <div className={`${masFiltros ? 'grid' : 'hidden'} gap-4 border-t border-grafito/10 pt-5 md:grid md:grid-cols-[1fr_auto_auto] md:items-end`}>
            <label className="campo-cs md:max-w-xs">Superficie mínima
              <select className="control-cs" value={f.superficieMin} onChange={(e) => poner('superficieMin', Number(e.target.value))}>
                <option value={0}>Cualquiera</option>
                <option value={40}>Desde 40 m²</option>
                <option value={55}>Desde 55 m²</option>
              </select>
            </label>
            <Interruptor activo={f.soloDisponibles} cambiar={(v) => poner('soloDisponibles', v)}>Solo disponibles</Interruptor>
            <Interruptor activo={f.soloDS1} cambiar={(v) => poner('soloDS1', v)}>Solo aptas para DS1*</Interruptor>
          </div>

          <button type="button" onClick={() => setMasFiltros((v) => !v)} aria-expanded={masFiltros} className="flex min-h-[44px] items-center gap-2 self-start text-sm font-semibold text-bosque-700 md:hidden">
            <Icono nombre="filtro" className="h-4 w-4" />{masFiltros ? 'Menos filtros' : 'Más filtros'}
          </button>
        </form>
      </Revelar>

      {/* Resultados */}
      {resultado.length ? (
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {resultado.map((v, i) => {
            // La primera tarjeta se destaca (2 columnas) solo si la grilla queda completa.
            const destacada = sinFiltros && i === 0 && resultado.length % 3 === 2;
            return (
              <Revelar como="li" key={v.slug} retraso={(i % 3) * 90} className={`flex ${destacada ? 'md:col-span-2' : ''}`}>
                <TarjetaVivienda v={v} destacada={destacada} />
              </Revelar>
            );
          })}
        </ul>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-4 rounded-4xl border border-dashed border-grafito/20 px-6 py-16 text-center">
          <Icono nombre="casa" className="h-10 w-10 text-bosque-300" />
          <p className="font-display text-2xl text-bosque-950">No encontramos viviendas con esos filtros</p>
          <p className="max-w-md text-grafito-500">Prueba ampliando el precio o la ubicación. También podemos avisarte cuando haya una vivienda para ti.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setF(inicial)} className="boton-bosque">Ver todas las viviendas</button>
            <a href="#contacto" className="boton-linea">Avísenme</a>
          </div>
        </div>
      )}

      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-grafito-400">
        * “Apta DS1” indica que la vivienda está pensada para operar con el subsidio. No garantiza la compatibilidad de cada operación:
        depende de tu certificado, tu tramo, tu ahorro, el terreno y el llamado vigente. Viviendas, precios y disponibilidad son de demostración.
      </p>
    </div>
  );
}
