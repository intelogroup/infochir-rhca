# Analytics smoke test

A manual/CI Playwright script that validates the telemetry pipeline end-to-end
against a running preview build (with `VITE_DEBUG_ANALYTICS=true`).

## What it verifies

1. Loading `/` fires a `page_view` (via `useAnalytics`) into `user_events`.
2. Opening an RHCA card fires a `click` event into `user_events`.
3. Clicking a share button fires a `share` event into `user_events`.

## How to run

Prerequisites:
- A preview build served locally with `VITE_DEBUG_ANALYTICS=true` on `http://localhost:8080`.
- Supabase env vars available so the script can query `user_events` for the newly
  emitted rows (uses the anon key — reads are allowed by RLS for aggregate views only,
  so this test relies on the client-side network requests instead).

```bash
# 1) Build & serve with debug analytics on
VITE_DEBUG_ANALYTICS=true bun run build
bun run preview  # serves on http://localhost:8080

# 2) In another shell, run the Playwright script
python3 tests/analytics-smoke.py
```

The script asserts that a POST to `/rest/v1/rpc/track_user_event` is fired for
each of the three interactions above. If any assertion fails, the CI exits non-zero.
