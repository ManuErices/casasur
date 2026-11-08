import Link from 'next/link';
import Cabecera from '@/components/sitio/Cabecera';

export default function NoEncontrado() {
  return (
    <>
      <Cabecera />
      <main className="contenedor flex min-h-[80vh] flex-col items-start justify-center gap-6 pt-28">
        <p className="antetitulo-cs">Error 404</p>
        <h1 className="font-display text-display-lg text-bosque-950">Esta casa no está en el mapa.</h1>
        <p className="max-w-lg text-lg text-grafito-500">La página que buscas no existe o la vivienda ya no está publicada.</p>
        <Link href="/#viviendas" className="boton-accion">Ver viviendas disponibles</Link>
      </main>
    </>
  );
}
