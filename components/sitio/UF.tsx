'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { UF_RESPALDO } from '@/lib/config';

type UF = { valor: number; delDia: boolean };
const Ctx = createContext<UF>({ valor: UF_RESPALDO, delDia: false });

/** Valor de la UF del día (vía /api/uf, con respaldo si el servicio no responde). */
export function UFProvider({ children }: { children: ReactNode }) {
  const [uf, setUf] = useState<UF>({ valor: UF_RESPALDO, delDia: false });
  useEffect(() => {
    fetch('/api/uf').then((r) => r.json()).then((d: UF) => { if (d.valor > 0) setUf(d); }).catch(() => {});
  }, []);
  return <Ctx.Provider value={uf}>{children}</Ctx.Provider>;
}

export const useUF = () => useContext(Ctx);

/** Monto en pesos a partir de UF, con formato chileno. */
export function EnPesos({ uf, compacto = false }: { uf: number; compacto?: boolean }) {
  const { valor } = useUF();
  const pesos = uf * valor;
  if (compacto) return <>${(pesos / 1_000_000).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} millones</>;
  return <>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(pesos)}</>;
}
