
import React, { useState } from 'react';
import FounderCard from './FounderCard';
import FounderModal from './FounderModal';
import { useFounders } from '@/hooks/useFounders';
import { Skeleton } from '@/components/ui/skeleton';
import type { Founder } from '@/hooks/useFounders';

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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Nos Fondateurs</h2>
          <div className="text-center text-red-500">
            Une erreur est survenue lors du chargement des fondateurs.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="founders" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Nos Fondateurs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeletons
            Array(7).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Skeleton className="w-32 h-32 rounded-full mb-4" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-4 w-40" />
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
      </div>
    </section>
  );
};

export default FoundersSection;
