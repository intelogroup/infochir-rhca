import type { RhcaVolume } from "../types";

export const filterVolumes = (volumes: RhcaVolume[], searchTerm: string): RhcaVolume[] => {
  const searchLower = searchTerm.toLowerCase();
  return volumes.filter((volume) => {
    return (
      volume.volume.toLowerCase().includes(searchLower) ||
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

export const sortVolumes = (volumes: RhcaVolume[], sortType: string): RhcaVolume[] => {
  const sorted = [...volumes];
  switch (sortType) {
    case "latest":
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case "year":
      return sorted.sort((a, b) => {
        const yearA = new Date(a.date).getFullYear();
        const yearB = new Date(b.date).getFullYear();
        return yearB - yearA;
      });
    case "downloads":
      return sorted.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
    case "shares":
      return sorted.sort((a, b) => (b.shareCount || 0) - (a.shareCount || 0));
    default:
      return sorted;
  }
};