import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

test('dist/index.html matches exact copy deck requirements', () => {
  const distPath = path.resolve('dist/index.html');
  execFileSync('npm',['run','build'],{stdio:'pipe',env:{...process.env,DAB_EVIDENCE:'true'}});

  const html = fs.readFileSync(distPath, 'utf-8');

  // 1. Exact H1 Title
  const expectedH1 = 'Convertimos procesos que hoy cuestan tiempo y dinero en sistemas operados por IA.';
  assert.ok(html.includes(expectedH1), `H1 title mismatch. Expected to find: "${expectedH1}"`);

  // 2. Exact Five Steps
  const expectedSteps = [
    'Encontramos impacto',
    'Mapeamos el flujo',
    'Conectamos contexto',
    'Desplegamos con control',
    'Medimos'
  ];

  expectedSteps.forEach((stepTitle, idx) => {
    const num = `0${idx + 1}`;
    assert.ok(html.includes(stepTitle), `Step ${num} title mismatch. Expected "${stepTitle}"`);
  });

  // 3. Exact Six FAQ Questions
  const expectedFaqs = [
    '¿DAB reemplaza nuestro ERP o CRM?',
    '¿La IA toma decisiones sola?',
    '¿Qué pasa cuando encuentra una excepción?',
    '¿Cuánto tarda una implementación?',
    '¿Cómo se mide el resultado?',
    '¿Qué tipo de empresa encaja mejor?'
  ];

  expectedFaqs.forEach((faq, idx) => {
    assert.ok(html.includes(faq), `FAQ #${idx + 1} mismatch. Expected question: "${faq}"`);
  });

  // 4. RFQ Disclaimer
  const expectedDisclaimer = 'Esta interfaz demuestra el mecanismo. No representa un caso de cliente ni una plataforma empaquetada.';
  assert.ok(html.includes(expectedDisclaimer), `RFQ disclaimer mismatch. Expected: "${expectedDisclaimer}"`);

  // 5. Absence of "Integration warning" / dev banner in production HTML
  assert.strictEqual(
    html.includes('Integration warning') || html.includes('PUBLIC_DIAGNOSTIC_WEBHOOK_URL'),
    false,
    'Production dist/index.html must NOT contain dev integration warnings.'
  );

  // 6. Absence of duplicate text ("operados operados")
  assert.strictEqual(
    html.includes('operados operados'),
    false,
    'dist/index.html must not contain duplicate text "operados operados".'
  );
});
