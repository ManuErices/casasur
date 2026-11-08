import Link from 'next/link';
import { CONTACTO, MARCA } from '@/lib/config';

export default function Pie() {
  return (
    <footer className="pie">
      <div className="wrap">
        <span>{CONTACTO.razonSocial} · Registro Nacional de Contratistas MINVU {CONTACTO.registroMinvu}</span>
        <span>Entidad Patrocinante: {CONTACTO.egis}</span>
        <span>{MARCA} · Valdivia, Región de Los Ríos · <Link href="/portal">Portal de clientes</Link></span>
      </div>
    </footer>
  );
}
