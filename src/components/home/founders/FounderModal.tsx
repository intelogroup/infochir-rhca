
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Founder } from '@/hooks/useFounders';

interface FounderModalProps {
  founder: Founder;
  isOpen: boolean;
  onClose: () => void;
}

const FounderModal: React.FC<FounderModalProps> = ({ founder, isOpen, onClose }) => {
  if (!founder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{founder.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {founder.title} · {founder.role}
            {founder.location && ` · ${founder.location}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 py-2">
          <div className="flex justify-center">
            {founder.image ? (
              <img
                src={founder.image}
                alt={`Photo de ${founder.name}`}
                className={`w-28 h-28 object-cover rounded-full border-2 ${
                  founder.isDeceased ? 'border-gray-400 grayscale' : 'border-primary'
                }`}
              />
            ) : (
              <div className={`w-28 h-28 rounded-full border-2 flex items-center justify-center bg-gray-100 ${
                founder.isDeceased ? 'border-gray-400' : 'border-primary'
              }`}>
                <span className="text-3xl font-semibold text-gray-500">
                  {founder.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {founder.bio && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Biographie</h4>
                <p className="text-sm text-gray-600">{founder.bio}</p>
              </div>
            )}
            
            {founder.specialties && founder.specialties.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Spécialités</h4>
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  {founder.specialties.map((specialty, index) => (
                    <li key={index}>{specialty}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {founder.achievements && founder.achievements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Réalisations</h4>
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  {founder.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {founder.responsibilities && founder.responsibilities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Responsabilités</h4>
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  {founder.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FounderModal;
