'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase-client';
import { ESTADOS_CONTACTO } from '@/lib/etapas';
import { modeloPorId, SUBSIDIO_UF, AHORRO_MINIMO_UF } from '@/lib/config';
import { diasHasta, fecha, nuevoCodigo } from '@/lib/formato';

type Lead = {
  id: string; nombre: string; telefono: string; comuna: string; modelo: string;
  subsidio: string; terreno: string; estado: string; notas: string;
  email?: string; vivienda?: { slug: string; nombre: string; comuna: string; precioUF: number } | null;
  vencimientoSubsidio: Timestamp | null; creado: Timestamp | null; proyectoId?: string;
};

const SUBSIDIO_TXT: Record<string, string> = { si: 'Con subsidio', postulando: 'Postulando', no: 'Sin subsidio' };

export default function Contactos() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [filtro, setFiltro] = useState<string>('activos');
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(clientDb(), 'leads'), orderBy('creado', 'desc'));
    return onSnapshot(q, (s) => setLeads(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, 'id'>) }))), (e) => setError(e.message));
  }, []);

  const conteo = useMemo(() => {
    const c: Record<string, number> = {};
    (leads ?? []).forEach((l) => { c[l.estado] = (c[l.estado] ?? 0) + 1; });
    return c;
  }, [leads]);

  const visibles = (leads ?? []).filter((l) =>
    filtro === 'todos' ? true : filtro === 'activos' ? !['cliente', 'descartado'].includes(l.estado) : l.estado === filtro);

  const guardar = (id: string, cambios: Partial<Lead>) => updateDoc(doc(clientDb(), 'leads', id), cambios).catch((e) => setError(e.message));

  async function crearCliente(l: Lead) {
    const m = modeloPorId(l.modelo);
    const ref = await addDoc(collection(clientDb(), 'proyectos'), {
      codigo: nuevoCodigo(), familia: l.nombre.split(' ').slice(-1)[0] || l.nombre, contacto: l.nombre,
      telefono: l.telefono, comuna: l.comuna, modelo: m.id, precioUF: l.vivienda?.precioUF ?? m.precioUF,
      aporteUF: Math.max(0, (l.vivienda?.precioUF ?? m.precioUF) - SUBSIDIO_UF - AHORRO_MINIMO_UF),
      etapa: 1, proximoPaso: '', vencimientoSubsidio: l.vencimientoSubsidio ?? null,
      historial: [{ etapa: 1, nota: 'Iniciamos la evaluación de su caso.', fecha: Timestamp.now() }],
      fotos: [], leadId: l.id, creado: serverTimestamp(),
    });
    await guardar(l.id, { estado: 'cliente', proyectoId: ref.id });
    router.push(`/admin/proyectos/${ref.id}`);
  }

  return (
    <>
      <h1>Contactos</h1>
      <p className="texto-suave" style={{ fontSize: 17 }}>Personas que dejaron sus datos en el sitio. Llámalas, anota lo conversado y conviértelas en clientes.</p>
      <div className="filtros" role="group" aria-label="Filtrar por estado">
        {[{ id: 'activos', nombre: 'Por atender' }, ...ESTADOS_CONTACTO, { id: 'todos', nombre: 'Todos' }].map((f) => (
          <button key={f.id} aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
            {f.nombre}{conteo[f.id] ? ` (${conteo[f.id]})` : ''}
          </button>
        ))}
      </div>
      {error && <p className="mensaje mensaje-error">{error}</p>}
      {leads === null ? <p>Cargando contactos…</p> : visibles.length === 0 ? (
        <div className="vacio">No hay contactos en esta lista. Cuando alguien llene el formulario del sitio, aparecerá aquí.</div>
      ) : visibles.map((l) => {
        const venc = l.vencimientoSubsidio?.toDate() ?? null;
        const dias = diasHasta(venc);
        const califica = l.subsidio === 'si' && l.terreno === 'si';
        return (
          <article key={l.id} className="fila">
            <div className="pila" style={{ gap: 6 }}>
              <strong style={{ fontSize: 20 }}>{l.nombre}</strong>
              <span>{l.comuna} · {fecha(l.creado?.toDate())}</span>
              {l.email && <a href={`mailto:${l.email}`} style={{ fontSize: 15 }}>{l.email}</a>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <span className={`chip ${califica ? 'chip-ok' : ''}`}>{califica ? 'Califica' : 'Revisar'}</span>
                <span className="chip">{SUBSIDIO_TXT[l.subsidio] ?? l.subsidio}</span>
                <span className="chip">{l.terreno === 'si' ? 'Con terreno' : l.terreno === 'no' ? 'Sin terreno' : 'Terreno sin dato'}</span>
                <span className="chip">{l.vivienda ? `${l.vivienda.nombre} · ${l.vivienda.comuna}` : l.modelo === 'no-se' ? 'Modelo por definir' : modeloPorId(l.modelo).nombre}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <a className="btn btn-borde btn-chico" href={`tel:${l.telefono.replace(/\s/g, '')}`}>Llamar {l.telefono}</a>
                <a className="btn btn-borde btn-chico" href={`https://wa.me/${l.telefono.replace(/\D/g, '')}`} target="_blank">WhatsApp</a>
              </div>
            </div>
            <div className="pila" style={{ gap: 10 }}>
              <label className="campo">Estado
                <select value={l.estado} onChange={(e) => guardar(l.id, { estado: e.target.value })}>
                  {ESTADOS_CONTACTO.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </label>
              <label className="campo">Vence el subsidio
                <input type="date" value={venc ? venc.toISOString().slice(0, 10) : ''}
                  onChange={(e) => guardar(l.id, { vencimientoSubsidio: e.target.value ? Timestamp.fromDate(new Date(e.target.value + 'T12:00:00')) : null })} />
              </label>
              {dias !== null && <span className={`chip ${dias <= 90 ? 'chip-alerta' : ''}`}>{dias < 0 ? 'Subsidio vencido' : `Quedan ${dias} días`}</span>}
            </div>
            <div className="pila" style={{ gap: 10 }}>
              <label className="campo">Notas
                <textarea defaultValue={l.notas} onBlur={(e) => e.target.value !== l.notas && guardar(l.id, { notas: e.target.value })} placeholder="Qué conversaron, cuándo volver a llamar…" />
              </label>
              {l.proyectoId ? (
                <button className="btn btn-borde btn-chico" onClick={() => router.push(`/admin/proyectos/${l.proyectoId}`)}>Ver ficha de cliente</button>
              ) : (
                <button className="btn btn-primario btn-chico" onClick={() => crearCliente(l)}>Convertir en cliente</button>
              )}
            </div>
          </article>
        );
      })}
    </>
  );
}
