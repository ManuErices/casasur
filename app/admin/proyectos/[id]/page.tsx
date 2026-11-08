'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { arrayRemove, arrayUnion, doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { clientDb, clientStorage } from '@/lib/firebase-client';
import { ETAPAS, etapaPorId } from '@/lib/etapas';
import { MODELOS, COMUNAS, CUOTAS } from '@/lib/config';
import { fecha, uf } from '@/lib/formato';

type Foto = { url: string; ruta: string; descripcion: string; fecha: string };
type Hist = { etapa: number; nota: string; fecha: Timestamp };
type Proyecto = {
  codigo: string; familia: string; contacto: string; telefono: string; comuna: string; modelo: string;
  precioUF: number; aporteUF: number; etapa: number; proximoPaso: string;
  vencimientoSubsidio: Timestamp | null; historial: Hist[]; fotos: Foto[];
};

export default function FichaCliente({ params }: { params: { id: string } }) {
  const [p, setP] = useState<Proyecto | null>(null);
  const [nuevaEtapa, setNuevaEtapa] = useState(1);
  const [nota, setNota] = useState('');
  const [descFoto, setDescFoto] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [aviso, setAviso] = useState('');
  const docRef = () => doc(clientDb(), 'proyectos', params.id);

  useEffect(() => onSnapshot(docRef(), (s) => {
    const d = s.data() as Proyecto | undefined;
    if (d) { setP(d); setNuevaEtapa(d.etapa); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [params.id]);

  if (!p) return <p>Cargando ficha…</p>;
  const linkPortal = typeof window !== 'undefined' ? `${window.location.origin}/portal/${p.codigo}` : `/portal/${p.codigo}`;
  const guardar = (c: Partial<Proyecto>) => updateDoc(docRef(), c).then(() => setAviso('Cambios guardados.')).catch((e) => setAviso(e.message));

  async function actualizarEtapa() {
    await updateDoc(docRef(), { etapa: nuevaEtapa, historial: arrayUnion({ etapa: nuevaEtapa, nota: nota.trim(), fecha: Timestamp.now() }) });
    setNota(''); setAviso(`Etapa actualizada: ${etapaPorId(nuevaEtapa).titulo}. La familia ya lo ve en su portal.`);
  }

  async function subirFotos(archivos: FileList | null) {
    if (!archivos?.length) return;
    setSubiendo(true);
    try {
      for (const a of Array.from(archivos)) {
        const ruta = `proyectos/${params.id}/${Date.now()}-${a.name.replace(/[^\w.-]/g, '_')}`;
        const r = ref(clientStorage(), ruta);
        await uploadBytes(r, a, { contentType: a.type });
        const url = await getDownloadURL(r);
        await updateDoc(docRef(), { fotos: arrayUnion({ url, ruta, descripcion: descFoto.trim(), fecha: new Date().toISOString() }) });
      }
      setDescFoto(''); setAviso('Fotos subidas. La familia ya las ve en su portal.');
    } catch (e) { setAviso(e instanceof Error ? e.message : 'No se pudieron subir las fotos.'); }
    finally { setSubiendo(false); }
  }

  async function borrarFoto(f: Foto) {
    if (!confirm('¿Borrar esta foto del portal de la familia?')) return;
    await updateDoc(docRef(), { fotos: arrayRemove(f) });
    deleteObject(ref(clientStorage(), f.ruta)).catch(() => {});
  }

  const venc = p.vencimientoSubsidio?.toDate() ?? null;

  return (
    <div className="pila" style={{ gap: 24 }}>
      <Link href="/admin/proyectos">← Volver a clientes</Link>
      <div className="pila" style={{ gap: 4 }}>
        <h1>Familia {p.familia}</h1>
        <p className="texto-suave" style={{ fontSize: 17 }}>Código del portal: <strong>{p.codigo}</strong> · <a href={linkPortal} target="_blank">Abrir portal de la familia</a>{' '}
          <button className="btn btn-borde btn-chico" onClick={() => navigator.clipboard.writeText(`Hola, puede seguir el avance de su casa aquí: ${linkPortal} (código ${p.codigo})`).then(() => setAviso('Mensaje copiado. Pégalo en WhatsApp.'))}>Copiar mensaje para la familia</button>
        </p>
      </div>
      {aviso && <p className="mensaje mensaje-ok" role="status">{aviso}</p>}

      <section className="panel" style={{ border: '1px solid var(--borde)' }}>
        <h2>Etapa de la obra</h2>
        <p>Ahora: <strong>Etapa {p.etapa}. {etapaPorId(p.etapa).titulo}</strong></p>
        <div className="rejilla-2">
          <label className="campo">Nueva etapa
            <select value={nuevaEtapa} onChange={(e) => setNuevaEtapa(Number(e.target.value))}>
              {ETAPAS.map((e) => <option key={e.id} value={e.id}>{e.id}. {e.titulo}</option>)}
            </select>
          </label>
          <label className="campo">Mensaje para la familia (opcional)
            <input type="text" value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej.: Esta semana terminamos el techo." />
          </label>
        </div>
        <button className="btn btn-primario btn-chico" style={{ alignSelf: 'flex-start' }} onClick={actualizarEtapa}>Actualizar etapa</button>
        <label className="campo">Próximo paso que verá la familia
          <input type="text" defaultValue={p.proximoPaso} placeholder={etapaPorId(p.etapa).proximoPaso} onBlur={(e) => e.target.value !== p.proximoPaso && guardar({ proximoPaso: e.target.value })} />
        </label>
      </section>

      <section className="panel" style={{ border: '1px solid var(--borde)' }}>
        <h2>Fotos del avance</h2>
        <div className="rejilla-2">
          <label className="campo">Descripción (opcional)<input type="text" value={descFoto} onChange={(e) => setDescFoto(e.target.value)} placeholder="Ej.: Estructura de techo" /></label>
          <label className="campo">Elegir fotos<input type="file" accept="image/*" multiple disabled={subiendo} onChange={(e) => subirFotos(e.target.files)} style={{ fontSize: 16 }} /></label>
        </div>
        {subiendo && <p>Subiendo fotos…</p>}
        {p.fotos?.length ? (
          <div className="fotos-admin">
            {[...p.fotos].reverse().map((f) => (
              <figure key={f.url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={f.descripcion || 'Foto de avance'} />
                <figcaption className="nota">{f.descripcion || 'Sin descripción'}</figcaption>
                <button className="btn btn-borde btn-chico" onClick={() => borrarFoto(f)}>Borrar</button>
              </figure>
            ))}
          </div>
        ) : <div className="vacio">Sube la primera foto de la obra. La familia la verá en su portal.</div>}
      </section>

      <section className="panel" style={{ border: '1px solid var(--borde)' }}>
        <h2>Datos del cliente</h2>
        <div className="rejilla-2">
          <label className="campo">Apellido de la familia (se ve en el portal)<input type="text" defaultValue={p.familia} onBlur={(e) => guardar({ familia: e.target.value })} /></label>
          <label className="campo">Persona de contacto<input type="text" defaultValue={p.contacto} onBlur={(e) => guardar({ contacto: e.target.value })} /></label>
          <label className="campo">Teléfono<input type="tel" defaultValue={p.telefono} onBlur={(e) => guardar({ telefono: e.target.value })} /></label>
          <label className="campo">Comuna
            <select value={p.comuna} onChange={(e) => guardar({ comuna: e.target.value })}>{COMUNAS.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          <label className="campo">Modelo
            <select value={p.modelo} onChange={(e) => guardar({ modelo: e.target.value })}>{MODELOS.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}</select>
          </label>
          <label className="campo">Vence el subsidio
            <input type="date" value={venc ? venc.toISOString().slice(0, 10) : ''} onChange={(e) => guardar({ vencimientoSubsidio: e.target.value ? Timestamp.fromDate(new Date(e.target.value + 'T12:00:00')) : null })} />
          </label>
          <label className="campo">Precio del contrato (UF)<input type="number" step="0.1" defaultValue={p.precioUF} onBlur={(e) => guardar({ precioUF: Number(e.target.value) })} /></label>
          <label className="campo">Aporte de la familia (UF)<input type="number" step="0.1" defaultValue={p.aporteUF} onBlur={(e) => guardar({ aporteUF: Number(e.target.value) })} /></label>
        </div>
        <div className="cuotas">
          <p style={{ fontWeight: 700 }}>Cuotas del aporte</p>
          <table><tbody>{CUOTAS.map((c) => <tr key={c.cuando}><td>{c.cuando} ({c.pct * 100}%)</td><td>{uf(p.aporteUF * c.pct)}</td></tr>)}</tbody></table>
        </div>
      </section>

      <section className="panel" style={{ border: '1px solid var(--borde)' }}>
        <h2>Historial</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...(p.historial ?? [])].reverse().map((h, i) => (
            <li key={i}><strong>{etapaPorId(h.etapa).titulo}</strong> · {fecha(h.fecha?.toDate())}{h.nota ? ` · ${h.nota}` : ''}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
