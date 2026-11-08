'use client';
import { useEffect, useState } from 'react';
import { CONTACTO } from '@/lib/config';
import { Icono } from '../ui/Icono';

/** WhatsApp discreto: aparece al salir del hero y no tapa contenido en móvil. */
export default function WhatsAppFlotante({ mensaje = 'Hola, quiero información sobre sus viviendas para el subsidio DS1.' }: { mensaje?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const f = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <a href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`} target="_blank" rel="noopener noreferrer"
      aria-label="Conversar por WhatsApp" tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-bosque pl-4 pr-4 text-marfil shadow-elevada ring-1 ring-white/10 transition-all duration-500 ease-suave hover:bg-bosque-900 sm:pr-5 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}>
      <Icono nombre="whatsapp" className="h-6 w-6" />
      <span className="hidden text-sm font-semibold sm:inline">¿Conversamos?</span>
    </a>
  );
}
