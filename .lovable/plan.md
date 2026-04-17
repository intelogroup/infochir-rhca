
The user reports RHCA cover images not showing up on the home page. Let me investigate.

From the network data, I can see the carousel query returns articles including IGM and ADC, but I need to check what's happening with RHCA. Let me look at the carousel hook and the storage URL helper.

Key file: `src/components/home/carousel/useCarouselData.tsx` — uses `getStorageUrl('rhca_covers', filename)` and falls back to generated `RHCA_vol_XX_no_YY_cover.png`.

Let me check the integrations file and what RHCA records actually exist.
