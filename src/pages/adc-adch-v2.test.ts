import { expect, test, describe } from "bun:test";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

// Regression guard for the ADCH v2 secretariat requests (2026-10-17):
// rename to "Atlas de Diagnostic Chirurgical en Haïti (ADCH)", atlas.html
// activation, Sommaire + Références front matter, "EN PREPARATION" slots
// for chapters VII/IX/XII/XIX/XXIV, per-chapter publication dates, the
// DISPONIBLE / EN PRÉPARATION / NON DISPONIBLE legend wording, and the
// ADDENDUM section. These are hard-coded JSX/data contracts, so the tests
// pin the user-visible strings and the installed files.

const root = join(import.meta.dir, "..", "..");
const read = (rel: string) => readFileSync(join(root, rel), "utf-8");

describe("ADCH v2 — rename", () => {
  test("page header carries the new ADCH title", () => {
    expect(read("src/components/adc/ADCHeader.tsx")).toContain(
      "Atlas de Diagnostic Chirurgical en Haïti (ADCH)"
    );
  });
  test("SEO title carries the new ADCH title", () => {
    expect(read("src/pages/ADC.tsx")).toContain(
      "Atlas de Diagnostic Chirurgical en Haïti (ADCH) | Info CHIR"
    );
  });
});

describe("ADCH v2 — atlas.html activation", () => {
  test("_redirects sends /atlas.html to /adc before the SPA catch-all", () => {
    const redirects = read("public/_redirects");
    const rule = redirects.indexOf("/atlas.html    /adc    301");
    expect(rule).toBeGreaterThan(-1);
    expect(rule).toBeLessThan(redirects.indexOf("/*    /index.html   200"));
  });
});

describe("ADCH v2 — Sommaire and Références front matter", () => {
  test("the dated Sommaire PDF is installed under public/docs", () => {
    const pdf = join(root, "public/docs/adc-sommaire-27-08-26.pdf");
    expect(existsSync(pdf)).toBe(true);
    expect(statSync(pdf).size).toBeGreaterThan(10_000);
  });
  test("front matter orders Sommaire at 0.5 and Références at 0.6", () => {
    const frontMatter = read("src/components/atlas/utils/frontMatter.ts");
    expect(frontMatter).toContain("/docs/adc-sommaire-27-08-26.pdf");
    expect(frontMatter).toContain("return 0.5");
    expect(frontMatter).toContain("return 0.6");
  });
});

describe("ADCH v2 — EN PREPARATION chapter slots", () => {
  test("missing chapters are exactly VII, IX, XII, XIII, XVII, XIX, XXIV", () => {
    const missing = read("src/components/atlas/utils/missingChapters.ts");
    expect(missing).toContain("const MISSING_CHAPTERS: number[] = [7, 9, 12, 13, 17, 19, 24];");
  });
});

describe("ADCH v2 — publication dates and legend wording", () => {
  test("chapter card shows a formatted publication date, not the raw stamp", () => {
    const card = read("src/components/atlas/AtlasCard.tsx");
    expect(card).toContain("Publié le {formatPublicationDate(chapter.publicationDate)}");
    expect(card).not.toContain("Mis à jour le {chapter");
  });
  test("status badges use the legend's exact wording", () => {
    const toc = read("src/components/atlas/AtlasTableOfContents.tsx");
    expect(toc).toContain(">En préparation</Badge>");
    expect(toc).toContain(">Non disponible</Badge>");
    const card = read("src/components/atlas/AtlasCard.tsx");
    expect(card).toContain("En préparation");
    expect(card).not.toContain("Bientôt disponible");
  });
});

describe("ADCH v2 — Addendum", () => {
  test("ADC page renders the Addendum with its three chapters", () => {
    const page = read("src/pages/ADC.tsx");
    expect(page).toContain("<ADCAddendum />");
    const addendum = read("src/components/adc/ADCAddendum.tsx");
    expect(addendum).toContain("Transplantation");
    expect(addendum).toContain("Recherche chirurgicale");
    expect(addendum).toContain("Éthique en chirurgie");
  });
});

describe("ADCH — En préparation cards never throw", () => {
  test("navigation guard only opens real article ids (UUIDs)", () => {
    const nav = read("src/components/atlas/utils/chapterNavigation.ts");
    expect(nav).toContain("export const isRealArticleId");
    expect(nav).toContain("export const canOpenChapter");
  });
  test("card click goes nowhere for placeholders instead of navigating", () => {
    const card = read("src/components/atlas/AtlasCard.tsx");
    expect(card).toContain("canOpenChapter(chapter)");
    expect(card).toContain("} else if (chapter.pdfUrl) {");
  });
  test("table of contents renders no link for placeholders", () => {
    const toc = read("src/components/atlas/AtlasTableOfContents.tsx");
    expect(toc).toContain("canOpenChapter(chapter) ? (");
  });
  test("article page shows a friendly state for synthetic or unknown ids", () => {
    const page = read("src/pages/articles/ArticleDetail.tsx");
    expect(page).toContain("isRealArticleId(id)");
    expect(page).toContain("Ce chapitre est en préparation");
    expect(page).toContain("PGRST116");
  });
});
