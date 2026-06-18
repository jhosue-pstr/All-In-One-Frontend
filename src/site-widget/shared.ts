export function getSiteId(element: Element): number | null {
  const value = (element as HTMLElement).dataset.sitioId;

  if (!value || value === "{{SITIO_ID}}") {
    const bodySiteId = document.body.dataset.sitioId;
    if (!bodySiteId) return null;

    const parsedBodyId = Number(bodySiteId);
    return Number.isNaN(parsedBodyId) ? null : parsedBodyId;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getLimit(element: Element, fallback: number): number {
  const value = (element as HTMLElement).dataset.limit;
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}
