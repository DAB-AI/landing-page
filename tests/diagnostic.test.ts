import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateDiagnostic,
  validateStep1,
  validateStep2,
  validateStep3,
  getSuggestedEvidence,
  buildWhatsAppMessage,
  buildWhatsAppLink,
  type DiagnosticAnswers
} from '../src/lib/diagnostic.ts';

test('diagnostic: validateStep1 handles process choices and custom text rules', () => {
  assert.strictEqual(validateStep1(''), 'Por favor selecciona un proceso a evaluar.');
  assert.strictEqual(validateStep1('rfq'), null);
  assert.strictEqual(validateStep1('cobranza'), null);
  assert.strictEqual(validateStep1('pedidos'), null);
  assert.strictEqual(validateStep1('otro', ''), 'Por favor describe brevemente el otro proceso.');
  assert.strictEqual(validateStep1('otro', '   '), 'Por favor describe brevemente el otro proceso.');

  const longText = 'a'.repeat(81);
  assert.strictEqual(validateStep1('otro', longText), 'La descripción del proceso no debe exceder 80 caracteres.');

  const validCustom = 'Validación de expedientes de proveedores';
  assert.strictEqual(validateStep1('otro', validCustom), null);
});

test('diagnostic: validateStep2 enforces at least one friction choice', () => {
  assert.strictEqual(validateStep2([]), 'Por favor selecciona al menos una fricción principal.');
  assert.strictEqual(validateStep2(['espera']), null);
  assert.strictEqual(validateStep2(['espera', 'retrabajo']), null);
});

test('diagnostic: validateStep3 checks presence of all operational evidence fields', () => {
  assert.strictEqual(validateStep3({}), 'Por favor selecciona la frecuencia.');
  assert.strictEqual(validateStep3({ frecuencia: 'diaria' }), 'Por favor selecciona el volumen aproximado.');
  assert.strictEqual(validateStep3({ frecuencia: 'diaria', volumen: '10_50' }), 'Por favor selecciona la consecuencia observable.');
  assert.strictEqual(
    validateStep3({ frecuencia: 'diaria', volumen: '10_50', consecuencia: 'tiempo_ciclo' }),
    'Por favor selecciona el estado del responsable.'
  );
  assert.strictEqual(
    validateStep3({ frecuencia: 'diaria', volumen: '10_50', consecuencia: 'tiempo_ciclo', responsable: 'identificado' }),
    'Por favor selecciona la accesibilidad de las fuentes.'
  );
  assert.strictEqual(
    validateStep3({
      frecuencia: 'diaria',
      volumen: '10_50',
      consecuencia: 'tiempo_ciclo',
      responsable: 'identificado',
      fuentes: 'accesibles'
    }),
    null
  );
});

test('diagnostic: Rule 1 - Buen candidato para diagnóstico', () => {
  const answers: DiagnosticAnswers = {
    processId: 'rfq',
    frictions: ['espera', 'retrabajo'],
    frecuencia: 'diaria',
    volumen: '51_200',
    consecuencia: 'tiempo_ciclo',
    responsable: 'identificado',
    fuentes: 'accesibles'
  };

  const result = evaluateDiagnostic(answers);
  assert.strictEqual(result.classificationId, 'buen_candidato');
  assert.strictEqual(result.title, 'Buen candidato para diagnóstico');
  assert.strictEqual(result.statusTag, 'RECOMENDADO');
  assert.ok(result.reasons.length >= 2);
});

test('diagnostic: Rule 2 - Conviene validar primero el baseline', () => {
  // Recurrence is diaria/semanal/mensual but missing consequence measurement or structure
  const answers: DiagnosticAnswers = {
    processId: 'cobranza',
    frictions: ['espera'],
    frecuencia: 'semanal',
    volumen: '10_50',
    consecuencia: 'todavia_no_medida',
    responsable: 'no_identificado',
    fuentes: 'no_sabe'
  };

  const result = evaluateDiagnostic(answers);
  assert.strictEqual(result.classificationId, 'validar_baseline');
  assert.strictEqual(result.title, 'Conviene validar primero el baseline');
  assert.strictEqual(result.statusTag, 'MEDICIÓN PREVIA');
});

test('diagnostic: Rule 3 - Aún no justifica software', () => {
  const answers: DiagnosticAnswers = {
    processId: 'pedidos',
    frictions: ['visibilidad'],
    frecuencia: 'ocasional',
    volumen: 'menos_10',
    consecuencia: 'todavia_no_medida',
    responsable: 'no_identificado',
    fuentes: 'no_sabe'
  };

  const result = evaluateDiagnostic(answers);
  assert.strictEqual(result.classificationId, 'no_software');
  assert.strictEqual(result.title, 'Aún no justifica software');
  assert.strictEqual(result.statusTag, 'EVALUACIÓN TEMPRANA');
});

test('diagnostic: Rule 4 - Precedence and fallback for unmapped combinations', () => {
  // Monthly frequency with observable consequence & structure (missed Rule 1, falls into Rule 2)
  const answersMonthly: DiagnosticAnswers = {
    processId: 'rfq',
    frictions: ['errores'],
    frecuencia: 'mensual',
    volumen: '51_200',
    consecuencia: 'errores_costo',
    responsable: 'identificado',
    fuentes: 'accesibles'
  };

  const resultMonthly = evaluateDiagnostic(answersMonthly);
  assert.strictEqual(resultMonthly.classificationId, 'validar_baseline');
});

test('diagnostic: Exhaustive matrix test covers 100% of valid option combinations', () => {
  const frecuencias: DiagnosticAnswers['frecuencia'][] = ['diaria', 'semanal', 'mensual', 'ocasional'];
  const volumenes: DiagnosticAnswers['volumen'][] = ['menos_10', '10_50', '51_200', 'mas_200', 'desconocido'];
  const consecuencias: DiagnosticAnswers['consecuencia'][] = [
    'tiempo_ciclo',
    'trabajo_manual',
    'errores_costo',
    'capital_ingresos',
    'afectacion_cliente',
    'riesgo_operativo',
    'todavia_no_medida'
  ];
  const responsables: DiagnosticAnswers['responsable'][] = ['identificado', 'no_identificado', 'no_sabe'];
  const fuentesArr: DiagnosticAnswers['fuentes'][] = ['accesibles', 'parciales', 'no_accesibles', 'no_sabe'];

  const validClassifications = new Set(['buen_candidato', 'validar_baseline', 'no_software']);
  let totalEvaluated = 0;

  for (const frecuencia of frecuencias) {
    for (const volumen of volumenes) {
      for (const consecuencia of consecuencias) {
        for (const responsable of responsables) {
          for (const fuentes of fuentesArr) {
            totalEvaluated++;
            const testAnswers: DiagnosticAnswers = {
              processId: 'rfq',
              frictions: ['espera'],
              frecuencia,
              volumen,
              consecuencia,
              responsable,
              fuentes
            };
            const evalRes = evaluateDiagnostic(testAnswers);
            assert.ok(
              validClassifications.has(evalRes.classificationId),
              `Unmapped classification '${evalRes.classificationId}' for combination: ${JSON.stringify(testAnswers)}`
            );
            assert.ok(evalRes.title && evalRes.title.length > 0);
            assert.ok(evalRes.reasons.length > 0);
            assert.ok(evalRes.suggestedEvidence.length > 0);
          }
        }
      }
    }
  }

  // 4 * 5 * 7 * 3 * 4 = 1680 combinations
  assert.strictEqual(totalEvaluated, 1680);
});

test('diagnostic: suggested evidence correctly maps frictions', () => {
  const evidence = getSuggestedEvidence(['espera', 'retrabajo', 'decisiones']);
  assert.strictEqual(evidence.length, 3);
  assert.strictEqual(evidence[0], 'Tiempo desde entrada hasta resolución final.');
  assert.strictEqual(evidence[1], 'Número de recapturas, conciliaciones o revisiones por caso.');
  assert.strictEqual(evidence[2], 'Tiempo de escalación y horas dedicadas a reconstruir contexto.');
});

test('diagnostic: buildWhatsAppMessage and buildWhatsAppLink format correctly', () => {
  const answers: DiagnosticAnswers = {
    processId: 'otro',
    customProcessText: 'Conciliación de facturas de flete',
    frictions: ['espera', 'errores'],
    frecuencia: 'diaria',
    volumen: '51_200',
    consecuencia: 'tiempo_ciclo',
    responsable: 'identificado',
    fuentes: 'accesibles'
  };

  const evaluation = evaluateDiagnostic(answers);
  const msg = buildWhatsAppMessage(answers, evaluation);

  assert.ok(msg.includes('Hola, quiero revisar un workflow con DAB Tech.'));
  assert.ok(msg.includes('Proceso: Otro (Conciliación de facturas de flete)'));
  assert.ok(msg.includes('Fricciones detectadas: Espera, Errores o discrepancias'));
  assert.ok(msg.includes('Frecuencia: Diaria'));
  assert.ok(msg.includes('Volumen aproximado: De 51 a 200 casos'));
  assert.ok(msg.includes('Resultado orientativo: Buen candidato para diagnóstico'));

  const link = buildWhatsAppLink(msg);
  assert.ok(link.startsWith('https://wa.me/527223579869?text='));
  assert.ok(link.includes(encodeURIComponent('Hola, quiero revisar un workflow con DAB Tech.')));
});


test('diagnostic: next step respects the handoff availability', async () => {
  const { getDiagnosticNextStepText } = await import('../src/content/diagnostic.es.ts');
  assert.strictEqual(
    getDiagnosticNextStepText(false),
    'Conserva este resultado como orientación inicial. El envío para revisión humana se habilitará cuando el aviso de privacidad haya sido validado.'
  );
  assert.strictEqual(
    getDiagnosticNextStepText(true),
    'Revisa el resumen de tus respuestas y compártelo con DAB Tech por WhatsApp para solicitar una revisión humana.'
  );
});


test('diagnostic: message is the readable summary with review objective and safely encoded text', async () => {
  const { getDiagnosticSummary } = await import('../src/lib/diagnostic.ts');
  const answers: DiagnosticAnswers = {processId:'otro', customProcessText:'<script>&á? #', frictions:['espera'], frecuencia:'diaria', volumen:'51_200', consecuencia:'tiempo_ciclo', responsable:'identificado', fuentes:'accesibles'};
  const evaluation = evaluateDiagnostic(answers);
  const message = buildWhatsAppMessage(answers, evaluation);
  for (const [label, value] of getDiagnosticSummary(answers, evaluation)) assert.ok(message.includes(`${label}: ${value}`));
  assert.ok(message.endsWith('tiempo objetivo de respuesta es de 1 día hábil.'));
  const link = new URL(buildWhatsAppLink(message));
  assert.equal(link.origin + link.pathname, 'https://wa.me/527223579869');
  assert.equal(link.searchParams.get('text'), message);
  assert.equal(link.hash, '');
  assert.ok(!/undefined|tiempo_ciclo|buen_candidato/.test(message));
});
