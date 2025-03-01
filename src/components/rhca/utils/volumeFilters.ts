
import type { RhcaVolume } from "../types";

// The following properties are now optional in RhcaVolume, so we need to handle them safely
export const filterVolumes = (
  volumes: RhcaVolume[],
  searchTerm: string,
  specialtyFilter: string,
  yearFilter: string
): RhcaVolume[] => {
  return volumes.filter((volume) => {
    // Text search
    const searchTermLower = searchTerm.toLowerCase();
    const textMatch =
      searchTerm === "" ||
      volume.title.toLowerCase().includes(searchTermLower) ||
      volume.specialty?.toLowerCase().includes(searchTermLower) ||
      (volume.description || "").toLowerCase().includes(searchTermLower);

    // Specialty filter
    const specialtyMatch =
      specialtyFilter === "" || volume.specialty === specialtyFilter;

    // Year filter
    const yearMatch = yearFilter === "" || volume.year === yearFilter;

    return textMatch && specialtyMatch && yearMatch;
  });
};

export const sortVolumes = (
  volumes: RhcaVolume[],
  sortBy: string
): RhcaVolume[] => {
  return [...volumes].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "downloads-desc":
        return (b.downloadCount || 0) - (a.downloadCount || 0);
      case "downloads-asc":
        return (a.downloadCount || 0) - (b.downloadCount || 0);
      case "shares-desc":
        return (b.shareCount || 0) - (a.shareCount || 0);
      case "shares-asc":
        return (a.shareCount || 0) - (b.shareCount || 0);
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
};
