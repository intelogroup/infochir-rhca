import { AtlasChapter } from '@/components/atlas/types';

// Only real `articles` rows have UUID ids. Placeholder chapters
// (En préparation) and the front-matter entries (Sommaire, Références
// des auteurs) carry synthetic ids like "adc-chapter-13-placeholder".
// Navigating to /adc/chapters/<synthetic id> makes the article page
// query the uuid column with a non-uuid value, which throws — so
// those cards must never navigate there. Their clicks go nowhere
// (or open their PDF directly when they have one, e.g. the Sommaire).
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isRealArticleId = (id?: string | null): boolean =>
  typeof id === 'string' && UUID_PATTERN.test(id);

export const canOpenChapter = (
  chapter: Pick<AtlasChapter, 'id'>
): boolean => isRealArticleId(chapter.id);
