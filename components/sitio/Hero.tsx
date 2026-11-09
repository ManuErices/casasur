import Image from 'next/image';
import Link from 'next/link';
import { MODELOS } from '@/lib/config';
import { Icono } from '../ui/Icono';

export default function Hero() {
  const desde = Math.min(...MODELOS.map((m) => m.precioUF));
  return (
    <section aria-labelledby="t-hero" className="grano relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bosque-950 text-white">
      <div className="absolute inset-0 -z-10 animate-zoom-lento">
        <Image src="/fotos/ranco-hero.jpg" alt="Casa modelo Ranco al atardecer, con terraza de madera, bosque nativo y un volcán nevado al fondo" fill priority sizes="100vw" className="object-cover object-[62%_center]" />
      </div>
      {/* Velos para legibilidad sin apagar la fotografía */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bosque-950/85 via-bosque-950/10 to-bosque-950/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bosque-950/65 via-bosque-950/5 to-transparent" />

      <div className="contenedor flex flex-1 flex-col justify-end pb-32 pt-36 sm:pb-40">
        <div className="max-w-3xl">
          <p className="animate-aparecer text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-laton" style={{ animationDelay: '150ms' }}>
            Primera vivienda · Región de Los Ríos
          </p>
          <h1 id="t-hero" className="sombra-texto mt-5 animate-aparecer font-display text-display-xl text-marfil" style={{ animationDelay: '250ms' }}>
            Tu subsidio ya tiene <em className="text-laton">forma de casa.</em>
          </h1>
          <p className="sombra-texto mt-6 max-w-xl animate-aparecer text-lg leading-relaxed text-white/85 sm:text-xl" style={{ animationDelay: '400ms' }}>
            Viviendas diseñadas para el sur de Chile y pensadas para adquirirse con el subsidio habitacional DS1. Te acompañamos desde la primera consulta hasta la entrega de llaves.
          </p>
          <div className="mt-9 flex animate-aparecer flex-col gap-3 sm:flex-row" style={{ animationDelay: '550ms' }}>
            <Link href="#viviendas" className="boton-accion">Encuentra tu casa<Icono nombre="flecha" className="h-4 w-4" /></Link>
            <Link href="#ds1" className="boton-vidrio">Conoce cómo funciona el DS1</Link>
          </div>
        </div>

        <dl className="mt-14 grid max-w-3xl animate-aparecer grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-6" style={{ animationDelay: '700ms' }}>
          {[
            { d: `${desde.toLocaleString('es-CL')} UF`, t: 'Precio desde' },
            { d: '43 m²', t: '2 dormitorios · 1 baño' },
            { d: '≈ 7 meses', t: 'De la firma a las llaves' },
          ].map((x) => (
            <div key={x.t} className="flex flex-col-reverse px-3 first:pl-0 sm:px-6">
              <dt className="mt-1 text-xs text-white/65 sm:text-sm">{x.t}</dt>
              <dd className="cifras font-display text-2xl text-marfil sm:text-4xl">{x.d}</dd>
            </div>
          ))}
        </dl>
      </div>

      <a href="#viviendas" className="group absolute bottom-40 right-5 hidden items-center gap-3 text-sm text-white/80 sm:right-8 md:flex lg:right-12" aria-label="Desplázate para descubrir las viviendas">
        <span className="tracking-wide">Descubre las viviendas</span>
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white group-hover:text-bosque-900">
          <Icono nombre="flechaAbajo" className="h-4 w-4 animate-desplazar" />
        </span>
      </a>
      <p className="absolute right-5 top-24 text-[0.7rem] text-white/60 sm:right-8 sm:top-28 lg:right-12">Modelo Ranco · imagen referencial</p>
    </section>
  );
}
