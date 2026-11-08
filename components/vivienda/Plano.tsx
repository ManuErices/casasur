/**
 * Plano de distribución referencial (sin escala). Dos variantes:
 *  - 43 m²: estar-comedor-cocina, 2 dormitorios y baño (igual en los 3 modelos).
 *  - ampliada: ejemplo de crecimiento con tercer dormitorio y segundo baño (demo).
 */
type Pieza = { x: number; y: number; w: number; h: number; nombre: string; m2?: number; zona: 'social' | 'privada' | 'servicio' };
const RELLENO = { social: '#F1E9DC', privada: '#E9EFEA', servicio: '#E3ECF1' };

const P43: { ancho: number; alto: number; piezas: Pieza[]; ventanas: number[][]; puertas: number[][] } = {
  ancho: 360, alto: 300,
  piezas: [
    { x: 9, y: 9, w: 342, h: 125, nombre: 'Estar · Comedor · Cocina', m2: 17, zona: 'social' },
    { x: 144.5, y: 138.5, w: 75, h: 38, nombre: '', zona: 'social' },
    { x: 9, y: 138.5, w: 131, h: 152.5, nombre: 'Dormitorio 1', m2: 8, zona: 'privada' },
    { x: 144.5, y: 181, w: 75, h: 110, nombre: 'Baño', zona: 'servicio' },
    { x: 224, y: 138.5, w: 127, h: 152.5, nombre: 'Dormitorio 2', m2: 8, zona: 'privada' },
  ],
  ventanas: [[22.5, 0, 75, 9], [102.5, 0, 75, 9], [257.5, 0, 60, 9], [44.5, 291, 60, 9], [169.5, 291, 25, 9], [257.5, 291, 60, 9]],
  puertas: [[197.5, 0, 42.5, 9]],
};

const PAMP: typeof P43 = {
  ancho: 460, alto: 300,
  piezas: [
    { x: 9, y: 9, w: 312, h: 125, nombre: 'Estar · Comedor · Cocina', m2: 19, zona: 'social' },
    { x: 325, y: 9, w: 126, h: 125, nombre: 'Dormitorio 3', m2: 8, zona: 'privada' },
    { x: 144.5, y: 138.5, w: 118, h: 38, nombre: '', zona: 'social' },
    { x: 9, y: 138.5, w: 131, h: 152.5, nombre: 'Dormitorio principal', m2: 9, zona: 'privada' },
    { x: 144.5, y: 181, w: 57, h: 110, nombre: 'Baño', zona: 'servicio' },
    { x: 205.5, y: 181, w: 57, h: 110, nombre: 'Baño 2', zona: 'servicio' },
    { x: 267, y: 138.5, w: 184, h: 152.5, nombre: 'Dormitorio 2', m2: 8, zona: 'privada' },
  ],
  ventanas: [[22.5, 0, 75, 9], [102.5, 0, 75, 9], [355, 0, 60, 9], [44.5, 291, 60, 9], [160, 291, 25, 9], [220, 291, 25, 9], [320, 291, 80, 9]],
  puertas: [[200, 0, 42.5, 9]],
};

export function Plano({ ampliada = false, className = '' }: { ampliada?: boolean; className?: string }) {
  const p = ampliada ? PAMP : P43;
  const desc = p.piezas.filter((x) => x.nombre).map((x) => `${x.nombre}${x.m2 ? ` de ${x.m2} m²` : ''}`).join(', ');
  return (
    <svg viewBox={`-20 -20 ${p.ancho + 40} ${p.alto + 60}`} role="img" aria-label={`Plano referencial: ${desc}`} className={className}>
      <rect x={0} y={0} width={p.ancho} height={p.alto} fill="#25292A" rx={2} />
      {p.piezas.map((x, i) => <rect key={i} x={x.x} y={x.y} width={x.w} height={x.h} fill={RELLENO[x.zona]} />)}
      <g fill="#9CC0D4">{p.ventanas.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} />)}</g>
      <g fill="#B3412B">{p.puertas.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} />)}</g>
      {/* Muebles de cocina */}
      <rect x={ampliada ? 205 : 242.5} y={9} width={ampliada ? 112 : 108.5} height={26} fill="#D2BF9F" />
      {p.piezas.filter((x) => x.nombre).map((x, i) => (
        <g key={i} fontFamily="var(--fuente-texto), sans-serif" textAnchor="middle">
          <text x={x.x + x.w / 2} y={x.y + x.h / 2 + (x.m2 ? 0 : 4)} fontSize={x.w < 70 ? 10 : 13} fontWeight={600} fill="#1A1D1E">{x.nombre}</text>
          {x.m2 && <text x={x.x + x.w / 2} y={x.y + x.h / 2 + 17} fontSize={12} fill="#565D5B">{x.m2} m²</text>}
        </g>
      ))}
      {/* Norte y nota */}
      <g transform={`translate(${p.ancho - 6}, ${p.alto + 26})`} fontFamily="var(--fuente-texto), sans-serif">
        <text x={0} y={4} fontSize={10} fill="#6E7573" textAnchor="end">Plano referencial · sin escala</text>
      </g>
      <g transform={`translate(8, ${p.alto + 24})`} fontFamily="var(--fuente-texto), sans-serif" fontSize={10} fill="#565D5B">
        <rect x={0} y={-7} width={10} height={10} fill={RELLENO.social} stroke="#0002" /><text x={15} y={2}>Social</text>
        <rect x={60} y={-7} width={10} height={10} fill={RELLENO.privada} stroke="#0002" /><text x={75} y={2}>Privada</text>
        <rect x={125} y={-7} width={10} height={10} fill={RELLENO.servicio} stroke="#0002" /><text x={140} y={2}>Servicio</text>
      </g>
    </svg>
  );
}
