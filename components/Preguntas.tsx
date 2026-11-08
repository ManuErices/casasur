const preguntas = [
  { p: '¿Qué documentos necesito para empezar?', r: 'Su carnet, el certificado de subsidio DS1, la escritura o inscripción del terreno a su nombre y la cartola de su cuenta de ahorro. Si le falta algo, le ayudamos a conseguirlo.' },
  { p: '¿Mi certificado de subsidio tiene fecha de vencimiento?', r: 'Sí. Por eso conviene empezar pronto. Revisamos la fecha de su certificado en la primera conversación.' },
  { p: '¿Tengo que pagar algo antes de firmar?', r: 'No. La visita a su terreno y la revisión de su caso no tienen costo. Su aporte se paga recién después de firmar, en 3 partes.' },
  { p: '¿Por qué el precio está en UF?', r: 'Porque el subsidio y los bancos usan UF. Siempre le mostramos también el valor aproximado en pesos.' },
  { p: '¿Cómo sé cómo va mi casa durante la obra?', r: 'Le damos un código para entrar a su portal desde el celular. Ahí ve en qué etapa va su casa y las fotos del avance.' },
  { p: '¿Quién responde si algo falla después?', r: 'Nosotros. La casa tiene garantía y atención de postventa según la ley.' },
];

export default function Preguntas() {
  return (
    <section className="seccion" aria-labelledby="t-faq">
      <div className="wrap">
        <div className="preguntas">
          <h2 id="t-faq" style={{ marginBottom: 12 }}>Preguntas frecuentes</h2>
          {preguntas.map((q, i) => (
            <details key={q.p} open={i === 0}><summary>{q.p}</summary><p>{q.r}</p></details>
          ))}
        </div>
      </div>
    </section>
  );
}
