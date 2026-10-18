import type { AtlasChapter } from "../types";

/**
 * Front-matter entries requested by the InfoChir secretariat (ADCH v2,
 * 2026-10-17): the Sommaire sits between the Introduction and Chapter I,
 * and the authors' academic-references chapter follows it while it is
 * still in preparation.
 *
 * These entries are not `articles` rows — the grid sorts them by title
 * (see the getOrder helpers: 'sommaire' -> 0.5, 'références' -> 0.6)
 * immediately after the Introduction (0) and before Chapter I (1).
 * The Sommaire PDF is the dated file the secretariat sent (27 08 26),
 * installed under public/docs/; the Références entry is a placeholder
 * with no file until the secretariat sends it.
 */
export const createFrontMatterEntries = (): AtlasChapter[] => [
  {
    id: "adc-sommaire",
    title: "Atlas de Diagnostic Chirurgical en Haïti (ADCH) – Sommaire",
    description:
      "Sommaire de l'Atlas de Diagnostic Chirurgical en Haïti (ADCH) : introduction, liste des auteurs, Tome I (chapitres 1 à 14), Tome II (chapitres 15 à 24) et annexes.",
    abstract:
      "Sommaire de l'Atlas de Diagnostic Chirurgical en Haïti (ADCH) : introduction, liste des auteurs, Tome I (chapitres 1 à 14), Tome II (chapitres 15 à 24) et annexes.",
    authors: ["Louis-Franck TÉLÉMAQUE"],
    author: "Louis-Franck TÉLÉMAQUE",
    status: "available",
    pdfUrl: "/docs/adc-sommaire-27-08-26.pdf",
    coverImage: "/docs/adc-sommaire-27-08-26.png",
    coverImageUrl: "/docs/adc-sommaire-27-08-26.png",
    publicationDate: "2026-08-27",
    lastUpdated: "2026-08-27",
    tags: ["sommaire", "atlas", "adch"],
    stats: { views: 0, shares: 0, downloads: 0 },
    source: "ADC",
    specialty: "Chirurgie générale",
    institution: "INFOCHIR/RHCA",
  },
  {
    id: "adc-references-auteurs",
    title: "Références académiques des auteurs",
    description:
      "Chapitre des références académiques des auteurs de l'ADCH. En préparation.",
    abstract:
      "Chapitre des références académiques des auteurs de l'ADCH. En préparation.",
    authors: ["Équipe ADCH"],
    author: "Équipe ADCH",
    status: "coming",
    publicationDate: "",
    lastUpdated: "",
    tags: ["auteurs", "références", "atlas", "adch"],
    stats: { views: 0, shares: 0, downloads: 0 },
    source: "ADC",
    specialty: "Chirurgie générale",
    institution: "INFOCHIR/RHCA",
  },
];

export const isFrontMatterEntry = (chapter: AtlasChapter): boolean =>
  chapter.id === "adc-sommaire" || chapter.id === "adc-references-auteurs";

/** Shared ordering used by the grid, the hook and the table of contents. */
export const getFrontMatterOrder = (title?: string): number | null => {
  const t = title?.toLowerCase() || "";
  if (t.includes("introduction")) return 0;
  if (t.includes("sommaire")) return 0.5;
  if (t.includes("références académiques")) return 0.6;
  return null;
};
