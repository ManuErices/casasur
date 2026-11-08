import type { MetadataRoute } from 'next';
import { obtenerViviendas } from '@/lib/catalogo';
import { SITIO_URL } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const viviendas = await obtenerViviendas();
  return [
    { url: SITIO_URL, changeFrequency: 'weekly', priority: 1 },
    ...viviendas.map((v) => ({ url: `${SITIO_URL}/viviendas/${v.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    { url: `${SITIO_URL}/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
