

## Insert IGM Record into Database

### Data to Insert

Insert one record into `unified_content` table with the following data extracted from your message:

| Column | Value |
|--------|-------|
| **title** | IGM Vol. 05 No. 51 |
| **abstract** | Ce numero traite des defis de la sante en Haiti... (full text provided) |
| **source** | IGM |
| **volume** | 05 |
| **issue** | 51 |
| **pdf_url** | `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/igm-pdfs/%20IGM_vol_05_no%2051_16_02_26.pdf` |
| **image_url** | `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/igm_covers/%20IGM_vol_05_no%2051_16_02_26.png` |
| **pdf_filename** | IGM_vol_05_no%2051_16_02_26.pdf |
| **cover_image_filename** | IGM_vol_05_no%2051_16_02_26.png |
| **authors** | Array of 35 authors provided |
| **tags** | ["SIDA", "sante mentale", "diabete", "vaccination", "chirurgie", "realite virtuelle"] |
| **status** | published |

### Notes
- The **ISBN** (978-99970-978-6-6) cannot be stored -- there is no ISBN column in `unified_content`. If you want to store it, a database schema change would be needed.
- The "+4" in your message -- do you have 4 more records to insert after this one? If so, please share them and I'll batch them together.

### Technical Details
- Will use a SQL INSERT into `unified_content` table
- Only the 3 required columns (title, abstract, source) plus the optional columns you provided will be filled
- The `id` is auto-generated, `created_at`/`updated_at`/`publication_date` default to now

