import Cabecera from '@/components/sitio/Cabecera';
import Hero from '@/components/sitio/Hero';
import Catalogo from '@/components/sitio/Catalogo';
import Ds1 from '@/components/sitio/Ds1';
import Simulador from '@/components/sitio/Simulador';
import PorQue from '@/components/sitio/PorQue';
import Proceso from '@/components/sitio/Proceso';
import Testimonios from '@/components/sitio/Testimonios';
import Preguntas from '@/components/sitio/Preguntas';
import Contacto from '@/components/sitio/Contacto';
import Pie from '@/components/sitio/Pie';
import WhatsAppFlotante from '@/components/sitio/WhatsAppFlotante';
import { UFProvider } from '@/components/sitio/UF';
import { InteresProvider } from '@/components/sitio/Interes';
import { Encabezado } from '@/components/ui/Encabezado';
import { obtenerViviendas } from '@/lib/catalogo';
import { CONTACTO, MARCA, SITIO_URL } from '@/lib/config';

export default async function Inicio() {
  const viviendas = await obtenerViviendas();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: MARCA,
    url: SITIO_URL,
    image: `${SITIO_URL}/fotos/og.jpg`,
    telephone: CONTACTO.telefono,
    email: CONTACTO.email,
    areaServed: { '@type': 'AdministrativeArea', name: 'Región de Los Ríos, Chile' },
    address: { '@type': 'PostalAddress', addressLocality: 'Valdivia', addressRegion: 'Los Ríos', addressCountry: 'CL' },
  };

  return (
    <UFProvider>
      <InteresProvider>
        <Cabecera sobreFoto />
        <main id="contenido">
          <Hero />
          <section aria-labelledby="t-viviendas" className="pb-24 sm:pb-32">
            <div className="contenedor">
              <Catalogo viviendas={viviendas} />
            </div>
          </section>
          <section aria-labelledby="t-manifiesto" className="border-y border-grafito/10 bg-marfil-50 py-20 sm:py-28">
            <div className="contenedor">
              <Encabezado id="t-manifiesto" centrado antetitulo="Nuestra manera de hacerlo"
                titulo={<>No vendemos casas subsidiadas. <em className="text-copihue">Hacemos posible la primera.</em></>}
                bajada="Detrás de cada certificado hay años de ahorro y una familia esperando. Nuestro trabajo es que ese esfuerzo se convierta en un hogar bien hecho, con claridad en cada paso." />
            </div>
          </section>
          <Ds1 />
          <Simulador viviendas={viviendas} />
          <PorQue />
          <Proceso />
          <Testimonios />
          <Preguntas />
          <Contacto />
        </main>
        <Pie />
        <WhatsAppFlotante />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </InteresProvider>
    </UFProvider>
  );
}
