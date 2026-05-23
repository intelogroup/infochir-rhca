---
name: add-journal-issue
description: Ingest a new IGM, RHCA, or Atlas (ADC) journal issue PDF into the infochir project — rename to convention, generate cover from page 1, upload to the right Supabase storage bucket, and insert the matching row in the `articles` table so it appears in the carousel and listing pages.
---

# Add a journal issue (IGM / RHCA / ADC)

Use this when the user uploads a journal PDF (IGM, RHCA, or Atlas/ADC) and wants it added so it shows up in the UI.

## 1. Extract metadata from the PDF

Use `document--parse_document user-uploads://<file>.pdf` and read page 1.

Pull out:
- **Volume** (e.g. "5") and **Issue / Numéro** (e.g. "53")
- **Publication date** — usually from the filename pattern `<PUB>_<NN>_DD_MM_YY.pdf` (e.g. `IGM_53_12_05_26.pdf` → `2026-05-12`). Fall back to the cover month.
- **Title** — build as `INFO GAZETTE MÉDICALE Vol X No Y - <Month YYYY>` (IGM) or equivalent for RHCA/ADC.
- **Abstract** — summarize the editorial / sommaire on page 1 (sections, theme).
- **ISBN / ISSN**, primary editor, page count.

## 2. Naming convention (strict — UI matches on these names)

| Publication | PDF bucket | PDF filename | Cover bucket | Cover filename |
|---|---|---|---|---|
| IGM | `igm-pdfs` | `IGM_vol_XX_no_YY_DD_MM_YY.pdf` | `igm_covers` | `IGM_vol_XX_no_YY_cover.png` |
| RHCA | `rhca-pdfs` | `RHCA_vol_XX_no_YY_DD_MM_YYYY.pdf` | `rhca_covers` | `RHCA_vol_XX_no_YY_cover.png` |
| ADC | `atlas-pdfs` | `ADC_ch_N_<suffix>.pdf` | `atlas_covers` | `ADC_ch_N_<suffix>.png` |

Volume is **zero-padded to 2 digits**, issue usually not padded (match existing rows with `SELECT pdf_filename FROM articles WHERE source='IGM' ORDER BY created_at DESC LIMIT 5;` if unsure).

## 3. Generate the cover

```bash
code--copy user-uploads://<file>.pdf /tmp/<renamed>.pdf
pdftoppm -png -r 150 -f 1 -l 1 /tmp/<renamed>.pdf /tmp/cover
mv /tmp/cover-01.png /tmp/<cover_filename>.png
```

## 4. Upload + insert via the `upload-igm-issue` edge function

Storage requires admin auth, so use the deployed edge function (see `supabase/functions/upload-igm-issue/index.ts`). For RHCA/ADC, **either** generalize that function by adding a `bucketPdf`/`bucketCover` param, **or** clone it as `upload-rhca-issue` / `upload-adc-issue`. Don't try to upload from the sandbox with the anon key — it will fail RLS.

Deploy after writing/editing: `supabase--deploy_edge_functions {function_names:["upload-igm-issue"]}`. New functions also need an entry in `supabase/config.toml`:

```toml
[functions.upload-igm-issue]
verify_jwt = false
```

Then call it:

```python
import base64, json, urllib.request
pdf_b64 = base64.b64encode(open('/tmp/<pdf>','rb').read()).decode()
cover_b64 = base64.b64encode(open('/tmp/<cover>','rb').read()).decode()
payload = json.dumps({
  "pdfBase64": pdf_b64,
  "coverBase64": cover_b64,
  "pdfFilename": "IGM_vol_05_no_53_12_05_26.pdf",
  "coverFilename": "IGM_vol_05_no_53_cover.png",
  "article": { ... see fields below ... }
}).encode()
req = urllib.request.Request(
  "https://llxzstqejdrplmxdjxlu.supabase.co/functions/v1/upload-igm-issue",
  data=payload,
  headers={"Authorization":"Bearer <ANON_KEY>", "Content-Type":"application/json"},
  method="POST")
print(urllib.request.urlopen(req, timeout=180).read().decode())
```

The anon key is in `.env` as `VITE_SUPABASE_PUBLISHABLE_KEY` (or use the one in `src/integrations/supabase/client.ts`).

## 5. `articles` row — required fields

```json
{
  "title": "INFO GAZETTE MÉDICALE Vol 5 No 53 - Mai 2026",
  "abstract": "...summary of sommaire / theme...",
  "source": "IGM",                  // or "RHCA" / "ADC"
  "article_type": "IGM",
  "status": "published",
  "volume": "5",
  "issue": "53",
  "publication_date": "2026-05-12",
  "authors": [],                    // uuid[] — leave empty unless members exist
  "category": "Médecine Générale",
  "specialty": "...theme...",
  "tags": ["..."],
  "keywords": ["..."],
  "institution": "Info Chir",
  "doi": "ISBN: 978-99970-956-4-9",
  "page_number": "1-32",
  "primary_author": "Dr Jean Alouidor"
}
```

The edge function auto-fills `pdf_filename`, `cover_image_filename`, `pdf_url`, `image_url` from the filename params. Do NOT set them client-side — public URLs follow:
`https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/<bucket>/<filename>`

## 6. Verify

```sql
SELECT id, title, pdf_filename, cover_image_filename, publication_date
FROM articles WHERE source='IGM' ORDER BY created_at DESC LIMIT 3;
```

Then check the carousel on `/` and the listing on `/igm` (or `/rhca`, `/adc`).

## Gotchas

- A newly-created edge function returns 404 from HTTP until `supabase--deploy_edge_functions` runs. Don't poll forever — just deploy.
- `verify_jwt = false` must be added to `supabase/config.toml` for new functions or callers must send a valid user JWT.
- `pdftoppm` output is named `cover-01.png` (not `cover-1.png`) at default padding.
- RLS on `igm-pdfs` / `rhca-pdfs` / `atlas-pdfs` only allows admin INSERT — that's why uploads go through the service-role edge function.
- If the cover doesn't render in the UI, the most common cause is a filename mismatch between `articles.cover_image_filename` and the actual storage object. Query both sides to confirm.

## Backfilling missing covers (any source)

There's a generic `upload-cover` edge function that takes `{coverBase64, coverFilename, bucket, articleIds[]}` — uploads to the given bucket (service role) and patches `cover_image_filename` + `image_url` on the listed articles.

Flow for backfilling RHCA/IGM/ADC covers from already-uploaded PDFs:

1. Fetch groups via PostgREST (anon key) — `articles?source=eq.RHCA&select=id,pdf_filename&pdf_filename=not.is.null`, then group ids by `pdf_filename` in Python.
2. For each group: `curl` the PDF from `<SB_URL>/storage/v1/object/public/<pdf-bucket>/<pdf>` → `pdftoppm -png -r 120 -f 1 -l 1 in.pdf out` → base64 the `out-1.png`.
3. POST to `/functions/v1/upload-cover` with `bucket="rhca_covers"` (or `igm_covers`/`atlas_covers`) and `coverFilename = pdf_basename + ".png"` (matches the existing convention).

Reference script: `/tmp/backfill_rhca.py` was used to backfill all 56 RHCA covers in one pass (May 2026).

