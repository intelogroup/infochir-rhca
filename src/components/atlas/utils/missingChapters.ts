import { AtlasChapter } from '@/components/atlas/types';

// Missing chapters that should show as "Coming Soon"
const MISSING_CHAPTERS = [9, 10, 11, 13, 21, 22, 23];

// Complete chapter definitions with expected content
const PLANNED_CHAPTERS: Partial<AtlasChapter>[] = [
  { chapterNumber: 1, title: "Introduction à la Chirurgie", specialty: "Chirurgie Générale" },
  { chapterNumber: 2, title: "Anatomie Chirurgicale", specialty: "Anatomie" },
  { chapterNumber: 3, title: "Techniques de Base", specialty: "Chirurgie Générale" },
  { chapterNumber: 4, title: "Chirurgie d'Urgence", specialty: "Urgences" },
  { chapterNumber: 5, title: "Chirurgie Orthopédique", specialty: "Orthopédie" },
  { chapterNumber: 6, title: "Chirurgie Pédiatrique", specialty: "Pédiatrie" },
  { chapterNumber: 7, title: "Chirurgie Cardiovasculaire", specialty: "Cardiologie" },
  { chapterNumber: 8, title: "Neurochirurgie", specialty: "Neurologie" },
  { chapterNumber: 9, title: "Chirurgie Thoracique", specialty: "Pneumologie", status: 'coming-soon' },
  { chapterNumber: 10, title: "Chirurgie Digestive", specialty: "Gastro-entérologie", status: 'coming-soon' },
  { chapterNumber: 11, title: "Chirurgie Urologique", specialty: "Urologie", status: 'coming-soon' },
  { chapterNumber: 12, title: "Chirurgie Gynécologique", specialty: "Gynécologie" },
  { chapterNumber: 13, title: "Chirurgie Plastique", specialty: "Chirurgie Plastique", status: 'coming-soon' },
  { chapterNumber: 14, title: "Anesthésie Chirurgicale", specialty: "Anesthésie" },
  { chapterNumber: 15, title: "Soins Post-opératoires", specialty: "Soins Intensifs" },
  { chapterNumber: 16, title: "Complications Chirurgicales", specialty: "Chirurgie Générale" },
  { chapterNumber: 17, title: "Chirurgie Ambulatoire", specialty: "Chirurgie Générale" },
  { chapterNumber: 18, title: "Chirurgie Robotique", specialty: "Technologie Médicale" },
  { chapterNumber: 19, title: "Échographie Chirurgicale", specialty: "Imagerie" },
  { chapterNumber: 20, title: "Endoscopie Chirurgicale", specialty: "Endoscopie" },
  { chapterNumber: 21, title: "Transplantation", specialty: "Transplantation", status: 'coming-soon' },
  { chapterNumber: 22, title: "Recherche Chirurgicale", specialty: "Recherche", status: 'coming-soon' },
  { chapterNumber: 23, title: "Éthique en Chirurgie", specialty: "Éthique Médicale", status: 'coming-soon' }
];

/**
 * Creates placeholder entries for missing Atlas chapters
 */
export const createMissingChapterPlaceholders = (): AtlasChapter[] => {
  return MISSING_CHAPTERS.map(chapterNumber => {
    const plannedChapter = PLANNED_CHAPTERS.find(ch => ch.chapterNumber === chapterNumber);
    
    return {
      id: `adc-chapter-${chapterNumber}-placeholder`,
      title: plannedChapter?.title || `Atlas Digital de Chirurgie - Chapitre ${chapterNumber}`,
      description: `Ce chapitre sera bientôt disponible. Contenu à venir sur ${plannedChapter?.specialty || 'les techniques chirurgicales avancées'}.`,
      category: plannedChapter?.specialty || 'Chirurgie Générale',
      chapterNumber,
      pageNumber: chapterNumber.toString(),
      authors: ['Équipe ADC'],
      author: 'Équipe ADC',
      lastUpdate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
      abstract: `Chapitre ${chapterNumber} de l'Atlas Digital de Chirurgie. Ce contenu sera bientôt disponible et couvrira les aspects essentiels de ${plannedChapter?.specialty || 'la chirurgie'}.`,
      status: 'coming-soon' as const,
      tags: ['chirurgie', 'atlas', 'éducation médicale', 'haïti'],
      stats: {
        views: 0,
        shares: 0,
        downloads: 0
      },
      source: 'ADC',
      primary_author: 'Équipe ADC',
      co_authors: [],
      issue: chapterNumber.toString(),
      volume: '1',
      specialty: plannedChapter?.specialty || 'Chirurgie Générale',
      institution: 'Association Haïtienne de Chirurgie'
    };
  });
};

/**
 * Gets the complete Atlas chapter order including placeholders
 */
export const getCompleteChapterOrder = (): number[] => {
  return Array.from({ length: 23 }, (_, i) => i + 1);
};