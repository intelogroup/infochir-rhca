
import React from 'react';
import type { Founder } from '@/hooks/useFounders';
import { Skeleton } from '@/components/ui/skeleton';

interface FounderCardProps {
  founder: Founder;
  onClick: () => void;
}

const FounderCard: React.FC<FounderCardProps> = ({ founder, onClick }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  return (
    <div 
      className={`flex flex-col items-center p-4 rounded-lg transition-transform duration-200 hover:shadow-md cursor-pointer ${
        founder.isDeceased ? 'opacity-75' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative mb-4">
        {!imageLoaded && !imageError && (
          <Skeleton className="w-32 h-32 rounded-full absolute inset-0" />
        )}
        
        {founder.image && !imageError ? (
          <img
            src={founder.image}
            alt={`Photo de ${founder.name}`}
            className={`w-32 h-32 object-cover rounded-full border-2 ${
              founder.isDeceased ? 'border-gray-400 grayscale' : 'border-primary'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        ) : (
          <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center bg-gray-100 ${
            founder.isDeceased ? 'border-gray-400' : 'border-primary'
          }`}>
            <span className="text-3xl font-semibold text-gray-500">
              {founder.name.charAt(0)}
            </span>
          </div>
        )}
        
        {founder.isDeceased && (
          <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
            In memoriam
          </div>
        )}
      </div>
      
      <h3 className="font-bold text-lg text-center">{founder.name}</h3>
      <p className="text-sm text-gray-600 text-center">{founder.title}</p>
      <p className="text-xs text-gray-500 text-center mt-1">{founder.role}</p>
    </div>
  );
};

export default FounderCard;
