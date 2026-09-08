// Datos reales confirmados por el propietario para su publicación el 2026-09-07.
export const legalConfig = {
  ownerType: 'persona_fisica',
  ownerFullName: 'Benito Antonio Martínez Ocasio',
  noticeAddress: 'Nacional 36, Metepec, Estado de México',
  arcoEmail: 'dabtech@gmail.com',
  arcoInitialResponsible: 'Fabrizio Condes Ballesteros',
  whatsappBusiness: '+52 722 357 9869',
  whatsappNumberHolder: 'Benito Antonio Martínez Ocasio',
  hostingProvider: 'Vercel',
  emailProvider: 'Google',
  analyticsProvider: 'Simple Analytics',
  prospectConversationRetentionMonths: 12,
  diagnosticReviewTarget: '1 día hábil',
  domain: 'dabtech.me',
  ownerApproved: true
} as const;

export const requiredLegalFields = ['ownerFullName', 'noticeAddress', 'whatsappNumberHolder', 'arcoInitialResponsible'] as const;
export function missingLegalFields(config: Partial<Record<typeof requiredLegalFields[number], unknown>>) {
  return requiredLegalFields.filter(key => {
    const value = config[key];
    return typeof value !== 'string' || !value.trim() || /\b(todo|pendiente|placeholder|ejemplo|valor real|test|prueba)\b|[\[\]<>]/i.test(value)
      || (key !== 'noticeAddress' && !/^[\p{L}\p{M} .'-]+$/u.test(value));
  });
}
export function hasApprovedLegalData(config: Parameters<typeof missingLegalFields>[0] & {ownerApproved?: boolean}) {
  return config.ownerApproved === true && missingLegalFields(config).length === 0;
}
export const isPrivacyApproved = hasApprovedLegalData(legalConfig);
export const whatsappPhone = legalConfig.whatsappBusiness.replace(/\D/g, '');
