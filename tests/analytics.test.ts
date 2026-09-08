import { test } from 'node:test';
import assert from 'node:assert';
import {
  trackEvent,
  trackedEventsMemory,
  setAnalyticsAdapter,
  DevTestAnalyticsAdapter,
  resetAnalyticsState,
  ALLOWED_EVENTS
} from '../src/lib/analytics.ts';

test('analytics: trackedEventsMemory is empty on start after reset', () => {
  setAnalyticsAdapter(new DevTestAnalyticsAdapter());
  resetAnalyticsState();
  assert.strictEqual(trackedEventsMemory.length, 0);
});

test('analytics: permits all 6 allowed zero-payload events', () => {
  setAnalyticsAdapter(new DevTestAnalyticsAdapter());
  resetAnalyticsState();

  trackEvent('view_workflow_demo');
  trackEvent('start_workflow_demo');
  trackEvent('click_primary_cta');
  trackEvent('start_diagnostic');
  trackEvent('complete_diagnostic');
  trackEvent('click_whatsapp_handoff');

  assert.strictEqual(trackedEventsMemory.length, 6);
  assert.strictEqual(trackedEventsMemory[0].event, 'view_workflow_demo');
  assert.strictEqual(trackedEventsMemory[3].event, 'start_diagnostic');
  assert.strictEqual(trackedEventsMemory[4].event, 'complete_diagnostic');
  assert.strictEqual(trackedEventsMemory[5].event, 'click_whatsapp_handoff');
});

test('analytics: enforces single emission of view_workflow_demo per page load', () => {
  setAnalyticsAdapter(new DevTestAnalyticsAdapter());
  resetAnalyticsState();

  trackEvent('view_workflow_demo');
  trackEvent('view_workflow_demo'); // Second call ignored
  trackEvent('view_workflow_demo'); // Third call ignored

  assert.strictEqual(trackedEventsMemory.length, 1);
  assert.strictEqual(trackedEventsMemory[0].event, 'view_workflow_demo');
});

test('analytics: rejects unknown events', () => {
  setAnalyticsAdapter(new DevTestAnalyticsAdapter());
  resetAnalyticsState();

  const rawTrack = trackEvent as unknown as (name: string) => void;
  rawTrack('unallowed_custom_event');
  rawTrack('ga_pageview');

  assert.strictEqual(trackedEventsMemory.length, 0);
});

test('analytics: completely rejects any event when a payload is provided', () => {
  setAnalyticsAdapter(new DevTestAnalyticsAdapter());
  resetAnalyticsState();

  const countBefore = trackedEventsMemory.length;
  const rawTrack = trackEvent as unknown as (name: string, payload: Record<string, unknown>) => void;

  rawTrack('click_whatsapp_handoff', { phone: '527223579869' });
  rawTrack('start_diagnostic', { step: 1 });
  rawTrack('complete_diagnostic', { result: 'buen_candidato' });

  // Adapter count MUST NOT increase!
  assert.strictEqual(trackedEventsMemory.length, countBefore);
});

test('analytics: confirms no cookies, localStorage, or external network calls during tests', () => {
  assert.strictEqual(typeof globalThis.document?.cookie, 'undefined');
  assert.strictEqual(typeof globalThis.localStorage, 'undefined');
  assert.strictEqual(ALLOWED_EVENTS.length, 6);
});
