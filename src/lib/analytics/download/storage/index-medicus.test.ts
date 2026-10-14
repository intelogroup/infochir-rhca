import { expect, test, describe, mock } from "bun:test";

// The Supabase storage SDK is the network boundary; the mock reproduces
// supabase-js's public-URL format so the app's own logic is what is tested:
// bucket choice, filename forwarding, empty/URL inputs.
const requestedBuckets: string[] = [];
mock.module("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: async () => ({ data: null, error: null }),
    from: () => ({ insert: async () => ({ error: null }) }),
    storage: {
      from: (bucket: string) => {
        requestedBuckets.push(bucket);
        return {
          getPublicUrl: (name: string) => ({
            data: {
              publicUrl: `https://proj.supabase.co/storage/v1/object/public/${bucket}/${name}`,
            },
          }),
        };
      },
    },
  },
}));
mock.module("./file-operations", () => ({
  checkFileExists: async () => true,
  getFilePublicUrl: () => "",
}));

const { getIndexMedicusPdfUrl, generateIndexMedicusFilename, BUCKET_ID_PDF } =
  await import("./index-medicus");

describe("getIndexMedicusPdfUrl (article page PDF link for Index Medicus)", () => {
  test("builds the public URL in the indexmedicuspdf bucket", () => {
    requestedBuckets.length = 0;
    const url = getIndexMedicusPdfUrl("article-52.pdf");
    expect(url).toBe(
      "https://proj.supabase.co/storage/v1/object/public/indexmedicuspdf/article-52.pdf",
    );
    expect(requestedBuckets).toEqual([BUCKET_ID_PDF]);
  });

  test("empty filename yields an empty URL (callers render no link)", () => {
    expect(getIndexMedicusPdfUrl("")).toBe("");
  });

  test("an already-absolute URL passes through unchanged", () => {
    expect(getIndexMedicusPdfUrl("https://cdn.example/x.pdf")).toBe(
      "https://cdn.example/x.pdf",
    );
  });
});

describe("generateIndexMedicusFilename", () => {
  test("produces the standardized dated filename", () => {
    expect(generateIndexMedicusFilename("Trauma Care Study", new Date(2026, 0, 5))).toBe(
      "index_medicus_trauma-care-study_2026-01-05.pdf",
    );
  });

  test("strips unsafe characters and caps the slug at 50 characters", () => {
    const name = generateIndexMedicusFilename(
      "Étude: cas/contrôle " + "x".repeat(80),
      new Date(2026, 9, 10),
    );
    expect(name.startsWith("index_medicus_")).toBe(true);
    expect(name.endsWith("_2026-10-10.pdf")).toBe(true);
    expect(name).not.toContain("/");
    expect(name).not.toContain(":");
    const slug = name.slice("index_medicus_".length, -"_2026-10-10.pdf".length);
    expect(slug.length).toBeLessThanOrEqual(50);
  });
});
