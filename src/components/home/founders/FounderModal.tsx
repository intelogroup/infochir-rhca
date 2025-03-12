
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Founder } from "@/hooks/useFounders";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface FounderModalProps {
  founder: Founder;
  isOpen: boolean;
  onClose: () => void;
}

export const FounderModal = ({ founder, isOpen, onClose }: FounderModalProps) => {
  const isMobile = useIsMobile();
  
  // Generate initials for avatar fallback
  const initials = founder.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const modalContent = (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {founder.name}
          </DialogTitle>
        </div>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
        <div className="flex flex-col items-center space-y-2 sm:space-y-4">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 border-2 border-white shadow-md">
            <AvatarImage 
              src={founder.image} 
              alt={founder.name}
              className="object-cover" 
            />
            <AvatarFallback className="text-2xl sm:text-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h3 className="font-bold text-lg sm:text-xl text-blue-800">
              {founder.name}
            </h3>
            <p className="text-gray-600 font-medium text-sm sm:text-base">{founder.title}</p>
            <p className="text-xs sm:text-sm text-gray-500">{founder.role}</p>
            
            {founder.location && (
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {founder.location}
              </p>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-3 sm:space-y-4">
          {founder.bio && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">Bio</h4>
              <p className="text-sm sm:text-base text-gray-600">{founder.bio}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
            {founder.specialties && founder.specialties.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">SPÉCIALITÉ</h4>
                <div className="flex flex-wrap gap-1">
                  {founder.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {founder.achievements && founder.achievements.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">Achievements</h4>
                <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600">
                  {founder.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {founder.responsibilities && founder.responsibilities.length > 0 && (
              <div className={cn(
                "mt-3 sm:mt-4",
                (founder.specialties?.length > 0 || founder.achievements?.length > 0) ? "lg:col-span-2" : ""
              )}>
                <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">Responsibilities</h4>
                <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600">
                  {founder.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex justify-center sm:justify-end mt-4 sm:mt-6">
        <Button onClick={onClose}>
          Fermer
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-hidden">
        {isMobile ? (
          <ScrollArea className="max-h-[65vh] pr-2 -mr-2">
            {modalContent}
          </ScrollArea>
        ) : (
          modalContent
        )}
      </DialogContent>
    </Dialog>
  );
};
