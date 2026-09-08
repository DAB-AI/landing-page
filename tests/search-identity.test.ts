import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readDist = (path: string) => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');

const extract = (html: string, pattern: RegExp) => {
  const match = html.match(pattern);
  assert.ok(match, `Expected ${pattern} in generated HTML`);
  return match[1];
};

test('search identity: generated pages expose one canonical metadata set and a valid JSON-LD graph', () => {
  const pages = [
    ['index.html', 'https://www.dabtech.me/'],
    ['empresa/index.html', 'https://www.dabtech.me/empresa/'],
    ['privacidad/index.html', 'https://www.dabtech.me/privacidad/']
  ] as const;

  for (const [file, canonical] of pages) {
    const html = readDist(file);

    assert.equal((html.match(/<title>/g) ?? []).length, 1);
    assert.equal((html.match(/<meta name="description"/g) ?? []).length, 1);
    assert.equal((html.match(/<link rel="canonical"/g) ?? []).length, 1);
    assert.equal(extract(html, /<link rel="canonical" href="([^"]+)"/), canonical);
    assert.equal(extract(html, /<meta property="og:site_name" content="([^"]+)"/), 'DAB Tech');
    assert.equal(extract(html, /<meta property="og:url" content="([^"]+)"/), canonical);

    const graph = JSON.parse(
      extract(html, /<script type="application\/ld\+json">(.*?)<\/script>/s)
    )['@graph'];

    assert.equal(graph.find((item: Record<string, string>) => item['@type'] === 'Organization')['@id'], 'https://www.dabtech.me/#organization');
    assert.equal(graph.find((item: Record<string, string>) => item['@type'] === 'WebSite')['@id'], 'https://www.dabtech.me/#website');
    assert.equal(graph.find((item: Record<string, string>) => item['@type'] === 'WebPage').url, canonical);
    assert.equal(graph.find((item: Record<string, string>) => item['@type'] === 'WebSite').inLanguage, 'es-MX');
  }
});

test('search identity: discovery surfaces use the canonical host and include the entity page', () => {
  const robots = readDist('robots.txt');
  const sitemap = readDist('sitemap.xml');
  const llms = readDist('llms.txt');
  const manifest = JSON.parse(readDist('site.webmanifest'));

  assert.match(robots, /User-agent: OAI-SearchBot\nAllow: \//);
  assert.match(robots, /Sitemap: https:\/\/www\.dabtech\.me\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/www\.dabtech\.me\/empresa\/<\/loc>/);
  assert.match(llms, /# DAB Tech/);
  assert.match(llms, /https:\/\/www\.dabtech\.me\/empresa\//);
  assert.equal(manifest.name, 'DAB Tech');
  assert.equal(manifest.short_name, 'DAB');
});
