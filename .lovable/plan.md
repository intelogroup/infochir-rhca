# Standard revamp of all inner pages

The homepage now follows the Emerald Prestige system (paper white surfaces, Libre Baskerville display type, gold hairline rules, flat editorial sections). The rest of the app does not. I screenshotted every public page; below is what is off-label and the standard revamp to apply.

## What the screenshots show

**Pages already on the shared header (RHCA, IGM, Atlas, Index Medicus, Annuaire)** — header is correct, but everything below it is legacy: heavy card chrome, tiny multicolour badges, cramped type.

**Pages with their own hand-rolled header (À propos, Soumettre, Directives, Comité éditorial, Faire un don, Opportunités)** — bold sans headlines in green or near-black, no gold rule, no back link, gradient icon tiles, inconsistent vertical rhythm. None of these use the shared header.

### Off-label elements found
- **Colour**: blue founder names on À propos, blue/orange/red micro-badges on RHCA and IGM cards, green→blue gradient donate button, `text-gray-900` / `text-gray-600` / `text-white` hardcodes in submission, footer, editorial and donate components (~35 files carry hardcoded colour or gradient classes).
- **Typography**: bold sans H1s where the display serif belongs; clipped names on the founders cards ("TÉLÉMAQUE" cut off); tag chips truncated mid-word ("Anesthésiolo", "Traumatism", "Antibiothéra").
- **Sizing**: IGM issue cards use ~11px metadata and 3-line clamps in a 3-up grid while RHCA uses a 2-up grid with a different card shape — two different card languages for the same content type. Action buttons ("Partager / Ouvrir / PDF") render as ~10px coloured pills.
- **Layout fluff**: green top-border bars on every Comité éditorial card, star glyphs around "Membres Fondateurs", floating heart decorations on Donate, cream `bg-muted` section bands, empty avatar circles on À propos, decorative grid background behind Submission, oversized rounded shadows on nearly every card.
- **Copy/consistency**: "Support INFOCHIR/RHCA" and the donate form are in English on a French site; Index Medicus pagination reads "Previous / Page 1 of 15 / Next".
- **Data noise**: Atlas cards print raw timestamps ("Mis à jour le 2026-08-31T03:28:35.664439+00:00") and grey gradient placeholders where covers are missing.

## The revamp

**1. One page header everywhere.** Migrate À propos, Soumettre, Directives, Comité éditorial, Faire un don and Opportunités onto the shared `PageHeader` (display serif title, gold rule, lead paragraph, optional back link). Delete the bespoke header components and their gradient icon tiles.

**2. One card language.** Introduce a single issue-card component used by RHCA, IGM and Atlas: fixed cover aspect ratio, serif title (2-line clamp), one metadata line (date · volume · pages), max 3 tags with a real `+n` overflow chip, and a consistent action row using standard `outline` / `ghost` buttons at `size="sm"`. No coloured micro-pills.

**3. Token discipline.** Replace every hardcoded `text-gray-*`, `text-white`, `text-blue-*`, `bg-blue-*` and `bg-gradient-*` in page/section components with semantic tokens (`foreground`, `muted-foreground`, `primary`, `card`, `border`). Badge variants reduced to: neutral (tags), primary (journal/source), gold (highlight).

**4. Strip the fluff.** Remove star glyphs, floating hearts, decorative grid backgrounds, green top-border bars, and empty avatar circles. Cards get a hairline border and no shadow; section separation comes from spacing and the gold rule, not tinted bands.

**5. Rhythm and type scale.** Standard page shell: `max-w-7xl`, `px-4 sm:px-6 lg:px-8`, `py-12 sm:py-16` per section, `space-y-8` inside. Headings use the existing `type-display` / `type-h2` / `type-lead` utilities with explicit line-heights so nothing clips.

**6. Copy fixes.** Translate the Donate page and the Index Medicus pagination to French; format Atlas dates as `31/08/2026`; replace missing-cover placeholders with a typographic cover (journal mark + Vol/No) instead of a grey gradient.

**7. Editorial pages get real structure.** Comité éditorial becomes a clean two-column roster: section label, hairline divider, name in medium weight with role in muted small caps — no card-per-group. À propos becomes an editorial page: intro, mission/objectifs/communauté as a three-column text block with gold rules, then the founders as a text roster (no empty photo frames).

## Scope

Public pages only: Home (already done), À propos, RHCA, IGM, Atlas, Index Medicus, Annuaire, Directives, Comité éditorial, Soumettre, Faire un don, Opportunités, 404. Admin pages untouched. No data-model, query or business-logic changes — presentation only, except date formatting and cover fallback rendering.

## Verification

After each page group, re-screenshot at 1280px and 390px and check the build log; confirm no hardcoded colour classes remain via a repo grep.
