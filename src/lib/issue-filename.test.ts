import { expect, test } from "bun:test";
import { parseFilename } from "./issue-filename";

test("IGM name parses to source, volume, issue, date and derived cover", () => {
  expect(parseFilename("IGM_vol_05_no_55_04_10_26.pdf")).toEqual({
    source: "IGM", volume: "05", issue: "55", publication_date: "2026-10-04",
    cover_filename: "IGM_vol_05_no_55_cover.png",
  });
});

test("RHCA name parses with 4-digit year", () => {
  expect(parseFilename("RHCA_vol_12_no_3_15_03_2026.pdf")?.publication_date).toBe("2026-03-15");
});

test("ADC name derives png cover from the same slug", () => {
  expect(parseFilename("ADC_ch_13_brulures-thermiques.pdf")?.cover_filename).toBe("ADC_ch_13_brulures-thermiques.png");
});

test("rejects wrong patterns and impossible dates", () => {
  expect(parseFilename("IGM_vol_5_no_55_04_10_26.pdf")).toBeNull(); // volume not 2 digits
  expect(parseFilename("IGM_vol_05_no_55_31_02_26.pdf")).toBeNull(); // 31 Feb
  expect(parseFilename("IGM_vol_05_no_55_04_10_26 (1).pdf")).toBeNull();
  expect(parseFilename("issue55.pdf")).toBeNull();
});
