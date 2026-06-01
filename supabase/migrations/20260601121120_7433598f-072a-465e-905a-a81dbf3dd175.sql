-- Fix double-slash URLs (ch 5, ch 6)
UPDATE public.articles
SET pdf_url = REPLACE(pdf_url, 'atlas-pdfs//', 'atlas-pdfs/')
WHERE source='ADC' AND pdf_url LIKE '%atlas-pdfs//%';

-- Clear pointers for PDFs that don't exist in storage so UI shows "no PDF" instead of broken downloads
UPDATE public.articles
SET pdf_url = '', pdf_filename = NULL
WHERE source='ADC' AND pdf_filename IN (
  'ADC_ch_9_maj_29_5_24.pdf',
  'ADC_ch_10_maj_16_5_24.pdf',
  'ADC_ch_11_maj_29_5_24.pdf',
  'ADC_ch_12_maj_29_5_24.pdf'
);