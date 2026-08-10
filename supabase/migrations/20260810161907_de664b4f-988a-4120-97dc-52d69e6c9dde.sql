-- 1. article_covers: tie uploads to the uploader
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'article_covers'
  AND length(name) < 255
  AND owner = auth.uid()
);

-- 2. recordings/waveforms: remove public write (and read) policies for unused buckets
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- 3. newsletter_subscriptions: no client-side unsubscribe; edge function (service role) only
DROP POLICY IF EXISTS "Anyone with token can unsubscribe" ON public.newsletter_subscriptions;

-- 4. newsletter triggers: send internal shared secret instead of relying on an open endpoint
CREATE OR REPLACE FUNCTION public.notify_subscribers_on_new_article()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'published' THEN
    PERFORM net.http_post(
      url := 'https://llxzstqejdrplmxdjxlu.supabase.co/functions/v1/send-new-content-newsletter',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-newsletter-trigger-secret', '8cdc7283d07dae5e4e59ed58ca57e3f76c4da9bb81968c63a1e6ed64fae63971'
      ),
      body := jsonb_build_object('contentId', NEW.id, 'contentType', NEW.source)
    );
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_subscribers_on_publish()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS DISTINCT FROM 'published') THEN
    PERFORM net.http_post(
      url := 'https://llxzstqejdrplmxdjxlu.supabase.co/functions/v1/send-new-content-newsletter',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-newsletter-trigger-secret', '8cdc7283d07dae5e4e59ed58ca57e3f76c4da9bb81968c63a1e6ed64fae63971'
      ),
      body := jsonb_build_object('contentId', NEW.id, 'contentType', NEW.source)
    );
  END IF;
  RETURN NEW;
END;
$function$;