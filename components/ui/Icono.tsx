/** Iconografía lineal propia: trazo fino, extremos redondeados, 24×24. */
const trazos = {
  cama: <><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" /><path d="M3 15h18M3 18v2M21 18v2" /><path d="M7 9V6.5A1.5 1.5 0 0 1 8.5 5h7A1.5 1.5 0 0 1 17 6.5V9" /></>,
  bano: <><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z" /><path d="M6 12V6a2 2 0 0 1 3.6-1.2" /><path d="M7 19l-1 2M17 19l1 2" /></>,
  superficie: <><path d="M4 4h16v16H4z" /><path d="M4 9h5V4M15 20v-5h5" /></>,
  auto: <><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v2H3z" /><circle cx="7.5" cy="13" r=".5" /><circle cx="16.5" cy="13" r=".5" /></>,
  ubicacion: <><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  flecha: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  flechaAbajo: <><path d="M12 5v14M6 13l6 6 6-6" /></>,
  check: <><path d="m5 12.5 4.5 4.5L19 7.5" /></>,
  escudo: <><path d="M12 3 4.5 6v6c0 4.4 3.2 7.9 7.5 9 4.3-1.1 7.5-4.6 7.5-9V6L12 3Z" /><path d="m9 12 2 2 4-4" /></>,
  documento: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></>,
  llave: <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M17 6l2 2M15 8l2 2" /></>,
  hoja: <><path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" /><path d="M5 19 13 11" /></>,
  sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></>,
  persona: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>,
  telefono: <><path d="M21 16.5v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.4 10.7a16 16 0 0 0 5 5l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.6 2.6.7A2 2 0 0 1 21 16.5Z" /></>,
  correo: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  whatsapp: <><path d="M20.5 11.6a8.6 8.6 0 0 1-12.8 7.5L3.5 20.5l1.4-4.1a8.6 8.6 0 1 1 15.6-4.8Z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9c-1-.4-2.4-1.8-2.8-2.8l.9-1-1-2L9 8.5Z" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" /></>,
  facebook: <><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" /></>,
  cerrar: <><path d="M6 6l12 12M18 6 6 18" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h10" /></>,
  filtro: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
  izquierda: <><path d="m15 6-6 6 6 6" /></>,
  derecha: <><path d="m9 6 6 6-6 6" /></>,
  calculadora: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h4" /></>,
  casa: <><path d="M3 11 12 4l9 7" /><path d="M5 9.5V20h14V9.5" /><path d="M10 20v-5h4v5" /></>,
  ampliar: <><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  reloj: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
};

export type NombreIcono = keyof typeof trazos;

export function Icono({ nombre, className = 'h-5 w-5', trazo = 1.6, titulo }: { nombre: NombreIcono; className?: string; trazo?: number; titulo?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={trazo} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden={titulo ? undefined : true} role={titulo ? 'img' : undefined} aria-label={titulo}>
      {trazos[nombre]}
    </svg>
  );
}
