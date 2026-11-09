import { MARCA } from '@/lib/config';
import { CAJA, HORIZONTAL, SIMBOLO, TEXTO } from './logo-datos';

/** Símbolo: el "1" que es una llave con ojo de cerradura. Trazos en components/ui/logo-datos.ts (generados). */
export function Simbolo({ className = 'h-9 w-auto', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox={`${CAJA.x} ${CAJA.y} ${CAJA.w} ${CAJA.h}`} className={className} aria-hidden="true">
      <path fillRule="evenodd" fill={color} d={SIMBOLO} />
    </svg>
  );
}

/** Logo horizontal oficial: símbolo | Primera / Llave. `claro` = sobre fondo oscuro. */
export function Logo({ claro = false, className = 'h-10 w-auto' }: { claro?: boolean; className?: string }) {
  const simbolo = claro ? '#F2B33D' : '#0F2A22';
  const texto = claro ? '#FBF6EC' : '#0F2A22';
  const barra = claro ? 'rgba(242,179,61,.45)' : 'rgba(15,42,34,.3)';
  return (
    <svg viewBox={`${CAJA.x} ${CAJA.y} ${HORIZONTAL.ancho} ${CAJA.h}`} className={className} role="img" aria-label={MARCA}>
      <path fillRule="evenodd" fill={simbolo} d={SIMBOLO} className="transition-colors duration-500" />
      <rect x={HORIZONTAL.xBarra} y={HORIZONTAL.yBarra} width={2.5} height={104} fill={barra} />
      <path fill={texto} d={TEXTO} className="transition-colors duration-500" />
    </svg>
  );
}
