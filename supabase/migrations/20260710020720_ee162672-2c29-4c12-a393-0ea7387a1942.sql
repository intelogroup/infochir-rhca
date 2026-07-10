ALTER TABLE public.user_events DROP CONSTRAINT IF EXISTS user_events_event_type_check;
ALTER TABLE public.user_events ADD CONSTRAINT user_events_event_type_check
  CHECK (event_type = ANY (ARRAY['download','share','view','search','click','login','logout','register','page_view','conversion','other']));

ALTER TABLE public.user_events DROP CONSTRAINT IF EXISTS user_events_document_type_check;
ALTER TABLE public.user_events ADD CONSTRAINT user_events_document_type_check
  CHECK (document_type IS NULL OR document_type = ANY (ARRAY['igm','rhca','adc','article','index-medicus','test','other']));