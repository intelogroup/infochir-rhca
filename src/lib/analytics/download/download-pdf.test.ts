import { expect, test, describe, beforeEach, mock } from "bun:test";

// This file owns the whole download-analytics module graph on purpose:
// bun's mock.module registry is shared across test files in a single run,
// so mocking "./track-downloads" here while another file imports the real
// module corrupts both. Instead, only the Supabase client (the network
// boundary) is doubled — steerable per test — and both downloadPDF and the
// real trackDownload run against it.
const rpcCalls: Array<{ fn: string; params: Record<string, unknown> }> = [];
const insertCalls: Array<Record<string, unknown>> = [];
let rpcError: Error | null = null;
let insertError: Error | null = null;

mock.module("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: async (fn: string, params: Record<string, unknown>) => {
      rpcCalls.push({ fn, params });
      if (rpcError) return { data: null, error: rpcError };
      return { data: null, error: null };
    },
    from: () => ({
      insert: async (row: Record<string, unknown>) => {
        insertCalls.push(row);
        return { error: insertError };
      },
    }),
    // Benign storage surface so this double stays export-complete if bun's
    // shared mock registry hands it to another test file's module graph.
    storage: {
      from: (bucket: string) => ({
        getPublicUrl: (name: string) => ({
          data: {
            publicUrl: `https://proj.supabase.co/storage/v1/object/public/${bucket}/${name}`,
          },
        }),
        list: async () => ({ data: [], error: null }),
      }),
    },
  },
}));

// downloadPDF imports checkFileExists from ./storage (re-export only);
// stub it so the real storage chain never loads.
mock.module("./storage", () => ({
  checkFileExists: async () => true,
  getFilePublicUrl: () => "",
}));

const { downloadPDF } = await import("./index");
const { trackDownload } = await import("./track-downloads");
const { DocumentType } = await import("./statistics/types");

// Minimal DOM: the code under test needs document.createElement('a'),
// document.body and document.referrer; trackDownload also reads
// window.innerWidth/innerHeight for the screen size.
let linkClicks = 0;
const fakeLink = {
  href: "",
  download: "",
  target: "",
  rel: "",
  style: {} as Record<string, string>,
  setAttribute() {},
  click() {
    linkClicks++;
  },
};
const g = globalThis as unknown as Record<string, unknown>;
g.document = {
  createElement: () => fakeLink,
  body: { appendChild() {}, removeChild() {} },
  referrer: "",
};
g.window = { innerWidth: 1280, innerHeight: 800 };

const PDF_URL =
  "https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/article-pdfs/test.pdf";
const realFetch = globalThis.fetch;

const trackedStatuses = () =>
  rpcCalls
    .filter((c) => c.fn === "track_user_event")
    .map((c) => (c.params.p_event_data as { status?: string }).status);

beforeEach(() => {
  rpcCalls.length = 0;
  insertCalls.length = 0;
  rpcError = null;
  insertError = null;
  linkClicks = 0;
  globalThis.fetch = realFetch;
});

describe("downloadPDF network failure handling", () => {
  test("fetch rejection (Safari 'Load failed') resolves false, tracks 'failed', never 'success', no fallback click", async () => {
    globalThis.fetch = async () => {
      throw new TypeError("Load failed");
    };

    let rejected = false;
    const result = await downloadPDF({
      url: PDF_URL,
      fileName: "test.pdf",
      documentId: "doc-1",
      documentType: DocumentType.Article,
    }).catch(() => {
      rejected = true;
      return null;
    });

    expect(rejected).toBe(false); // no unhandled rejection escapes
    expect(result).toBe(false);
    expect(trackedStatuses()).toEqual(["failed"]);
    expect(linkClicks).toBe(0); // no silent direct-link fallback
  });

  test("HTTP error status resolves false and tracks 'failed'", async () => {
    globalThis.fetch = async () =>
      ({ ok: false, status: 503 }) as Response;

    const result = await downloadPDF({
      url: PDF_URL,
      fileName: "test.pdf",
      documentId: "doc-1",
      documentType: DocumentType.Article,
    });

    expect(result).toBe(false);
    expect(trackedStatuses()).toEqual(["failed"]);
    expect(linkClicks).toBe(0);
  });

  test("successful fetch downloads via blob link and tracks 'success' exactly as before", async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        blob: async () => new Blob(["%PDF-1.4"], { type: "application/pdf" }),
        headers: { get: () => "application/pdf" },
      }) as unknown as Response;

    const result = await downloadPDF({
      url: PDF_URL,
      fileName: "test.pdf",
      documentId: "doc-1",
      documentType: DocumentType.Article,
    });

    expect(result).toBe(true);
    expect(trackedStatuses()).toEqual(["success"]);
    expect(linkClicks).toBe(1);
  });
});

describe("trackDownload (analytics capture never throws)", () => {
  test("resolves false when both the RPC and the insert fallback fail", async () => {
    rpcError = new Error("rpc unavailable");
    insertError = new Error("insert unavailable");

    let threw = false;
    let result: boolean | undefined;
    try {
      result = await trackDownload({
        document_id: "123e4567-e89b-12d3-a456-426614174000",
        document_type: "article",
        file_name: "paper.pdf",
        status: "success",
      });
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
    expect(result).toBe(false);
  });

  test("success event increments the download counter exactly once", async () => {
    const result = await trackDownload({
      document_id: "123e4567-e89b-12d3-a456-426614174000",
      document_type: "article",
      file_name: "paper.pdf",
      status: "success",
    });

    expect(result).toBe(true);
    const increments = rpcCalls.filter((c) => c.fn === "increment_count");
    expect(increments).toHaveLength(1);
    expect(increments[0].params).toEqual({
      table_name: "articles",
      column_name: "downloads",
      row_id: "123e4567-e89b-12d3-a456-426614174000",
    });
  });

  test("failed event is recorded as failed but does NOT increment the download counter", async () => {
    const result = await trackDownload({
      document_id: "123e4567-e89b-12d3-a456-426614174000",
      document_type: "article",
      file_name: "paper.pdf",
      status: "failed",
      error_details: "Load failed",
    });

    expect(result).toBe(true); // the event itself is still recorded
    expect(rpcCalls.filter((c) => c.fn === "increment_count")).toHaveLength(0);
    expect(trackedStatuses()).toEqual(["failed"]);
  });

  test("insert fallback records the failure status and error details when the RPC is down", async () => {
    rpcError = new Error("rpc unavailable");

    const result = await trackDownload({
      document_id: "123e4567-e89b-12d3-a456-426614174000",
      document_type: "article",
      file_name: "paper.pdf",
      status: "failed",
      error_details: "Load failed",
    });

    expect(result).toBe(true); // the fallback insert succeeded
    expect(insertCalls).toHaveLength(1);
    expect(insertCalls[0].status).toBe("failed");
    expect(String(insertCalls[0].error_details)).toContain("Load failed");
  });
});
