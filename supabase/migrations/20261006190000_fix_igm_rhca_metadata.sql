-- 1. Broken pdf_url values (object names verified in storage).
update articles set pdf_url = rtrim(pdf_url) where source = 'IGM' and issue = '24' and pdf_url like '% ';
update articles set pdf_url = replace(pdf_url, 'igm-pdfs/%20IGM_vol_04_no%2050', 'igm-pdfs/IGM_vol_04_no%2050') where source = 'IGM' and issue = '50';
update articles set pdf_url = 'https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-pdfs/' || pdf_url
where source = 'RHCA' and issue = '40' and pdf_url not like 'http%';

-- 2. Dates from filenames (DD_MM_YY for IGM, DD_MM_YYYY for RHCA), only where the row is 1 day off
--    (timezone shift) or RHCA issues 8/15/18/20/22 (day/month swapped; filename dates are in issue order).
--    Larger gaps (IGM 23/45/48/49, RHCA 29/38) are left for a manual decision.
with d as (
  select id, source, issue, publication_date,
    case when source = 'IGM' then regexp_match(replace(pdf_url,'%20',' '), '_(\d\d)_(\d\d)_(\d\d)\.pdf *$')
         else regexp_match(pdf_url, '_(\d{1,2})_(\d{1,2})_(\d{4})\.pdf$') end m
  from articles where source in ('IGM','RHCA') and coalesce(pdf_url,'') <> ''
), t as (
  select id, source, issue, publication_date,
    make_date(case when source = 'IGM' then 2000 + m[3]::int else m[3]::int end, m[2]::int, m[1]::int) fd
  from d where m is not null
)
update articles a set publication_date = t.fd::timestamptz from t
where a.id = t.id and a.publication_date::date <> t.fd
  and (abs(a.publication_date::date - t.fd) <= 1 or (t.source = 'RHCA' and t.issue in ('08','8','15','18','20','22')))
returning a.source, a.volume, a.issue, a.publication_date::date;

-- 3. RHCA no 47 / no 48 belong to vol 07; the vol 02 / vol 03 rows are byte-identical copies.
delete from articles where source = 'RHCA' and ((volume in ('02','2') and issue = '47') or (volume in ('03','3') and issue = '48'))
returning source, volume, issue;
