'use client';
import Image from 'next/image';
import { CONTACTO, MODELOS, modeloPorId } from '@/lib/config';
import { millones } from '@/lib/formato';
import { useSeleccion } from './Seleccion';
import { FachadaCalleCalle, FachadaNiebla, Plano } from './Ilustraciones';
import { Check, WhatsApp } from './Iconos';

export default function Modelos() {
  const { modeloId, setModeloId, valorUF } = useSeleccion();
  const m = modeloPorId(modeloId);
  const texto = encodeURIComponent(`Hola, me interesa el modelo ${m.nombre} para mi subsidio DS1`);

  return (
    <section id="modelos" className="seccion" aria-labelledby="t-mod">
      <div className="wrap">
        <div className="intro">
          <h2 id="t-mod">Tres estilos, una misma casa por dentro</h2>
          <p>Los tres modelos tienen la misma distribución y la misma calidad. Cambia lo que se ve desde afuera. Toque un modelo para verlo.</p>
        </div>
        <div className="selector" role="group" aria-label="Elegir modelo">
          {MODELOS.map((x) => (
            <button key={x.id} type="button" aria-pressed={x.id === m.id} onClick={() => setModeloId(x.id)}>{x.nombre}</button>
          ))}
        </div>
        <div className="modelos">
          <div>
            <div className="marco-modelo">
              {m.imagen ? (
                <figure style={{ margin: 0 }}>
                  <Image src={m.imagen} alt={`Fachada del modelo ${m.nombre}`} width={1672} height={941} />
                  <figcaption className="nota" style={{ marginTop: 8 }}>Imagen referencial</figcaption>
                </figure>
              ) : m.id === 'niebla' ? <FachadaNiebla /> : <FachadaCalleCalle />}
            </div>
            <div className="plano">
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                <h3>Así es por dentro</h3><span className="nota">Igual en los 3 modelos · 43 m²</span>
              </div>
              <Plano />
            </div>
          </div>
          <div className="ficha">
            <h3 style={{ fontSize: 46, fontWeight: 800 }}>{m.nombre}</h3>
            <p style={{ fontSize: 21, color: 'var(--menta-suave)' }}>{m.resumen}</p>
            <ul>{m.caracteristicas.map((c) => <li key={c}><Check color="#BFE3D5" />{c}</li>)}</ul>
            <div className="precio">
              <span style={{ color: 'var(--menta-suave)', fontSize: 17 }}>Precio desde</span>
              <strong>{m.precioUF.toLocaleString('es-CL')} UF</strong>
              <span style={{ color: 'var(--menta-suave)' }}>aprox. {millones(m.precioUF * valorUF)}</span>
            </div>
            <a href="#simulador" className="btn btn-claro">Calcular mi aporte con este modelo</a>
            <a href={`https://wa.me/${CONTACTO.whatsapp}?text=${texto}`} className="btn btn-borde-claro"><WhatsApp color="#BFE3D5" />Me interesa este modelo</a>
          </div>
        </div>
      </div>
    </section>
  );
}
