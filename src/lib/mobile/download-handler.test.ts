import { expect, test, describe, beforeEach, mock } from "bun:test";

// Capture sonner toasts instead of rendering them.
const successToasts: unknown[][] = [];
const errorToasts: unknown[][] = [];
mock.module("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => successToasts.push(args),
    error: (...args: unknown[]) => errorToasts.push(args),
    info: () => {},
  },
}));

const { handleMobileDownload } = await import("./download-handler");

// Pretend to be iOS Safari — the population behind the "Load failed"
// exceptions: the blob strategy runs, iOS branch included.
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
Object.defineProperty(globalThis.navigator, "userAgent", {
  get: () => IPHONE_UA,
  configurable: true,
});

// Minimal window/document for the paths under test.
const fakeOpenedWindow = { location: { href: "" }, close() {} };
const g = globalThis as unknown as Record<string, unknown>;
g.window = {
  open: () => fakeOpenedWindow,
  location: { href: "" },
};
g.document = {
  createElement: () => ({
    href: "",
    download: "",
    target: "",
    rel: "",
    style: {},
    click() {},
  }),
  body: { appendChild() {}, removeChild() {} },
};

const PDF_URL = "https://example.supabase.co/storage/v1/object/public/article-pdfs/test.pdf";
const realFetch = globalThis.fetch;

let successCallbacks: number;
let errorCallbacks: string[];

beforeEach(() => {
  successToasts.length = 0;
  errorToasts.length = 0;
  successCallbacks = 0;
  errorCallbacks = [];
  globalThis.fetch = realFetch;
});

const callbacks = () => ({
  onSuccess: () => {
    successCallbacks++;
  },
  onError: (e: string) => {
    errorCallbacks.push(e);
  },
});

describe("handleMobileDownload network failure handling", () => {
  test("connection dead at the accessibility check: resolves false, friendly error toast, no raw browser string", async () => {
    globalThis.fetch = async () => {
      throw new TypeError("Load failed");
    };

    let rejected = false;
    const result = await handleMobileDownload(PDF_URL, "test.pdf", callbacks().onSuccess, callbacks().onError).catch(
      () => {
        rejected = true;
        return null;
      }
    );

    expect(rejected).toBe(false); // no unhandled rejection escapes
    expect(result).toBe(false);
    expect(errorCallbacks).toHaveLength(1);
    expect(successCallbacks).toBe(0);
    expect(successToasts).toHaveLength(0);
    expect(errorToasts).toHaveLength(1);
    const [, opts] = errorToasts[0] as [string, { description?: string }];
    expect(opts.description?.toLowerCase()).toContain("connexion");
    expect(opts.description).not.toContain("Load failed");
  });

  test("connection drops on the download fetch itself: resolves false, no fake success (regression test)", async () => {
    globalThis.fetch = async (_url: unknown, opts?: { method?: string }) => {
      if (opts?.method === "HEAD") return { ok: true } as Response;
      throw new TypeError("Load failed");
    };

    const { onSuccess, onError } = callbacks();
    const result = await handleMobileDownload(PDF_URL, "test.pdf", onSuccess, onError);

    expect(result).toBe(false);
    expect(successCallbacks).toBe(0); // previously: onSuccess fired + true
    expect(successToasts).toHaveLength(0); // previously: "PDF ouvert dans Safari"
    expect(errorCallbacks).toHaveLength(1);
    expect(errorToasts).toHaveLength(1);
  });

  test("HTTP error on the download fetch: resolves false with an error, not a success", async () => {
    globalThis.fetch = async (_url: unknown, opts?: { method?: string }) => {
      if (opts?.method === "HEAD") return { ok: true } as Response;
      return { ok: false, status: 404 } as Response;
    };

    const { onSuccess, onError } = callbacks();
    const result = await handleMobileDownload(PDF_URL, "test.pdf", onSuccess, onError);

    expect(result).toBe(false);
    expect(successCallbacks).toBe(0);
    expect(errorCallbacks).toHaveLength(1);
  });

  test("HTTP failure at the accessibility check: resolves false and does not blame the connection", async () => {
    globalThis.fetch = async () => ({ ok: false, status: 404 }) as Response;

    const { onSuccess, onError } = callbacks();
    const result = await handleMobileDownload(PDF_URL, "test.pdf", onSuccess, onError);

    expect(result).toBe(false);
    expect(successCallbacks).toBe(0);
    expect(errorCallbacks).toHaveLength(1);
    expect(errorToasts).toHaveLength(1);
    const [, opts] = errorToasts[0] as [string, { description?: string }];
    expect(opts.description).not.toContain("interrompue");
  });

  test("successful fetch still opens the PDF and reports success exactly as before", async () => {
    globalThis.fetch = async (_url: unknown, opts?: { method?: string }) => {
      if (opts?.method === "HEAD") return { ok: true } as Response;
      return {
        ok: true,
        blob: async () => new Blob(["%PDF-1.4"], { type: "application/pdf" }),
      } as unknown as Response;
    };

    const { onSuccess, onError } = callbacks();
    const result = await handleMobileDownload(PDF_URL, "test.pdf", onSuccess, onError);

    expect(result).toBe(true);
    expect(successCallbacks).toBe(1);
    expect(errorCallbacks).toHaveLength(0);
    expect(successToasts).toHaveLength(1);
    expect(errorToasts).toHaveLength(0);
  });
});
