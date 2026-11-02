import { expect, test, describe } from "bun:test";
import { getPaginationWindow } from "./pagination";

// Regression guard for the "Page 1 sur 13" bug: the page count must follow
// the filtered result set, and an out-of-range page must clamp instead of
// showing an empty page.

describe("getPaginationWindow", () => {
  test("full unfiltered set spans all pages", () => {
    expect(getPaginationWindow(127, 0, 10)).toEqual({
      totalPages: 13,
      safePage: 0,
      start: 0,
      end: 10,
    });
  });

  test("a filter shrinking the set shrinks the page count", () => {
    const w = getPaginationWindow(4, 0, 10);
    expect(w.totalPages).toBe(1);
    expect(w.start).toBe(0);
    expect(w.end).toBe(10);
  });

  test("a page left over from a longer list clamps to the last valid page", () => {
    const w = getPaginationWindow(4, 12, 10);
    expect(w.safePage).toBe(0);
    expect(w.start).toBe(0);
  });

  test("last partial page slices the remainder", () => {
    const w = getPaginationWindow(127, 12, 10);
    expect(w.safePage).toBe(12);
    expect(w.start).toBe(120);
    expect(w.end).toBe(130);
  });

  test("empty result set has no pages and clamps to page 0", () => {
    expect(getPaginationWindow(0, 3, 10)).toEqual({
      totalPages: 0,
      safePage: 0,
      start: 0,
      end: 10,
    });
  });
});
