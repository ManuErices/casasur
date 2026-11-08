export function pesos(valor: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(valor);
}

export function millones(valor: number): string {
  return `$${(valor / 1_000_000).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} millones`;
}

export function uf(valor: number): string {
  return `${Math.round(valor).toLocaleString('es-CL')} UF`;
}

export function fecha(valor: Date | null | undefined): string {
  if (!valor) return '—';
  return valor.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function diasHasta(valor: Date | null | undefined): number | null {
  if (!valor) return null;
  const ms = valor.getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

/** Código para el portal de la familia, sin letras que se confundan (0/O, 1/I). */
export function nuevoCodigo(): string {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += letras[Math.floor(Math.random() * letras.length)];
  return `CS-${s}`;
}
