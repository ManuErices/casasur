'use client';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

/**
 * Vivienda que le interesa al visitante. La comparten el catálogo, el simulador y el formulario,
 * para que el contacto llegue al equipo indicando qué casa vio.
 */
type Interes = { vivienda: string; elegir: (slug: string, irA?: 'contacto' | 'simulador') => void };
const Ctx = createContext<Interes>({ vivienda: '', elegir: () => {} });

export function InteresProvider({ children, inicial = '' }: { children: ReactNode; inicial?: string }) {
  const [vivienda, setVivienda] = useState(inicial);
  const elegir = useCallback((slug: string, irA?: 'contacto' | 'simulador') => {
    setVivienda(slug);
    if (irA) requestAnimationFrame(() => document.getElementById(irA)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, []);
  return <Ctx.Provider value={{ vivienda, elegir }}>{children}</Ctx.Provider>;
}

export const useInteres = () => useContext(Ctx);
