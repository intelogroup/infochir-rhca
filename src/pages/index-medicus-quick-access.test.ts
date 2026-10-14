import { expect, test, describe } from "bun:test";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Regression guard for the Index Medicus "Accès rapide aux fichiers" strip
// — the feature the client (InfoChir secretariat) explicitly requested.
// The strip is hard-coded JSX, so the testable contract is: the AUTEURS
// button's target is the dated file actually installed under public/, the
// button is enabled, and ARTICLES stays a disabled, link-less button while
// no ARTICLES file is installed. If someone renames/removes the installed
// PDF, or enables ARTICLES without a file, this fails loudly.

const pageSource = readFileSync(join(import.meta.dir, "IndexMedicus.tsx"), "utf-8");
const publicDir = join(import.meta.dir, "..", "..", "public");

describe("Index Medicus quick-access strip", () => {
  test("AUTEURS button is enabled and targets the installed dated PDF", () => {
    const match = pageSource.match(/href="(\/docs\/[^"]+\.pdf)"/);
    expect(match).not.toBeNull();
    const href = match![1];

    // The link is the dated 2026-10-10 install and the label agrees.
    expect(href).toContain("2026-10-10");
    expect(pageSource).toContain("Fichier AUTEURS · 10/10/26");

    // The AUTEURS button itself is not disabled (its <Button> wraps the <a>).
    const labelIdx = pageSource.indexOf("Fichier AUTEURS");
    const btnStart = pageSource.lastIndexOf("<Button", labelIdx);
    const btnTag = pageSource.slice(btnStart, pageSource.indexOf(">", btnStart));
    expect(btnTag).not.toContain("disabled");

    // The target file really is installed and really is a PDF.
    const filePath = join(publicDir, href.replace(/^\//, ""));
    expect(existsSync(filePath)).toBe(true);
    expect(statSync(filePath).size).toBeGreaterThan(50_000);
    const header = readFileSync(filePath).subarray(0, 5).toString("latin1");
    expect(header).toBe("%PDF-");
  });

  test("ARTICLES button stays disabled with no link while no ARTICLES file is installed", () => {
    const labelIdx = pageSource.indexOf("Fichier ARTICLES");
    expect(labelIdx).toBeGreaterThan(-1);

    const btnStart = pageSource.lastIndexOf("<Button", labelIdx);
    const btnTag = pageSource.slice(btnStart, pageSource.indexOf(">", btnStart));
    expect(btnTag).toContain("disabled");

    // No ARTICLES pdf is installed yet — if one appears in public/docs,
    // the strip must be updated in the same change and this test revisited.
    const docs = readdirSync(join(publicDir, "docs"));
    expect(docs.filter((f) => /articles/i.test(f) && f.endsWith(".pdf"))).toEqual([]);
  });
});
