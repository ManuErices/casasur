import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Cabecera from '@/components/sitio/Cabecera';
import Pie from '@/components/sitio/Pie';
import Formulario from '@/components/sitio/Formulario';
import TarjetaVivienda, { Datos } from '@/components/sitio/TarjetaVivienda';
import WhatsAppFlotante from '@/components/sitio/WhatsAppFlotante';
import { EnPesos, UFProvider } from '@/components/sitio/UF';
import { InteresProvider } from '@/components/sitio/Interes';
import Galeria from '@/components/vivienda/Galeria';
import { Plano } from '@/components/vivienda/Plano';
import { Icono } from '@/components/ui/Icono';
import { EtiquetaDS1, EtiquetaDemo, EtiquetaDisponibilidad } from '@/components/ui/Etiquetas';
import { Revelar } from '@/components/ui/Revelar';
import { obtenerVivienda, obtenerViviendas, opcionesVivienda } from '@/lib/catalogo';
import { CONTACTO, MARCA, SITIO_URL } from '@/lib/config';
import { ESPECIFICACIONES, MODALIDAD } from '@/lib/viviendas';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return (await obtenerViviendas()).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = await obtenerVivienda(params.slug);
  if (!v) return {};
  const titulo = `${v.nombre} en ${v.comuna} · ${v.dormitorios} dormitorios, ${v.superficieM2} m²`;
  const foto = v.fotos.find((f) => f.src.startsWith('/'))?.src ?? '/fotos/og.jpg';
  return {
    title: titulo,
    description: `${v.frase} ${v.precioUF.toLocaleString('es-CL')} UF. ${MODALIDAD[v.modalidad]} en ${v.comuna}, Región de Los Ríos.`,
    alternates: { canonical: `/viviendas/${v.slug}` },
    openGraph: { title: titulo, description: v.frase, images: [{ url: foto }] },
  };
}

function Seccion({ titulo, children, id }: { titulo: string; children: React.ReactNode; id: string }) {
  return (
    <Revelar como="section" aria-labelledby={id} className="flex flex-col gap-6 border-t border-grafito/10 py-12">
      <h2 id={id} className="font-display text-display-md text-bosque-950">{titulo}</h2>
      {children}
    </Revelar>
  );
}

export default async function PaginaVivienda({ params }: Props) {
  const v = await obtenerVivienda(params.slug);
  if (!v) notFound();
  const otras = (await obtenerViviendas()).filter((x) => x.slug !== v.slug).slice(0, 3);
  const { lat, lng } = v.coordenadas;
  const caja = `${lng - 0.06},${lat - 0.035},${lng + 0.06},${lat + 0.035}`;
  const ampliada = v.dormitorios >= 3;
  const wsp = `Hola, me interesa la vivienda ${v.nombre} en ${v.comuna} (${v.precioUF} UF).`;

  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'SingleFamilyResidence', name: `${v.nombre} · ${v.comuna}`, description: v.descripcion,
      url: `${SITIO_URL}/viviendas/${v.slug}`, numberOfRooms: v.dormitorios, numberOfBathroomsTotal: v.banos,
      floorSize: { '@type': 'QuantitativeValue', value: v.superficieM2, unitCode: 'MTK' },
      address: { '@type': 'PostalAddress', addressLocality: v.comuna, addressRegion: 'Los Ríos', addressCountry: 'CL' },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: MARCA, item: SITIO_URL },
        { '@type': 'ListItem', position: 2, name: 'Viviendas', item: `${SITIO_URL}/#viviendas` },
        { '@type': 'ListItem', position: 3, name: v.nombre, item: `${SITIO_URL}/viviendas/${v.slug}` },
      ],
    },
  ];

  return (
    <UFProvider>
      <InteresProvider inicial={v.slug}>
        <Cabecera />
        <main id="contenido" className="pt-28 sm:pt-32">
          <div className="contenedor">
            <nav aria-label="Ruta de navegación" className="text-sm text-grafito-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="hover:text-bosque-700">Inicio</Link></li><li aria-hidden="true">/</li>
                <li><Link href="/#viviendas" className="hover:text-bosque-700">Viviendas</Link></li><li aria-hidden="true">/</li>
                <li aria-current="page" className="text-grafito">{v.nombre} · {v.comuna}</li>
              </ol>
            </nav>

            <header className="mt-6 flex flex-col gap-6 pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <EtiquetaDS1 estado={v.ds1.estado} />
                  <EtiquetaDisponibilidad valor={v.disponibilidad} />
                  {v.demo && <EtiquetaDemo />}
                </div>
                <h1 className="font-display text-display-xl text-bosque-950">{v.nombre}</h1>
                <p className="flex items-center gap-2 text-lg text-grafito-500"><Icono nombre="ubicacion" className="h-5 w-5 text-bosque-500" />{v.comuna} · {v.sector} · {MODALIDAD[v.modalidad]}</p>
              </div>
              <div className="lg:text-right">
                <p className="text-sm text-grafito-500">Precio referencial</p>
                <p className="cifras font-display text-5xl text-bosque-950">{v.precioUF.toLocaleString('es-CL')} <span className="text-2xl">UF</span></p>
                <p className="cifras text-grafito-500">≈ <EnPesos uf={v.precioUF} /></p>
              </div>
            </header>

            <Galeria fotos={v.fotos} nombre={v.nombre} />

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
              <div>
                <div className="flex flex-col gap-6 pb-12">
                  <p className="font-display text-3xl leading-snug text-bosque-950 sm:text-4xl">{v.frase}</p>
                  <p className="max-w-2xl text-lg leading-relaxed text-grafito-500">{v.descripcion}</p>
                  <Datos v={v} className="!text-base" />
                </div>

                <Seccion titulo="Lo que la hace especial" id="t-destacados">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {v.destacados.map((d) => (
                      <li key={d} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-grafito/5">
                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-bosque-50 text-bosque-700"><Icono nombre="check" className="h-4 w-4" trazo={2.2} /></span>{d}
                      </li>
                    ))}
                  </ul>
                </Seccion>

                <Seccion titulo="Planos y distribución" id="t-plano">
                  <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
                    <div className="rounded-4xl bg-white p-4 ring-1 ring-grafito/5 sm:p-8"><Plano ampliada={ampliada} className="h-auto w-full" /></div>
                    <dl className="flex flex-col divide-y divide-grafito/10">
                      {v.recintos.map((r) => (
                        <div key={r.nombre} className="flex justify-between gap-4 py-3">
                          <dt className="text-grafito-700">{r.nombre}</dt><dd className="cifras font-semibold text-grafito">{r.m2 ? `${r.m2} m²` : '—'}</dd>
                        </div>
                      ))}
                      <div className="flex justify-between gap-4 py-3 font-semibold"><dt>Superficie construida</dt><dd className="cifras">{v.superficieM2} m²</dd></div>
                    </dl>
                  </div>
                </Seccion>

                <Seccion titulo="Especificaciones" id="t-especificaciones">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {ESPECIFICACIONES.map((g) => (
                      <div key={g.grupo} className="rounded-3xl bg-white p-6 ring-1 ring-grafito/5">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-bosque-500">{g.grupo}</h3>
                        <ul className="mt-4 flex flex-col gap-2.5 text-[0.95rem] text-grafito-700">
                          {g.items.map((x) => <li key={x} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-copihue" />{x}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-grafito-500"><Icono nombre="reloj" className="mr-1.5 inline h-4 w-4 align-[-3px]" />Plazo estimado de la firma a la entrega: <strong className="text-grafito">{v.plazoMeses}</strong></p>
                </Seccion>

                <Seccion titulo="Ubicación" id="t-ubicacion">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-4xl bg-arena-100 ring-1 ring-grafito/5">
                    <iframe title={`Mapa referencial de ${v.comuna}`} loading="lazy" className="absolute inset-0 h-full w-full grayscale-[30%]"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${caja}&layer=mapnik`} />
                  </div>
                  <p className="text-sm text-grafito-500">Mapa referencial de la comuna de {v.comuna}. La dirección exacta se informa durante la asesoría.</p>
                </Seccion>

                <Seccion titulo="Compatibilidad con DS1" id="t-ds1">
                  <div className={`flex flex-col gap-4 rounded-4xl p-7 ${v.ds1.estado === 'compatible' ? 'bg-bosque text-marfil' : 'bg-arena-100 text-grafito'}`}>
                    <p className="flex items-center gap-2 font-semibold"><Icono nombre="escudo" className="h-5 w-5" />{v.ds1.estado === 'compatible' ? 'Pensada para operar con subsidio DS1' : 'Compatibilidad por confirmar'}</p>
                    <p className="opacity-85">{v.ds1.nota}</p>
                    <p className="text-sm opacity-70">La compatibilidad de cada operación depende de tu certificado, tu tramo, tu ahorro y las condiciones del llamado vigente.</p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link href="/#simulador" className={v.ds1.estado === 'compatible' ? 'boton-claro' : 'boton-bosque'}>Simular mi compra</Link>
                      <Link href="/#ds1" className={v.ds1.estado === 'compatible' ? 'boton-vidrio' : 'boton-linea'}>Cómo funciona el DS1</Link>
                    </div>
                  </div>
                </Seccion>
              </div>

              {/* Ficha de contacto fija */}
              <aside id="contacto" aria-label="Solicitar información" className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-4xl bg-white p-6 shadow-elevada ring-1 ring-grafito/5 sm:p-8">
                  <p className="font-display text-3xl text-bosque-950">Cotiza esta vivienda</p>
                  <p className="mt-2 text-sm text-grafito-500">Te llamamos para revisar tu caso y resolver tus dudas. Sin costo.</p>
                  <div className="mt-6"><Formulario opciones={opcionesVivienda()} viviendaFija={v.slug} compacto textoBoton="Solicitar información" /></div>
                  <a href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(wsp)}`} target="_blank" rel="noopener noreferrer" className="boton-linea mt-3 w-full">
                    <Icono nombre="whatsapp" />Consultar por WhatsApp
                  </a>
                </div>
              </aside>
            </div>
          </div>

          <section aria-labelledby="t-otras" className="mt-16 bg-arena-100 py-20 sm:py-28">
            <div className="contenedor">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="t-otras" className="font-display text-display-md text-bosque-950">Otras viviendas que podrían gustarte</h2>
                <Link href="/#viviendas" className="boton-linea">Ver todas</Link>
              </div>
              <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {otras.map((o) => <li key={o.slug} className="flex"><TarjetaVivienda v={o} cotizarEnFicha /></li>)}
              </ul>
            </div>
          </section>
        </main>
        <Pie />
        <WhatsAppFlotante mensaje={wsp} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </InteresProvider>
    </UFProvider>
  );
}
