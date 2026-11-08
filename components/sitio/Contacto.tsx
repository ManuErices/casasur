import Image from 'next/image';
import { CONTACTO } from '@/lib/config';
import { opcionesVivienda } from '@/lib/catalogo';
import Formulario from './Formulario';
import { Icono } from '../ui/Icono';
import { Revelar } from '../ui/Revelar';

/** Cierre emocional + captura: la llamada a la acción final ES el formulario. */
export default function Contacto() {
  return (
    <section id="contacto" aria-labelledby="t-contacto" className="grano relative isolate overflow-hidden bg-bosque-950 py-24 text-marfil sm:py-32">
      <Image src="/fotos/ranco-atardecer.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover object-[70%_center]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bosque-950/95 via-bosque-950/80 to-bosque-950/40" />

      <div className="contenedor grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <Revelar className="flex flex-col gap-8">
          <span className="antetitulo-cs !text-arena-300">Tu próximo capítulo</span>
          <h2 id="t-contacto" className="equilibrar font-display text-display-lg">
            Hay decisiones que cambian tu vida. <em className="text-arena-200">Encontrar tu casa es una de ellas.</em>
          </h2>
          <p className="max-w-lg text-lg text-marfil/75">Déjanos tus datos y un asesor te llamará para revisar tu caso. Sin presión: primero entender, después decidir.</p>
          <ul className="flex flex-col gap-3 text-marfil/85">
            {['Primera asesoría sin costo ni compromiso', 'Te decimos con claridad si tu caso es viable', 'Un solo asesor de principio a fin'].map((x) => (
              <li key={x} className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10"><Icono nombre="check" className="h-3.5 w-3.5" trazo={2.4} /></span>{x}</li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-arena-200 font-display text-xl text-bosque-900">{CONTACTO.asesor.charAt(0)}</span>
              <div><p className="font-semibold">{CONTACTO.asesor}</p><p className="text-sm text-marfil/60">Tu asesor</p></div>
            </div>
            <a href={`tel:${CONTACTO.telefono.replace(/\s/g, '')}`} className="flex min-h-[44px] items-center gap-2 text-marfil/85 hover:text-white"><Icono nombre="telefono" className="h-4 w-4" />{CONTACTO.telefono}</a>
            <a href={`https://wa.me/${CONTACTO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center gap-2 text-marfil/85 hover:text-white"><Icono nombre="whatsapp" className="h-4 w-4" />WhatsApp</a>
          </div>
          <p className="text-sm text-marfil/50">{CONTACTO.horario}</p>
        </Revelar>

        <Revelar retraso={150} className="rounded-4xl bg-marfil p-6 text-grafito shadow-elevada sm:p-9">
          <p className="mb-6 font-display text-2xl text-bosque-950 sm:text-3xl">Cuéntanos de ti</p>
          <Formulario opciones={opcionesVivienda()} />
        </Revelar>
      </div>
    </section>
  );
}
