import { describe, expect, it } from "bun:test";
import { isNetworkFetchError } from "./network-errors";

describe("isNetworkFetchError", () => {
  it("matches the three bare browser wordings exactly", () => {
    expect(isNetworkFetchError("Failed to fetch")).toBe(true);
    expect(isNetworkFetchError("Load failed")).toBe(true);
    expect(isNetworkFetchError("NetworkError when attempting to fetch resource.")).toBe(true);
  });

  it("does not match longer or unrelated messages", () => {
    expect(isNetworkFetchError("Failed to fetch dynamically imported module")).toBe(false);
    expect(isNetworkFetchError("Failed to fetch: HTTP 500")).toBe(false);
    expect(isNetworkFetchError("Cannot read properties of undefined")).toBe(false);
    expect(isNetworkFetchError("")).toBe(false);
  });
});
