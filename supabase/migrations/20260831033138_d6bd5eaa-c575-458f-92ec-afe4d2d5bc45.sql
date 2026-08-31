
ALTER TABLE public.articles DISABLE TRIGGER trg_notify_subscribers_on_new_article;

INSERT INTO public.articles (title, abstract, authors, source, article_type, status, volume, issue, category, specialty, institution, primary_author, tags, keywords, publication_date, pdf_filename, cover_image_filename, pdf_url, image_url, page_number)
VALUES
('Atlas de Diagnostic Chirurgical (ADC) - Chapitre 13 : Brûlures thermiques et électriques',
 'Chapitre 13 de l''ADC — brûlures thermiques et électriques : évaluation de la surface et de la profondeur, complications et séquelles. Chapitre en préparation par les auteurs de l''Atlas.',
 '{}', 'ADC', 'ADC', 'coming', '1', '13', 'Chirurgie', 'Brûlures', 'Info Chir / RHCA', 'Louis-Franck Télémaque',
 ARRAY['Atlas','Brûlures'], ARRAY['brûlures','ADC'], NULL, NULL, NULL, '', '', NULL),
('Atlas de Diagnostic Chirurgical (ADC) - Chapitre 17 : ORL – Maxillo-facial',
 'Chapitre 17 de l''ADC (Tome II) : pathologie oto-rhino-laryngologique et maxillo-faciale — tumeurs, infections et traumatismes de la face et des voies aéro-digestives supérieures.',
 '{}', 'ADC', 'ADC', 'published', '2', '17', 'Chirurgie', 'ORL – Maxillo-facial', 'Info Chir / RHCA', 'Louis-Franck Télémaque',
 ARRAY['Atlas','ORL','Maxillo-facial'], ARRAY['ORL','maxillo-facial','ADC'], '2022-03-30',
 'ADC_ch_5_maj_30_03_22.pdf', 'ADC_ch_5_maj_30_03_22.png',
 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas-pdfs/ADC_ch_5_maj_30_03_22.pdf',
 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas_covers/ADC_ch_5_maj_30_03_22.png', NULL),
('Atlas de Diagnostic Chirurgical (ADC) - Chapitre 19 : Vasculaire veineux et lymphatique',
 'Chapitre 19 de l''ADC (Tome II) : pathologie veineuse et lymphatique — varices, thromboses, ulcères et lymphœdèmes. Document commun aux chapitres 18 et 19.',
 '{}', 'ADC', 'ADC', 'published', '2', '19', 'Chirurgie', 'Chirurgie vasculaire', 'Info Chir / RHCA', 'Louis-Franck Télémaque',
 ARRAY['Atlas','Vasculaire'], ARRAY['veines','lymphatique','ADC'], '2022-08-17',
 'ADC_ch_8_maj_17_08_22.pdf', 'ADC_ch_8_maj_17_08_22.png',
 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas-pdfs/ADC_ch_8_maj_17_08_22.pdf',
 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas_covers/ADC_ch_8_maj_17_08_22.png', NULL),
('Atlas de Diagnostic Chirurgical (ADC) - Chapitre 24 : Chirurgie reconstructive',
 'Chapitre 24 de l''ADC (Tome II) — chirurgie reconstructive : lambeaux, greffes et reconstruction après traumatisme ou exérèse tumorale. Chapitre en préparation par les auteurs de l''Atlas.',
 '{}', 'ADC', 'ADC', 'coming', '2', '24', 'Chirurgie', 'Chirurgie reconstructive', 'Info Chir / RHCA', 'Louis-Franck Télémaque',
 ARRAY['Atlas','Reconstructive'], ARRAY['reconstruction','ADC'], NULL, NULL, NULL, '', '', NULL);

ALTER TABLE public.articles ENABLE TRIGGER trg_notify_subscribers_on_new_article;
