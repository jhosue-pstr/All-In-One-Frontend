const API_BASE = '/api';
const SESSION_KEY = 'analitica_session_id';

function getSessionId(): string {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getSiteId(): number | null {
  const el = document.querySelector<HTMLElement>('[data-analitica-site]');
  if (!el) return null;
  const id = el.getAttribute('data-analitica-site');
  return id ? Number(id) : null;
}

async function trackPageView(): Promise<void> {
  const siteId = getSiteId();

  if (!siteId) return;

  const payload = {
    url: window.location.pathname + window.location.search,
    titulo_pagina: document.title,
    referer: document.referrer || undefined,
    session_id: getSessionId(),
  };

  try {
    await fetch(`${API_BASE}/modules/analitica/${siteId}/visitas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silencioso - no bloquear la experiencia del usuario
  }
}

async function trackEvent(
  tipo: string,
  etiqueta?: string,
  valor?: string,
  metadata?: unknown,
): Promise<void> {
  const siteId = getSiteId();

  if (!siteId) return;

  try {
    await fetch(`${API_BASE}/modules/analitica/${siteId}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo,
        etiqueta,
        valor,
        metadata_json: metadata,
        url: window.location.pathname,
        session_id: getSessionId(),
      }),
    });
  } catch {
    // Silencioso
  }
}

function initAnalitica(): void {
  trackPageView();

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const trackEl = target.closest<HTMLElement>('[data-analitica-event]');

    if (trackEl) {
      const tipo = trackEl.getAttribute('data-analitica-event') || 'click';
      const etiqueta = trackEl.getAttribute('data-analitica-label') || undefined;
      const valor = trackEl.getAttribute('data-analitica-value') || undefined;
      trackEvent(tipo, etiqueta, valor);
    }
  });

  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    const trackEl = form.closest<HTMLElement>('[data-analitica-form]');

    if (trackEl) {
      const nombre = trackEl.getAttribute('data-analitica-form') || 'form_submit';
      trackEvent('form', nombre);
    }
  });
}

export { initAnalitica, trackPageView, trackEvent };
