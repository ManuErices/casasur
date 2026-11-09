'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { COMUNAS, CONTACTO } from '@/lib/config';
import { Icono } from '../ui/Icono';
import { useInteres } from './Interes';

type Estado = 'listo' | 'enviando' | 'enviado' | 'error';
type Opcion = { slug: string; nombre: string; comuna: string };

function Chips({ nombre, leyenda, opciones, requerido = false }: { nombre: string; leyenda: string; opciones: { v: string; t: string }[]; requerido?: boolean }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-grafito-700">{leyenda}{!requerido && <span className="font-normal text-grafito-400"> (opcional)</span>}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o, i) => (
          <label key={o.v} className="relative">
            <input type="radio" name={nombre} value={o.v} required={requerido && i === 0} className="peer sr-only" />
            <span className="flex min-h-[44px] cursor-pointer items-center rounded-full border border-grafito/15 bg-white px-4 text-sm font-medium text-grafito-700 transition-all hover:border-bosque/40 peer-checked:border-bosque peer-checked:bg-bosque peer-checked:text-marfil peer-focus-visible:ring-2 peer-focus-visible:ring-laton">
              {o.t}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Formulario breve de contacto. Envía a /api/leads (Firestore + aviso por correo opcional).
 * Indica qué vivienda le interesa al visitante para que el equipo llegue preparado.
 */
export default function Formulario({ opciones, viviendaFija, compacto = false, textoBoton = 'Quiero encontrar mi casa' }: {
  opciones: Opcion[]; viviendaFija?: string; compacto?: boolean; textoBoton?: string;
}) {
  const { vivienda } = useInteres();
  const [seleccion, setSeleccion] = useState(viviendaFija ?? vivienda ?? '');
  const [estado, setEstado] = useState<Estado>('listo');
  const [error, setError] = useState('');

  useEffect(() => { if (!viviendaFija && vivienda) setSeleccion(vivienda); }, [vivienda, viviendaFija]);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = { ...Object.fromEntries(new FormData(e.currentTarget).entries()), origen: window.location.pathname };
    setEstado('enviando'); setError('');
    try {
      const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'No pudimos enviar tus datos.');
      setEstado('enviado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos enviar tus datos.');
      setEstado('error');
    }
  }

  const elegida = opciones.find((o) => o.slug === seleccion);
  const textoWsp = encodeURIComponent(elegida ? `Hola, me interesa la vivienda ${elegida.nombre} en ${elegida.comuna}.` : 'Hola, quiero información sobre sus viviendas para el subsidio DS1.');

  if (estado === 'enviado') {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bosque text-marfil"><Icono nombre="check" className="h-7 w-7" trazo={2.2} /></span>
        <h3 className="font-display text-3xl text-bosque-950">Recibimos tus datos</h3>
        <p className="text-grafito-500">Te llamaremos para conversar sobre {elegida ? <strong className="text-grafito">{elegida.nombre} en {elegida.comuna}</strong> : 'tu casa'}. Si quieres adelantar la conversación, escríbenos.</p>
        <a href={`https://wa.me/${CONTACTO.whatsapp}?text=${textoWsp}`} target="_blank" rel="noopener noreferrer" className="boton-linea"><Icono nombre="whatsapp" />Escribir por WhatsApp</a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-5">
      <div className={`grid gap-4 ${compacto ? '' : 'sm:grid-cols-2'}`}>
        <label className="campo-cs">Nombre<input className="control-cs" type="text" name="nombre" autoComplete="name" required minLength={2} maxLength={80} /></label>
        <label className="campo-cs">Teléfono<input className="control-cs" type="tel" name="telefono" autoComplete="tel" required minLength={8} maxLength={30} placeholder="+56 9 1234 5678" /></label>
        {!compacto && <label className="campo-cs"><span>Correo <span className="font-normal text-grafito-400">(opcional)</span></span><input className="control-cs" type="email" name="email" autoComplete="email" maxLength={120} /></label>}
        <label className="campo-cs">Comuna
          <select className="control-cs" name="comuna" defaultValue="Valdivia">
            {COMUNAS.map((c) => <option key={c}>{c}</option>)}<option value="Otra">Otra comuna</option>
          </select>
        </label>
        {!viviendaFija && (
          <label className={`campo-cs ${compacto ? '' : 'sm:col-span-2'}`}>Vivienda que te interesa
            <select className="control-cs" name="vivienda" value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
              <option value="">Aún no lo sé</option>
              {opciones.map((o) => <option key={o.slug} value={o.slug}>{o.nombre} · {o.comuna}</option>)}
            </select>
          </label>
        )}
        {viviendaFija && <input type="hidden" name="vivienda" value={viviendaFija} />}
      </div>

      <Chips nombre="subsidio" leyenda="¿Tienes subsidio DS1?" requerido opciones={[{ v: 'si', t: 'Sí, tengo certificado' }, { v: 'postulando', t: 'Estoy postulando' }, { v: 'no', t: 'Aún no' }]} />
      {!compacto && <Chips nombre="terreno" leyenda="¿Tienes terreno propio?" opciones={[{ v: 'si', t: 'Sí' }, { v: 'no', t: 'No' }]} />}

      {/* Campo trampa contra robots: invisible para personas. */}
      <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">Empresa<input type="text" name="empresa" tabIndex={-1} autoComplete="off" /></label>

      <label className="flex items-start gap-3 text-sm text-grafito-500">
        <input type="checkbox" name="consentimiento" value="si" required className="mt-0.5 h-5 w-5 flex-none rounded accent-bosque" />
        <span>Acepto que me contacten sobre mi consulta según el <Link href="/privacidad" className="font-semibold text-bosque-700 underline underline-offset-2">aviso de privacidad</Link>.</span>
      </label>

      {estado === 'error' && (
        <p role="alert" className="rounded-2xl bg-copihue-50 p-4 text-sm text-copihue-700">
          {error} Revisa tus datos o <a className="font-semibold underline" href={`https://wa.me/${CONTACTO.whatsapp}?text=${textoWsp}`}>escríbenos por WhatsApp</a>.
        </p>
      )}

      <button type="submit" disabled={estado === 'enviando'} className="boton-accion w-full">
        {estado === 'enviando' ? 'Enviando…' : textoBoton}{estado !== 'enviando' && <Icono nombre="flecha" className="h-4 w-4" />}
      </button>
      <p className="text-center text-xs text-grafito-400">Sin costo ni compromiso. Usamos tus datos solo para responder tu consulta.</p>
    </form>
  );
}
