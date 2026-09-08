export const siteIdentity = {
  name: 'DAB Tech',
  alternateName: 'DAB/TECH',
  url: 'https://www.dabtech.me/',
  language: 'es-MX',
  locale: 'es_MX',
  descriptor: 'Sistemas operados por IA para empresas mexicanas.',
  description:
    'DAB Tech diseña e integra sistemas operados por IA dentro de procesos empresariales existentes, conectando datos, reglas y acciones con control humano y medición de resultados.',
  metaDescription:
    'DAB Tech diseña e integra sistemas operados por IA dentro de procesos empresariales como cotizaciones, cobranza, pedidos y conciliación, con control humano y resultados medibles.',
  location: {
    region: 'Estado de México',
    country: 'México',
    countryCode: 'MX'
  },
  processes: [
    'RFQ y cotizaciones',
    'Cobranza y crédito',
    'Pedidos y conciliación'
  ],
  method: [
    'Diagnóstico',
    'Piloto controlado',
    'Producción',
    'Operación y expansión'
  ],
  assets: {
    logo: '/favicon.svg',
    socialImage: '/assets/hero/hero-workflows-poster.webp'
  },
  canonicalPages: ['/', '/empresa/', '/privacidad/']
} as const;

export const absoluteSiteUrl = (path: string) => new URL(path, siteIdentity.url).toString();
