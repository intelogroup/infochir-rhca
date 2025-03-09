
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type Founder } from "./types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FounderModalProps {
  founder: Founder;
  isOpen: boolean;
  onClose: () => void;
}

const FounderModal = ({ founder, isOpen, onClose }: FounderModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            {founder.name}
            {founder.isDeceased && (
              <span className="text-sm font-normal text-muted-foreground">(Décédé)</span>
            )}
          </DialogTitle>
          <DialogDescription className="text-base font-medium text-muted-foreground">
            {founder.title} - {founder.role}
            {founder.location && <span> • {founder.location}</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="col-span-1 flex flex-col items-center gap-4">
            <div className="rounded-full overflow-hidden border-2 border-gray-200 w-40 h-40">
              {founder.image ? (
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  Photo non disponible
                </div>
              )}
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 space-y-4">
            {founder.bio && (
              <div>
                <h3 className="font-semibold text-lg">Biographie</h3>
                <p className="mt-1 text-muted-foreground">{founder.bio}</p>
              </div>
            )}

            {founder.specialties && founder.specialties.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg">Spécialités</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {founder.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {founder.achievements && founder.achievements.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg">Réalisations</h3>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground space-y-1">
                  {founder.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {founder.responsibilities && founder.responsibilities.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg">Responsabilités</h3>
                <Separator className="my-2" />
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  {founder.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FounderModal;
