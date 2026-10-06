-- Blank metadata invented by the (now deleted) backfill-igm-articles function.
-- Scope: 19 IGM rows with the backfill's fake DOI whose listed authors do not appear anywhere in their PDF text
-- (verified 2026-10-06): vol 01 no 02-12, vol 02 no 14-19, vol 03 no 27-28.
-- PDF, cover, volume, issue, date, title, views and downloads are left untouched. RHCA rows are not touched here.
update articles
set abstract = '', authors = '{}', tags = '{}', keywords = '{}', doi = null
where source = 'IGM'
  and doi ~ '^ISBN: 978-99970-977-'
  and (volume, issue) in (
    ('01','02'),('01','03'),('01','04'),('01','05'),('01','06'),('01','07'),('01','08'),('01','09'),('01','10'),('01','11'),('01','12'),
    ('02','14'),('02','15'),('02','16'),('02','17'),('02','18'),('02','19'),
    ('03','27'),('03','28'))
returning volume, issue;
