import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
import { MARCA, SITIO_URL } from '@/lib/config';
import './globals.css';
import './legacy.css';

const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--fuente-display', display: 'swap' });
const texto = Instrument_Sans({ subsets: ['latin'], variable: '--fuente-texto', display: 'swap' });

const descripcion = 'Viviendas diseñadas para el sur de Chile y pensadas para adquirirse con el subsidio habitacional DS1. Catálogo, simulador de compra y asesoría en la Región de Los Ríos.';

export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
  title: { default: `${MARCA} · Tu primera casa con subsidio DS1 en Los Ríos`, template: `%s · ${MARCA}` },
  description: descripcion,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'es_CL', siteName: MARCA, title: `${MARCA} · Tu subsidio ya tiene forma de casa`, description: descripcion, images: [{ url: '/fotos/og.jpg', width: 1200, height: 630, alt: 'Casa modelo Ranco en el sur de Chile' }] },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = { themeColor: '#1F3B2E', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${display.variable} ${texto.variable}`} suppressHydrationWarning>
      <head>
        {/* Activa las animaciones de aparición solo si hay JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
