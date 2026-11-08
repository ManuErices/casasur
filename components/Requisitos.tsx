import { Check } from './Iconos';

const items = [
  { t: 'Tiene su subsidio', d: 'Certificado DS1 vigente, para construcción en sitio propio.' },
  { t: 'Tiene su terreno', d: 'A su nombre, con posibilidad de conectar agua, alcantarillado y luz.' },
  { t: 'Tiene su ahorro', d: 'El ahorro del subsidio y el aporte que falta para completar el precio.' },
];

export default function Requisitos() {
  return (
    <section className="seccion" aria-labelledby="t-req">
      <div className="wrap">
        <div className="intro">
          <h2 id="t-req">¿Esta casa es para usted?</h2>
          <p>Si cumple estas tres condiciones, podemos construir su casa.</p>
        </div>
        <div className="tarjetas">
          {items.map((i) => (
            <div key={i.t} className="requisito">
              <div className="check"><Check size={30} color="#FFFFFF" /></div>
              <div className="pila" style={{ gap: 6 }}><h3>{i.t}</h3><p className="texto-suave" style={{ fontSize: 20 }}>{i.d}</p></div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24, color: 'var(--gris)' }}>¿No está seguro de alguna? <a href="#contacto" style={{ fontWeight: 700 }}>Llámenos y lo revisamos juntos, sin costo.</a></p>
      </div>
    </section>
  );
}
