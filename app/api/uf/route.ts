import { NextResponse } from 'next/server';
import { UF_RESPALDO } from '@/lib/config';

export const revalidate = 21600; // 6 horas

/** Valor de la UF del día desde mindicador.cl, con respaldo si el servicio no responde. */
export async function GET() {
  try {
    const r = await fetch('https://mindicador.cl/api/uf', { next: { revalidate } });
    if (!r.ok) throw new Error(String(r.status));
    const d = await r.json();
    const valor = Number(d?.serie?.[0]?.valor);
    if (!valor || valor < 10000) throw new Error('valor inválido');
    return NextResponse.json({ valor, delDia: true });
  } catch {
    return NextResponse.json({ valor: UF_RESPALDO, delDia: false });
  }
}
