import React, { useState, useRef, useEffect } from 'react';
import { diagnosticContent, getDiagnosticNextStepText } from '../../content/diagnostic.es';
import {
  evaluateDiagnostic,
  validateStep1,
  validateStep2,
  validateStep3,
  buildWhatsAppMessage,
  getDiagnosticSummary,
  buildWhatsAppLink,
  type DiagnosticAnswers,
  type DiagnosticEvaluation
} from '../../lib/diagnostic';
import { trackEvent } from '../../lib/analytics';

interface WorkflowDiagnosticProps {
  handoffEnabled?: boolean;
}

export default function WorkflowDiagnostic({ handoffEnabled = false }: WorkflowDiagnosticProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Ephemeral state - memory only
  const [processId, setProcessId] = useState<string>('rfq');
  const [customProcessText, setCustomProcessText] = useState<string>('');
  const [frictions, setFrictions] = useState<string[]>([]);

  // Step 3 answers
  const [frecuencia, setFrecuencia] = useState<string>('');
  const [volumen, setVolumen] = useState<string>('');
  const [consecuencia, setConsecuencia] = useState<string>('');
  const [responsable, setResponsable] = useState<string>('');
  const [fuentes, setFuentes] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasStartedTracked, setHasStartedTracked] = useState<boolean>(false);

  // Focus management ref for step heading
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, [step]);

  const triggerStartTrack = () => {
    if (!hasStartedTracked) {
      trackEvent('start_diagnostic');
      setHasStartedTracked(true);
    }
  };

  const handleNextStep1 = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    triggerStartTrack();

    const err = validateStep1(processId, customProcessText);
    if (err) {
      setErrorMsg(err);
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const err = validateStep2(frictions);
    if (err) {
      setErrorMsg(err);
      return;
    }
    setStep(3);
  };

  const handleNextStep3 = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const partialAnswers: Partial<DiagnosticAnswers> = {
      frecuencia: frecuencia as DiagnosticAnswers['frecuencia'],
      volumen: volumen as DiagnosticAnswers['volumen'],
      consecuencia: consecuencia as DiagnosticAnswers['consecuencia'],
      responsable: responsable as DiagnosticAnswers['responsable'],
      fuentes: fuentes as DiagnosticAnswers['fuentes']
    };

    const err = validateStep3(partialAnswers);
    if (err) {
      setErrorMsg(err);
      return;
    }

    trackEvent('complete_diagnostic');
    setStep(4);
  };

  const toggleFriction = (id: string) => {
    triggerStartTrack();
    if (frictions.includes(id)) {
      setFrictions(frictions.filter((item) => item !== id));
    } else {
      setFrictions([...frictions, id]);
    }
  };

  const currentAnswers: DiagnosticAnswers = {
    processId,
    customProcessText,
    frictions,
    frecuencia: (frecuencia || 'diaria') as DiagnosticAnswers['frecuencia'],
    volumen: (volumen || 'menos_10') as DiagnosticAnswers['volumen'],
    consecuencia: (consecuencia || 'todavia_no_medida') as DiagnosticAnswers['consecuencia'],
    responsable: (responsable || 'no_identificado') as DiagnosticAnswers['responsable'],
    fuentes: (fuentes || 'no_sabe') as DiagnosticAnswers['fuentes']
  };

  const evaluation: DiagnosticEvaluation = evaluateDiagnostic(currentAnswers);
  const handleWhatsAppClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!handoffEnabled || step !== 4) {
      event.preventDefault();
      return;
    }
    // Only this explicit activation constructs the message and external URL.
    event.currentTarget.href = buildWhatsAppLink(buildWhatsAppMessage(currentAnswers, evaluation));
    trackEvent('click_whatsapp_handoff');
  };

  return (
    <div className="diagnostic-island" id="diagnostic-island">
      {/* Header & Step Bar */}
      <div className="diagnostic-island__header">
        <span className="diagnostic-island__eyebrow">{diagnosticContent.header.eyebrow}</span>
        <h2 className="diagnostic-island__title">{diagnosticContent.header.title}</h2>
        <p className="diagnostic-island__intro">{diagnosticContent.header.intro}</p>

        {/* Step Indicator */}
        <div className="diagnostic-stepper" aria-label="Progreso del diagnóstico">
          <div
            className={`diagnostic-stepper__item ${step >= 1 ? 'diagnostic-stepper__item--active' : ''}`}
            aria-current={step === 1 ? 'step' : undefined}
          >
            <span className="diagnostic-stepper__num">1</span>
            <span className="diagnostic-stepper__label">Proceso</span>
          </div>
          <div className="diagnostic-stepper__line" />
          <div
            className={`diagnostic-stepper__item ${step >= 2 ? 'diagnostic-stepper__item--active' : ''}`}
            aria-current={step === 2 ? 'step' : undefined}
          >
            <span className="diagnostic-stepper__num">2</span>
            <span className="diagnostic-stepper__label">Fricción</span>
          </div>
          <div className="diagnostic-stepper__line" />
          <div
            className={`diagnostic-stepper__item ${step >= 3 ? 'diagnostic-stepper__item--active' : ''}`}
            aria-current={step >= 3 ? 'step' : undefined}
          >
            <span className="diagnostic-stepper__num">3</span>
            <span className="diagnostic-stepper__label">Evidencia</span>
          </div>
        </div>
      </div>

      {/* Error Notice Banner */}
      {errorMsg && (
        <div className="diagnostic-error-banner" role="alert" aria-live="polite">
          <p className="diagnostic-error-text">{errorMsg}</p>
        </div>
      )}

      {/* STEP 1: Proceso */}
      {step === 1 && (
        <form className="diagnostic-card" onSubmit={handleNextStep1} noValidate>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="diagnostic-step-title focus:outline-none"
          >
            {diagnosticContent.steps[0].title}
          </h3>
          <p className="diagnostic-step-instruction">{diagnosticContent.steps[0].instruction}</p>

          <fieldset className="diagnostic-fieldset">
            <legend className="sr-only">Selecciona el proceso a evaluar</legend>
            <div className="diagnostic-options-grid">
              {diagnosticContent.step1.processes.map((proc) => (
                <label
                  key={proc.id}
                  className={`diagnostic-option-card ${processId === proc.id ? 'diagnostic-option-card--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="processChoice"
                    value={proc.id}
                    checked={processId === proc.id}
                    onChange={() => {
                      setProcessId(proc.id);
                      triggerStartTrack();
                    }}
                    className="diagnostic-radio"
                  />
                  <div className="diagnostic-option-content">
                    <span className="diagnostic-option-label">{proc.label}</span>
                    <span className="diagnostic-option-desc">{proc.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {processId === 'otro' && (
            <div className="diagnostic-custom-field">
              <label htmlFor="custom-process-input" className="form-label">
                {diagnosticContent.step1.customProcessLabel}
              </label>
              <input
                type="text"
                id="custom-process-input"
                maxLength={80}
                value={customProcessText}
                onChange={(e) => {
                  setCustomProcessText(e.target.value.slice(0, 80));
                  triggerStartTrack();
                }}
                placeholder={diagnosticContent.step1.customProcessPlaceholder}
                className="form-input"
              />
              <span className="diagnostic-field-charcount">{customProcessText.length} / 80 caracteres</span>
              <p className="form-field-warning">{diagnosticContent.step1.customProcessWarning}</p>
            </div>
          )}

          <div className="diagnostic-actions">
            <button type="submit" className="btn-diagnostic-next">
              Siguiente paso →
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Fricción principal */}
      {step === 2 && (
        <form className="diagnostic-card" onSubmit={handleNextStep2} noValidate>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="diagnostic-step-title focus:outline-none"
          >
            {diagnosticContent.steps[1].title}
          </h3>
          <p className="diagnostic-step-instruction">{diagnosticContent.steps[1].instruction}</p>

          <fieldset className="diagnostic-fieldset">
            <legend className="sr-only">Selecciona las fricciones principales</legend>
            <div className="diagnostic-options-grid">
              {diagnosticContent.step2.frictions.map((fric) => {
                const selected = frictions.includes(fric.id);
                return (
                  <label
                    key={fric.id}
                    className={`diagnostic-option-card ${selected ? 'diagnostic-option-card--selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      value={fric.id}
                      checked={selected}
                      onChange={() => toggleFriction(fric.id)}
                      className="diagnostic-checkbox"
                    />
                    <div className="diagnostic-option-content">
                      <span className="diagnostic-option-label">{fric.label}</span>
                      <span className="diagnostic-option-desc">{fric.description}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="diagnostic-actions diagnostic-actions--split">
            <button type="button" onClick={() => setStep(1)} className="btn-diagnostic-back">
              ← Paso anterior
            </button>
            <button type="submit" className="btn-diagnostic-next">
              Siguiente paso →
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Evidencia operativa */}
      {step === 3 && (
        <form className="diagnostic-card" onSubmit={handleNextStep3} noValidate>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="diagnostic-step-title focus:outline-none"
          >
            {diagnosticContent.steps[2].title}
          </h3>
          <p className="diagnostic-step-instruction">{diagnosticContent.steps[2].instruction}</p>

          <div className="diagnostic-step3-grid">
            {/* Frecuencia */}
            <fieldset className="diagnostic-group-fieldset">
              <legend className="diagnostic-group-label">{diagnosticContent.step3.frecuencia.label}</legend>
              <div className="diagnostic-radio-row">
                {diagnosticContent.step3.frecuencia.options.map((opt) => (
                  <label key={opt.id} className={`diagnostic-radio-pill ${frecuencia === opt.id ? 'diagnostic-radio-pill--selected' : ''}`}>
                    <input
                      type="radio"
                      name="frecuencia"
                      value={opt.id}
                      checked={frecuencia === opt.id}
                      onChange={() => setFrecuencia(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Volumen */}
            <fieldset className="diagnostic-group-fieldset">
              <legend className="diagnostic-group-label">{diagnosticContent.step3.volumen.label}</legend>
              <div className="diagnostic-radio-row">
                {diagnosticContent.step3.volumen.options.map((opt) => (
                  <label key={opt.id} className={`diagnostic-radio-pill ${volumen === opt.id ? 'diagnostic-radio-pill--selected' : ''}`}>
                    <input
                      type="radio"
                      name="volumen"
                      value={opt.id}
                      checked={volumen === opt.id}
                      onChange={() => setVolumen(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Consecuencia */}
            <fieldset className="diagnostic-group-fieldset">
              <legend className="diagnostic-group-label">{diagnosticContent.step3.consecuencia.label}</legend>
              <div className="diagnostic-radio-row diagnostic-radio-row--wrap">
                {diagnosticContent.step3.consecuencia.options.map((opt) => (
                  <label key={opt.id} className={`diagnostic-radio-pill ${consecuencia === opt.id ? 'diagnostic-radio-pill--selected' : ''}`}>
                    <input
                      type="radio"
                      name="consecuencia"
                      value={opt.id}
                      checked={consecuencia === opt.id}
                      onChange={() => setConsecuencia(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Responsable */}
            <fieldset className="diagnostic-group-fieldset">
              <legend className="diagnostic-group-label">{diagnosticContent.step3.responsable.label}</legend>
              <div className="diagnostic-radio-row">
                {diagnosticContent.step3.responsable.options.map((opt) => (
                  <label key={opt.id} className={`diagnostic-radio-pill ${responsable === opt.id ? 'diagnostic-radio-pill--selected' : ''}`}>
                    <input
                      type="radio"
                      name="responsable"
                      value={opt.id}
                      checked={responsable === opt.id}
                      onChange={() => setResponsable(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Fuentes */}
            <fieldset className="diagnostic-group-fieldset">
              <legend className="diagnostic-group-label">{diagnosticContent.step3.fuentes.label}</legend>
              <div className="diagnostic-radio-row">
                {diagnosticContent.step3.fuentes.options.map((opt) => (
                  <label key={opt.id} className={`diagnostic-radio-pill ${fuentes === opt.id ? 'diagnostic-radio-pill--selected' : ''}`}>
                    <input
                      type="radio"
                      name="fuentes"
                      value={opt.id}
                      checked={fuentes === opt.id}
                      onChange={() => setFuentes(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="diagnostic-actions diagnostic-actions--split">
            <button type="button" onClick={() => setStep(2)} className="btn-diagnostic-back">
              ← Paso anterior
            </button>
            <button type="submit" className="btn-diagnostic-next">
              Ver resultado →
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Resultado */}
      {step === 4 && (
        <div className="diagnostic-card diagnostic-result-card" role="status" aria-live="polite">
          <div className="diagnostic-result-header">
            <span className="diagnostic-result-badge">{evaluation.statusTag}</span>
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="diagnostic-result-title focus:outline-none"
            >
              {evaluation.title}
            </h3>
            <p className="diagnostic-result-summary">{evaluation.summary}</p>
          </div>

          {/* Reasons */}
          <div className="diagnostic-result-section">
            <h4 className="diagnostic-result-subtitle">{diagnosticContent.resultCard.reasonsHeader}</h4>
            <ul className="diagnostic-result-list">
              {evaluation.reasons.map((reason, idx) => (
                <li key={idx} className="diagnostic-result-item">
                  <span className="diagnostic-result-bullet">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Evidence */}
          <div className="diagnostic-result-section">
            <h4 className="diagnostic-result-subtitle">{diagnosticContent.resultCard.evidenceHeader}</h4>
            <ul className="diagnostic-result-list">
              {evaluation.suggestedEvidence.map((ev, idx) => (
                <li key={idx} className="diagnostic-result-item">
                  <span className="diagnostic-result-bullet">✓</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {handoffEnabled && (
            <div className="diagnostic-result-section diagnostic-answer-summary">
              <h4 className="diagnostic-result-subtitle">Resumen de tus respuestas</h4>
              {getDiagnosticSummary(currentAnswers, evaluation).map(([label, value]) => (
                <p className="diagnostic-result-text" key={label} data-summary-label={label}><strong>{label}: </strong><span>{value}</span></p>
              ))}
            </div>
          )}

          {/* Next Step & Human Review */}
          <div className="diagnostic-result-section diagnostic-result-section--highlight">
            <h4 className="diagnostic-result-subtitle">{diagnosticContent.resultCard.nextStepHeader}</h4>
            <p className="diagnostic-result-text">{getDiagnosticNextStepText(handoffEnabled)}</p>
            <span className="diagnostic-human-tag">{handoffEnabled ? diagnosticContent.resultCard.commercialReviewNotice : diagnosticContent.resultCard.humanReviewNotice}</span>
          </div>

          {/* Privacy Confirmation Notice */}
          <div className="diagnostic-privacy-notice form-privacy-simplified">
            <h5 className="diagnostic-privacy-title">{diagnosticContent.resultCard.privacySummaryTitle}</h5>
            <p className="diagnostic-privacy-text">{diagnosticContent.resultCard.privacySummaryText}</p>
          </div>

          {/* Disclaimer */}
          <p className="diagnostic-disclaimer">{diagnosticContent.resultCard.disclaimer}</p>

          {/* WhatsApp Handoff CTA or Privacy Disabled Notice */}
          <div className="diagnostic-actions diagnostic-actions--result">
            {handoffEnabled ? (
              <a
                href="#diagnostic-island"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="btn-whatsapp-cta"
              >
                <svg className="whatsapp-icon" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.892 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>{diagnosticContent.resultCard.whatsappButtonText}</span>
              </a>
            ) : (
              <div className="diagnostic-whatsapp-disabled" role="status">
                <span className="disabled-badge">PRÓXIMAMENTE DISPONIBLE</span>
                <p className="disabled-text">{diagnosticContent.resultCard.whatsappDisabledNotice}</p>
              </div>
            )}

            <button type="button" onClick={() => setStep(3)} className="btn-diagnostic-back-edit">
              {diagnosticContent.resultCard.backButtonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
