-- Verified against PDF text (2026-10-06):
--   ch 18 (Vasculaire artériel – Anévrismes): ADC_ch_8_maj_17_08_22.pdf is "VIII : VASCULAIRE", section 8.1 ARTÈRES only. Keep it, cover = page 1.
--   ch 17 (ORL): attached PDF is an old Ophtalmologie file; no ORL PDF exists in atlas-pdfs. Back to coming.
--   ch 19 (Vasculaire veineux): same arterial PDF as ch 18, no venous content; no venous PDF exists. Back to coming.
update articles set image_url = 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas_covers/ADC_ch_8_maj_17_08_22_p1.png'
where source = 'ADC' and issue = '18' and pdf_url like '%ADC_ch_8_maj_17_08_22.pdf';

update articles set status = 'coming', pdf_url = '', image_url = ''
where source = 'ADC' and issue in ('17', '19')
  and pdf_url ~ 'ADC_ch_(5_maj_30_03_22|8_maj_17_08_22)\.pdf$'
returning issue, status;
