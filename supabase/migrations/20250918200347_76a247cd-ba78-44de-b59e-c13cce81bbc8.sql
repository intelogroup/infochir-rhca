-- Fix double slash URLs and update cover image filenames based on available files in atlas_covers bucket
UPDATE articles SET 
  cover_image_filename = CASE
    WHEN volume = '1' THEN 'ADC_ch_1_maj_01_04_22.png'
    WHEN volume = '2' THEN 'ADC_ch_2_maj_01_01_25.png'
    WHEN volume = '3' THEN 'ADC_ch_3_maj_11_10_21.png'
    WHEN volume = '4' THEN 'ADC_ch_4_maj_11_10_21.png'
    WHEN volume = '5' THEN 'ADC_ch_5_maj_30_03_22.png'
    WHEN volume = '6' THEN 'ADC_ch_6_maj_29_5_24.png'
    WHEN volume = '7' THEN 'ADC_ch_7 _maj_12_4_24.png'
    WHEN volume = '8' THEN 'ADC_ch_8_maj_17_08_22.png'
    WHEN volume = '12' THEN 'ADC_ch_12_maj_02_01_22.png'
    WHEN volume = '14' THEN 'ADC_ch_14_maj_4_1_24.png'
    WHEN volume = '15' THEN 'ADC_ch_15_maj_20_10_21.png'
    WHEN volume = '16' THEN 'ADC_ch_16_maj_22_11_22.png'
    WHEN volume = '17' THEN 'ADC_ch_17_maj_18_02_23.png'
    WHEN volume = '18' THEN 'ADC_ch_18_maj_09_10_22.png'
    WHEN volume = '19' THEN 'ADC_ch_19_maj_11_10_21.png'
    WHEN volume = '20' THEN 'ADC_ch_20_maj_02_01_22.png'
    WHEN title LIKE '%Introduction%' THEN 'ADC_intro_maj_23_7_24.png'
    ELSE cover_image_filename
  END,
  image_url = CASE
    WHEN volume = '1' THEN 'atlas_covers/ADC_ch_1_maj_01_04_22.png'
    WHEN volume = '2' THEN 'atlas_covers/ADC_ch_2_maj_01_01_25.png'
    WHEN volume = '3' THEN 'atlas_covers/ADC_ch_3_maj_11_10_21.png'
    WHEN volume = '4' THEN 'atlas_covers/ADC_ch_4_maj_11_10_21.png'
    WHEN volume = '5' THEN 'atlas_covers/ADC_ch_5_maj_30_03_22.png'
    WHEN volume = '6' THEN 'atlas_covers/ADC_ch_6_maj_29_5_24.png'
    WHEN volume = '7' THEN 'atlas_covers/ADC_ch_7 _maj_12_4_24.png'
    WHEN volume = '8' THEN 'atlas_covers/ADC_ch_8_maj_17_08_22.png'
    WHEN volume = '12' THEN 'atlas_covers/ADC_ch_12_maj_02_01_22.png'
    WHEN volume = '14' THEN 'atlas_covers/ADC_ch_14_maj_4_1_24.png'
    WHEN volume = '15' THEN 'atlas_covers/ADC_ch_15_maj_20_10_21.png'
    WHEN volume = '16' THEN 'atlas_covers/ADC_ch_16_maj_22_11_22.png'
    WHEN volume = '17' THEN 'atlas_covers/ADC_ch_17_maj_18_02_23.png'
    WHEN volume = '18' THEN 'atlas_covers/ADC_ch_18_maj_09_10_22.png'
    WHEN volume = '19' THEN 'atlas_covers/ADC_ch_19_maj_11_10_21.png'
    WHEN volume = '20' THEN 'atlas_covers/ADC_ch_20_maj_02_01_22.png'
    WHEN title LIKE '%Introduction%' THEN 'atlas_covers/ADC_intro_maj_23_7_24.png'
    ELSE image_url
  END
WHERE source = 'ADC';