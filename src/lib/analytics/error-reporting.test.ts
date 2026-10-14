import { expect, test, describe, mock } from "bun:test";

// The error pipeline must never break the page it watches: reportError has
// to resolve no matter how its Supabase backend fails. The client module is
// mocked at the boundary; insert behavior is steered per test.
type InsertResult = { error: unknown } | Promise<{ error: unknown }>;
let insertImpl: (row: Record<string, unknown>) => InsertResult = () => ({ error: null });
const insertCalls: Record<string, unknown>[] = [];

mock.module("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      insert: (row: Record<string, unknown>) => {
        insertCalls.push(row);
        return insertImpl(row);
      },
    }),
    // Benign extra surfaces: export-complete in case the shared mock
    // registry hands this double to another file's module graph.
    rpc: async () => ({ data: null, error: null }),
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
// Export-complete double: bun's shared mock registry means this can be
// picked up by other files' graphs (e.g. ../track imports getClientInfo
// from this same module) — a partial mock breaks their module linking.
mock.module("./session", () => ({
  getSessionId: () => "test-session",
  getClientInfo: () => ({
    sessionId: "test-session",
    userAgent: null,
    referrer: null,
    pageUrl: null,
    screenSize: null,
  }),
  clearSession: () => {},
}));

const g = globalThis as unknown as Record<string, unknown>;
g.window = {
  location: { href: "https://info-chir.org/index-medicus", pathname: "/index-medicus" },
};

const { reportError } = await import("./error-reporting");

describe("reportError (error pipeline never breaks the page)", () => {
  test("resolves when the backend insert rejects", async () => {
    insertImpl = () => Promise.reject(new Error("network down"));
    let threw = false;
    try {
      await reportError({ errorType: "test.reject", message: "boom reject" });
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
  });

  test("resolves when the backend insert throws synchronously", async () => {
    insertImpl = () => {
      throw new Error("sync failure");
    };
    let threw = false;
    try {
      await reportError({ errorType: "test.throw", message: "boom throw" });
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
  });

  test("successful report inserts one row with bounded payload fields", async () => {
    insertImpl = () => ({ error: null });
    const before = insertCalls.length;
    await reportError({
      errorType: "t".repeat(150),
      message: "m".repeat(6000),
      stack: "s".repeat(12000),
    });
    expect(insertCalls.length).toBe(before + 1);
    const row = insertCalls[insertCalls.length - 1];
    expect(row.session_id).toBe("test-session");
    expect((row.error_type as string).length).toBe(100);
    expect((row.message as string).length).toBe(5000);
    expect((row.stack as string).length).toBe(10000);
    expect(row.url).toBe("https://info-chir.org/index-medicus");
  });

  test("identical errors are reported once per session (dedupe)", async () => {
    insertImpl = () => ({ error: null });
    const before = insertCalls.length;
    await reportError({ errorType: "test.dupe", message: "same failure" });
    await reportError({ errorType: "test.dupe", message: "same failure" });
    expect(insertCalls.length).toBe(before + 1);
  });

  // Kept in this file (not a sibling) because bun's mock.module registry is
  // shared across test files in a run — two files mocking this module with
  // different insert behaviors corrupt each other. The tests above consumed
  // 4 of the 10 per-session report slots (reject, throw, payload, dedupe).
  test("stops reporting after 10 per session and still resolves", async () => {
    insertImpl = () => ({ error: null });
    const before = insertCalls.length;
    for (let i = 0; i < 10; i++) {
      await reportError({ errorType: "test.cap", message: `cap failure ${i}` });
    }
    // Only the 6 remaining slots produce inserts.
    expect(insertCalls.length).toBe(before + 6);

    let threw = false;
    try {
      await reportError({ errorType: "test.cap", message: "one past the cap" });
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
    expect(insertCalls.length).toBe(before + 6);
  });
});
