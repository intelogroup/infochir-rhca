
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createLogger } from '@/lib/error-logger';
import { AtlasChapter } from '../types';

const logger = createLogger('useAtlasArticles');

// Mock data for development
const mockChapters: AtlasChapter[] = [
  {
    id: '1',
    title: 'Introduction aux décisions cliniques',
    description: 'Un aperçu des principes de base des décisions cliniques.',
    category: 'Fondamentaux',
    chapterNumber: 1,
    authors: ['Dr. Jean Dupont', 'Dr. Marie Curie'],
    pdfUrl: 'https://example.com/chapter1.pdf',
    coverImageUrl: '/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png',
    lastUpdate: '2023-10-15',
    status: 'available',
    tags: ['introduction', 'principes', 'fondamentaux']
  },
  {
    id: '2',
    title: 'Évaluation des risques en chirurgie',
    description: 'Comment évaluer les risques lors des interventions chirurgicales.',
    category: 'Chirurgie',
    chapterNumber: 2,
    authors: ['Dr. Pierre Martin', 'Dr. Sophie Laurent'],
    pdfUrl: 'https://example.com/chapter2.pdf',
    lastUpdate: '2023-11-05',
    status: 'available',
    tags: ['chirurgie', 'risques', 'évaluation']
  },
  {
    id: '3',
    title: 'Protocoles d\'urgence cardiaque',
    description: 'Procédures et protocoles pour les urgences cardiaques.',
    category: 'Cardiologie',
    chapterNumber: 3,
    authors: ['Dr. Thomas Petit', 'Dr. Claire Grand'],
    pdfUrl: 'https://example.com/chapter3.pdf',
    lastUpdate: '2023-09-20',
    status: 'available',
    tags: ['cardiologie', 'urgence', 'protocoles']
  },
  {
    id: '4',
    title: 'Gestion de la douleur post-opératoire',
    description: 'Stratégies et méthodes pour la gestion de la douleur après une opération.',
    category: 'Anesthésie',
    chapterNumber: 4,
    authors: ['Dr. Lucie Blanc', 'Dr. François Noir'],
    pdfUrl: 'https://example.com/chapter4.pdf',
    lastUpdate: '2023-12-01',
    status: 'available',
    tags: ['anesthésie', 'douleur', 'post-opératoire']
  },
  {
    id: '5',
    title: 'Diagnostic différentiel en neurologie',
    description: 'Comment établir un diagnostic différentiel en neurologie.',
    category: 'Neurologie',
    chapterNumber: 5,
    authors: ['Dr. Michel Leroy', 'Dr. Anne Dubois'],
    pdfUrl: 'https://example.com/chapter5.pdf',
    lastUpdate: '2024-01-10',
    status: 'available',
    tags: ['neurologie', 'diagnostic', 'différentiel']
  },
  {
    id: '6',
    title: 'Soins intensifs pédiatriques',
    description: 'Procédures et considérations pour les soins intensifs en pédiatrie.',
    category: 'Pédiatrie',
    chapterNumber: 6,
    authors: ['Dr. Isabelle Martin', 'Dr. Robert Durand'],
    status: 'coming-soon',
    tags: ['pédiatrie', 'soins intensifs', 'enfants']
  }
];

export const useAtlasArticles = () => {
  return useQuery({
    queryKey: ['atlas-articles'],
    queryFn: async () => {
      try {
        // In a real implementation, fetch from supabase
        // const { data, error } = await supabase
        //   .from('atlas_chapters')
        //   .select('*')
        //   .order('chapterNumber', { ascending: true });
        
        // if (error) {
        //   throw new Error(error.message);
        // }
        
        // return data as AtlasChapter[];
        
        // For now, use mock data
        return mockChapters;
      } catch (error) {
        logger.error('Error fetching Atlas articles:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
};
