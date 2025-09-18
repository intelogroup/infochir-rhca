-- Remove duplicate/older chapters to keep only the most recent versions
DELETE FROM articles 
WHERE id IN (
  '504c3179-e29d-43f3-81c7-e8ba61a83d2e', -- Old Chapter 1 (2022)
  '35eb21c4-448b-4b70-87b2-f4b67f28882e'  -- Old Chapter 2 (January 2024)
);