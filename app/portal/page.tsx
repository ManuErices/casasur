'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cabecera from '@/components/sitio/Cabecera';
import { CONTACTO } from '@/lib/config';

export default function EntrarPortal() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    const limpio = codigo.trim().toUpperCase().replace(/\s/g, '');
    if (limpio) router.push(`/portal/${encodeURIComponent(limpio)}`);
  }

  return (
    <>
      <Cabecera />
      <main className="portal">
        <div className="pila">
          <h1 style={{ fontSize: 46 }}>Siga el avance de su casa</h1>
          <p className="texto-suave">Escriba el código que le entregamos al firmar el contrato. Lo encuentra en su contrato o en el WhatsApp de su asesor.</p>
        </div>
        <form className="tarjeta" onSubmit={entrar}>
          <label className="campo">Su código
            <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="CS-ABC234" autoCapitalize="characters" autoComplete="off" required style={{ fontSize: 26, letterSpacing: 2 }} />
          </label>
          <button type="submit" className="btn btn-primario">Ver mi casa</button>
        </form>
        <p className="texto-suave">¿No tiene su código? Llame a su asesor al <a href={`tel:${CONTACTO.telefono.replace(/\s/g, '')}`} style={{ fontWeight: 700 }}>{CONTACTO.telefono}</a>.</p>
      </main>
    </>
  );
}
