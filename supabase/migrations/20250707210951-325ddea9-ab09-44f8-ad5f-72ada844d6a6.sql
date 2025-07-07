-- Fix missing PDF filenames, cover filenames, and image URLs for RHCA articles
-- Extract filename from PDF URL and update the records
UPDATE articles 
SET 
  pdf_filename = CASE 
    WHEN pdf_url LIKE '%/rhca-pdfs/%' THEN 
      SUBSTRING(pdf_url FROM '.*/rhca-pdfs/(.+)$')
    ELSE pdf_filename
  END,
  cover_image_filename = CASE
    WHEN pdf_url LIKE '%/rhca-pdfs/RHCA_vol_%' THEN
      REPLACE(SUBSTRING(pdf_url FROM '.*/rhca-pdfs/(.+)\.pdf$'), '.pdf', '_cover.png')
    ELSE cover_image_filename
  END,
  image_url = CASE
    WHEN pdf_url LIKE '%/rhca-pdfs/RHCA_vol_%' THEN
      'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/' || 
      REPLACE(SUBSTRING(pdf_url FROM '.*/rhca-pdfs/(.+)\.pdf$'), '.pdf', '_cover.png')
    ELSE image_url
  END
WHERE source = 'RHCA' 
  AND pdf_url IS NOT NULL 
  AND pdf_url != ''
  AND (pdf_filename IS NULL OR pdf_filename = '' OR cover_image_filename IS NULL OR cover_image_filename = '' OR image_url IS NULL OR image_url = '');