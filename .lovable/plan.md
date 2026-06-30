## Telemetry & Observability Audit

### What's working today
- **Page views / article views**: `useAnalytics` hook + `trackPageView` is mounted in `MainLayout` and writes to `user_events` via `track_user_event` RPC. ✅ 5,238 `view` rows exist.
- **Downloads (legacy path)**: `src/lib/analytics/download/index.ts` writes to `download_events` from PDF download flows. 2,839 rows exist (RHCA/IGM/article).
- **Admin dashboards**: `/admin/analytics` reads from views (`admin_analytics_summary`, `popular_articles_view`, `daily_activity_view`, `analytics_dashboard`) — all exist.
- **Session IDs**: Persisted via `getSessionId()` in localStorage.

### Gaps found (with evidence)

| # | Gap | Evidence |
|---|-----|----------|
| 1 | **`page_view` events never recorded** — only `view` exists in DB | `SELECT DISTINCT event_type FROM user_events` returns only `view`/`download`. Either `trackPageView` is gated by `import.meta.env.PROD` and the published build isn't firing it, or the `page_view` event_type is being dropped. |
| 2 | **Downloads stopped May–Oct 2025**, while views still grow | `download_events` MAX = 2025-10-01; `user_events` MAX = 2026-01-02. The download buttons on RHCA/IGM/Article cards likely lost the `trackDownload` wiring during a refactor. |
| 3 | **Share tracking only wired on ADC modal** | Only `ModalActions.tsx` calls `trackShare`. RHCA / IGM / Article share buttons never fire it → 0 `share` events in DB. |
| 4 | **`performance_metrics` table empty** | No client code writes to it. Web Vitals (LCP, CLS, INP, TTFB) are not being captured. |
| 5 | **`error_events` table empty** | No client error handler posts to it. Runtime errors are only console-logged. |
| 6 | **No search tracking** | `trackSearch` exists but is not called from any search input. |
| 7 | **No click-through tracking on cards** | `trackClick` defined but unused. We can't compute "card impression → article open" conversion. |
| 8 | **Dev-mode blocking** | `useAnalytics` skips tracking unless `PROD` or `VITE_DEBUG_ANALYTICS=true`. Acceptable, but should be documented. |
| 9 | **No funnel / engagement metrics** | No time-on-page, scroll-depth, or session duration captured. |
| 10 | **Donations & contact form submissions not tracked as events** | We have rows in `donations`/`contact_messages` but no `user_events` link for funnel analysis. |

### Plan to fix (build mode)

**Phase 1 — Restore broken tracking (high value, low risk)**
1. Audit every PDF download button (`DownloadAction`, `AtlasActions`, RHCA card, IGM card, Article card) and ensure `trackDownload` is invoked on click with the correct `documentType` + `documentId`.
2. Wire `trackShare` into the shared `ShareAction` component so RHCA/IGM/Article shares are captured.
3. Add `trackSearch` to the global search bar and the RHCA/IGM list filters.
4. Add `trackClick` to article/issue card clicks so we measure CTR from listing pages.

**Phase 2 — Add observability**
5. Add a tiny `webVitals.ts` using `web-vitals` package → POST CLS/LCP/INP/FCP/TTFB to `performance_metrics`.
6. Wire `window.onerror` + `window.onunhandledrejection` + React `ErrorBoundary` to insert into `error_events` (debounced, sampled).
7. Track donation completion and contact form submit as `user_events` (`event_type='conversion'`).

**Phase 3 — Admin visibility**
8. Extend `/admin/analytics` with three new cards: **Web Vitals (p75)**, **JS errors (24h)**, **Conversions (donations / contacts / subscriptions)**.
9. Add per-source breakdown (RHCA vs IGM vs ADC vs Index Medicus) on the daily activity chart.
10. Add a "data freshness" indicator showing the timestamp of the most recent event, so future regressions are caught quickly.

**Phase 4 — Hygiene**
11. Document `VITE_DEBUG_ANALYTICS=true` in README so we can validate tracking on preview.
12. Add a Playwright smoke test that loads `/`, clicks a download, and asserts a row appears in `user_events`.

### Technical notes
- All inserts go through the existing `track_user_event` RPC — no schema changes required for Phase 1.
- Phase 2 uses the existing `performance_metrics` and `error_events` tables (already have anon-insert RLS with length guards).
- Sampling: cap `performance_metrics` at 1 record per session per metric; cap `error_events` at 10 per session to avoid runaway inserts.
- Keep `service_role` out of the client — all inserts remain anon via the existing RLS policies.

### Out of scope (ask before doing)
- Third-party analytics (GA4, Plausible, PostHog) — not needed if the in-house pipeline is healthy.
- Cookie consent banner — only needed if we add third-party tracking.

Approve and I'll start with Phase 1 (the highest-impact fixes: restoring download/share/search tracking).