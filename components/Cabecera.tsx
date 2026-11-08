import Link from 'next/link';
import { CONTACTO, MARCA } from '@/lib/config';
import { Logo, Telefono } from './Iconos';

export default function Cabecera() {
  return (
    <>
      <div className="barra-superior">
        <div className="wrap">
          <span>{CONTACTO.horario}</span>
          <a href={`tel:${CONTACTO.telefono.replace(/\s/g, '')}`}><Telefono color="#BFE3D5" />Llámenos: {CONTACTO.telefono}</a>
        </div>
      </div>
      <header className="cabecera">
        <div className="wrap">
          <Link href="/" className="marca"><Logo />{MARCA}</Link>
          <nav className="nav" aria-label="Principal">
            <a href="/#modelos">Modelos</a>
            <a href="/#simulador">Cuánto cuesta</a>
            <a href="/#pasos">Cómo funciona</a>
            <Link href="/portal">Ya soy cliente</Link>
            <a href="/#contacto" className="btn btn-primario btn-chico">Quiero que me llamen</a>
          </nav>
        </div>
      </header>
    </>
  );
}
