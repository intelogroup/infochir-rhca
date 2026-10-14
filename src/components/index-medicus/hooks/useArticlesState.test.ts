import { expect, test, describe } from "bun:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { useArticlesState } from "./useArticlesState";
import type { Article } from "../types";

// Index Medicus search/filter state. The repo has no DOM test renderer, so
// this exercises the hook's initial render (server-rendered probe): with an
// empty query — the state a reader lands in — every article must pass the
// filter (the listing shows everything), and the facet lists + stats the
// search UI renders must be derived from the articles. Interactive
// re-filtering on keystrokes needs a DOM renderer the repo does not have;
// that gap is stated in the dry-run report, not papered over here.

const fixtures: Article[] = [
  {
    id: "1",
    title: "Chirurgie digestive",
    abstract: "Résumé un",
    authors: ["Dr Auteur Un"],
    publicationDate: "2026-01-10",
    date: "2026-01-10",
    source: "RHCA",
    category: "Chirurgie",
    tags: ["digestif"],
  },
  {
    id: "2",
    title: "Santé maternelle",
    abstract: "Résumé deux",
    authors: ["Dr Auteur Deux", "Dr Auteur Un"],
    publicationDate: "2025-06-01",
    date: "2025-06-01",
    source: "IGM",
    category: "Gynécologie",
    tags: ["maternité"],
  },
  {
    id: "3",
    title: "Atlas des cas cliniques",
    abstract: "Résumé trois",
    authors: ["Dr Auteur Trois"],
    publicationDate: "2024-03-20",
    date: "2024-03-20",
    source: "ADC",
    category: "Atlas",
    tags: [],
  },
];

const probe = (articles: Article[]) => {
  let captured: ReturnType<typeof useArticlesState> | undefined;
  const Probe = () => {
    captured = useArticlesState(articles);
    return null;
  };
  renderToString(createElement(Probe));
  if (!captured) throw new Error("hook probe did not render");
  return captured;
};

describe("useArticlesState (Index Medicus search state)", () => {
  test("empty query passes every article through to the listing", () => {
    const state = probe(fixtures);
    expect(state.searchTerm).toBe("");
    expect(state.filteredArticles.map((a) => a.id)).toEqual(["1", "2", "3"]);
    expect(state.articleStats.total).toBe(3);
    expect(state.articleStats.filtered).toBe(3);
  });

  test("facet lists and per-source stats are derived from the articles", () => {
    const state = probe(fixtures);
    expect(state.categories).toEqual(["Atlas", "Chirurgie", "Gynécologie"]);
    expect(state.sources).toEqual(["ADC", "IGM", "RHCA"]);
    expect(state.availableAuthors).toEqual([
      "Dr Auteur Deux",
      "Dr Auteur Trois",
      "Dr Auteur Un",
    ]);
    expect(state.availableTags).toEqual(["digestif", "maternité"]);
    expect(state.articleStats.sources).toEqual({ ADC: 1, IGM: 1, RHCA: 1 });
  });

  test("empty result set yields empty facets and zeroed stats, not an error", () => {
    const state = probe([]);
    expect(state.filteredArticles).toEqual([]);
    expect(state.articleStats.total).toBe(0);
    expect(state.categories).toEqual([]);
    expect(state.availableAuthors).toEqual([]);
  });
});
