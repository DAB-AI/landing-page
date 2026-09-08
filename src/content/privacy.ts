import { legalConfig, isPrivacyApproved } from '../config/legal.ts';
export { isPrivacyApproved };
export const privacyStatus = isPrivacyApproved ? 'APPROVED' : 'BLOCKED_FOR_PRIVACY_OWNER_DATA';
export const privacyContent = {
  version: 'R7.2',
  lastUpdated: '2026-09-07',
  title: 'Aviso de Privacidad Integral',
  sections: [
    {
      title: '1. Identidad y contacto del responsable',
      paragraphs: [
        `${legalConfig.ownerFullName}, persona física que opera bajo el nombre comercial DAB Tech, es responsable del tratamiento de la información que recibe para revisar workflows operativos. Su domicilio para efectos de este aviso es ${legalConfig.noticeAddress}.`,
        `Para solicitudes de acceso, rectificación, cancelación u oposición (ARCO), revocación del consentimiento o consultas sobre este aviso, escribe a ${legalConfig.arcoEmail}. La atención inicial está a cargo de ${legalConfig.arcoInitialResponsible}.`,
        `El canal comercial es WhatsApp Business ${legalConfig.whatsappBusiness}, cuyo titular es ${legalConfig.whatsappNumberHolder}.`
      ]
    },
    {
      title: '2. Durante el diagnóstico en la web',
      paragraphs: [
        'La evaluación utiliza el tipo de proceso, las fricciones operativas, frecuencia, volumen, consecuencia, responsable y disponibilidad de fuentes. También permite una descripción opcional de otro proceso, limitada a 80 caracteres.',
        'Estas respuestas se procesan únicamente en la memoria del navegador. No se guardan en cookies, localStorage, sessionStorage, IndexedDB ni Cache Storage, ni se incorporan a la URL o al historial. DAB Tech no recibe las respuestas antes de que el usuario elija continuar por WhatsApp. Al recargar o cerrar la página se pierden las respuestas no enviadas.',
        'El resultado es una orientación preliminar, no un diagnóstico definitivo, cotización, aprobación automática ni compromiso de implementación.'
      ]
    },
    {
      title: '3. Cuando eliges continuar por WhatsApp',
      paragraphs: [
        'Al pulsar “Conversar por WhatsApp con contexto”, el navegador abre WhatsApp con un borrador que contiene el resumen visible del diagnóstico. Esta acción comunica el texto del borrador al servicio de WhatsApp. Puedes revisarlo, editarlo o descartarlo antes de enviarlo; DAB Tech recibe el mensaje solo si decides enviarlo. La web no realiza un envío automático ni puede confirmar que lo enviaste.',
        'DAB Tech podrá tratar el número telefónico, nombre u otros identificadores visibles en tu cuenta de WhatsApp, el contenido del mensaje, las respuestas que decidas incluir y la conversación posterior, archivos e información que compartas voluntariamente.',
        'Durante el contacto inicial no envíes contraseñas, credenciales, datos bancarios, expedientes médicos, secretos industriales ni datos personales de terceros. Para una revisión posterior que requiera información adicional, se acordarán previamente el alcance y las condiciones correspondientes.'
      ]
    },
    {
      title: '4. Medición del sitio e infraestructura',
      paragraphs: [
        'En producción, únicamente en dabtech.me, Simple Analytics mide visitas y uso agregado del sitio. Los únicos eventos personalizados son view_workflow_demo, start_workflow_demo, click_primary_cta, start_diagnostic, complete_diagnostic y click_whatsapp_handoff. Se envía solo el nombre del evento, sin respuestas, clasificación, proceso seleccionado, número telefónico ni texto personalizado.',
        'DAB Tech no añade cookies, identificadores persistentes ni propiedades personalizadas para esta medición. La integración oficial puede utilizar un identificador de carga de página para relacionar eventos de esa carga, además de información técnica de la visita conforme a su documentación. No se utiliza seguimiento publicitario ni se afirma que toda la infraestructura sea ajena al tratamiento de datos personales.',
        'Vercel sirve y protege el sitio. Como proveedor de infraestructura puede procesar información técnica, direcciones IP y registros de acceso o seguridad conforme a su configuración y políticas. No es un receptor comercial de las respuestas del diagnóstico.'
      ]
    },
    {
      title: '5. Finalidades del tratamiento',
      paragraphs: [
        'Recibir tu solicitud voluntaria de revisión, comprender el workflow descrito, evaluar si existe una oportunidad operativa medible, realizar una revisión humana, contactarte, coordinar una reunión si existe encaje y dar seguimiento a la conversación.',
        `El tiempo objetivo de revisión del diagnóstico es ${legalConfig.diagnosticReviewTarget}; es un objetivo operativo y no una garantía de resultado o contratación. También se trata la información necesaria para mantener la seguridad, prevenir abuso y atender obligaciones aplicables.`,
        'No se realizan campañas de marketing por correo, perfiles publicitarios ni venta de datos. No hay finalidades secundarias de publicidad que requieran una opción de rechazo separada.'
      ]
    },
    {
      title: '6. Proveedores, encargados y comunicación de información',
      paragraphs: [
        'Meta/WhatsApp proporciona el canal de mensajería cuando tú eliges abrirlo y enviar un mensaje. Vercel proporciona infraestructura del sitio. Simple Analytics proporciona medición agregada. Google proporciona el correo utilizado para consultas y atención de solicitudes ARCO.',
        'Cada proveedor interviene según el servicio prestado, las instrucciones y los términos aplicables; no se considera que todos tengan la misma función ni que todos sean receptores comerciales del diagnóstico. WhatsApp y otros proveedores pueden tratar información para sus propias funciones y políticas.',
        'Algunos proveedores pueden procesar información fuera de México. Las comunicaciones y tratamientos correspondientes se sujetan a sus términos y a los mecanismos y requisitos legales aplicables. DAB Tech no vende información ni la transfiere para publicidad; cualquier transferencia adicional que requiera consentimiento se informará y solicitará antes de realizarla, salvo las excepciones previstas por la ley.'
      ]
    },
    {
      title: '7. Conservación',
      paragraphs: [
        'El diagnóstico no enviado se elimina de la memoria al recargar o cerrar la página.',
        `Las conversaciones de prospectos se conservan hasta ${legalConfig.prospectConversationRetentionMonths} meses desde la última interacción; al concluir ese periodo se eliminan, salvo que exista una obligación aplicable o una relación posterior que requiera informar otro tratamiento.`,
        'Las solicitudes ARCO y su documentación se conservan durante el tiempo necesario para atenderlas y mantener evidencia del cumplimiento. Los datos técnicos y analíticos se sujetan a la configuración y los plazos del proveedor correspondiente.'
      ]
    },
    {
      title: '8. Derechos ARCO, revocación y limitación',
      paragraphs: [
        `Puedes solicitar acceso, rectificación, cancelación u oposición, revocar tu consentimiento o limitar el uso o divulgación de tu información mediante un correo a ${legalConfig.arcoEmail}. Indica tu nombre, un medio para comunicar la respuesta, el derecho que deseas ejercer y una descripción suficiente para localizar la información.`,
        'Cuando corresponda se solicitará únicamente la documentación necesaria y proporcional para acreditar identidad o representación. Para una rectificación, explica el cambio solicitado y aporta el soporte pertinente. No envíes documentación sensible sin que sea necesaria para atender la solicitud.',
        'Los plazos y condiciones de atención serán los previstos por la legislación aplicable. Si falta información necesaria, se te indicará cómo completarla. La revocación no tiene efectos retroactivos y puede estar limitada por obligaciones legales de conservación; se explicarán los motivos y alternativas que correspondan.'
      ]
    },
    {
      title: '9. Cambios al aviso',
      paragraphs: ['Las modificaciones se publicarán en https://dabtech.me/privacidad/, con la versión y fecha de última actualización visibles. Este aviso describe la operación confirmada por el propietario de DAB Tech.']
    }
  ]
};
