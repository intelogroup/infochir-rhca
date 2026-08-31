# UI Audit + Premium Design System for InfoChir/RHCA

I captured the live app (home, RHCA, IGM, Atlas, Index Medicus, Annuaire, À propos, Don) and read `src/index.css` / `tailwind.config.ts`. Tokens exist but are thin and largely bypassed: **120 component files still hardcode `text-white` / `bg-white` / hex values**.

## What's making it look AI-generated

**1. Blue→green gradients everywhere**
The hero is a full-bleed navy→emerald gradient; the wordmark is half blue half green; "Faire un don" is a green gradient pill; `Continue to Payment` is a blue gradient bar; section backgrounds are faint blue/green washes. Gradient-on-gradient is the single strongest "template" signal.

**2. Gradient text on headings**
`text-gradient-brand` on page titles ("Revue Haïtienne…" in green, "Support INFOCHIR/RHCA" navy→cyan, "Index Medicus" blue→green, "À propos" blue). Contrast varies mid-word; the green title on near-white fails AA at that weight.

**3. Hero is broken, not just ugly**
The hero photo occupies ~1200px of vertical space with a hard cut-off at the bottom, no gradient scrim, and the "Découvrir notre mission" outline button on gradient is barely legible. Below the fold the CTA copy is unreadable over green.

**4. Every page repeats the same centered stack**
Back link → logo in a rounded white tile → gradient title → grey subtitle → 300px of dead space → content. Four identical pages. No page-level identity, no breadcrumbs, huge wasted vertical rhythm.

**5. Card noise**
RHCA/IGM cards stack 4 colored micro-badges (blue date, green vol, orange pages, tag pills) plus 3 tiny outline buttons in 3 different colors, all inside ~200px. Titles truncate ("Revue Haïtienne de Chir…"), covers are unmasked raw images with mismatched aspect ratios.

**6. Atlas grid**
Card thumbnails are screenshots of dense PDF text rendered at 200px — illegible grey noise. Titles all begin with the same 40 characters, so cards are indistinguishable. Green "Chirurgie" badge floats on top of the image with no scrim. Raw timestamps leak: `Mis à jour le 2026-08-31T03:28:35.664439+00:00`.

**7. Index Medicus table**
Two stacked actions per row (tiny outline "Partager" + big green "PDF"), some PDF buttons rendered at 50% opacity for no visible reason, 15 pages behind Previous/Next only, `N/A` shown as a date, cyan tag pills competing with a green source badge.

**8. Untranslated / inconsistent copy**
The Donate page is entirely English (`Email (required)`, `Select amount`, `Continue to Payment`) inside a French app. "Support INFOCHIR/RHCA" reads as "technical support" in French.

**9. Fondateurs / À propos**
Empty circles where avatars were removed — they read as broken images. Emoji-ish star glyphs flank "Membres Fondateurs". Icon circles use pale blue-on-pale-blue.

**10. Contrast and elevation debt**
`--muted-foreground` at 47% L on white is borderline for the 12px meta text used everywhere. Three near-identical shadows (`card`, `elevated`, `elegant`) applied inconsistently; `--radius: 0.75rem` mixed with `rounded-full` pills and `rounded-sm` badges on the same card.

## Recommended token system: "Clinical Editorial"

Direction: near-white paper, one deep ink, a single restrained brand accent, no gradients, hairline borders instead of shadows, generous type scale. Green demoted from co-primary to a status/accent color only.

```
Ink        #0B1220   text, headings, dark surfaces
Paper      #FCFCFD   page background
Surface    #FFFFFF   cards
Line       #E8EAEE   1px hairline borders (replaces shadows)
Brand      #0B4F9C   InfoChir blue, links + primary actions
Accent     #1F8A54   RHCA green — badges/status ONLY, never large fills
Muted text #5A6472   AA-compliant at 14px
```

Token changes in `index.css`:
- Retune `--foreground` to Ink, `--background` to Paper, `--muted-foreground` to `#5A6472` (passes AA at 14px).
- **Delete** `--gradient-brand` / `--gradient-primary` / `--gradient-secondary` / `--gradient-surface` and the `.text-gradient-brand` utility.
- Replace 3 shadows with 2: `--shadow-sm` (hairline + 1px) and `--shadow-pop` (hover/modals only).
- Radius scale: `--radius-sm 6px / --radius 10px / --radius-lg 14px`; pills reserved for badges only.
- Spacing rhythm: section padding `py-16 md:py-24`, max content width `72rem`, single 8px base grid.
- Typography: keep one geometric sans for UI, add a text serif for journal titles and article prose (editorial credibility, and it differentiates from every AI-default Inter/Poppins site). Tighten `.type-display` to `text-4xl md:text-5xl`, `tracking-[-0.02em]`, weight 600 not bold.
- Add `--surface-inset` for table headers/filter bars so they stop looking like cards.

## Areas that need a rethink (build order)

1. **Global tokens + Tailwind mapping** — new palette, radii, 2 shadows, type scale; remove gradient utilities.
2. **Header** — solid Paper with a bottom hairline, single-ink wordmark, `Faire un don` as a solid Brand button (no gradient), active nav via underline not color.
3. **Hero** — half-height (`min-h-[62svh]`), split layout: Ink-tinted photo panel right with a scrim, text left on Paper. One solid primary CTA + one text link.
4. **PageHeader** — left-aligned, no logo tile, no gradient text; title / one-line description / breadcrumb; kill the 300px dead zone.
5. **Issue card (RHCA/IGM)** — fixed 3:4 cover with `object-cover` and a hairline frame, 2-line clamped title with tooltip, one meta line (`22 mai 2026 · Vol. 8 N° 52 · 44 p.`), max 2 tag pills, primary "Lire" + icon-only share/download.
6. **Atlas card** — replace PDF-screenshot thumbnails with a generated typographic cover (chapter numeral + title on Ink), formatted date, scrimmed badge, disabled state for "Bientôt".
7. **Index Medicus table** — one action group per row, `--surface-inset` header, zebra-free hairline rows, "—" instead of `N/A`, sticky filter bar, page-size control.
8. **Donate** — full French translation, amount chips as a segmented control, solid CTA.
9. **À propos / Fondateurs** — initials monogram tiles instead of empty circles, remove star glyphs, Ink-on-Paper section headers.
10. **Sweep hardcoded colors** — replace `text-white` / `bg-white` / hex across the ~120 flagged files with tokens; verify dark mode.
11. **A11y pass** — AA contrast check on badges/meta, visible focus rings using `--ring`, `aria-label` on icon-only buttons.

## Technical notes

- All values land in `src/index.css` as HSL custom properties and are mapped in `tailwind.config.ts`; components consume semantic classes only.
- Steps 1–2 are global and will visibly shift every page; steps 3–9 are page-scoped and independently shippable.
- No business logic, data, or edge functions are touched — presentation layer only.
- Dark mode is currently a stock shadcn slate theme; it gets retuned as Ink-based surfaces in step 1.

## Before I build

I can start at step 1 with the "Clinical Editorial" palette above, or first show you 2–3 rendered directions for the home page so you pick the look before I commit the tokens.
