'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { clientAuth, clientDb } from '@/lib/firebase-client';
import { MARCA } from '@/lib/config';
import '@/components/admin/admin.css';

type Acceso = 'cargando' | 'sin-sesion' | 'sin-permiso' | 'ok';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const ruta = usePathname();
  const router = useRouter();
  const [acceso, setAcceso] = useState<Acceso>('cargando');
  const [usuario, setUsuario] = useState<User | null>(null);
  const enLogin = ruta === '/admin/login';

  useEffect(() => {
    return onAuthStateChanged(clientAuth(), async (u) => {
      setUsuario(u);
      if (!u) { setAcceso('sin-sesion'); return; }
      try {
        const adm = await getDoc(doc(clientDb(), 'admins', u.uid));
        setAcceso(adm.exists() ? 'ok' : 'sin-permiso');
      } catch { setAcceso('sin-permiso'); }
    });
  }, []);

  useEffect(() => {
    if (acceso === 'sin-sesion' && !enLogin) router.replace('/admin/login');
    if (acceso === 'ok' && enLogin) router.replace('/admin');
  }, [acceso, enLogin, router]);

  if (enLogin) return <div className="admin">{children}</div>;
  if (acceso === 'cargando' || acceso === 'sin-sesion') return <div className="admin"><p className="wrap" style={{ paddingTop: 40 }}>Cargando…</p></div>;
  if (acceso === 'sin-permiso') {
    return (
      <div className="admin"><div className="wrap pila" style={{ paddingTop: 40 }}>
        <h1>Tu usuario no tiene acceso al panel</h1>
        <p className="texto-suave">Pide que agreguen tu usuario ({usuario?.email}) a la lista de administradores.</p>
        <button className="btn btn-primario" style={{ alignSelf: 'flex-start' }} onClick={() => signOut(clientAuth())}>Cerrar sesión</button>
      </div></div>
    );
  }

  const links = [{ href: '/admin', t: 'Contactos' }, { href: '/admin/proyectos', t: 'Clientes' }];
  return (
    <div className="admin">
      <div className="admin-barra">
        <div className="wrap">
          <strong>{MARCA} · Panel</strong>
          <nav aria-label="Panel">
            {links.map((l) => <Link key={l.href} href={l.href} aria-current={ruta === l.href || (l.href !== '/admin' && ruta.startsWith(l.href)) ? 'page' : undefined}>{l.t}</Link>)}
            <Link href="/" target="_blank">Ver sitio</Link>
            <button onClick={() => signOut(clientAuth())}>Salir</button>
          </nav>
        </div>
      </div>
      <div className="wrap admin-cuerpo">{children}</div>
    </div>
  );
}
