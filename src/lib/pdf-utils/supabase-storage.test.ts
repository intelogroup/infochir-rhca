import { expect, test, describe, mock } from "bun:test";

// Same SDK-boundary mocking approach as the Index Medicus storage tests:
// supabase-js's public-URL format, so the app's bucket/file handling is the
// behavior under test. This helper builds the PDF link on RHCA/IGM pages.
mock.module("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: async () => ({ data: null, error: null }),
    from: () => ({ insert: async () => ({ error: null }) }),
    storage: {
      from: (bucket: string) => ({
        getPublicUrl: (name: string) => ({
          data: {
            publicUrl: `https://proj.supabase.co/storage/v1/object/public/${bucket}/${name}`,
          },
        }),
      }),
    },
  },
}));

const { getFilePublicUrl } = await import("./supabase-storage");

describe("getFilePublicUrl (archive article PDF link)", () => {
  test("builds the public URL for the requested bucket and file", () => {
    expect(getFilePublicUrl("rhca-pdfs", "rhca-vol8.pdf")).toBe(
      "https://proj.supabase.co/storage/v1/object/public/rhca-pdfs/rhca-vol8.pdf",
    );
  });

  test("missing filename yields null so the page renders no dead link", () => {
    expect(getFilePublicUrl("rhca-pdfs", "")).toBeNull();
  });
});
