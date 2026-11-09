'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Foto } from '../media/Foto';
import { Plano } from '../vivienda/Plano';
import { INTERIORES } from '@/lib/viviendas';
import { ETAPAS } from '@/lib/etapas';
import { MARCA } from '@/lib/config';

/** Maqueta del portal de clientes real (/portal): el acompañamiento hecho producto. */
function MaquetaPortal() {
  const actual = 5;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bosque-800 to-bosque-950 p-8">
      <div className="w-[min(78%,300px)] rounded-[2.4rem] bg-grafito-900 p-2.5 shadow-elevada ring-1 ring-white/10">
        <div className="overflow-hidden rounded-[1.9rem] bg-marfil">
          <div className="bg-bosque px-5 pb-5 pt-7 text-marfil">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-arena-200">Portal {MARCA}</p>
            <p className="mt-1 font-display text-xl leading-tight">Hola, familia Soto</p>
            <p className="mt-3 text-[0.7rem] text-marfil/70">Etapa {actual} de {ETAPAS.length}</p>
            <p className="font-display text-lg">{ETAPAS[actual - 1].titulo}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-arena-300" style={{ width: `${(actual / ETAPAS.length) * 100}%` }} /></div>
          </div>
          <ol className="flex flex-col gap-2.5 px-5 py-5">
            {ETAPAS.slice(2, 7).map((e) => (
              <li key={e.id} className="flex items-center gap-2.5 text-[0.72rem]">
                <span className={`flex h-5 w-5 flex-none items-center justify-center rounded-full text-[0.6rem] font-bold ${e.id < actual ? 'bg-bosque text-marfil' : e.id === actual ? 'bg-laton text-bosque-950' : 'bg-arena-200 text-grafito-500'}`}>{e.id < actual ? '✓' : e.id}</span>
                <span className={e.id === actual ? 'font-semibold text-grafito' : 'text-grafito-500'}>{e.titulo}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="absolute bottom-4 left-0 right-0 text-center text-[0.7rem] text-marfil/50">Ilustración del portal de clientes · datos ficticios</p>
    </div>
  );
}

type Capitulo = { titulo: string; texto: string; visual: ReactNode; pie?: string };

const CAPITULOS: Capitulo[] = [
  {
    titulo: 'Diseño funcional',
    texto: 'Una planta simple y clara: la vida en común hacia la luz, el descanso hacia el silencio. Sin pasillos que se coman los metros.',
    visual: <div className="absolute inset-0 flex items-center justify-center bg-marfil-50 p-6 sm:p-10"><Plano className="h-full w-full" /></div>,
  },
  {
    titulo: 'Espacios bien aprovechados',
    texto: 'Estar, comedor y cocina integrados en 17 m² continuos. Clósets en los dormitorios y espacio para la lavadora en el baño.',
    visual: <Foto foto={INTERIORES[0]} sizes="(min-width: 1024px) 50vw, 100vw" />, pie: 'Interior de ambientación',
  },
  {
    titulo: 'Calidad constructiva',
    texto: 'Revestimientos pensados para la lluvia del sur, aleros que protegen los muros y terminaciones que se mantienen con poco.',
    visual: <Foto foto={{ src: '/fotos/ranco-acceso.jpg', alt: 'Detalle del revestimiento de madera y acceso del modelo Ranco' }} sizes="(min-width: 1024px) 50vw, 100vw" />, pie: 'Modelo Ranco · imagen referencial',
  },
  {
    titulo: 'Eficiencia y confort',
    texto: 'Aislación en muros y techo según la norma térmica vigente y ventanas con doble vidrio de baja emisividad. Menos frío, menos humedad, menos gasto.',
    visual: <Foto foto={{ src: '/fotos/ranco-ventanas.jpg', alt: 'Ventanas con doble vidrio del estar del modelo Ranco' }} sizes="(min-width: 1024px) 50vw, 100vw" />, pie: 'Modelo Ranco · imagen referencial',
  },
  {
    titulo: 'Ubicaciones con paisaje',
    texto: 'Construimos en las doce comunas de Los Ríos: cerca de la ciudad, junto a un lago o frente a un volcán. Tu casa, donde está tu vida.',
    visual: <Foto foto={{ src: '/fotos/ranco-volcan.jpg', alt: 'Bosque nativo y volcán nevado del sur de Chile' }} sizes="(min-width: 1024px) 50vw, 100vw" />,
  },
  {
    titulo: 'Acompañamiento real',
    texto: 'Un asesor de principio a fin y un portal para seguir el avance de tu casa desde el celular, con fotos de cada etapa.',
    visual: <MaquetaPortal />,
  },
];

export default function PorQue() {
  const [activo, setActivo] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) setActivo(Number((e.target as HTMLElement).dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section id="por-que" aria-labelledby="t-porque" className="bg-marfil py-24 sm:py-32">
      <div className="contenedor">
        <div className="grid gap-x-16 lg:grid-cols-2">
          {/* Visual fijo (escritorio) */}
          <div className="hidden lg:block">
            <div className="sticky top-[12vh] h-[76vh] overflow-hidden rounded-4xl bg-arena-100 shadow-elevada">
              {CAPITULOS.map((c, i) => (
                <div key={c.titulo} aria-hidden={i !== activo} className={`absolute inset-0 transition-all duration-[900ms] ease-suave ${i === activo ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'}`}>
                  {c.visual}
                  {c.pie && <span className="absolute bottom-4 left-4 rounded-full bg-black/35 px-3 py-1 text-[0.7rem] text-white backdrop-blur">{c.pie}</span>}
                </div>
              ))}
              <div className="absolute right-5 top-5 flex gap-1.5">
                {CAPITULOS.map((c, i) => <span key={c.titulo} className={`h-1.5 rounded-full transition-all duration-500 ${i === activo ? 'w-6 bg-laton' : 'w-1.5 bg-grafito/25'}`} />)}
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-5 lg:min-h-[40vh] lg:justify-center">
              <span className="antetitulo-cs">Por qué {MARCA}</span>
              <h2 id="t-porque" className="equilibrar font-display text-display-lg text-bosque-950">Casas pensadas para el sur. <em>Y para quedarse.</em></h2>
              <p className="max-w-xl text-lg text-grafito-500">No vendemos metros cuadrados: diseñamos la primera casa de una familia. Esto es lo que cuidamos en cada una.</p>
            </div>
            <ol className="mt-12 flex flex-col lg:mt-0">
              {CAPITULOS.map((c, i) => (
                <li key={c.titulo} ref={(el) => { refs.current[i] = el; }} data-i={i}
                  className={`flex flex-col gap-5 border-t border-grafito/10 py-10 transition-opacity duration-500 lg:min-h-[52vh] lg:justify-center ${i === activo ? 'lg:opacity-100' : 'lg:opacity-35'}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-arena-100 lg:hidden">{c.visual}</div>
                  <span className="cifras font-display text-xl text-laton-700">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-[2.2rem] leading-tight text-bosque-950">{c.titulo}</h3>
                  <p className="max-w-lg text-lg leading-relaxed text-grafito-500">{c.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
