import { COMUNAS } from '@/lib/config';
import { Check } from './Iconos';

const items = [
  'Estar, comedor y cocina juntos, con luz natural',
  '2 dormitorios con closet',
  'Baño completo con espacio para lavadora',
  'Cocina con muebles y lavaplatos',
  'Aislación en paredes y techo según la norma térmica 2025',
  'Ventanas con doble vidrio de baja emisividad',
  'Calefón de 10 litros certificado',
  'Conexión de agua, alcantarillado y luz, con certificados',
  'Planos con un tercer dormitorio para ampliar en el futuro',
  'Garantía y atención de postventa',
];

export default function Incluye() {
  return (
    <section className="seccion seccion-oscura" aria-labelledby="t-inc">
      <div className="wrap pila" style={{ gap: 28 }}>
        <h2 id="t-inc">Qué incluye su casa</h2>
        <ul className="incluye">{items.map((i) => <li key={i}><Check color="#BFE3D5" />{i}</li>)}</ul>
        <div className="pila" style={{ gap: 12, paddingTop: 8 }}>
          <h3>Construimos en todas las comunas de Los Ríos</h3>
          <ul className="comunas" aria-label="Comunas">{COMUNAS.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
