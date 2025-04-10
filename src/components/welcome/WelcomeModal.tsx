
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Use a unique key for the welcome modal
    const hasSeenWelcome = localStorage.getItem("hasSeenSpecialNote");

    if (!hasSeenWelcome) {
      // If not, show the welcome dialog after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500); // Reduced delay for faster pop-up

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    // Mark that the user has seen the welcome message with the unique key
    localStorage.setItem("hasSeenSpecialNote", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-bold text-primary">
            NOTE SPÉCIALE AUX AUTEURS ET LECTEURS
          </DialogTitle>
          <DialogDescription className="text-center text-gray-800 font-semibold">
            DE LA REVUE HAÏTIENNE DE CHIRURGIE ET D'ANESTHÉSIOLOGIE ET DE L'INFO GAZETTE MÉDICALE D'INFOCHIR/RHCA
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4 text-gray-700">
          <p className="leading-relaxed">
            La situation d'insécurité en Haiti prend de plus en plus d'ampleur et terrorise la population. L'aire métropolitaine est pratiquement assiégée : aucun moyen d'en sortir.
          </p>
          <p className="leading-relaxed">
            Comme des millions de concitoyens, les membres d'INFOCHIR/RHCA vivent un stress incessant. Ils sont menacés quotidiennement dans leurs vies et leurs biens, par des rafales d'armes continuelles dans certains quartiers. Certains ont dû fuir leurs maisons alors que d'autres craignent, perplexes que leur tour n'arrive. Une incertitude grandissante, assez ankylosante qui favorise peu l'opérationnalisation de notre plateforme. Toutefois, en dépit de ce contexte délétère, l'équipe, dans un instinct de survie, entend maintenir ses publications tant et aussi longtemps qu'elle le pourra.
          </p>
          <p className="leading-relaxed">
            Aussi, veut-t-elle encourager les auteurs à continuer à lui envoyer leurs textes et aux lecteurs à poursuivre les consultations de nos périodiques. Il devient encore plus pertinent de nous faire parvenir vos réactions. Cependant, compte tenu de la situation décrite plus haut et de l'état d'esprit dans lequel nous fonctionnons, la périodicité de nos publications connaîtra des fluctuations dans les mois à venir et, ce, jusqu'à nouvel ordre.
          </p>
          <p className="leading-relaxed">
            Comptant sur votre compréhension et votre accompagnement en la circonstance, nous vous en remercions.
          </p>
          <p className="text-right font-semibold">La Rédaction</p>
        </div>
        
        <DialogFooter className="mt-6">
          <Button onClick={handleClose} className="w-full">
            Continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
