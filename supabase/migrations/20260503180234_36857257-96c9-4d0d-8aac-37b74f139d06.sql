
-- Fix known mismatches first
UPDATE articles SET cover_image_filename='RHCA_vol_07_no_47_19_7_2024.png'
  WHERE id='55226db3-4e90-4e0c-80e9-fbb59a647759';
UPDATE articles SET cover_image_filename='RHCA_vol_08_no_49_11_1_2025.png'
  WHERE id='f6488811-f64d-42be-9744-cd503b91f546';

-- Null out any RHCA cover filename that doesn't exist in the rhca_covers bucket
UPDATE articles
SET cover_image_filename = NULL
WHERE source = 'RHCA'
  AND cover_image_filename IS NOT NULL
  AND cover_image_filename NOT IN (
    SELECT name FROM storage.objects WHERE bucket_id = 'rhca_covers'
  );
