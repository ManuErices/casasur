'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, orderBy, query, type Timestamp } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase-client';
import { ETAPAS, etapaPorId } from '@/lib/etapas';
import { modeloPorId } from '@/lib/config';
import { diasHasta } from '@/lib/formato';

type Proyecto = { id: string; codigo: string; familia: string; comuna: string; modelo: string; etapa: number; vencimientoSubsidio: Timestamp | null };

export default function Clientes() {
  const [lista, setLista] = useState<Proyecto[] | null>(null);
  useEffect(() => {
    const q = query(collection(clientDb(), 'proyectos'), orderBy('creado', 'desc'));
    return onSnapshot(q, (s) => setLista(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Proyecto, 'id'>) }))));
  }, []);

  const enObra = (lista ?? []).filter((p) => p.etapa >= 4 && p.etapa <= 6).length;
  const porCobrar = (lista ?? []).filter((p) => p.etapa === 7).length;

  return (
    <>
      <h1>Clientes</h1>
      <div className="rejilla-2" style={{ margin: '16px 0 24px' }}>
        <div className="tarjeta" style={{ background: '#FFFFFF' }}><span className="nota">Clientes</span><strong style={{ fontSize: 34 }}>{lista?.length ?? '—'}</strong></div>
        <div className="tarjeta" style={{ background: '#FFFFFF' }}><span className="nota">Casas en obra</span><strong style={{ fontSize: 34 }}>{enObra}</strong></div>
        <div className="tarjeta" style={{ background: '#FFFFFF' }}><span className="nota">En recepción (subsidio por cobrar)</span><strong style={{ fontSize: 34 }}>{porCobrar}</strong></div>
      </div>
      {lista === null ? <p>Cargando…</p> : lista.length === 0 ? (
        <div className="vacio">Todavía no hay clientes. Conviértelos desde la lista de contactos.</div>
      ) : lista.map((p) => {
        const dias = diasHasta(p.vencimientoSubsidio?.toDate() ?? null);
        return (
          <Link key={p.id} href={`/admin/proyectos/${p.id}`} className="fila" style={{ color: 'inherit', textDecoration: 'none' }}>
            <div className="pila" style={{ gap: 4 }}>
              <strong style={{ fontSize: 20 }}>Familia {p.familia}</strong>
              <span>{p.codigo} · {p.comuna} · {modeloPorId(p.modelo).nombre}</span>
            </div>
            <div className="pila" style={{ gap: 6 }}>
              <span>Etapa {p.etapa} de {ETAPAS.length}: <strong>{etapaPorId(p.etapa).titulo}</strong></span>
              <div className="progreso"><div style={{ width: `${(p.etapa / ETAPAS.length) * 100}%` }} /></div>
            </div>
            <div>{dias !== null && p.etapa < 7 && <span className={`chip ${dias <= 90 ? 'chip-alerta' : ''}`}>{dias < 0 ? 'Subsidio vencido' : `Subsidio vence en ${dias} días`}</span>}</div>
          </Link>
        );
      })}
    </>
  );
}
