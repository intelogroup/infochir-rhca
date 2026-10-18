import { describe, test, expect } from "bun:test";
import { formatDate } from "./utils";

// Publication dates are calendar dates stored at midnight UTC. The
// suites run under both TZ=UTC and TZ=America/New_York; before the
// UTC pin, the New York run rendered the stored 14th as the 13th.
describe("formatDate renders the stored calendar day in every timezone", () => {
  test("date-only string", () => {
    expect(formatDate("2025-11-14")).toBe("14 nov. 2025");
  });

  test("midnight-UTC timestamp as returned by the API", () => {
    expect(formatDate("2025-11-14T00:00:00+00:00")).toBe("14 nov. 2025");
  });

  test("month boundary does not slip either", () => {
    expect(formatDate("2026-03-01")).toBe("1 mars 2026");
  });
});
