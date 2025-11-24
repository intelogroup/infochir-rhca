-- Update authors list for RHCA Vol. 8, No 51
UPDATE articles 
SET authors = ARRAY[
  'Karry Jose Felix MD',
  'Anne Marie Berthe Léveillé-Tulce MD',
  'Junior V. Jean-Pierre MD',
  'Samuel M. Jean-Claude MD',
  'Pierre S. Joseph MD',
  'Emmanuel S. Jean François MD',
  'Pierre P. F. Jacques MD',
  'Carla F. Dérivois MD'
]
WHERE volume = '8' 
  AND issue = '51' 
  AND source = 'RHCA';