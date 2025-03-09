
import { useState } from 'react';
import { Section } from '@/components/ui/section';
import FounderCard from './FounderCard';
import FounderModal from './FounderModal';
import { Founder } from './types';
import { useFounders } from '@/hooks/useFounders';
import { Skeleton } from '@/components/ui/skeleton';

const FoundersSection = () => {
  const { founders, loading, error } = useFounders();
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFounderClick = (founder: Founder) => {
    setSelectedFounder(founder);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFounder(null);
  };

  if (error) {
    return (
      <Section id="founders" className="bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-8">Nos Fondateurs</h2>
        <div className="text-center text-red-500">
          Une erreur est survenue lors du chargement des fondateurs.
        </div>
      </Section>
    );
  }

  return (
    <Section id="founders" className="bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-8">Nos Fondateurs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeletons
          Array(7).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton className="w-40 h-40 rounded-full mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))
        ) : (
          founders.map((founder) => (
            <FounderCard
              key={founder.name}
              founder={founder}
              onClick={() => handleFounderClick(founder)}
            />
          ))
        )}
      </div>

      {selectedFounder && (
        <FounderModal
          founder={selectedFounder}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </Section>
  );
};

export default FoundersSection;
