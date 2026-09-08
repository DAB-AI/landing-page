import { whatsappPhone, legalConfig } from '../config/legal.ts';
import { diagnosticContent } from '../content/diagnostic.es.ts';

export interface DiagnosticAnswers {
  processId: string;
  customProcessText?: string;
  frictions: string[];
  frecuencia: 'diaria' | 'semanal' | 'mensual' | 'ocasional';
  volumen: 'menos_10' | '10_50' | '51_200' | 'mas_200' | 'desconocido';
  consecuencia: 'tiempo_ciclo' | 'trabajo_manual' | 'errores_costo' | 'capital_ingresos' | 'afectacion_cliente' | 'riesgo_operativo' | 'todavia_no_medida';
  responsable: 'identificado' | 'no_identificado' | 'no_sabe';
  fuentes: 'accesibles' | 'parciales' | 'no_accesibles' | 'no_sabe';
}

export interface DiagnosticEvaluation {
  classificationId: 'buen_candidato' | 'validar_baseline' | 'no_software';
  title: string;
  statusTag: string;
  summary: string;
  reasons: string[];
  suggestedEvidence: string[];
}

export function validateStep1(processId: string, customProcessText?: string): string | null {
  if (!processId) {
    return 'Por favor selecciona un proceso a evaluar.';
  }
  if (processId === 'otro') {
    const trimmed = (customProcessText || '').trim();
    if (!trimmed) {
      return 'Por favor describe brevemente el otro proceso.';
    }
    if (trimmed.length > 80) {
      return 'La descripción del proceso no debe exceder 80 caracteres.';
    }
  }
  return null;
}

export function validateStep2(frictions: string[]): string | null {
  if (!frictions || frictions.length === 0) {
    return 'Por favor selecciona al menos una fricción principal.';
  }
  return null;
}

export function validateStep3(answers: Partial<DiagnosticAnswers>): string | null {
  if (!answers.frecuencia) return 'Por favor selecciona la frecuencia.';
  if (!answers.volumen) return 'Por favor selecciona el volumen aproximado.';
  if (!answers.consecuencia) return 'Por favor selecciona la consecuencia observable.';
  if (!answers.responsable) return 'Por favor selecciona el estado del responsable.';
  if (!answers.fuentes) return 'Por favor selecciona la accesibilidad de las fuentes.';
  return null;
}

export function evaluateDiagnostic(answers: DiagnosticAnswers): DiagnosticEvaluation {
  const { frecuencia, consecuencia, responsable, fuentes, frictions, volumen } = answers;

  const hasObservableConsequence = consecuencia !== 'todavia_no_medida';
  const hasStructure = responsable === 'identificado' || fuentes === 'accesibles' || fuentes === 'parciales';

  let classificationId: 'buen_candidato' | 'validar_baseline' | 'no_software';

  // Rule 1: Buen candidato
  if (
    (frecuencia === 'diaria' || frecuencia === 'semanal') &&
    hasObservableConsequence &&
    hasStructure
  ) {
    classificationId = 'buen_candidato';
  }
  // Rule 2: Conviene validar baseline (any diaria, semanal, mensual that missed Rule 1)
  else if (frecuencia === 'diaria' || frecuencia === 'semanal' || frecuencia === 'mensual') {
    classificationId = 'validar_baseline';
  }
  // Rule 3: Aún no justifica software
  else if (
    (frecuencia === 'ocasional' && volumen === 'menos_10') ||
    (frecuencia === 'ocasional' && !hasObservableConsequence && responsable !== 'identificado' && (fuentes === 'no_accesibles' || fuentes === 'no_sabe'))
  ) {
    classificationId = 'no_software';
  }
  // Rule 4: Fallback
  else {
    classificationId = 'validar_baseline';
  }

  const config = diagnosticContent.classifications[classificationId];

  // Derived reasons
  const reasons: string[] = [];
  const freqObj = diagnosticContent.step3.frecuencia.options.find((o) => o.id === frecuencia);
  const consecObj = diagnosticContent.step3.consecuencia.options.find((o) => o.id === consecuencia);
  const freqLabel = freqObj ? freqObj.label.toLowerCase() : frecuencia;
  const consecLabel = consecObj ? consecObj.label : consecuencia;

  if (classificationId === 'buen_candidato') {
    reasons.push(`El proceso ocurre con frecuencia ${freqLabel} y tiene la consecuencia observable "${consecLabel}".`);
    reasons.push(`Existe responsable o acceso a fuentes de información para respaldar la medición.`);
    reasons.push(`Las fricciones reportadas (${frictions.length}) generan un impacto operativo adecuado para estructurar un workflow.`);
  } else if (classificationId === 'validar_baseline') {
    reasons.push(`Existe recurrencia (${freqLabel}), pero se requiere precisar el impacto o confirmar responsables y fuentes.`);
    reasons.push(`Antes de evaluar software, DAB Tech recomienda construir un baseline claro de tiempo de ciclo y costo actual.`);
    reasons.push(`La medición previa evitará automatizar un proceso sin métricas de éxito definidas.`);
  } else {
    reasons.push(`La frecuencia es ${freqLabel} y el volumen o consecuencia no muestran aún una carga crítica.`);
    reasons.push(`El costo operativo actual no justifica la inversión o complejidad de desarrollo de software.`);
    reasons.push(`Conviene resolver la estandarización manual antes de considerar automatización.`);
  }

  // Suggested evidence based on friction
  const suggestedEvidence = getSuggestedEvidence(frictions);

  return {
    classificationId,
    title: config.title,
    statusTag: config.statusTag,
    summary: config.summary,
    reasons,
    suggestedEvidence
  };
}

export function getSuggestedEvidence(frictions: string[]): string[] {
  const evidenceList: string[] = [];
  for (const frictionId of frictions) {
    const text = diagnosticContent.evidenceMapping[frictionId as keyof typeof diagnosticContent.evidenceMapping];
    if (text && !evidenceList.includes(text)) {
      evidenceList.push(text);
    }
  }
  return evidenceList.length > 0
    ? evidenceList
    : ["Registro de tiempo de ciclo entre origen y resolución final."];
}

export function getProcessDisplayLabel(answers: DiagnosticAnswers): string {
  if (answers.processId === 'otro' && answers.customProcessText) {
    return `Otro (${answers.customProcessText.trim()})`;
  }
  const proc = diagnosticContent.step1.processes.find((p) => p.id === answers.processId);
  return proc ? proc.label : answers.processId;
}

export function getFrictionDisplayLabels(frictions: string[]): string {
  return frictions
    .map((fId) => {
      const f = diagnosticContent.step2.frictions.find((item) => item.id === fId);
      return f ? f.label : fId;
    })
    .join(', ');
}

export function getOptionLabel(step3Key: 'frecuencia' | 'volumen' | 'consecuencia' | 'responsable' | 'fuentes', value: string): string {
  const group = diagnosticContent.step3[step3Key];
  if (!group) return value;
  const opt = group.options.find((o) => o.id === value);
  return opt ? opt.label : value;
}

export function getDiagnosticSummary(answers: DiagnosticAnswers, evaluation: DiagnosticEvaluation) {
  return [
    ['Proceso', getProcessDisplayLabel(answers)],
    ['Fricciones detectadas', getFrictionDisplayLabels(answers.frictions)],
    ['Frecuencia', getOptionLabel('frecuencia', answers.frecuencia)],
    ['Volumen aproximado', getOptionLabel('volumen', answers.volumen)],
    ['Consecuencia principal', getOptionLabel('consecuencia', answers.consecuencia)],
    ['Responsable identificado', getOptionLabel('responsable', answers.responsable)],
    ['Fuentes disponibles', getOptionLabel('fuentes', answers.fuentes)],
    ['Resultado orientativo', evaluation.title],
    ['Evidencia sugerida', evaluation.suggestedEvidence.join('; ')]
  ];
}
export function buildWhatsAppMessage(answers: DiagnosticAnswers, evaluation: DiagnosticEvaluation): string {
  const lines = getDiagnosticSummary(answers, evaluation).map(([label, value]) => `${label}: ${value}`);
  return `Hola, quiero revisar un workflow con DAB Tech.\n\n${lines.slice(0, 7).join('\n')}\n\n${lines.slice(7).join('\n')}\n\nEntiendo que DAB Tech realizará una revisión humana y que el tiempo objetivo de respuesta es de ${legalConfig.diagnosticReviewTarget}.`;
}
export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
}
