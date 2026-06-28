declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

const getCookieValue = (name: string) => {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
};

export const runClarityDiagnostics = () => {
  if (typeof window === 'undefined') return;

  if (typeof window.clarity === 'function') {
    window.clarity('consent');
    console.log('[Clarity Diagnostics] Consent signal sent.');
  }

  window.setTimeout(() => {
    const clarityResources = performance
      .getEntriesByType('resource')
      .filter((entry) => entry.name.includes('clarity.ms'));

    console.group('[Clarity Diagnostics]');
    console.log('window.clarity:', typeof window.clarity);
    console.log('_clck cookie:', getCookieValue('_clck') ? 'present' : 'missing');
    console.log('_clsk cookie:', getCookieValue('_clsk') ? 'present' : 'missing');
    console.log(
      'clarity resources:',
      clarityResources.map((entry) => entry.name),
    );
    console.log('If resources are empty or cookies are missing, check ad blockers, privacy settings, VPN/DNS filtering, or consent requirements.');
    console.groupEnd();
  }, 3000);
};
