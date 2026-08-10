DELETE FROM public.newsletter_subscriptions
WHERE subscribed_at >= '2026-08-10'
  AND name ~ '^[A-Za-z]{12,}$'
  AND name !~ ' ';