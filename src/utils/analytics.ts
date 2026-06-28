declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: 'event', eventName: string, eventData?: Record<string, unknown>) => void;
  }
}

export const pushToDataLayer = (eventName: string, eventData: Record<string, unknown> = {}) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventData,
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventData);
  }

  console.log(`[Analytics Fired] ${eventName}:`, eventData);
};
