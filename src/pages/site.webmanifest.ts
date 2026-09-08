import type { APIRoute } from 'astro';
import { siteIdentity } from '../config/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const manifest = {
    name: siteIdentity.name,
    short_name: 'DAB',
    description: siteIdentity.description,
    lang: siteIdentity.language,
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: '#F7F5F0',
    theme_color: '#1C241E',
    icons: [
      {
        src: siteIdentity.assets.logo,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ]
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' }
  });
};
