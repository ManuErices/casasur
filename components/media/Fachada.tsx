/**
 * Ilustraciones de fachada a la hora dorada, con paisaje de Los Ríos (volcán, bosque nativo y pradera).
 * Se usan mientras no existan fotografías o renders reales del modelo.
 * Reemplázalas agregando fotos en lib/viviendas.ts (campo `fotos`).
 */
import { useId } from 'react';

type Modelo = 'calle-calle' | 'niebla' | 'ranco';

/** Pino/coigüe estilizado: copa en capas triangulares. */
function Arbol({ x, base, alto, ancho, color }: { x: number; base: number; alto: number; ancho: number; color: string }) {
  const capas = 4;
  const pts: string[] = [];
  for (let i = 0; i < capas; i++) {
    const y0 = base - (alto * i) / (capas + 0.4);
    const w = ancho * (1 - i / (capas + 1));
    pts.push(`M${x - w / 2},${y0} L${x},${y0 - alto / 2.1} L${x + w / 2},${y0} Z`);
  }
  return (
    <g fill={color}>
      <rect x={x - 3} y={base - 10} width={6} height={18} />
      <path d={pts.join(' ')} />
    </g>
  );
}

function Bosque({ desde, hasta, base, alto, color, semilla }: { desde: number; hasta: number; base: number; alto: number; color: string; semilla: number }) {
  const arboles = [];
  let x = desde;
  let s = semilla;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  while (x < hasta) {
    const a = alto * (0.7 + rnd() * 0.55);
    arboles.push(<Arbol key={x} x={x} base={base + rnd() * 10} alto={a} ancho={a * 0.42} color={color} />);
    x += 18 + rnd() * 26;
  }
  return <g>{arboles}</g>;
}

function Ventana({ x, y, w, h, id }: { x: number; y: number; w: number; h: number; id: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={`url(#luz-${id})`} stroke="#23282A" strokeWidth={7} />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke="#23282A" strokeWidth={4} />
      <rect x={x + 6} y={y + 6} width={w / 2 - 10} height={h * 0.35} fill="#FFF6E2" opacity={0.35} />
    </g>
  );
}

function CalleCalle({ id }: { id: string }) {
  return (
    <g>
      <rect x={440} y={560} width={720} height={240} fill="#EEE7DA" />
      <g stroke="#D9CFBD" strokeWidth={2}>
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={440} x2={1160} y1={578 + i * 19} y2={578 + i * 19} />)}
      </g>
      <rect x={440} y={560} width={720} height={240} fill="none" stroke="#23282A" strokeWidth={4} />
      <polygon points="410,572 1190,572 1150,460 450,460" fill="#4B5352" />
      <g stroke="#5E6766" strokeWidth={3}>
        {Array.from({ length: 22 }, (_, i) => { const x = 470 + i * 31; return <line key={i} x1={x} y1={462} x2={x - 18 + i * 1.6} y2={570} />; })}
      </g>
      <polygon points="410,572 1190,572 1190,582 410,582" fill="#2C3131" />
      <Ventana x={495} y={612} w={135} h={104} id={id} />
      <Ventana x={660} y={612} w={135} h={104} id={id} />
      <rect x={845} y={598} width={74} height={202} fill="#26473A" stroke="#23282A" strokeWidth={5} />
      <circle cx={905} cy={705} r={4} fill="#D9B67C" />
      <Ventana x={975} y={618} w={140} h={96} id={id} />
      <rect x={826} y={790} width={112} height={14} fill="#B8AE9C" />
    </g>
  );
}

function Niebla({ id }: { id: string }) {
  return (
    <g>
      <rect x={470} y={590} width={660} height={210} fill="#F1EADD" stroke="#23282A" strokeWidth={4} />
      <rect x={470} y={740} width={660} height={60} fill="#D6CCBA" />
      <clipPath id={`fronton-${id}`}><polygon points="470,592 1130,592 800,388" /></clipPath>
      <polygon points="470,592 1130,592 800,388" fill="#B98250" />
      <g clipPath={`url(#fronton-${id})`} stroke="#94622F" strokeWidth={3}>
        {Array.from({ length: 30 }, (_, i) => <line key={i} x1={480 + i * 22} y1={380} x2={480 + i * 22} y2={600} />)}
      </g>
      <polyline points="438,612 800,372 1162,612" fill="none" stroke="#2D3333" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={800} cy={500} r={26} fill={`url(#luz-${id})`} stroke="#23282A" strokeWidth={5} />
      {/* Techito de acceso */}
      <polygon points="548,636 772,636 760,618 560,618" fill="#2D3333" />
      <rect x={560} y={636} width={10} height={164} fill="#8A5A2B" />
      <rect x={750} y={636} width={10} height={164} fill="#8A5A2B" />
      <rect x={622} y={662} width={78} height={138} fill="#26473A" stroke="#23282A" strokeWidth={5} />
      <circle cx={688} cy={735} r={4} fill="#D9B67C" />
      <Ventana x={820} y={640} w={118} h={96} id={id} />
      <Ventana x={970} y={640} w={118} h={96} id={id} />
      <rect x={600} y={792} width={122} height={14} fill="#B8AE9C" />
    </g>
  );
}

function Ranco({ id }: { id: string }) {
  return (
    <g>
      <polygon points="440,606 1160,540 1160,800 440,800" fill="#2F3435" />
      <g stroke="#3B4142" strokeWidth={3}>
        {Array.from({ length: 36 }, (_, i) => { const x = 452 + i * 20; return <line key={i} x1={x} y1={606 - (x - 440) * 0.0917} x2={x} y2={800} />; })}
      </g>
      <rect x={828} y={560} width={124} height={240} fill="#C38D55" />
      <g stroke="#A8743F" strokeWidth={3}>{Array.from({ length: 7 }, (_, i) => <line key={i} x1={840 + i * 17} y1={560} x2={840 + i * 17} y2={800} />)}</g>
      <polygon points="402,600 1200,524 1200,546 402,624" fill="#1E2223" />
      <Ventana x={480} y={630} w={320} h={34} id={id} />
      <Ventana x={480} y={680} w={150} h={104} id={id} />
      <Ventana x={650} y={680} w={150} h={104} id={id} />
      <rect x={846} y={650} width={78} height={150} fill="#2A2F30" stroke="#1B1F20" strokeWidth={4} />
      <rect x={936} y={644} width={10} height={20} fill="#1B1F20" />
      <circle cx={941} cy={668} r={16} fill="#FFD9A0" opacity={0.35} />
      <rect x={990} y={640} width={78} height={160} fill="#2A2F30" stroke="#1B1F20" strokeWidth={4} />
      <Ventana x={1090} y={620} w={50} h={70} id={id} />
      {/* Terraza */}
      <rect x={420} y={780} width={540} height={22} fill="#C9935C" />
      <rect x={560} y={802} width={300} height={14} fill="#B98250" />
      <rect x={540} y={816} width={340} height={14} fill="#A9763F" />
      <g stroke="#C9935C" strokeWidth={9} strokeLinecap="round">
        <line x1={430} y1={712} x2={430} y2={782} /><line x1={600} y1={712} x2={600} y2={782} />
        <line x1={430} y1={716} x2={600} y2={716} /><line x1={430} y1={742} x2={600} y2={742} />
      </g>
    </g>
  );
}

const CASAS = { 'calle-calle': CalleCalle, niebla: Niebla, ranco: Ranco };

export function Fachada({ modelo, titulo, className = '' }: { modelo: Modelo; titulo: string; className?: string }) {
  const id = useId().replace(/:/g, '');
  const Casa = CASAS[modelo];
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label={titulo} className={className}>
      <defs>
        <linearGradient id={`cielo-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FAAB6" />
          <stop offset=".55" stopColor="#E9D3B4" />
          <stop offset="1" stopColor="#F4DEC0" />
        </linearGradient>
        <radialGradient id={`sol-${id}`} cx="1260" cy="560" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE3B3" stopOpacity=".95" />
          <stop offset="1" stopColor="#FFE3B3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`pasto-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7D9560" />
          <stop offset="1" stopColor="#4E673B" />
        </linearGradient>
        <linearGradient id={`luz-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FCE2B0" />
          <stop offset="1" stopColor="#E7A55E" />
        </linearGradient>
        <linearGradient id={`velo-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset=".6" stopColor="#142820" stopOpacity="0" />
          <stop offset="1" stopColor="#142820" stopOpacity=".35" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#cielo-${id})`} />
      <rect width="1600" height="1000" fill={`url(#sol-${id})`} />
      {/* Volcán */}
      <polygon points="940,600 1250,318 1282,306 1314,318 1640,600" fill="#90A2A6" />
      <polygon points="1196,368 1250,318 1282,306 1314,318 1370,370 1336,360 1306,378 1278,358 1246,380 1222,362" fill="#F6F2EA" />
      {/* Cerros */}
      <path d="M0 640 C 200 560 380 600 560 570 S 900 610 1100 590 S 1450 560 1600 600 V 1000 H 0 Z" fill="#7C968A" opacity=".85" />
      <Bosque desde={-20} hasta={1640} base={650} alto={70} color="#56756A" semilla={7} />
      <path d="M0 700 C 260 660 520 690 800 680 S 1300 670 1600 690 V 1000 H 0 Z" fill="#3E5F51" />
      <Bosque desde={-20} hasta={360} base={760} alto={150} color="#2D4D40" semilla={3} />
      <Bosque desde={1240} hasta={1640} base={760} alto={150} color="#2D4D40" semilla={11} />
      {/* Pradera */}
      <rect x="0" y="770" width="1600" height="230" fill={`url(#pasto-${id})`} />
      <ellipse cx="800" cy="812" rx="470" ry="26" fill="#2E3D25" opacity=".35" />
      <Casa id={id} />
      <path d="M760 830 C 740 900 640 960 560 1000 H 900 C 880 950 860 890 880 830 Z" fill="#B9B3A6" opacity=".85" />
      {/* Arbustos y árboles de primer plano */}
      <Arbol x={150} base={900} alto={420} ancho={170} color="#1F3B2E" />
      <Arbol x={1480} base={910} alto={460} ancho={180} color="#1F3B2E" />
      <ellipse cx="380" cy="808" rx="70" ry="34" fill="#4F6E3F" />
      <ellipse cx="1210" cy="806" rx="60" ry="30" fill="#4F6E3F" />
      <rect width="1600" height="1000" fill={`url(#velo-${id})`} />
    </svg>
  );
}

export type { Modelo as ModeloIlustrado };
