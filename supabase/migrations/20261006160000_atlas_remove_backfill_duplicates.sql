-- Remove duplicate Atlas rows created by backfill-atlas-articles on 2026-10-06 16:12 UTC.
-- Chapters 7 and 12 only have their PDF on the legacy row: copy it (and cover) to the curated row first.
begin;

update articles c
set pdf_url = l.pdf_url,
    image_url = coalesce(nullif(c.image_url, ''), 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas_covers/' || regexp_replace(regexp_replace(l.pdf_url, '^.*/', ''), '\.pdf$', '.png')),
    status = 'published'
from articles l
where c.source = 'ADC' and l.source = 'ADC'
  and c.title not like 'Atlas Digital de Chirurgie - Chapitre%'
  and l.title like 'Atlas Digital de Chirurgie - Chapitre%'
  and c.status = 'coming' and coalesce(c.pdf_url, '') = ''
  and l.issue::int = c.issue::int and l.pdf_url <> '';

delete from articles
where source = 'ADC' and title like 'Atlas Digital de Chirurgie - Chapitre%'
  and created_at >= '2026-10-06 16:00:00+00' and created_at < '2026-10-06 17:00:00+00';

commit;
