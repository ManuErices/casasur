'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from '../ui/Logo';
import { Icono } from '../ui/Icono';
import { CONTACTO } from '@/lib/config';

const ENLACES = [
  { href: '/#viviendas', texto: 'Viviendas' },
  { href: '/#ds1', texto: 'Subsidio DS1' },
  { href: '/#simulador', texto: 'Simulador' },
  { href: '/#proceso', texto: 'Proceso' },
  { href: '/portal', texto: 'Soy cliente' },
];

/** Cabecera fija: transparente sobre el hero y marfil con desenfoque al desplazarse. */
export default function Cabecera({ sobreFoto = false }: { sobreFoto?: boolean }) {
  const [desplazado, setDesplazado] = useState(!sobreFoto);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!sobreFoto) return;
    const alDesplazar = () => setDesplazado(window.scrollY > 40);
    alDesplazar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, [sobreFoto]);

  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [abierto]);

  const claro = !desplazado && !abierto;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-suave ${desplazado && !abierto ? 'border-b border-grafito/5 bg-marfil/85 shadow-[0_1px_0_rgba(0,0,0,.02)] backdrop-blur-xl' : 'bg-transparent'}`}>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Saltar al contenido</a>
      <div className={`contenedor flex items-center justify-between transition-all duration-500 ${desplazado ? 'h-[72px]' : 'h-[88px]'}`}>
        <Link href="/" aria-label="Casa Sur, ir al inicio" className="relative z-10"><Logo claro={claro} /></Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {ENLACES.map((e) => (
            <Link key={e.href} href={e.href} className={`rounded-full px-4 py-2 text-[0.93rem] font-medium transition-colors ${claro ? 'text-white/85 hover:bg-white/10 hover:text-white' : 'text-grafito-700 hover:bg-bosque/5 hover:text-bosque-900'}`}>
              {e.texto}
            </Link>
          ))}
          <Link href="/#contacto" className={`ml-3 ${claro ? 'boton-claro' : 'boton-bosque'} !min-h-[44px] !px-5 !text-[0.9rem]`}>Agenda una asesoría</Link>
        </nav>

        <button type="button" onClick={() => setAbierto((v) => !v)} aria-expanded={abierto} aria-controls="menu-movil"
          className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${claro ? 'bg-white/15 text-white backdrop-blur' : 'bg-bosque/5 text-bosque-900'}`}>
          <span className="sr-only">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
          <Icono nombre={abierto ? 'cerrar' : 'menu'} className="h-5 w-5" />
        </button>
      </div>

      {/* Menú móvil a pantalla completa */}
      <div id="menu-movil" hidden={!abierto} className="fixed inset-0 bg-marfil lg:hidden">
        <nav aria-label="Móvil" className="contenedor flex h-full flex-col pb-10 pt-28">
          <ul className="flex flex-col">
            {ENLACES.map((e, i) => (
              <li key={e.href} className="animate-aparecer border-b border-grafito/10" style={{ animationDelay: `${i * 50}ms` }}>
                <Link href={e.href} onClick={() => setAbierto(false)} className="flex items-center justify-between py-5 font-display text-3xl text-bosque-950">
                  {e.texto}<Icono nombre="flecha" className="h-5 w-5 text-bosque-300" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <Link href="/#contacto" onClick={() => setAbierto(false)} className="boton-accion w-full">Agenda una asesoría</Link>
            <a href={`https://wa.me/${CONTACTO.whatsapp}`} className="boton-linea w-full"><Icono nombre="whatsapp" />Escríbenos por WhatsApp</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
