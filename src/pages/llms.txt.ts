import type { APIRoute } from 'astro';
import { absoluteSiteUrl, siteIdentity } from '../config/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = `# ${siteIdentity.name}

> ${siteIdentity.description}

${siteIdentity.name}, representada visualmente también como ${siteIdentity.alternateName}, desarrolla sistemas operados por IA para empresas mexicanas. Sus procesos iniciales visibles son ${siteIdentity.processes.join(', ')}.

El método de trabajo es: ${siteIdentity.method.join(' → ')}. DAB Tech opera desde ${siteIdentity.location.region}, ${siteIdentity.location.country}, y mantiene control humano y medición de resultados durante la implementación.

Las simulaciones del sitio son ejemplos ilustrativos del mecanismo. No representan casos de clientes ni una plataforma empaquetada.

## Canonical pages

${siteIdentity.canonicalPages.map((path) => `- ${absoluteSiteUrl(path)}`).join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
