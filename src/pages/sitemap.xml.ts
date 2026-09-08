import type { APIRoute } from 'astro';
import { absoluteSiteUrl, siteIdentity } from '../config/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const urls = siteIdentity.canonicalPages
    .map((path) => `<url><loc>${absoluteSiteUrl(path)}</loc></url>`)
    .join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
