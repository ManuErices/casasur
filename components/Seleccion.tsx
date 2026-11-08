'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { MODELOS, UF_RESPALDO } from '@/lib/config';

type Ctx = {
  modeloId: string;
  setModeloId: (id: string) => void;
  valorUF: number;
  ufDelDia: boolean;
};

const SeleccionCtx = createContext<Ctx | null>(null);

/** Comparte el modelo elegido y el valor de la UF entre el selector, el simulador y el formulario. */
export function SeleccionProvider({ children }: { children: React.ReactNode }) {
  const [modeloId, setModeloId] = useState(MODELOS[2].id);
  const [valorUF, setValorUF] = useState(UF_RESPALDO);
  const [ufDelDia, setUfDelDia] = useState(false);

  useEffect(() => {
    fetch('/api/uf')
      .then((r) => r.json())
      .then((d: { valor: number; delDia: boolean }) => {
        if (d.valor > 0) { setValorUF(d.valor); setUfDelDia(d.delDia); }
      })
      .catch(() => {});
  }, []);

  return <SeleccionCtx.Provider value={{ modeloId, setModeloId, valorUF, ufDelDia }}>{children}</SeleccionCtx.Provider>;
}

export function useSeleccion(): Ctx {
  const c = useContext(SeleccionCtx);
  if (!c) throw new Error('useSeleccion debe usarse dentro de SeleccionProvider');
  return c;
}
