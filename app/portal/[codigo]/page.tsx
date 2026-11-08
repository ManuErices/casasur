import Link from 'next/link';
import Cabecera from '@/components/Cabecera';
import { adminDb } from '@/lib/firebase-admin';
import { ETAPAS, etapaPorId } from '@/lib/etapas';
import { CONTACTO, modeloPorId } from '@/lib/config';
import { fecha } from '@/lib/formato';
import { Telefono, WhatsApp } from '@/components/Iconos';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false } };

type Hist = { etapa: number; nota: string; fecha: { toDate(): Date } | null };
type Foto = { url: string; descripcion: string; fecha: string };

export default async function PortalFamilia({ params }: { params: { codigo: string } }) {
  const codigo = decodeURIComponent(params.codigo).toUpperCase();
  let data: FirebaseFirestore.DocumentData | null = null;
  try {
    const snap = await adminDb().collection('proyectos').where('codigo', '==', codigo).limit(1).get();
    data = snap.empty ? null : snap.docs[0].data();
  } catch (e) {
    console.error(e);
  }

  if (!data) {
    return (
      <>
        <Cabecera />
        <main className="portal">
          <h1 style={{ fontSize: 40 }}>No encontramos ese código</h1>
          <p className="texto-suave">Revise que esté bien escrito (por ejemplo, CS-ABC234). Si sigue sin funcionar, llame a su asesor al {CONTACTO.telefono}.</p>
          <Link href="/portal" className="btn btn-primario" style={{ alignSelf: 'flex-start' }}>Escribir el código otra vez</Link>
        </main>
      </>
    );
  }

  const etapa = etapaPorId(Number(data.etapa) || 1);
  const historial: Hist[] = Array.isArray(data.historial) ? [...data.historial].reverse() : [];
  const fotos: Foto[] = Array.isArray(data.fotos) ? [...data.fotos].reverse() : [];
  const modelo = modeloPorId(data.modelo);

  return (
    <>
      <Cabecera />
      <main className="portal">
        <div className="pila" style={{ gap: 8 }}>
          <p className="antetitulo">Código {codigo} · Modelo {modelo.nombre} · {data.comuna}</p>
          <h1 style={{ fontSize: 44 }}>Hola, familia {data.familia}</h1>
        </div>

        <div className="destacado">
          <span style={{ color: 'var(--menta-suave)', fontSize: 18 }}>Su casa está en la etapa {etapa.id} de {ETAPAS.length}</span>
          <h2 style={{ fontSize: 36 }}>{etapa.titulo}</h2>
          <p style={{ color: 'var(--menta-suave)' }}>{etapa.paraLaFamilia}</p>
          <p><strong>Lo que viene:</strong> {data.proximoPaso || etapa.proximoPaso}</p>
        </div>

        <section className="tarjeta" aria-labelledby="t-etapas">
          <h2 id="t-etapas" style={{ fontSize: 30 }}>Todas las etapas</h2>
          <ol className="linea-tiempo">
            {ETAPAS.map((e) => {
              const clase = e.id < etapa.id ? 'hecho' : e.id === etapa.id ? 'actual' : '';
              return (
                <li key={e.id} className={`hito ${clase}`} aria-current={e.id === etapa.id ? 'step' : undefined}>
                  <span className="bolita" aria-hidden="true">{e.id < etapa.id ? '✓' : e.id}</span>
                  <div style={{ paddingTop: 6 }}>
                    <h3 style={{ fontSize: 22 }}>{e.titulo}</h3>
                    {e.id === etapa.id && <p className="texto-suave" style={{ fontSize: 18 }}>Aquí va su casa ahora.</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {fotos.length > 0 && (
          <section className="pila" aria-labelledby="t-fotos">
            <h2 id="t-fotos" style={{ fontSize: 30 }}>Fotos del avance</h2>
            <div className="fotos">
              {fotos.map((f) => (
                <figure key={f.url}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={f.descripcion || 'Foto del avance de la obra'} loading="lazy" />
                  <figcaption>{f.descripcion}{f.descripcion ? ' · ' : ''}{fecha(new Date(f.fecha))}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {historial.length > 0 && (
          <section className="tarjeta" aria-labelledby="t-hist">
            <h2 id="t-hist" style={{ fontSize: 30 }}>Novedades</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {historial.map((h, i) => (
                <li key={i} style={{ borderLeft: '6px solid var(--verde)', paddingLeft: 14 }}>
                  <strong>{etapaPorId(h.etapa).titulo}</strong> <span className="nota">· {fecha(h.fecha ? h.fecha.toDate() : null)}</span>
                  {h.nota && <p className="texto-suave" style={{ fontSize: 19 }}>{h.nota}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="tarjeta" aria-labelledby="t-ase">
          <h2 id="t-ase" style={{ fontSize: 28 }}>¿Tiene dudas?</h2>
          <p className="texto-suave">Su asesor es {CONTACTO.asesor}.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a href={`tel:${CONTACTO.telefono.replace(/\s/g, '')}`} className="btn btn-primario"><Telefono color="#FFFFFF" />Llamar</a>
            <a href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(`Hola, soy de la familia ${data.familia} (código ${codigo})`)}`} className="btn btn-borde"><WhatsApp />WhatsApp</a>
          </div>
        </section>
      </main>
    </>
  );
}
