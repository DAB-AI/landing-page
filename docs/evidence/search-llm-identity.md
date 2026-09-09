# Search + LLM identity evidence

## Git isolation

- Branch: `chore/search-llm-identity`
- Base commit: `d54f638dbebd5cf8f7206f069434d770f0c20639`
- Base source: local `main`
- `origin/main` was unavailable because this repository has no configured remotes.
- The original `main` checkout was not changed; its pre-existing `.gitignore` modification was left untouched.

## Discovery conclusion

- KEEP: the current visible proposition, the three initial process areas, the four-phase method, the illustrative simulation disclaimer, WhatsApp as a real contact handoff, and the public State of Mexico location.
- CHANGE: the apex canonical in Astro, metadata, JSON-LD, robots and sitemap. Public Vercel responses show `http://dabtech.me/` redirecting to HTTPS and the HTTPS apex redirecting permanently to `https://www.dabtech.me/`.
- REMOVE: the previous standalone `Organization` and `Service` JSON-LD blocks, which lacked stable IDs and did not define `WebSite` or `WebPage`.
- UNKNOWN: Google Search Console and Bing Webmaster Tools ownership/verification are not represented in the repository.

Historical terms found in tracked, current code were classified as follows:

- WhatsApp: KEEP; current contact and privacy behavior, not old positioning.
- Automatización: KEEP where it explains evaluation criteria or a capability, not company identity.
- Metepec: KEEP only in legal/privacy material; it was not modified.
- Marketing: KEEP only in the privacy statement that explicitly denies marketing-email use.
- Chatbot, agencia, Toluca, salones and estéticas: no current public metadata or visible product-positioning occurrences found.

## Files changed

- `astro.config.mjs`
- `src/config/site.ts`
- `src/content/home.es.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/empresa.astro`
- `src/pages/llms.txt.ts`
- `src/pages/robots.txt.ts`
- `src/pages/site.webmanifest.ts`
- `src/pages/sitemap.xml.ts`
- `tests/search-identity.test.ts`
- `vercel.json`
- `public/robots.txt` (replaced by a generated static endpoint)
- `public/sitemap.xml` (replaced by a generated static endpoint)
- `docs/evidence/search-llm-identity.md`

No privacy page, privacy content or legal configuration file was changed.

## New URLs

- `https://www.dabtech.me/empresa/`
- `https://www.dabtech.me/llms.txt`
- `https://www.dabtech.me/site.webmanifest`

## Final metadata

- Home title: `DAB Tech | Sistemas operados por IA para empresas mexicanas`
- Home description: `DAB Tech diseña e integra sistemas operados por IA dentro de procesos empresariales como cotizaciones, cobranza, pedidos y conciliación, con control humano y resultados medibles.`
- Home canonical: `https://www.dabtech.me/`
- `og:site_name`: `DAB Tech`
- Locale/language: `es_MX` / `es-MX`
- Social image: existing official site asset at `https://www.dabtech.me/assets/hero/hero-workflows-poster.webp` (1280×720)

Generated HTML checks found exactly one title, description, canonical and JSON-LD script on `/`, `/empresa/` and `/privacidad/`.

## JSON-LD summary

One parseable `@graph` is emitted per page:

- `Organization`: `https://www.dabtech.me/#organization`
- `WebSite`: `https://www.dabtech.me/#website`
- Home `WebPage`: `https://www.dabtech.me/#webpage`

The organization uses only repository-confirmed identity, alternate visual name, description, official favicon, area served and State of Mexico location. No founder, founding date, employee count, legal name, tax ID, telephone, awards or inferred social profiles were added.

## Robots result

Public crawling is allowed for the wildcard agent and explicitly for Googlebot, Bingbot and OAI-SearchBot. No GPTBot policy existed, so none was introduced or changed. The sitemap directive is:

`Sitemap: https://www.dabtech.me/sitemap.xml`

## Sitemap result

The generated sitemap contains only:

- `https://www.dabtech.me/`
- `https://www.dabtech.me/empresa/`
- `https://www.dabtech.me/privacidad/`

No invented `lastmod` values are present.

## llms.txt result

The generated file identifies DAB Tech, its alternate visual name, factual description, three initial processes, four-phase method, geography, human-control model and the illustrative nature of simulations. It links only to the three canonical pages above and makes no ranking claim.

## Semantic gate

The built title, description, H1, opening copy, JSON-LD, `/llms.txt` and `/empresa/` consistently answer:

1. Name: DAB Tech.
2. Work: designs and integrates AI-operated systems into existing business processes.
3. Audience: Mexican companies with observable friction in repetitive processes.
4. Country: Mexico; operating from the State of Mexico.
5. Problems: waiting, re-entry/reconciliation, stalled decisions and context-poor exceptions.
6. AI implementation: diagnosis, controlled pilot, production, then operation and expansion, with human control and measured results.
7. Differentiation: the starting point is an integrated real process and existing systems, not an isolated tool or packaged chatbot.
8. Canonical organization URL: `https://www.dabtech.me/`.

No contradictory company identity was found in public metadata.

## Validation commands and results

- `npm run build`: PASS; Astro Check reported 0 errors, 0 warnings and 0 hints. Four HTML pages and all text/XML/manifest endpoints were generated.
- `npm test`: PASS; 24/24 tests, including canonical metadata, JSON-LD and discovery-surface coverage.
- `git diff --check`: PASS.
- Impeccable detector on the new entity page and footer: PASS; no findings.
- Browser inspection of `/empresa/`: PASS; semantic headings and links present, no horizontal mobile overflow (`scrollWidth` 360 at a 375 px viewport).
- Preview HTTP checks: PASS; `/`, `/empresa/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` and `/site.webmanifest` all returned 200 with applicable content types.
- JSON-LD parse check: PASS for home, entity and privacy pages.
- Entity-page body length: 310 words.

## External gaps

- No Git remote is configured, so `git fetch origin main` and branch push cannot be performed.
- The apex-to-www redirect is defined in `vercel.json`; every redirect variant must still be reconfirmed after deployment.
- No Google or Bing verification token was found in the repository.
- Existing analytics origin checks still target `https://dabtech.me`; they were intentionally left unchanged because analytics changes are outside this task. Their behavior on the current www production host should be reviewed separately.

## Manual post-deploy

1. Deploy the branch after human review.
2. Verify the canonical domain in production, including HTTP/HTTPS, apex/www, trailing slash and `index.html` variants.
3. In Google Search Console:
   - inspect `/`;
   - inspect `/empresa/`;
   - submit the sitemap;
   - request new indexing.
4. In Bing Webmaster Tools:
   - submit the sitemap;
   - request a recrawl if appropriate.
5. Check the brand result after search engines have recrawled the site. Snippet changes are not immediate or guaranteed.

## Revalidation — 2026-09-09

- Branch: `chore/search-llm-identity-v2`
- Base: `origin/main` at `93559aa33d8f124c57f88b7c23181d0d17486136`
- The pre-existing user modification in `.gitignore` was preserved and excluded from this work.
- The centralized identity, canonical host, metadata, JSON-LD graph, `/empresa/`, `/robots.txt`, `/sitemap.xml`, web manifest, and `/llms.txt` were audited and retained because they already satisfy the brief.
- Corrected the remaining public copy `Piloto controlled` to `Piloto controlado` in `src/content/home.es.ts`.
- Legacy output scan found only legitimate `Metepec`, `WhatsApp`, and `marketing` references inside the unchanged privacy notice. No public output identifies DAB Tech as the former agency or as a chatbot, salon, beauty, or marketing-focused provider.
- Generated-output entity test answers consistently: DAB Tech; AI-operated systems integrated into existing business processes; Mexican companies; Estado de México, México; RFQ and quotations, collections and credit, orders and reconciliation; progressive AI autonomy with human review, exception ownership, and measured results; canonical URL `https://www.dabtech.me/`.
- `npm ci`: PASS.
- `npm run build`: PASS; Astro Check reported 0 errors, 0 warnings, and 0 hints.
- `npm test`: PASS; 24/24 tests.
- JSON-LD parsing through `tests/search-identity.test.ts`: PASS.
- `git diff --check`: PASS for this work; the only message is a line-ending warning from the user's pre-existing `.gitignore` change.
- No lint script exists in `package.json`.
- IndexNow remains a FOLLOW-UP: Vercel can serve the protocol's root ownership key file, but a key and deployment-triggered submission are still required. No key or deployment automation was introduced in this LOOP. References: https://www.indexnow.org/documentation and https://vercel.com/docs/build-output-api/primitives.
- Post-deploy manual actions remain Google Search Console inspection/indexing for `/` and `/empresa/`, sitemap verification, and equivalent Bing Webmaster Tools registration/submission/refresh.
