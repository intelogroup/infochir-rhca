-- ch 7 and 12 PDFs copied from stale backfill rows are old-numbering files (Thorax VII, Foie XII): revert to coming.
update articles
set status = 'coming', pdf_url = '', image_url = ''
where source = 'ADC' and issue in ('07', '12')
  and pdf_url in (
    'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas-pdfs/ADC_ch_7_maj_18_09_25.pdf',
    'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas-pdfs/ADC_ch_12_maj_02_01_22.pdf')
returning issue, status;
