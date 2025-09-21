-- Fix the misnamed chapter: This should be Chirurgie Vasculaire (chapter 7), not Chirurgie Thoracique
UPDATE articles 
SET title = 'Atlas De Diagnostic Chirurgicale (ADC) - Chirurgie Vasculaire',
    cover_image_filename = 'ADC_ch_7_maj_18_09_25.png',
    image_url = 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas_covers/ADC_ch_7_maj_18_09_25.png'
WHERE id = 'f5150fe5-6cba-4f0c-962a-c9b1cf2cdfb2';