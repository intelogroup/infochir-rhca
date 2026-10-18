/**
 * Formats an ISO date for display on ADCH chapter cards, in French,
 * e.g. "12 avril 2024". Returns null when the value is empty or invalid
 * so callers can simply hide the line.
 */
export const formatPublicationDate = (iso?: string | null): string | null => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};
