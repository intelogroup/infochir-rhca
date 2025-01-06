import type { RhcaVolume } from "../types";
import type { SortOption } from "@/types/sortOptions";

export const filterVolumes = (volumes: RhcaVolume[], searchTerm: string): RhcaVolume[] => {
  if (!searchTerm) return volumes;
  
  const searchLower = searchTerm.toLowerCase();
  return volumes.filter((volume) => {
    return (
      volume.volume.toString().includes(searchTerm) ||
      volume.description?.toLowerCase().includes(searchLower) ||
      volume.articles.some(
        article =>
          article.title?.toLowerCase().includes(searchLower) ||
          article.abstract?.toLowerCase().includes(searchLower) ||
          article.authors.some(author => 
            author.toLowerCase().includes(searchLower)
          )
      )
    );
  });
};

export const sortVolumes = (volumes: RhcaVolume[], sortType: SortOption): RhcaVolume[] => {
  const sorted = [...volumes];
  switch (sortType) {
    case "latest":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const yearDiff = dateB.getFullYear() - dateA.getFullYear();
        
        if (yearDiff === 0) {
          // If same year, sort by month (newest first)
          return dateB.getMonth() - dateA.getMonth();
        }
        return yearDiff;
      });
    case "year":
      return sorted.sort((a, b) => {
        const yearA = new Date(a.date).getFullYear();
        const yearB = new Date(b.date).getFullYear();
        const yearDiff = yearB - yearA;
        
        if (yearDiff === 0) {
          // If same year, sort by month (newest first)
          return new Date(b.date).getMonth() - new Date(a.date).getMonth();
        }
        return yearDiff;
      });
    case "downloads":
      return sorted.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
    case "shares":
      return sorted.sort((a, b) => (b.shareCount || 0) - (a.shareCount || 0));
    default:
      return sorted;
  }
};

export const groupVolumesByYear = (volumes: RhcaVolume[]): Record<string, RhcaVolume[]> => {
  const grouped = volumes.reduce((acc, volume) => {
    const year = new Date(volume.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    // Sort volumes within each year by month (newest first)
    acc[year].push(volume);
    acc[year].sort((a, b) => new Date(b.date).getMonth() - new Date(a.date).getMonth());
    return acc;
  }, {} as Record<string, RhcaVolume[]>);

  // Return an object with years sorted in descending order
  return Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .reduce((acc, year) => {
      acc[year] = grouped[year];
      return acc;
    }, {} as Record<string, RhcaVolume[]>);
};