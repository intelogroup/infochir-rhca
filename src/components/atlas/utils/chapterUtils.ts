
import { AtlasChapter } from "../types";

export const getChapterById = (chapters: AtlasChapter[], id: string): AtlasChapter | undefined => {
  return chapters.find(chapter => chapter.id === id);
};

export const filterAvailableChapters = (chapters: AtlasChapter[]): AtlasChapter[] => {
  return chapters.filter(chapter => chapter.status === "available");
};

export const filterComingChapters = (chapters: AtlasChapter[]): AtlasChapter[] => {
  return chapters.filter(chapter => chapter.status === "coming");
};

export const sortChaptersByDate = (chapters: AtlasChapter[]): AtlasChapter[] => {
  return [...chapters].sort((a, b) => {
    if (!a.lastUpdated || !b.lastUpdated) return 0;
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });
};
