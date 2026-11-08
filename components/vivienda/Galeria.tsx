'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Foto as TFoto } from '@/lib/viviendas';
import { Foto } from '../media/Foto';
import { Icono } from '../ui/Icono';

/** Mosaico de fotos (1 grande + 4) con visor a pantalla completa navegable con teclado y gestos. */
export default function Galeria({ fotos, nombre }: { fotos: TFoto[]; nombre: string }) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const toque = useRef<number | null>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  const mover = useCallback((d: number) => setAbierta((i) => (i === null ? i : (i + d + fotos.length) % fotos.length)), [fotos.length]);

  useEffect(() => {
    if (abierta === null) return;
    document.body.style.overflow = 'hidden';
    cerrarRef.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(null);
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    window.addEventListener('keydown', tecla);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', tecla); };
  }, [abierta, mover]);

  const visibles = fotos.slice(0, 5);
  return (
    <>
      {/* Móvil: carrusel deslizable */}
      <div className="ocultar-scroll -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:hidden">
        {fotos.map((f, i) => (
          <button key={f.src + i} type="button" onClick={() => setAbierta(i)} className="relative aspect-[4/3] w-[86%] flex-none snap-center overflow-hidden rounded-3xl bg-arena-100" aria-label={`Ampliar foto ${i + 1} de ${fotos.length}`}>
            <Foto foto={f} sizes="86vw" prioridad={i === 0} />
            {f.referencial && <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] text-white backdrop-blur">Ambientación</span>}
          </button>
        ))}
      </div>

      {/* Escritorio: mosaico */}
      <div className="hidden h-[min(68vh,620px)] grid-cols-4 grid-rows-2 gap-3 sm:grid">
        {visibles.map((f, i) => (
          <button key={f.src + i} type="button" onClick={() => setAbierta(i)}
            className={`group relative overflow-hidden bg-arena-100 ${i === 0 ? 'col-span-2 row-span-2 rounded-l-4xl' : ''} ${i === 2 ? 'rounded-tr-4xl' : ''} ${i === 4 ? 'rounded-br-4xl' : ''}`}
            aria-label={`Ampliar foto ${i + 1} de ${fotos.length}: ${f.alt}`}>
            <span className="absolute inset-0 transition-transform duration-700 ease-suave group-hover:scale-105"><Foto foto={f} sizes={i === 0 ? '50vw' : '25vw'} prioridad={i === 0} /></span>
            {f.referencial && <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] text-white backdrop-blur">Ambientación</span>}
            {i === visibles.length - 1 && fotos.length > visibles.length && (
              <span className="absolute inset-0 flex items-center justify-center bg-bosque-950/45 font-semibold text-white">+{fotos.length - visibles.length} fotos</span>
            )}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setAbierta(0)} className="mt-4 hidden items-center gap-2 text-sm font-semibold text-bosque-700 sm:inline-flex">
        <Icono nombre="ampliar" className="h-4 w-4" />Ver las {fotos.length} imágenes
      </button>

      {abierta !== null && (
        <div role="dialog" aria-modal="true" aria-label={`Fotos de ${nombre}`} className="fixed inset-0 z-[60] flex flex-col bg-grafito-900/97 text-white backdrop-blur"
          onTouchStart={(e) => { toque.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => { if (toque.current === null) return; const d = e.changedTouches[0].clientX - toque.current; if (Math.abs(d) > 50) mover(d < 0 ? 1 : -1); toque.current = null; }}>
          <div className="flex items-center justify-between p-4 sm:p-6">
            <p className="cifras text-sm text-white/70">{abierta + 1} / {fotos.length}</p>
            <button ref={cerrarRef} type="button" onClick={() => setAbierta(null)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Cerrar">
              <Icono nombre="cerrar" />
            </button>
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-x-0 inset-y-0 mx-auto max-w-6xl sm:inset-x-20">
              <div className="relative h-full w-full overflow-hidden sm:rounded-3xl"><Foto key={abierta} foto={fotos[abierta]} sizes="100vw" className="!object-contain" /></div>
            </div>
            <button type="button" onClick={() => mover(-1)} className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:flex" aria-label="Foto anterior"><Icono nombre="izquierda" /></button>
            <button type="button" onClick={() => mover(1)} className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:flex" aria-label="Foto siguiente"><Icono nombre="derecha" /></button>
          </div>
          <p className="p-4 text-center text-sm text-white/70 sm:p-6">{fotos[abierta].alt}{fotos[abierta].referencial ? ' · imagen de ambientación' : ''}</p>
        </div>
      )}
    </>
  );
}
