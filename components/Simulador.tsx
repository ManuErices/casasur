'use client';
import { useState } from 'react';
import { AHORRO_MINIMO_UF, CUOTAS, EXTRA_RURAL_UF, MODELOS, SUBSIDIO_UF, modeloPorId } from '@/lib/config';
import { millones, pesos } from '@/lib/formato';
import { useSeleccion } from './Seleccion';

export default function Simulador() {
  const { modeloId, setModeloId, valorUF, ufDelDia } = useSeleccion();
  const [rural, setRural] = useState(false);
  const [ahorro, setAhorro] = useState(AHORRO_MINIMO_UF);

  const m = modeloPorId(modeloId);
  const precio = m.precioUF + (rural ? EXTRA_RURAL_UF : 0);
  const aporte = Math.max(0, precio - SUBSIDIO_UF - ahorro);
  const pct = (v: number) => `${((v / precio) * 100).toFixed(1)}%`;
  const enPesos = (v: number) => millones(v * valorUF);

  return (
    <section id="simulador" className="seccion seccion-suave" aria-labelledby="t-sim">
      <div className="wrap">
        <div className="intro">
          <h2 id="t-sim">Calcule cuánto le falta para su casa</h2>
          <p>El subsidio para construir en su terreno es un monto fijo de {SUBSIDIO_UF} UF. Elija su modelo, su tipo de terreno y su ahorro, y vea al instante cuánto tendría que aportar.</p>
        </div>
        <div className="simulador">
          <div className="panel">
            <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
              <legend className="campo" style={{ marginBottom: 10 }}>Modelo</legend>
              <div className="opciones">
                {MODELOS.map((x) => (
                  <label key={x.id} className="opcion">
                    <input type="radio" name="sim-modelo" checked={x.id === m.id} onChange={() => setModeloId(x.id)} />
                    <span>{x.nombre}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
              <legend className="campo" style={{ marginBottom: 10 }}>Su terreno</legend>
              <div className="opciones">
                <label className="opcion"><input type="radio" name="sim-sitio" checked={!rural} onChange={() => setRural(false)} /><span>En la ciudad</span></label>
                <label className="opcion"><input type="radio" name="sim-sitio" checked={rural} onChange={() => setRural(true)} /><span>En el campo</span></label>
              </div>
              <p className="ayuda" style={{ marginTop: 8 }}>En el campo se suman la fosa séptica y el agua potable rural.</p>
            </fieldset>
            <label className="campo">
              Su ahorro acreditado: {ahorro} UF
              <input type="range" min={AHORRO_MINIMO_UF} max={300} step={5} value={ahorro} onChange={(e) => setAhorro(Number(e.target.value))} aria-describedby="ayuda-ahorro" />
              <span id="ayuda-ahorro" className="ayuda">Mínimo {AHORRO_MINIMO_UF} UF. Si ahorró más, su aporte baja. ({enPesos(ahorro)})</span>
            </label>
          </div>

          <div className="panel" aria-live="polite">
            <div>
              <span className="nota">Precio de su casa</span>
              <p style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 44, fontWeight: 800, lineHeight: 1.1 }}>{precio.toLocaleString('es-CL')} UF</p>
              <p className="texto-suave" style={{ fontSize: 20 }}>aprox. {enPesos(precio)}</p>
            </div>
            <div className="barra-costo" aria-hidden="true">
              <div style={{ width: pct(SUBSIDIO_UF), background: 'var(--verde)', color: '#FFFFFF' }}>Subsidio</div>
              <div style={{ width: pct(ahorro), background: '#7FAF8F', color: 'var(--tinta)' }}>{ahorro >= 80 ? 'Ahorro' : ''}</div>
              <div style={{ width: pct(aporte), background: 'var(--madera)', color: 'var(--tinta)' }}>{aporte > 120 ? 'Su aporte' : ''}</div>
            </div>
            <div className="partes">
              <div className="parte" style={{ borderColor: 'var(--verde)' }}><span>Pone el Estado</span><strong>{SUBSIDIO_UF} UF</strong><span>{enPesos(SUBSIDIO_UF)}</span></div>
              <div className="parte" style={{ borderColor: '#7FAF8F' }}><span>Su ahorro</span><strong>{ahorro} UF</strong><span>{enPesos(ahorro)}</span></div>
              <div className="parte" style={{ borderColor: 'var(--madera)' }}><span>Le falta</span><strong>{Math.round(aporte)} UF</strong><span>{enPesos(aporte)}</span></div>
            </div>
            {aporte > 0 ? (
              <div className="cuotas">
                <p style={{ fontWeight: 700, marginBottom: 6 }}>Lo que le falta se paga en 3 partes:</p>
                <table>
                  <tbody>
                    {CUOTAS.map((c) => (
                      <tr key={c.cuando}><td>{c.cuando} ({c.pct * 100}%)</td><td>{pesos(aporte * c.pct * valorUF)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mensaje mensaje-ok">Con su ahorro, el subsidio cubre todo el precio de esta casa.</p>
            )}
            <a href="#contacto" className="btn btn-primario">Quiero esta casa, llámenme</a>
            <p className="nota">Valores referenciales para terreno en la Región de Los Ríos, calculados con 1 UF = {pesos(valorUF)}{ufDelDia ? ' (valor de hoy)' : ''}. El precio final se confirma por escrito después de visitar su terreno.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
