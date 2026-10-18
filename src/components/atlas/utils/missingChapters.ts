import { AtlasChapter } from '@/components/atlas/types';

// Chapters with no `articles` row yet. The secretariat (ADCH v2,
// 2026-10-17) asked for VII, IX, XII, XIX and XXIV to be shown as
// "EN PREPARATION" slots, so these get client-side placeholders until
// real rows (and files) exist for them. XVII (ORL-CMF) joined the
// list on 2026-10-18 at Jim's word: its file exists nowhere reachable,
// so it shows as En préparation too rather than being silently absent
// from the atlas. XIII (Brûlures) was on the list briefly the same
// day, until the secretariat sent its file and the chapter published.
const MISSING_CHAPTERS: number[] = [7, 9, 12, 17, 19, 24];

// Official ADC taxonomy (Introduction, mise à jour août 2026): Tome I = ch. 1-14, Tome II = ch. 15-24
const PLANNED_CHAPTERS: Partial<AtlasChapter>[] = [
  { chapterNumber: 1, title: "Traumatismes – Plaies", specialty: "Traumatologie" },
  { chapterNumber: 2, title: "Peau et Tissus sous-cutanés", specialty: "Dermatologie chirurgicale" },
  { chapterNumber: 3, title: "Sein", specialty: "Pathologie mammaire" },
  { chapterNumber: 4, title: "Cou", specialty: "Chirurgie cervicale" },
  { chapterNumber: 5, title: "Thorax", specialty: "Chirurgie thoracique" },
  { chapterNumber: 6, title: "Diaphragme ; de l'Œsophage à l'Iléon", specialty: "Chirurgie digestive" },
  { chapterNumber: 7, title: "De l'Appendice au Rectum", specialty: "Chirurgie colorectale", status: 'coming-soon' },
  { chapterNumber: 8, title: "Foie – Voies biliaires – Pancréas – Rate", specialty: "Chirurgie hépato-bilio-pancréatique" },
  { chapterNumber: 9, title: "Cavité abdominale – Omentum – Mésentère", specialty: "Chirurgie abdominale", status: 'coming-soon' },
  { chapterNumber: 10, title: "Paroi abdominale – Hernies – Éventration", specialty: "Chirurgie pariétale" },
  { chapterNumber: 11, title: "Périnée – Fesses", specialty: "Chirurgie périnéale" },
  { chapterNumber: 12, title: "Corps étrangers", specialty: "Chirurgie générale", status: 'coming-soon' },
  { chapterNumber: 13, title: "Brûlures thermiques et électriques", specialty: "Brûlures", status: 'coming-soon' },
  { chapterNumber: 14, title: "Challenges et Gigantismes", specialty: "Chirurgie générale" },
  { chapterNumber: 15, title: "Neurochirurgie – Crâne, Moelle épinière, Nerfs périphériques", specialty: "Neurochirurgie" },
  { chapterNumber: 16, title: "Ophtalmologie", specialty: "Ophtalmologie" },
  { chapterNumber: 17, title: "ORL – Maxillo-facial", specialty: "ORL – Maxillo-facial", status: 'coming-soon' },
  { chapterNumber: 18, title: "Vasculaire artériel – Anévrismes", specialty: "Chirurgie vasculaire" },
  { chapterNumber: 19, title: "Système vasculaire veineux et lymphatique", specialty: "Chirurgie vasculaire", status: 'coming-soon' },
  { chapterNumber: 20, title: "Chirurgie pédiatrique", specialty: "Chirurgie pédiatrique" },
  { chapterNumber: 21, title: "Urologie et appareil génital de l'homme", specialty: "Urologie" },
  { chapterNumber: 22, title: "Appareil génital de la femme", specialty: "Gynécologie chirurgicale" },
  { chapterNumber: 23, title: "Orthopédie – Appareil loco-moteur", specialty: "Orthopédie" },
  { chapterNumber: 24, title: "Chirurgie reconstructive", specialty: "Chirurgie reconstructive", status: 'coming-soon' }
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
      authors: ['Équipe ADCH'],
      author: 'Équipe ADCH',
      lastUpdate: '',
      lastUpdated: '',
      publicationDate: '',
      abstract: `Chapitre ${chapterNumber} de l'Atlas de Diagnostic Chirurgical en Haïti (ADCH). Ce contenu est en préparation et couvrira les aspects essentiels de ${plannedChapter?.specialty || 'la chirurgie'}.`,
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
  return Array.from({ length: 24 }, (_, i) => i + 1);
};