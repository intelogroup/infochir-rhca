# Update the Atlas (ADC) with the new chapter versions

The 10 uploaded PDFs are the source of truth. Their own cover pages give the official numbering, and the Introduction PDF (Août 2026) lists the definitive taxonomy: **2 tomes, 24 chapters**. The database today does not follow that list — chapter numbers and titles were assigned ad hoc (e.g. "Cou" is stored as chapter 06 but the PDF says CHAPITRE IV; several rows are still called "Atlas Digital de Chirurgie - Chapitre 16"), and 4 rows point to a PDF that doesn't exist or to another chapter's file.

So: realign the Atlas to the PDFs, ingest the 10 new versions, and keep every old file in the bucket untouched.

## What the uploaded files map to

| Uploaded PDF | Official chapter | Updated | Pages |
|---|---|---|---|
| INTRODUCTION_A_L_ATLAS_27_08_26 | Introduction (00) | Août 2026 | 3 |
| ADC_Chapitre_I_12_4_24_Traumatisme | 1 — Traumatismes – plaies | 12 avr. 2024 | 11 |
| ADC_28_10_25_Chapitre_II_part_1_Peau… | 2 — Peau et tissus sous-cutanés (part 1) | 28 oct. 2025 | 34 |
| ADC_CHAPITRE_III_SEIN_13_12_25 | 3 — Sein | 13 déc. 2025 | 32 |
| ADC_CHAPITRE_IV_COU_26_03_26 | 4 — Cou | 12 fév. 2026 | 30 |
| ADC_CHAPITRE_V_THORAX_18_09_25 | 5 — Thorax | 18 sep. 2025 | 12 |
| ADC_Chapitre_VI…diaphragme_de_oesophage_à_iléon | 6 — Diaphragme ; de l'œsophage à l'iléon | 20 sep. 2025 | 16 |
| ADC_C_VIII_Foie_Voies_biliaires_Pancreas_Rate_11_12_25 | 8 — Foie – VBEH – Pancréas – Rate | 5 déc. 2025 | 10 |
| ADC_Ch_X_Paroi_abdominale_Hernies_eventrations_4_01_24 | 10 — Paroi abdominale – Hernies – Éventration | 4 jan. 2024 | 14 |
| ADC_Ch_XI_Périnée_et_fesses_5_10_21 | 11 — Périnée – Fesses | 5 oct. 2021 | 10 |

## Steps

1. **Ingest the 10 PDFs** — rename to the existing convention `ADC_ch_<N>_maj_<DD_MM_YY>.pdf` (intro: `ADC_intro_maj_27_08_26.pdf`), render page 1 at 150 dpi to a matching `.png` cover, and upload both to `atlas-pdfs` / `atlas_covers` through the service-role edge function. Old files stay in the buckets; nothing is deleted.
2. **Realign the `articles` rows** — for each of the 10 chapters, update the existing ADC row (matched by content, not by current number) to the official chapter number, official title, real contributor list from the PDF, updated publication date, page count, and the new PDF + cover filenames/URLs. Where no row exists for an official chapter, insert one.
3. **Audit the remaining chapters** — the other rows (currently issues 07, 09, 12–20) keep their PDFs but get retitled to the official chapter names, and their chapter numbers are corrected by opening each stored PDF's page 1 to read its real "CHAPITRE …" heading. Rows whose `pdf_filename` is null or points to another chapter's file (Urologique, Pédiatrique, Plastique, Digestive) are converted to "coming soon" instead of pointing at wrong files.
4. **Fix the front-end chapter list** — replace the hardcoded 23-entry list in `useAtlasArticles.ts` and the invented placeholder titles in `missingChapters.ts` ("Chirurgie Robotique", "Éthique en Chirurgie"…) with the real 24-chapter taxonomy split into Tome I / Tome II, so coming-soon cards show actual titles (Corps étrangers, Gigantismes, ORL-CMF…).
5. **Verify** — query the ADC rows, confirm each `pdf_filename`/`cover_image_filename` resolves to a real public object, then load `/adc` and the home carousel to confirm covers render and the chapters read 1→24 in order.

## Technical notes

- Titles standardise to `Atlas de Diagnostic Chirurgical (ADC) - Chapitre N : <Titre officiel>`, matching the pattern already used for IGM/RHCA.
- Uploads go through a service-role edge function (RLS on `atlas-pdfs` blocks anon writes); if the existing `upload-igm-issue`/`upload-cover` functions need a bucket parameter, they get one rather than a new clone.
- Chapter number lives in `articles.issue` (zero-padded 2 digits, `00` for the intro), which is what the Atlas sort and routing already read.
- The newsletter trigger fires on publish for ADC rows too, so updates use `UPDATE` of existing published rows where possible to avoid re-broadcasting 10 emails. If a broadcast is wanted for the new versions, it can be triggered deliberately afterwards.
- No database schema change is needed — data and storage only.
