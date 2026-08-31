/**
 * Display helper: journal issue titles are stored with a redundant
 * "Vol XX No YY" suffix that the card already shows as an eyebrow.
 * Strip it and normalise shouty all-caps into title case.
 */
export const formatIssueTitle = (raw?: string | null): string => {
  if (!raw) return "Sans titre";

  let title = raw.trim();

  // Remove trailing volume / issue reference
  title = title.replace(/[\s,·\-–|]*vol\.?\s*0*\d+\s*[,·\-–]?\s*(no|n°|num[eé]ro)?\.?\s*0*\d+\s*$/i, "");
  title = title.trim().replace(/[\s,·\-–|]+$/, "");

  // Normalise all-caps titles (keep short acronyms intact)
  const hasLowercase = /[a-zà-ÿ]/.test(title);
  if (!hasLowercase) {
    title = title
      .toLocaleLowerCase("fr-FR")
      .replace(/(^|[\s(«"'\-–/])([a-zà-ÿ])/g, (_m, p, c) => p + c.toLocaleUpperCase("fr-FR"))
      .replace(/\b(igm|rhca|adc|pdf)\b/gi, (m) => m.toUpperCase());
  }

  return title || "Sans titre";
};
