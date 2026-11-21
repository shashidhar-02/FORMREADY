import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://formready.vercel.app';
  const lastModified = new Date();

  const routes = [
    '',
    '/compress-image',
    '/compress-image-to-10kb',
    '/compress-image-to-20kb',
    '/compress-image-to-30kb',
    '/compress-image-to-40kb',
    '/compress-image-to-50kb',
    '/compress-image-to-80kb',
    '/compress-image-to-100kb',
    '/compress-image-to-150kb',
    '/compress-image-to-200kb',
    '/compress-image-to-500kb',
    '/compress-image-to-1mb',
    '/compress-image-under-1mb',
    '/compress-photo-to-50kb',
    '/resize-image',
    '/resize-photo',
    '/resize-photo-for-online-form',
    '/passport-photo',
    '/resize-signature',
    '/signature-to-20kb',
    '/jpg-to-pdf',
    '/merge-pdf',
    '/split-pdf',
    '/compress-pdf',
    '/convert-image',
    '/presets',
    '/privacy',
    '/about',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/compress-image-to') ? 0.9 : 0.8,
  }));
}
