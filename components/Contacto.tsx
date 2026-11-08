'use client';
import { useState } from 'react';
import { COMUNAS, CONTACTO, MODELOS } from '@/lib/config';
import { useSeleccion } from './Seleccion';
import { Persona, WhatsApp } from './Iconos';

type Estado = 'listo' | 'enviando' | 'enviado' | 'error';

export default function Contacto() {
  const { modeloId } = useSeleccion();
  const [estado, setEstado] = useState<Estado>('listo');
  const [error, setError] = useState('');

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.currentTarget).entries());
    setEstado('enviando'); setError('');
    try {
      const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'No se pudo enviar.');
      setEstado('enviado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar.');
      setEstado('error');
    }
  }

  return (
    <section id="contacto" className="seccion seccion-suave" aria-labelledby="t-con">
      <div className="wrap contacto">
        <div className="pila" style={{ gap: 20 }}>
          <h2 id="t-con">Conversemos sobre su casa</h2>
          <p className="texto-suave">Déjenos sus datos y lo llamamos. Si prefiere, llame o escriba directamente a su asesor.</p>
          <div className="asesor">
            <div className="avatar"><Persona color="#1E5A47" /></div>
            <div className="pila" style={{ gap: 2 }}>
              <strong style={{ fontSize: 22 }}>{CONTACTO.asesor}</strong>
              <span className="nota">Su asesor de principio a fin</span>
              <a href={`tel:${CONTACTO.telefono.replace(/\s/g, '')}`} style={{ fontWeight: 700, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{CONTACTO.telefono}</a>
            </div>
          </div>
          <a href={`https://wa.me/${CONTACTO.whatsapp}`} className="btn btn-primario" style={{ alignSelf: 'flex-start' }}><WhatsApp color="#FFFFFF" />Escribir por WhatsApp</a>
        </div>

        {estado === 'enviado' ? (
          <div className="panel" role="status">
            <h3>Recibimos sus datos</h3>
            <p className="texto-suave">Lo llamaremos al teléfono que nos dejó para revisar su caso. Si quiere adelantar la conversación, escríbanos por WhatsApp.</p>
          </div>
        ) : (
          <form className="panel" onSubmit={enviar} noValidate={false}>
            <label className="campo">Su nombre<input type="text" name="nombre" autoComplete="name" required minLength={2} /></label>
            <label className="campo">Su teléfono<input type="tel" name="telefono" autoComplete="tel" required minLength={8} placeholder="+56 9 1234 5678" /></label>
            <label className="campo">Comuna de su terreno
              <select name="comuna" defaultValue="Valdivia">{COMUNAS.map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            <label className="campo">Modelo que le interesa
              <select name="modelo" key={modeloId} defaultValue={modeloId}>{MODELOS.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}<option value="no-se">Todavía no sé</option></select>
            </label>
            <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
              <legend className="campo" style={{ marginBottom: 10 }}>¿Tiene certificado de subsidio DS1?</legend>
              <div className="opciones">
                <label className="opcion"><input type="radio" name="subsidio" value="si" required /><span>Sí</span></label>
                <label className="opcion"><input type="radio" name="subsidio" value="postulando" /><span>Estoy postulando</span></label>
                <label className="opcion"><input type="radio" name="subsidio" value="no" /><span>No</span></label>
              </div>
            </fieldset>
            <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
              <legend className="campo" style={{ marginBottom: 10 }}>¿Tiene terreno a su nombre?</legend>
              <div className="opciones">
                <label className="opcion"><input type="radio" name="terreno" value="si" required /><span>Sí</span></label>
                <label className="opcion"><input type="radio" name="terreno" value="no" /><span>No</span></label>
              </div>
            </fieldset>
            <label className="oculto" aria-hidden="true">Empresa<input type="text" name="empresa" tabIndex={-1} autoComplete="off" /></label>
            {estado === 'error' && <p className="mensaje mensaje-error" role="alert">{error} Revise sus datos o escríbanos por WhatsApp.</p>}
            <button className="btn btn-primario" type="submit" disabled={estado === 'enviando'}>{estado === 'enviando' ? 'Enviando…' : 'Quiero que me llamen'}</button>
            <p className="nota">Usamos sus datos solo para contactarlo por su casa.</p>
          </form>
        )}
      </div>
    </section>
  );
}
