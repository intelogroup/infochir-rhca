CREATE TABLE IF NOT EXISTS public.form_submission_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form TEXT NOT NULL,
  ip TEXT,
  email TEXT,
  outcome TEXT NOT NULL DEFAULT 'accepted',
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.form_submission_log TO service_role;

ALTER TABLE public.form_submission_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view submission log"
ON public.form_submission_log
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE INDEX IF NOT EXISTS form_submission_log_ip_created_idx ON public.form_submission_log (ip, created_at DESC);
CREATE INDEX IF NOT EXISTS form_submission_log_created_idx ON public.form_submission_log (created_at DESC);