## Newsletter auto-notification system

Goal: every time a new RHCA issue, IGM issue, Atlas chapter, or Index Medicus article is successfully added, automatically email every active subscriber in `newsletter_subscriptions` with a link to the new content.

### 1. Sender domain (action needed from you)

Resend requires a verified sender domain. Two paths:

- **Now (testing)**: send from `Info Chir <onboarding@resend.dev>` — works immediately, no setup, but Resend caps it to your own address only. Not viable for a real subscriber list.
- **Production**: verify `infochir.org` (or a subdomain like `news.infochir.org`) in Resend → add the DKIM/SPF DNS records they give you → then send from `Info Chir <newsletter@infochir.org>`.

I'll hardcode the From address as a constant in the edge function so it's easy to swap once your domain is verified. `RESEND_API_KEY` is already in your secrets ✅.

### 2. Database

New table `newsletter_send_log` (track what was sent to whom, prevent duplicates, allow retries):
- `content_id`, `content_type` (rhca | igm | atlas | index-medicus), `content_title`
- `recipient_email`, `status` (sent | failed | skipped), `error_message`
- `resend_message_id`, `sent_at`

Add `unsubscribe_token` (uuid) column to `newsletter_subscriptions` for one-click unsubscribe links.

### 3. Edge function: `send-new-content-newsletter`

Single function, invoked with `{ contentType, contentId }`. It:
1. Fetches the content row (title, abstract, cover image, link target)
2. Loads all active subscribers
3. Filters out anyone already logged as sent for this `content_id`
4. Sends via Resend in batches of 100 (Resend batch endpoint) with rate limiting
5. Logs every send/failure in `newsletter_send_log`
6. Returns counts: `{ sent, failed, skipped }`

Email template (React Email-style HTML) with InfoChir branding, cover image, title, abstract preview, "Lire maintenant" CTA, and unsubscribe link.

### 4. Triggers (where the send fires)

I'll invoke the function from the success paths of:
- `upload-igm-issue` edge function (already exists) — after the article insert succeeds
- `upload-cover` / RHCA + Atlas upload flows
- Admin "publish" action for Index Medicus articles (`ArticleCreate` / `ArticleEdit` when `status` transitions to `published`)

To keep it bulletproof, I'll **also** add a Postgres trigger on `articles` (AFTER INSERT … WHEN status='published') that calls the function via `pg_net.http_post`. That way even direct DB inserts or admin tool inserts notify subscribers. The function itself dedupes via `newsletter_send_log`, so double-invocations are safe.

### 5. Unsubscribe

- New edge function `newsletter-unsubscribe` (public, no JWT)
- Public page `/newsletter/unsubscribe?token=…` that calls it and shows confirmation
- Every email footer includes this link

### 6. Admin visibility (small addition)

Add a "Newsletter" panel to `/admin` showing: subscriber count, last 20 campaigns from `newsletter_send_log` grouped by `content_id` with sent/failed counts and a "Resend to failed" button.

### Technical details

- **Resend SDK**: call REST directly from Deno (`https://api.resend.com/emails/batch`) — no npm import needed
- **Batching**: 100 recipients per Resend batch call, 500ms delay between batches to respect rate limits (10 req/s on free tier)
- **Idempotency**: `newsletter_send_log` UNIQUE on `(content_id, recipient_email)` so retries never double-send
- **Failures**: logged with error, surfaced in admin panel; manual resend button re-runs the function which only targets non-sent rows
- **Security**: `newsletter_send_log` admin-only RLS; `unsubscribe_token` allows anon update of own row only

### Deliverables

1. Migration: `newsletter_send_log` table + `unsubscribe_token` column + GRANTs/RLS + optional pg trigger
2. Edge function `send-new-content-newsletter`
3. Edge function `newsletter-unsubscribe`
4. Modifications to existing upload flows + admin publish action to invoke the function
5. Public unsubscribe page
6. Admin newsletter campaign panel

### Open question before I build

**Which From address should I configure?** If you don't have a verified Resend domain yet, I'll wire it up with `onboarding@resend.dev` so the code is fully functional, and you can change one constant + verify your domain in Resend whenever you're ready. Confirm and I'll start.
