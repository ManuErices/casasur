import type { ReactNode } from 'react';
import { Revelar } from './Revelar';

/** Encabezado editorial de sección: antetítulo, título grande y bajada breve. */
export function Encabezado({ antetitulo, titulo, bajada, id, claro = false, centrado = false, children }: {
  antetitulo: string; titulo: ReactNode; bajada?: ReactNode; id: string; claro?: boolean; centrado?: boolean; children?: ReactNode;
}) {
  return (
    <Revelar className={`flex flex-col gap-5 ${centrado ? 'mx-auto items-center text-center' : ''} max-w-3xl`}>
      <span className={`antetitulo-cs ${claro ? '!text-arena-300' : ''}`}>{antetitulo}</span>
      <h2 id={id} className={`equilibrar font-display text-display-lg ${claro ? 'text-marfil' : 'text-bosque-950'}`}>{titulo}</h2>
      {bajada && <p className={`max-w-2xl text-lg leading-relaxed ${claro ? 'text-marfil/75' : 'text-grafito-500'}`}>{bajada}</p>}
      {children}
    </Revelar>
  );
}
