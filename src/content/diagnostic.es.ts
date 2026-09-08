export interface DiagnosticOption {
  id: string;
  label: string;
  description?: string;
}

export const diagnosticContent = {
  header: {
    eyebrow: "Evaluación breve",
    title: "Diagnóstico de Workflow Operativo",
    intro: "Evalúa en 3 pasos la fricción de tu proceso antes de considerar software o automatización."
  },
  steps: [
    {
      stepNumber: 1,
      title: "Paso 1 de 3: Selecciona el proceso a evaluar",
      instruction: "Elige el área operativa donde sospechas que existe mayor fricción o costo por trabajo manual."
    },
    {
      stepNumber: 2,
      title: "Paso 2 de 3: Identifica la fricción principal",
      instruction: "Selecciona una o más manifestaciones del problema en la operación diaria."
    },
    {
      stepNumber: 3,
      title: "Paso 3 de 3: Revisa la evidencia operativa",
      instruction: "Proporciona estimaciones cerradas sobre la recurrencia y control del proceso."
    }
  ],
  step1: {
    processes: [
      { id: "rfq", label: "RFQ y cotizaciones", description: "Atención a solicitudes de precio, catálogo y condiciones comerciales." },
      { id: "cobranza", label: "Cobranza y crédito", description: "Seguimiento de facturas, conciliación y decisiones de crédito." },
      { id: "pedidos", label: "Pedidos y conciliación", description: "Procesamiento de órdenes, verificación de inventarios y entregas." },
      { id: "otro", label: "Otro proceso", description: "Especifica otro flujo operativo repetitivo de tu empresa." }
    ],
    customProcessLabel: "Describe brevemente el proceso (máx. 80 caracteres):",
    customProcessPlaceholder: "Ej. Validación de expedientes de proveedores",
    customProcessWarning: "No incluyas nombres de personas, correos, contraseñas, secretos comerciales ni información confidencial."
  },
  step2: {
    frictions: [
      { id: "espera", label: "Espera", description: "Solicitudes o aprobaciones detenidas entre personas o sistemas." },
      { id: "retrabajo", label: "Retrabajo", description: "Recaptura o verificación repetida de información existente." },
      { id: "errores", label: "Errores o discrepancias", description: "Diferencias en datos, montos o documentos que exigen corrección." },
      { id: "decisiones", label: "Decisiones detenidas", description: "Excepciones que llegan sin contexto previo para resolver inmediatamente." },
      { id: "visibilidad", label: "Falta de visibilidad", description: "Falta de claridad sobre el estado de un caso o responsable asignado." }
    ]
  },
  step3: {
    frecuencia: {
      label: "Frecuencia con la que ocurre el proceso:",
      options: [
        { id: "diaria", label: "Diaria" },
        { id: "semanal", label: "Semanal" },
        { id: "mensual", label: "Mensual" },
        { id: "ocasional", label: "Ocasional" }
      ]
    },
    volumen: {
      label: "Volumen aproximado mensual de casos:",
      options: [
        { id: "menos_10", label: "Menos de 10 casos" },
        { id: "10_50", label: "De 10 a 50 casos" },
        { id: "51_200", label: "De 51 a 200 casos" },
        { id: "mas_200", label: "Más de 200 casos" },
        { id: "desconocido", label: "Desconocido" }
      ]
    },
    consecuencia: {
      label: "Consecuencia observable principal:",
      options: [
        { id: "tiempo_ciclo", label: "Tiempo de ciclo excesivo" },
        { id: "trabajo_manual", label: "Horas dedicadas a trabajo manual" },
        { id: "errores_costo", label: "Costo directo por errores o retrabajo" },
        { id: "capital_ingresos", label: "Capital o ingresos detenidos" },
        { id: "afectacion_cliente", label: "Afectación al servicio o cliente" },
        { id: "riesgo_operativo", label: "Riesgo operativo o de cumplimiento" },
        { id: "todavia_no_medida", label: "Todavía no medida" }
      ]
    },
    responsable: {
      label: "Responsable del proceso:",
      options: [
        { id: "identificado", label: "Identificado" },
        { id: "no_identificado", label: "No identificado" },
        { id: "no_sabe", label: "No sabe" }
      ]
    },
    fuentes: {
      label: "Fuentes de información requeridas:",
      options: [
        { id: "accesibles", label: "Accesibles" },
        { id: "parciales", label: "Parcialmente accesibles" },
        { id: "no_accesibles", label: "No accesibles" },
        { id: "no_sabe", label: "No sabe" }
      ]
    }
  },
  evidenceMapping: {
    espera: "Tiempo desde entrada hasta resolución final.",
    retrabajo: "Número de recapturas, conciliaciones o revisiones por caso.",
    errores: "Tasa de discrepancias y costo estimado de corrección.",
    decisiones: "Tiempo de escalación y horas dedicadas a reconstruir contexto.",
    visibilidad: "Frecuencia de consultas de estado, retrasos y casos sin responsable claro."
  },
  classifications: {
    buen_candidato: {
      id: "buen_candidato",
      title: "Buen candidato para diagnóstico",
      statusTag: "RECOMENDADO",
      summary: "El proceso presenta recurrencia clara y evidencia mínima para justificar una cuantificación detallada de impacto."
    },
    validar_baseline: {
      id: "validar_baseline",
      title: "Conviene validar primero el baseline",
      statusTag: "MEDICIÓN PREVIA",
      summary: "Existe actividad frecuente, pero se requiere medir la consecuencia o confirmar responsables y fuentes antes de diseñar software."
    },
    no_software: {
      id: "no_software",
      title: "Aún no justifica software",
      statusTag: "EVALUACIÓN TEMPRANA",
      summary: "El volumen o la baja frecuencia indican que el costo actual no justifica invertir en un sistema automatizado."
    }
  },
  resultCard: {
    title: "Resultado Orientativo Inicial",
    disclaimer: "Esta orientación es un análisis preliminar determinista. No constituye un diagnóstico definitivo, cotización ni compromiso de implementación. DAB Tech siempre valida primero si el problema merece software.",
    commercialReviewNotice: "DAB Tech revisará el caso en un plazo objetivo de 1 día hábil. Si existe una oportunidad medible, coordinaremos una reunión para conocer el proceso con mayor detalle.",
    humanReviewNotice: "Revisión humana objetivo: 1 día hábil.",
    reasonsHeader: "Razones del resultado:",
    evidenceHeader: "Evidencia sugerida a reunir:",
    nextStepHeader: "Siguiente paso:",
    nextStepText: "Revisa el resumen de tus respuestas y compártelo con DAB Tech por WhatsApp para solicitar una revisión humana.",
    nextStepBlockedText: "Conserva este resultado como orientación inicial. El envío para revisión humana se habilitará cuando el aviso de privacidad haya sido validado.",
    privacySummaryTitle: "Tratamiento de información:",
    privacySummaryText: "No se solicitan datos personales dentro de la evaluación y ninguna respuesta se almacena ni transmite a DAB antes del handoff voluntario. El texto opcional se procesa únicamente en memoria.",
    whatsappButtonText: "Conversar por WhatsApp con contexto",
    whatsappDisabledNotice: "El envío a DAB por WhatsApp se habilitará cuando el aviso de privacidad haya sido validado.",
    backButtonText: "Regresar y editar respuestas"
  }
};

export function getDiagnosticNextStepText(handoffEnabled: boolean): string {
  return handoffEnabled
    ? diagnosticContent.resultCard.nextStepText
    : diagnosticContent.resultCard.nextStepBlockedText;
}
