export type AnalyticsEvent =
  | 'view_workflow_demo'
  | 'start_workflow_demo'
  | 'click_primary_cta'
  | 'start_diagnostic'
  | 'complete_diagnostic'
  | 'click_whatsapp_handoff';

export const ALLOWED_EVENTS: string[] = [
  'view_workflow_demo',
  'start_workflow_demo',
  'click_primary_cta',
  'start_diagnostic',
  'complete_diagnostic',
  'click_whatsapp_handoff'
];

export interface AnalyticsAdapter {
  track(eventName: string): void;
}

// Memory record of tracked events for testing/dev environments ONLY
export const trackedEventsMemory: Array<{ event: string; timestamp: string }> = [];

export class ProductionNoopAnalyticsAdapter implements AnalyticsAdapter {
  track(_eventName: string): void {
    // Pure noop when disabled or unconfigured in production
  }
}

export class SimpleAnalyticsAdapter implements AnalyticsAdapter {
  track(eventName: string): void {
    if (typeof window !== 'undefined' && window.location.origin === 'https://dabtech.me') {
      const sa = (window as unknown as { sa_event?: (name: string) => void }).sa_event;
      if (typeof sa === 'function') {
        sa(eventName);
      }
    }
  }
}

export class DevTestAnalyticsAdapter implements AnalyticsAdapter {
  track(eventName: string): void {
    trackedEventsMemory.push({
      event: eventName,
      timestamp: new Date().toISOString()
    });

    if (typeof window !== 'undefined') {
      console.debug(`[DAB SimpleAnalytics: DEV/TEST] ${eventName}`);
    }
  }
}

const isDevOrTest =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.DEV || import.meta.env.MODE === 'test')) ||
  (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test');

const isSimpleAnalyticsEnabled = typeof __DAB_ANALYTICS_PRODUCTION__ !== 'undefined' && __DAB_ANALYTICS_PRODUCTION__;

// Singleton adapter instance
let adapter: AnalyticsAdapter = isSimpleAnalyticsEnabled
  ? new SimpleAnalyticsAdapter()
  : isDevOrTest
  ? new DevTestAnalyticsAdapter()
  : new ProductionNoopAnalyticsAdapter();

export function setAnalyticsAdapter(newAdapter: AnalyticsAdapter): void {
  adapter = newAdapter;
}

export function getAnalyticsAdapter(): AnalyticsAdapter {
  return adapter;
}

let viewWorkflowDemoTracked = false;

export function resetAnalyticsState(): void {
  viewWorkflowDemoTracked = false;
  trackedEventsMemory.length = 0;
}

export function trackEvent(eventName: AnalyticsEvent): void;
export function trackEvent(eventName: string, payload?: Record<string | symbol, unknown>): void {
  // 1. Runtime Allowlist Validation for Event Name
  if (!ALLOWED_EVENTS.includes(eventName)) {
    if (isDevOrTest) {
      console.warn(`[DAB SimpleAnalytics] Event "${eventName}" is not permitted.`);
    }
    return;
  }

  // 2. Strict Payload Rejection - ZERO payload allowed for all events!
  if (payload !== undefined) {
    if (isDevOrTest) {
      console.warn(`[DAB SimpleAnalytics] Event "${eventName}" does not accept any payload. Event rejected.`);
    }
    return;
  }

  // 3. Single emission rule for view_workflow_demo per page load
  if (eventName === 'view_workflow_demo') {
    if (viewWorkflowDemoTracked) {
      return;
    }
    viewWorkflowDemoTracked = true;
  }

  adapter.track(eventName);
}
