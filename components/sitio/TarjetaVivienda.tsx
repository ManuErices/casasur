'use client';
import Link from 'next/link';
import { MODALIDAD, type Vivienda } from '@/lib/viviendas';
import { Foto } from '../media/Foto';
import { Icono } from '../ui/Icono';
import { EtiquetaDS1, EtiquetaDemo, EtiquetaDisponibilidad } from '../ui/Etiquetas';
import { EnPesos } from './UF';
import { useInteres } from './Interes';

export function Datos({ v, className = '' }: { v: Vivienda; className?: string }) {
  const items = [
    { i: 'superficie' as const, t: `${v.superficieM2} m²`, l: 'construidos' },
    { i: 'cama' as const, t: `${v.dormitorios}`, l: v.dormitorios === 1 ? 'dormitorio' : 'dormitorios' },
    { i: 'bano' as const, t: `${v.banos}`, l: v.banos === 1 ? 'baño' : 'baños' },
    ...(v.estacionamientos ? [{ i: 'auto' as const, t: `${v.estacionamientos}`, l: v.estacionamientos === 1 ? 'estacionamiento' : 'estacionamientos' }] : []),
  ];
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm text-grafito-500 ${className}`}>
      {items.map((x) => (
        <li key={x.i} className="flex items-center gap-1.5">
          <Icono nombre={x.i} className="h-[18px] w-[18px] text-bosque-500" />
          <span className="cifras font-semibold text-grafito">{x.t}</span>
          <span className={x.i === 'superficie' ? '' : 'sr-only sm:not-sr-only'}>{x.l}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TarjetaVivienda({ v, destacada = false, cotizarEnFicha = false }: { v: Vivienda; destacada?: boolean; cotizarEnFicha?: boolean }) {
  const { elegir } = useInteres();
  const reservada = v.disponibilidad === 'reservada';
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-4xl bg-white shadow-suave ring-1 ring-grafito/5 transition-all duration-500 ease-suave hover:-translate-y-1 hover:shadow-elevada ${destacada ? 'md:col-span-2 md:flex-row' : ''}`}>
      <div className={`relative overflow-hidden ${destacada ? 'aspect-[4/3] md:aspect-auto md:w-[58%]' : 'aspect-[4/3]'}`}>
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-suave group-hover:scale-[1.04]">
          <Foto foto={v.fotos[0]} sizes={destacada ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'} className={reservada ? 'grayscale-[40%]' : ''} />
        </div>
        <div className="absolute inset-x-0 top-0 flex flex-wrap items-start gap-2 p-4">
          <EtiquetaDS1 estado={v.ds1.estado} sobreFoto />
          <EtiquetaDisponibilidad valor={v.disponibilidad} sobreFoto />
          {v.demo && <EtiquetaDemo className="ml-auto" />}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-4 pt-12">
          <p className="flex items-center gap-1.5 text-sm font-medium text-white">
            <Icono nombre="ubicacion" className="h-4 w-4" />{v.comuna} · {v.sector}
          </p>
        </div>
      </div>

      <div className={`flex flex-1 flex-col gap-5 p-6 sm:p-7 ${destacada ? 'md:justify-center md:p-10' : ''}`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-bosque-500">{MODALIDAD[v.modalidad]}</p>
          <h3 className={`mt-2 font-display leading-none text-bosque-950 ${destacada ? 'text-5xl' : 'text-[2.1rem]'}`}>{v.nombre}</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-grafito-500">{v.frase}</p>
        </div>

        <Datos v={v} />

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-grafito/10 pt-5">
          <div>
            <p className="text-xs text-grafito-400">Precio referencial</p>
            <p className="cifras font-display text-3xl leading-tight text-bosque-950">{v.precioUF.toLocaleString('es-CL')} <span className="text-lg">UF</span></p>
            <p className="cifras text-sm text-grafito-500">≈ <EnPesos uf={v.precioUF} compacto /></p>
          </div>
          {cotizarEnFicha ? (
            <Link href={`/viviendas/${v.slug}#contacto`} className="flex h-11 items-center rounded-full px-4 text-sm font-semibold text-copihue-600 transition-colors hover:bg-copihue-50" aria-label={`Cotizar la vivienda ${v.nombre} en ${v.comuna}`}>Cotizar</Link>
          ) : (
            <button type="button" onClick={() => elegir(v.slug, 'contacto')} className="flex h-11 items-center rounded-full px-4 text-sm font-semibold text-copihue-600 transition-colors hover:bg-copihue-50" aria-label={`Cotizar la vivienda ${v.nombre} en ${v.comuna}`}>Cotizar</button>
          )}
        </div>

        <Link href={`/viviendas/${v.slug}`} className="boton-linea w-full justify-between !px-6 group-hover:border-bosque group-hover:bg-bosque group-hover:text-marfil">
          Conocer esta vivienda<Icono nombre="flecha" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
