-- Covers for ch 20-23 = page 1 of their PDFs (existing same-name PNGs held other images, so uploaded as *_p1.png).
update articles set image_url = 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas_covers/' || regexp_replace(regexp_replace(pdf_url, '^.*/', ''), '\.pdf$', '_p1.png')
where source = 'ADC' and issue in ('20','21','22','23')
  and pdf_url ~ 'ADC_ch_(16_maj_22_11_22|17_maj_18_02_23|18_maj_09_10_22|19_maj_11_10_21)\.pdf$'
returning issue, image_url;
