import Image from 'next/image';
import { CONTACTO, MODELOS } from '@/lib/config';
import { WhatsApp } from './Iconos';

export default function Portada() {
  const desde = Math.min(...MODELOS.map((m) => m.precioUF));
  return (
    <section className="portada">
      <div className="wrap">
        <div className="portada-texto">
          <p className="etiqueta">Para familias con subsidio DS1 y terreno propio, en la Región de Los Ríos</p>
          <h1>Construimos la casa de su subsidio, en su propio terreno.</h1>
          <p className="bajada">Nos encargamos de todo: los planos, los permisos, la construcción y el cobro del subsidio. Usted solo elige el modelo que más le guste.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <a href="#simulador" className="btn btn-claro">Calcular cuánto me falta</a>
            <a href={`https://wa.me/${CONTACTO.whatsapp}`} className="btn btn-borde-claro"><WhatsApp color="#BFE3D5" />Escribir por WhatsApp</a>
          </div>
          <div className="datos">
            <div className="dato"><strong>43 m²</strong><span>2 dormitorios y 1 baño</span></div>
            <div className="dato"><strong>{desde.toLocaleString('es-CL')} UF</strong><span>Precio desde</span></div>
            <div className="dato"><strong>~7 meses</strong><span>De la firma a las llaves</span></div>
          </div>
        </div>
        <figure className="foto-portada" style={{ margin: 0 }}>
          <Image src="/ranco.jpg" alt="Casa modelo Ranco: un piso, techo a un agua, revestimiento gris carbón con franja de madera y terraza, con un volcán al fondo" width={1672} height={941} priority style={{ width: '100%', height: 'auto', borderRadius: 24 }} />
          <figcaption>Modelo Ranco. Imagen referencial.</figcaption>
        </figure>
      </div>
    </section>
  );
}
