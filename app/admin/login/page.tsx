'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { clientAuth } from '@/lib/firebase-client';
import { MARCA } from '@/lib/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault(); setError(''); setCargando(true);
    try { await signInWithEmailAndPassword(clientAuth(), email.trim(), clave); }
    catch { setError('Correo o clave incorrectos.'); }
    finally { setCargando(false); }
  }

  return (
    <main className="wrap" style={{ maxWidth: 480, paddingTop: 80 }}>
      <form className="panel" onSubmit={entrar} style={{ border: '1px solid var(--borde)' }}>
        <h1 style={{ fontSize: 30 }}>{MARCA} · Panel interno</h1>
        <label className="campo">Correo<input type="text" inputMode="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="campo">Clave<input type="password" autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} required style={{ font: 'inherit', fontWeight: 400, padding: '12px 16px', border: '2px solid var(--borde-fuerte)', borderRadius: 12, minHeight: 56 }} /></label>
        {error && <p className="mensaje mensaje-error" role="alert">{error}</p>}
        <button className="btn btn-primario" type="submit" disabled={cargando}>{cargando ? 'Entrando…' : 'Entrar'}</button>
      </form>
    </main>
  );
}
