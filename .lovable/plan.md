# Plan: Sponsor move + IGM Vol 5 No 53 ingestion

## 1. Sponsors list — move Fritz Sam logo

In `src/components/home/sponsors/SponsorsData.ts`, change the existing "Promotion Dr. Fritz G. Sam FMP Haiti (40 ans, 1986-2026)" entry from `type: 'partner'` to `type: 'sponsor'`. No other edits.

## 2. Ingest IGM PDF — extracted metadata

From the parsed PDF (`IGM_53_12_05_26.pdf`, page 1):
- **Publication**: Info Gazette Médicale
- **Volume**: 5
- **Issue (No)**: 53
- **Date**: Mai 2026 → publication_date `2026-05-12` (from filename `12_05_26`)
- **ISSN**: 2958-1346 (journal) / 2958-1354 (online)
- **ISBN**: 978-99970-956-4-9
- **Editor**: Dr Jean Alouidor
- **Editorial theme**: Soins palliatifs (palliative care)
- **Sections**: Lu pour vous, Santé Publique, Actualités Médicales et Paramédicales, Académie & Professions, Informations Socio-Culturelles, Éthique, Petites Annonces
- **Page count**: 32

Authors / contributors extracted: Michel Dodard, Maxime Coles, Ernst Jean Baptiste, Henry Jean-Baptiste, Pavel Desrosiers, Franck Généus, Guirlaine Raymond, Chesnel Norcéide, Mario Laroche, Christophe Millien, Wilfine Dupont, Pierre-Marie Woolley, Vanessa Jaelle Dor, Edith C. Georges, Marlyn Lestage-Laforest, Carine Réveil Jean-Baptiste, Jessy Colimon Adrien, Judith Jean-Baptiste, Wisly Joseph, Claudine Hyppolite, Nadège Charlot, Gérald Lerebours, Louis Franck Télémaque, Sylvio Augustin Jr, Jean Alouidor.

## 3. File naming (matches existing convention)

- **PDF**: `IGM_vol_05_no_53_12_05_26.pdf` → upload to `igm-pdfs` bucket
- **Cover**: `IGM_vol_05_no_53_cover.png` → generated from page 1 screenshot, upload to `igm_covers` bucket

## 4. Steps

1. Copy uploaded PDF to `/tmp/`, rename to convention, upload to `igm-pdfs` bucket via storage API.
2. Render page 1 of the PDF to PNG (`pdftoppm`), save as `IGM_vol_05_no_53_cover.png`, upload to `igm_covers` bucket.
3. Insert row into `articles` table via SQL with:
   - `source = 'IGM'`, `article_type = 'IGM'`, `status = 'published'`
   - `title`, `abstract` (editorial summary on palliative care), `volume='5'`, `issue='53'`
   - `publication_date='2026-05-12'`
   - `pdf_filename`, `cover_image_filename`, `pdf_url`, `image_url` (public Supabase URLs)
   - `authors=[]` (uuid[] — empty), `category='Médecine Générale'`, `specialty='Soins Palliatifs'`
   - `tags=['soins palliatifs','santé publique','éthique','cardiologie','oncologie pédiatrique']`
   - `institution='Info Chir'`, `doi='ISBN: 978-99970-956-4-9'`, `page_number='1-32'`
4. Verify via SELECT that the record exists and the carousel/IGM page picks it up.

## 5. Files touched

- `src/components/home/sponsors/SponsorsData.ts` (1 field change)
- New storage objects in `igm-pdfs` and `igm_covers` buckets
- New row in `public.articles` (via insert SQL — no schema migration needed)
