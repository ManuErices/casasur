import Link from 'next/link';
import { CONTACTO, MARCA } from '@/lib/config';
import { Logo } from '../ui/Logo';
import { Icono } from '../ui/Icono';

const NAV = [
  { t: 'Explorar', l: [{ h: '/#viviendas', t: 'Viviendas' }, { h: '/#simulador', t: 'Simulador' }, { h: '/#por-que', t: 'Por qué Casa Sur' }] },
  { t: 'Aprender', l: [{ h: '/#ds1', t: 'Subsidio DS1' }, { h: '/#proceso', t: 'Proceso de compra' }, { h: '/#confianza', t: 'Testimonios' }] },
  { t: 'Clientes', l: [{ h: '/portal', t: 'Portal de clientes' }, { h: '/#contacto', t: 'Agenda una asesoría' }, { h: '/privacidad', t: 'Aviso de privacidad' }] },
];

export default function Pie() {
  const redes = [
    { h: CONTACTO.instagram, t: 'Instagram', i: 'instagram' as const },
    { h: CONTACTO.facebook, t: 'Facebook', i: 'facebook' as const },
    { h: `https://wa.me/${CONTACTO.whatsapp}`, t: 'WhatsApp', i: 'whatsapp' as const },
  ].filter((r) => r.h);

  return (
    <footer className="bg-bosque-950 text-marfil/70">
      <div className="contenedor grid gap-14 py-20 lg:grid-cols-[1.3fr_2fr]">
        <div className="flex flex-col gap-6">
          <Logo claro />
          <p className="max-w-sm font-display text-2xl leading-snug text-marfil">Hacemos posible la primera casa de las familias del sur.</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li><a href={`https://wa.me/${CONTACTO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-2.5 hover:text-white"><Icono nombre="whatsapp" className="h-4 w-4" />WhatsApp {CONTACTO.telefono}</a></li>
            <li><a href={`tel:${CONTACTO.telefono.replace(/\s/g, '')}`} className="inline-flex min-h-[40px] items-center gap-2.5 hover:text-white"><Icono nombre="telefono" className="h-4 w-4" />{CONTACTO.telefono}</a></li>
            <li><a href={`mailto:${CONTACTO.email}`} className="inline-flex min-h-[40px] items-center gap-2.5 hover:text-white"><Icono nombre="correo" className="h-4 w-4" />{CONTACTO.email}</a></li>
            <li className="inline-flex min-h-[40px] items-center gap-2.5"><Icono nombre="ubicacion" className="h-4 w-4" />{CONTACTO.direccion}</li>
          </ul>
          <ul className="flex gap-2" aria-label="Redes sociales">
            {redes.map((r) => (
              <li key={r.t}><a href={r.h} target="_blank" rel="noopener noreferrer" aria-label={r.t} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:bg-white hover:text-bosque-950"><Icono nombre={r.i} className="h-[18px] w-[18px]" /></a></li>
            ))}
          </ul>
        </div>
        <nav aria-label="Pie de página" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {NAV.map((g) => (
            <div key={g.t}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-arena-300">{g.t}</p>
              <ul className="mt-5 flex flex-col gap-1">
                {g.l.map((x) => <li key={x.h}><Link href={x.h} className="inline-flex min-h-[40px] items-center hover:text-white">{x.t}</Link></li>)}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="contenedor flex flex-col gap-3 py-8 text-xs leading-relaxed text-marfil/45 lg:flex-row lg:justify-between">
          <p>© {new Date().getFullYear()} {MARCA} · {CONTACTO.razonSocial} · Registro Nacional de Contratistas MINVU {CONTACTO.registroMinvu} · Entidad Patrocinante: {CONTACTO.egis}</p>
          <p className="max-w-xl lg:text-right">Imágenes referenciales. Viviendas, precios y testimonios del sitio son de demostración. El subsidio DS1 es otorgado por el MINVU y su obtención está sujeta a sus requisitos. <Link href="/privacidad" className="underline underline-offset-2 hover:text-white">Aviso legal y de privacidad</Link>.</p>
        </div>
      </div>
    </footer>
  );
}
