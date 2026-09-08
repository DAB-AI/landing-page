import { siteIdentity } from '../config/site';

export const homeContent = {
  meta: {
    title: `${siteIdentity.name} | Sistemas operados por IA para empresas mexicanas`,
    description: siteIdentity.metaDescription
  },
  nav: {
    links: [
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Dónde empezar", href: "#donde-empezar" },
      { label: "Método", href: "#metodo" },
      { label: "Preguntas", href: "#preguntas" }
    ],
    cta: { label: "Diagnosticar un workflow", href: "#diagnostico" }
  },
  hero: {
    eyebrow: "IA dentro de tu operación",
    title: "Convertimos procesos que hoy cuestan tiempo y dinero en sistemas operados por IA.",
    body: "Entramos a un workflow real, conectamos sus datos y reglas, desplegamos IA con control humano y medimos el resultado antes de ampliar.",
    primaryCta: { label: "Diagnosticar un workflow", href: "#diagnostico" },
    secondaryCta: { label: "Ver cómo funciona", href: "#como-funciona" },
    note: "Empezamos por un proceso. Sin reemplazar los sistemas que ya usa tu empresa."
  },
  problemSignals: {
    eyebrow: "El punto de entrada",
    title: "Antes de automatizar, encontramos el workflow que sí vale la pena cambiar.",
    intro: "No todo trabajo manual justifica IA. Buscamos procesos donde el volumen, la espera, los errores o el capital atrapado ya tienen un costo visible.",
    signals: [
      {
        id: "espera",
        title: "Espera",
        description: "Solicitudes, expedientes o aprobaciones se detienen entre personas y sistemas.",
        evidence: "Evidencia requerida: Registro de tiempo de ciclo entre origen y resolución final."
      },
      {
        id: "retrabajo",
        title: "Retrabajo",
        description: "El equipo vuelve a capturar, conciliar o verificar información que ya existe.",
        evidence: "Evidencia requerida: Conteo de duplicación de captura y tasa de discrepancia entre datos."
      },
      {
        id: "decisiones",
        title: "Decisiones detenidas",
        description: "Las excepciones llegan sin contexto y requieren reconstruir el caso antes de actuar.",
        evidence: "Evidencia requerida: Frecuencia de escalación y tiempo dedicado a buscar contexto previo."
      }
    ],
    closure: "Si el problema no puede medirse, todavía no merece un deployment."
  },
  workflowSteps: {
    eyebrow: "Cómo trabaja DAB",
    title: "Un proceso. Contexto suficiente. Resultado medible.",
    steps: [
      {
        number: "01",
        title: "Encontramos impacto",
        body: "Definimos qué cuesta el proceso hoy: tiempo de ciclo, horas, errores, cartera, capacidad o ingresos no atendidos."
      },
      {
        number: "02",
        title: "Mapeamos el flujo",
        body: "Documentamos entradas, decisiones, reglas, responsables, excepciones y sistemas de registro."
      },
      {
        number: "03",
        title: "Conectamos contexto",
        body: "La IA consulta las fuentes necesarias y conserva el significado de clientes, pedidos, documentos y métricas dentro del proceso."
      },
      {
        number: "04",
        title: "Desplegamos con control",
        body: "El sistema prepara trabajo, ejecuta acciones permitidas y lleva las excepciones a la persona correcta."
      },
      {
        number: "05",
        title: "Medimos",
        body: "Comparamos el baseline con el resultado real antes de aumentar autonomía o abrir el siguiente workflow."
      }
    ]
  },
  demoSection: {
    eyebrow: "Ejemplo ilustrativo",
    title: "De una solicitud de cotización a una respuesta lista para aprobar.",
    intro: "Una RFQ puede exigir revisar correos, archivos, inventario, precios, márgenes y antecedentes. El workflow reúne el contexto, prepara la respuesta y separa las excepciones.",
    disclaimer: "Esta interfaz demuestra el mecanismo. No representa un caso de cliente ni una plataforma empaquetada."
  },
  autonomySection: {
    eyebrow: "Control antes que promesas",
    title: "La IA se gana la autonomía con evidencia.",
    levels: [
      {
        level: "Nivel 0",
        name: "recomienda",
        description: "La IA reúne contexto y propone. El equipo decide y ejecuta.",
        humanRole: "Revisión 100% y ejecución manual.",
        gate: "Evaluación inicial de precisión."
      },
      {
        level: "Nivel 1",
        name: "prepara",
        description: "La IA genera el trabajo completo. El equipo revisa cada salida.",
        humanRole: "Aprobación de la salida armada.",
        gate: "Tasa de corrección < 5%."
      },
      {
        level: "Nivel 2",
        name: "ejecuta con aprobación",
        description: "La IA actúa después de una aprobación explícita y registra la decisión.",
        humanRole: "Un clic para autorizar o corregir excepción.",
        gate: "Consistencia operativa sostenida."
      },
      {
        level: "Nivel 3",
        name: "automatiza dentro de límites",
        description: "Solo las acciones de bajo riesgo y desempeño probado avanzan sin revisión. Las excepciones siguen siendo humanas.",
        humanRole: "Atención exclusiva a casos fuera de norma.",
        gate: "Auditoría periódica y límites duros."
      }
    ]
  },
  wedgeList: {
    eyebrow: "Dónde empezar",
    title: "Empezamos donde el costo ya existe.",
    intro: "Estas son áreas iniciales de evaluación, no paquetes cerrados.",
    wedges: [
      {
        tag: "Hipótesis 1",
        title: "RFQ y cotizaciones",
        description: "Reducir el tiempo entre una solicitud y una respuesta correcta, con reglas de precio, margen y disponibilidad."
      },
      {
        tag: "Hipótesis 2",
        title: "Cobranza y crédito",
        description: "Priorizar casos, reunir contexto y preparar acciones sin perder control sobre decisiones sensibles."
      },
      {
        tag: "Hipótesis 3",
        title: "Pedidos y conciliación",
        description: "Detectar diferencias, reunir evidencia y resolver excepciones antes de que se conviertan en retrasos."
      }
    ]
  },
  methodTimeline: {
    eyebrow: "Del diagnóstico a producción",
    title: "DAB trabaja dentro del proceso, no alrededor de él.",
    phases: [
      {
        name: "Diagnóstico",
        description: "Elegimos un workflow por impacto, acceso a datos, repetibilidad y viabilidad.",
        output: "Mapa de proceso, cuantificación de baseline y arquitectura preliminar."
      },
      {
        name: "Piloto controlled",
        nameFull: "Piloto controlado",
        description: "Probamos con volumen real y revisión humana. Medimos precisión, tiempo y excepciones.",
        output: "Prototipo funcional operado con supervisión activa."
      },
      {
        name: "Producción",
        description: "Integramos las acciones aprobadas y definimos límites, responsables y recuperación ante errores.",
        output: "Sistema integrado a bases de datos y canales operativos."
      },
      {
        name: "Operación y expansión",
        description: "Seguimos el desempeño. Solo después de demostrar valor decidimos si conviene aumentar autonomía o abordar otro proceso.",
        output: "Tablero de impacto económico y hoja de ruta del siguiente workflow."
      }
    ]
  },
  measurementFrame: {
    eyebrow: "Cómo se demuestra valor",
    title: "Cada deployment debe terminar con un antes y un después.",
    baseline: {
      title: "Baseline",
      items: [
        "volumen",
        "tiempo de ciclo",
        "personas involucradas",
        "errores",
        "revisiones",
        "costo relevante"
      ]
    },
    after: {
      title: "Después",
      items: [
        "tiempo resultante",
        "trabajo humano restante",
        "excepciones",
        "calidad",
        "resultado económico cuando pueda atribuirse"
      ]
    },
    closure: "El informe de impacto forma parte del producto."
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Dudas sobre implementación, control y medición.",
    items: [
      {
        q: "¿DAB reemplaza nuestro ERP o CRM?",
        a: "No. El punto de partida son los sistemas que ya operan la empresa. DAB conecta el contexto y las acciones necesarias para un workflow concreto."
      },
      {
        q: "¿La IA toma decisiones sola?",
        a: "No desde el inicio. Comienza recomendando o preparando trabajo. La autonomía aumenta únicamente cuando el proceso, el riesgo y la evidencia lo permiten."
      },
      {
        q: "¿Qué pasa cuando encuentra una excepción?",
        a: "La detiene, adjunta el contexto relevante y la envía al responsable definido. El objetivo no es ocultar incertidumbre, sino volverla operable."
      },
      {
        q: "¿Cuánto tarda una implementación?",
        a: "Depende del workflow, los sistemas y el acceso a datos. El diagnóstico define un piloto pequeño con alcance, baseline y gate de salida antes de construir."
      },
      {
        q: "¿Cómo se mide el resultado?",
        a: "Se acuerdan métricas antes del piloto. Pueden incluir tiempo de ciclo, errores, trabajo manual, casos procesados, cartera recuperada o ingresos atendidos."
      },
      {
        q: "¿Qué tipo de empresa encaja mejor?",
        a: "Empresas con un proceso repetitivo, suficiente volumen, un responsable claro, datos accesibles y un problema cuyo costo puede observarse."
      }
    ]
  },
  finalCta: {
    eyebrow: "Primer paso",
    title: "¿Qué parte de tu operación cuesta más de lo que debería?",
    body: "Cuéntanos el proceso, su volumen y dónde se detiene. Si existe una oportunidad real, la convertimos en un diagnóstico de workflow.",
    button: "Diagnosticar un workflow",
    note: "Sin compromiso de implementación. Primero validamos si el problema merece software."
  },
  footer: {
    thesis: "DAB instala capacidad operativa con IA dentro de empresas mexicanas.",
    location: "Estado de México, México.",
    links: [
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Método", href: "#metodo" },
      { label: "Preguntas", href: "#preguntas" },
      { label: "Empresa", href: "/empresa/" },
      { label: "Privacidad", href: "/privacidad/" },
      { label: "Contacto", href: "#diagnostico" }
    ],
    copyright: "© DAB Tech. Todos los derechos reservados."
  }
};
