import { expect, test, describe } from "bun:test";
import { mapDatabaseArticleToArticle } from "./article";

// The article mapping feeds every listing and article page: if it breaks,
// titles/authors/dates render wrong and the PDF link disappears.

const baseRow = {
  id: "a1",
  title: "Chirurgie digestive en Haïti",
  abstract: "Résumé",
  publication_date: "2026-03-15",
  source: "RHCA",
  category: "Chirurgie",
  tags: ["chirurgie"],
  views: 12,
  shares: 1,
  downloads: 3,
  citations: 0,
  status: "published",
  pdf_url: "https://example.supabase.co/storage/v1/object/public/rhca-pdfs/a1.pdf",
  pdf_filename: "a1.pdf",
  image_url: "https://example/cover.png",
  volume: "8",
  issue: "52",
  page_number: "10",
  specialty: "Chirurgie",
  institution: "HUEH",
};

describe("mapDatabaseArticleToArticle", () => {
  test("maps a full row: metadata, dates, counters and both PDF link fields", () => {
    const a = mapDatabaseArticleToArticle({
      ...baseRow,
      authors: ["Dr Jean Alouidor", "Dr Louis-Franck Télémaque"],
    });

    expect(a.title).toBe(baseRow.title);
    expect(a.publicationDate).toBe("2026-03-15");
    expect(a.date).toBe("2026-03-15");
    expect(a.authors).toEqual(["Dr Jean Alouidor", "Dr Louis-Franck Télémaque"]);
    expect(a.pdfUrl).toBe(baseRow.pdf_url);
    expect(a.pdf_url).toBe(baseRow.pdf_url);
    expect(a.views).toBe(12);
    expect(a.downloads).toBe(3);
    expect(a.status).toBe("published");
  });

  test("consolidates authors from primary_author + co_authors when the array is empty", () => {
    const a = mapDatabaseArticleToArticle({
      ...baseRow,
      authors: [],
      primary_author: "Dr A",
      co_authors: ["Dr B", "Dr C"],
    });
    expect(a.authors).toEqual(["Dr A", "Dr B", "Dr C"]);
  });

  test("defaults missing counters/tags/status instead of leaking undefined", () => {
    const a = mapDatabaseArticleToArticle({
      id: "a2",
      title: "Note clinique",
      publication_date: "2025-01-01",
      source: "IGM",
      tags: "not-an-array",
    });
    expect(a.tags).toEqual([]);
    expect(a.views).toBe(0);
    expect(a.downloads).toBe(0);
    expect(a.status).toBe("published");
    expect(a.pdfUrl).toBeUndefined();
  });
});
