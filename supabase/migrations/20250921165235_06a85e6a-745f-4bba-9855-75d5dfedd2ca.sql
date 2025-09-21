-- Fix Atlas chapter 7 (Chirurgie Vasculaire) to use correct image URL matching its cover_image_filename
UPDATE articles 
SET image_url = 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas_covers/ADC_ch_7_maj_18_09_25.png'
WHERE id = '66caac77-2633-498c-9055-370d40cd7e99' 
AND title = 'Atlas De Diagnostic Chirurgicale (ADC) - Chirurgie Vasculaire';

-- Fix Atlas chapter 4 (Chirurgie Thoracique) to use correct image URL matching its cover_image_filename  
UPDATE articles 
SET image_url = 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas_covers/ADC_ch_4_maj_21_3_22.png'
WHERE id = 'f5150fe5-6cba-4f0c-962a-c9b1cf2cdfb2' 
AND title = 'Atlas De Diagnostic Chirurgicale (ADC) - Chirurgie Thoracique';