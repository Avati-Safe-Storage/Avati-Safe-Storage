// ============================================================
//  Avati Safe Storage — Analytics Service (GA4)
//  Wraps window.gtag with typed calls and safe fallbacks.
//  Initialize GA4 in main.tsx or index.html <head> script tag.
// ============================================================

import type { AnalyticsEventName } from './events';

// Extend window for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;

/** Whether GA4 has been loaded in the page */
function isGa4Available(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

// ── GA4 initialization snippet (call once in main.tsx) ───────
export function initGA4(): void {
  if (!GA4_MEASUREMENT_ID) {
    console.warn('[Analytics] VITE_GA4_MEASUREMENT_ID not set — GA4 disabled');
    return;
  }
  if (isGa4Available()) return; // already loaded

  // Inject the gtag script dynamically
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args) { window.dataLayer!.push(args); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: false, // We'll send page views manually via trackPageView()
  });
}

// ── Page view tracking ───────────────────────────────────────
export function trackPageView(path: string, title?: string): void {
  if (!isGa4Available() || !GA4_MEASUREMENT_ID) return;
  window.gtag!('event', 'page_view', {
    page_location: window.location.origin + path,
    page_path: path,
    page_title: title || document.title,
    send_to: GA4_MEASUREMENT_ID,
  });
}

// ── Generic event tracking ───────────────────────────────────
export function trackEvent(
  eventName: AnalyticsEventName,
  params?: Record<string, string | number | boolean>,
): void {
  if (!isGa4Available()) return;
  try {
    window.gtag!('event', eventName, {
      event_category: 'avati_platform',
      ...params,
    });
  } catch (err) {
    // Never let analytics break the user experience
    console.warn('[Analytics] trackEvent error:', err);
  }
}

// ── Convenience helpers ──────────────────────────────────────
export function trackQuoteStep(step: number, stepName: string, extra?: Record<string, string | number>): void {
  trackEvent('quote_step_completed', { step_number: step, step_name: stepName, ...extra });
}

export function trackCTAClick(label: string, location: string): void {
  trackEvent('cta_click', { cta_label: label, cta_location: location });
}

export function trackWhatsApp(context: string): void {
  trackEvent('whatsapp_click', { context });
}
