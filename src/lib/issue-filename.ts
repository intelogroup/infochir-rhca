// Nomenclature for journal issue PDFs: the file name is the source of truth.
export type ParsedName = {
  source: "IGM" | "RHCA" | "ADC";
  volume: string;
  issue: string;
  publication_date: string;
  cover_filename: string;
};

const isRealDate = (y: number, m: number, d: number) => {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
};

// The dropped file's own name is the source of truth: parse it, never guess it.
export const parseFilename = (name: string): ParsedName | null => {
  let m = name.match(/^IGM_vol_(\d{2})_no_(\d+)_(\d{2})_(\d{2})_(\d{2})\.pdf$/);
  if (m) {
    const [, vol, no, dd, mm, yy] = m;
    if (!isRealDate(2000 + +yy, +mm, +dd)) return null;
    return {
      source: "IGM", volume: vol, issue: no,
      publication_date: `20${yy}-${mm}-${dd}`,
      cover_filename: `IGM_vol_${vol}_no_${no}_cover.png`,
    };
  }
  m = name.match(/^RHCA_vol_(\d{2})_no_(\d+)_(\d{2})_(\d{2})_(\d{4})\.pdf$/);
  if (m) {
    const [, vol, no, dd, mm, yyyy] = m;
    if (!isRealDate(+yyyy, +mm, +dd)) return null;
    return {
      source: "RHCA", volume: vol, issue: no,
      publication_date: `${yyyy}-${mm}-${dd}`,
      cover_filename: `RHCA_vol_${vol}_no_${no}_cover.png`,
    };
  }
  m = name.match(/^ADC_ch_(\d+)_([a-z0-9-]+)\.pdf$/i);
  if (m) {
    return {
      source: "ADC", volume: "", issue: m[1], publication_date: "",
      cover_filename: name.replace(/\.pdf$/i, ".png"),
    };
  }
  return null;
};
