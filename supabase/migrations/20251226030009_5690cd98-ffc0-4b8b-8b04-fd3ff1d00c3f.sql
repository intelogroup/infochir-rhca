-- Fix typo: "Chirurgicale" -> "Chirurgical" in all ADC article titles
UPDATE articles 
SET title = REPLACE(title, 'Chirurgicale', 'Chirurgical')
WHERE source = 'ADC' AND title LIKE '%Chirurgicale%';