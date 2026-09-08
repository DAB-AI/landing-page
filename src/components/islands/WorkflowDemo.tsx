import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../../lib/analytics';

export interface StateStep {
  id: string;
  stepNum: string;
  title: string;
  shortLabel: string;
  detail: string;
  statusBadge: string;
  statusType: 'connected' | 'exception' | 'reviewing' | 'approved';
  rules: string[];
  output: string;
}

export const DEMO_STEPS: StateStep[] = [
  {
    id: 'received',
    stepNum: 'PASO 01',
    title: '1. Solicitud recibida',
    shortLabel: 'Solicitud',
    detail: 'Correo B2B recibido con especificaciones de suministro industrial y plazo solicitado.',
    statusBadge: 'DATOS RECIBIDOS',
    statusType: 'connected',
    rules: ['Buzón de Entrada: Correo RFQ', 'Formato: Correo + Adjunto PDF'],
    output: 'Borrador de Solicitud Inicial'
  },
  {
    id: 'requirements',
    stepNum: 'PASO 02',
    title: '2. Requisitos detectados',
    shortLabel: 'Requisitos',
    detail: 'Extracción de volumen (1,500 uds.), especificación técnica y fecha límite de entrega.',
    statusBadge: 'CONTEXTO EXTRAÍDO',
    statusType: 'connected',
    rules: ['Parser Documental B2B', 'Validación de SKU & Cantidad'],
    output: 'Parámetros Estructurados'
  },
  {
    id: 'sources',
    stepNum: 'PASO 03',
    title: '3. Fuentes consultadas',
    shortLabel: 'Fuentes',
    detail: 'Cruce en tiempo real entre inventario central, catálogo de precios y condiciones de cliente.',
    statusBadge: 'FUENTES CONECTADAS',
    statusType: 'connected',
    rules: ['ERP / Inventario Central', 'CRM / Histórico Comercial', 'Catálogo de Precios'],
    output: 'Contexto de Datos Unificado'
  },
  {
    id: 'inventory',
    stepNum: 'PASO 04',
    title: '4. Inventario y reglas',
    shortLabel: 'Reglas',
    detail: 'Stock confirmado (2,400 uds.). Regla de negocio evaluada: Variación máxima de margen <= 5.0%.',
    statusBadge: 'EVALUANDO REGLA',
    statusType: 'connected',
    rules: ['Regla: MAX_MARGIN_VARIANCE <= 5.0%', 'Stock Almacén: 2,400 uds.'],
    output: 'Resultado de Regla de Negocio'
  },
  {
    id: 'exception',
    stepNum: 'PASO 05',
    title: '5. Excepción de margen',
    shortLabel: 'Excepción',
    detail: 'El descuento solicitado excede el 5.0% permitido (+7.2% de desviación). Notificación enviada.',
    statusBadge: 'EXCEPCIÓN DETECTADA',
    statusType: 'exception',
    rules: ['Desviación Detectada: +7.2%', 'Acción: Bloqueo Preventivo'],
    output: 'Expediente de Excepción Generado'
  },
  {
    id: 'review',
    stepNum: 'PASO 06',
    title: '6. Revisión humana',
    shortLabel: 'Revisión',
    detail: 'Asignado a responsable comercial con expediente de decisión y contexto del cliente.',
    statusBadge: 'ASIGNADO A RESPONSABLE',
    statusType: 'reviewing',
    rules: ['Supervisión Humana Requerida', 'Responsable Comercial Asignado'],
    output: 'Evaluación Humana en Curso'
  },
  {
    id: 'response',
    stepNum: 'PASO 07',
    title: '7. Respuesta preparada y registrada',
    shortLabel: 'Respuesta',
    detail: 'Cotización borrador armada con ajuste aprobado por el responsable. Registro completado.',
    statusBadge: 'APROBADO CON AJUSTE',
    statusType: 'approved',
    rules: ['Cotización Borrador Armada', 'Registro de Decisión Guardado'],
    output: 'Respuesta Lista para Enviar'
  }
];

export const WorkflowDemo: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const hasTrackedView = useRef<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    if (!hasTrackedView.current) {
      trackEvent('view_workflow_demo');
      hasTrackedView.current = true;
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying && currentIndex < DEMO_STEPS.length - 1) {
      timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 3500);
    } else if (isPlaying && currentIndex === DEMO_STEPS.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex]);

  const handleStepSelect = (index: number) => {
    setIsPlaying(false);
    setCurrentIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsPlaying(false);
      setCurrentIndex((prev) => Math.min(DEMO_STEPS.length - 1, prev + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setIsPlaying(false);
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const activeStep = DEMO_STEPS[currentIndex];

  return (
    <div
      className="r7-demo-surface"
      id="workflow-demo"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Superficie de control interactiva RFQ"
    >
      {/* Top Bar Header */}
      <div className="r7-demo-topbar">
        <div className="r7-demo-badge">SIMULACIÓN DE WORKFLOW</div>
        <div className="r7-demo-title">Procesamiento de Solicitud RFQ</div>
        <div className={`r7-demo-status-tag status--${activeStep.statusType}`}>
          ESTADO: {activeStep.statusBadge}
        </div>
      </div>

      {/* Main Grid: Desktop 2 Columns, Mobile 1 Screen */}
      <div className="r7-demo-grid">
        {/* Left Column: Sequence of Steps */}
        <div className="r7-demo-col-steps">
          <div className="r7-demo-col-label">SECUENCIA DEL PROCESO</div>
          <div className="r7-demo-step-list" role="tablist" aria-label="Pasos del proceso">
            {DEMO_STEPS.map((step, idx) => {
              const isActive = idx === currentIndex;
              const isPassed = idx < currentIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`step-panel-${step.id}`}
                  onClick={() => handleStepSelect(idx)}
                  className={`r7-step-card ${isActive ? 'r7-step-card--active' : ''} ${isPassed ? 'r7-step-card--passed' : ''}`}
                >
                  <div className="r7-step-num">{step.stepNum}</div>
                  <div className="r7-step-info">
                    <div className="r7-step-title">{step.title}</div>
                    {isActive && <div className="r7-step-detail">{step.detail}</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active State Detail Panel */}
        <div className="r7-demo-col-detail" id={`step-panel-${activeStep.id}`}>
          <div className="r7-demo-col-label">FUENTES CONSULTADAS Y SALIDA PREPARADA</div>

          {/* Sources Grid */}
          <div className="r7-sources-grid">
            <div className="r7-source-pill">Correo RFQ</div>
            <div className="r7-source-pill">ERP / Inventario</div>
            <div className="r7-source-pill">Catálogo Precios</div>
            <div className="r7-source-pill">CRM / Histórico</div>
          </div>

          {/* Active Detail Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18 }}
              className="r7-detail-card"
            >
              <div className="r7-detail-header">
                <span className="r7-detail-num">{activeStep.stepNum}</span>
                <span className="r7-detail-title">{activeStep.title}</span>
              </div>

              <p className="r7-detail-text">{activeStep.detail}</p>

              <div className="r7-rules-box">
                <div className="r7-box-row">
                  <span className="r7-box-label">Regla de Negocio:</span>
                  <span className="r7-box-val">Variación máxima de margen: 5.0%</span>
                </div>
                {activeStep.statusType === 'exception' && (
                  <div className="r7-box-row r7-box-row--exception">
                    <span className="r7-box-label">Desviación Detectada:</span>
                    <span className="r7-box-val">+7.2% (EXCEPCIÓN)</span>
                  </div>
                )}
                {activeStep.statusType === 'reviewing' && (
                  <div className="r7-box-row">
                    <span className="r7-box-label">Supervisión Humana:</span>
                    <span className="r7-box-val">Asignado a responsable comercial</span>
                  </div>
                )}
                <div className="r7-box-row">
                  <span className="r7-box-label">Salida Preparada:</span>
                  <span className="r7-box-val">{activeStep.output}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Navigation & Controls */}
          <div className="r7-controls-bar">
            <button
              type="button"
              onClick={() => { setIsPlaying(false); setCurrentIndex((prev) => Math.max(0, prev - 1)); }}
              disabled={currentIndex === 0}
              className="r7-ctrl-btn"
              aria-label="Paso anterior"
            >
              Anterior
            </button>

            <span className="r7-step-indicator" aria-live="polite">
              Paso {currentIndex + 1} de {DEMO_STEPS.length}
            </span>

            <button
              type="button"
              onClick={() => { setIsPlaying(false); setCurrentIndex((prev) => Math.min(DEMO_STEPS.length - 1, prev + 1)); }}
              disabled={currentIndex === DEMO_STEPS.length - 1}
              className="r7-ctrl-btn"
              aria-label="Siguiente paso"
            >
              Siguiente
            </button>

            <button
              type="button"
              onClick={() => {
                if (isPlaying) {
                  setIsPlaying(false);
                } else {
                  if (currentIndex === DEMO_STEPS.length - 1) setCurrentIndex(0);
                  setIsPlaying(true);
                  trackEvent('start_workflow_demo');
                }
              }}
              className="r7-ctrl-btn r7-ctrl-btn--primary"
            >
              {isPlaying ? 'Pausar' : 'Simular Flujo'}
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="r7-demo-disclaimer">
        Esta interfaz demuestra el mecanismo. No representa un caso de cliente ni una plataforma empaquetada.
      </div>
    </div>
  );
};
