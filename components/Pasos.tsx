const pasos = [
  { cuando: 'Semana 1, sin costo', t: 'Conversamos y visitamos su terreno', d: 'Revisamos su certificado, su ahorro y si el terreno tiene agua, alcantarillado y luz.' },
  { cuando: 'Semana 2', t: 'Elige su modelo y firmamos', d: 'Le entregamos por escrito el precio, cuánto pone cada parte y los plazos.' },
  { cuando: 'Meses 1 a 3', t: 'Planos y permisos', d: 'Hacemos el proyecto y conseguimos la aprobación del SERVIU y el permiso de la municipalidad.' },
  { cuando: 'Meses 4 a 6', t: 'Construimos su casa', d: 'Unos 3 meses de obra, con visitas de control al inicio, a la mitad y casi al final. Puede seguir el avance desde su celular.' },
  { cuando: 'Mes 7', t: 'Recepción y entrega de llaves', d: 'Hacemos la recepción municipal y el cobro del subsidio. Usted recibe su casa terminada.' },
];

export default function Pasos() {
  return (
    <section id="pasos" className="seccion" aria-labelledby="t-pasos">
      <div className="wrap">
        <div className="intro"><h2 id="t-pasos">Cómo funciona, de la primera llamada a las llaves</h2></div>
        <ol className="pasos">
          {pasos.map((p, i) => (
            <li key={p.t} className="paso">
              <span className="numero" aria-hidden="true">{i + 1}</span>
              <div className="pila" style={{ gap: 4, paddingTop: 8 }}>
                <span className="cuando">{p.cuando}</span>
                <h3 style={{ fontSize: 27 }}>{p.t}</h3>
                <p className="texto-suave" style={{ fontSize: 20 }}>{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
