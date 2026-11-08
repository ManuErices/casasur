import type { MetadataRoute } from 'next';
import { SITIO_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/portal/', '/api/'] }, sitemap: `${SITIO_URL}/sitemap.xml` };
}
