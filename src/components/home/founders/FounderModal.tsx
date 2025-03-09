
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { Founder } from "@/hooks/useFounders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FounderModalProps {
  founder: Founder;
  isOpen: boolean;
  onClose: () => void;
}

export const FounderModal = ({ founder, isOpen, onClose }: FounderModalProps) => {
  // Generate initials from name
  const initials = founder.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogClose asChild className="absolute right-4 top-4">
          {/* Fixed the button size from "icon" to "sm" */}
          <Button variant="ghost" size="sm" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
        
        <DialogHeader className="pt-6 sm:text-center flex flex-col items-center">
          <Avatar className="h-24 w-24 border-2 border-white shadow-lg mx-auto mb-4">
            <AvatarImage 
              src={founder.image} 
              alt={founder.name} 
              className="object-cover"
            />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <DialogTitle className="text-2xl font-bold text-center">
            {founder.name}
            {founder.isDeceased && (
              <Badge variant="outline" className="ml-2 bg-gray-100">
                In Memoriam
              </Badge>
            )}
          </DialogTitle>
          
          <div className="mt-1 text-center">
            <p className="text-gray-700 font-medium">{founder.title}</p>
            <p className="text-gray-500 text-sm mt-1">{founder.role}</p>
            {founder.location && (
              <p className="text-gray-500 text-sm mt-1">{founder.location}</p>
            )}
          </div>
        </DialogHeader>
        
        <div className="mt-6 space-y-4">
          {founder.bio && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Biographie</h3>
              <p className="text-gray-600">{founder.bio}</p>
            </div>
          )}
          
          {founder.specialties && founder.specialties.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Spécialités</h3>
              <div className="flex flex-wrap gap-2">
                {founder.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {founder.achievements && founder.achievements.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Réalisations</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                {founder.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
          
          {founder.responsibilities && founder.responsibilities.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Responsabilités</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                {founder.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
