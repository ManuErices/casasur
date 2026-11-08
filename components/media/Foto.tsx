'use client';
import Image from 'next/image';
import { useState } from 'react';
import type { Foto as TFoto } from '@/lib/viviendas';
import { Fachada, type ModeloIlustrado } from './Fachada';
import { Icono } from '../ui/Icono';

/**
 * Imagen del catálogo. Acepta tres orígenes:
 *  - "ilustracion:<modelo>": ilustración de fachada (sin fotografía todavía).
 *  - Ruta local (/fotos/...): optimizada con next/image.
 *  - URL externa: <img> con respaldo elegante si no carga.
 * Siempre llena su contenedor (que debe ser `relative` y tener alto).
 */
export function Foto({ foto, sizes = '100vw', prioridad = false, className = '' }: {
  foto: TFoto; sizes?: string; prioridad?: boolean; className?: string;
}) {
  const [fallo, setFallo] = useState(false);
  const base = `absolute inset-0 h-full w-full object-cover ${className}`;

  if (foto.src.startsWith('ilustracion:')) {
    return <Fachada modelo={foto.src.split(':')[1] as ModeloIlustrado} titulo={foto.alt} className={base} />;
  }
  if (fallo) {
    return (
      <div className={`${base} flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-arena-100 to-arena-200 p-6 text-center text-bosque-700`} role="img" aria-label={foto.alt}>
        <Icono nombre="casa" className="h-8 w-8 opacity-60" />
        <span className="max-w-[16rem] text-sm leading-snug opacity-80">{foto.alt}</span>
      </div>
    );
  }
  if (foto.src.startsWith('/')) {
    return <Image src={foto.src} alt={foto.alt} fill sizes={sizes} priority={prioridad} className={base} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={foto.src} alt={foto.alt} loading={prioridad ? 'eager' : 'lazy'} decoding="async" onError={() => setFallo(true)} className={base} />
  );
}
