
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
      // If not, show the welcome dialog after a longer delay to ensure content loads first
      const timer = setTimeout(() => {
        // Check if the page is already loaded before showing modal
        if (document.readyState === 'complete') {
          setIsOpen(true);
        } else {
          // If page isn't loaded yet, wait for load event
          window.addEventListener('load', () => setIsOpen(true), { once: true });
        }
      }, 1500); // Increased delay to ensure content loads first

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
      <DialogContent className="w-[95vw] max-w-2xl h-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl text-center font-bold text-primary">
            NOTE SPÉCIALE AUX AUTEURS ET LECTEURS
          </DialogTitle>
          <DialogDescription className="text-center text-gray-800 font-semibold text-sm sm:text-base">
            DE LA REVUE HAÏTIENNE DE CHIRURGIE ET D'ANESTHÉSIOLOGIE ET DE L'INFO GAZETTE MÉDICALE D'INFOCHIR/RHCA
          </DialogDescription>
          <div className="text-center text-gray-600 mt-1 text-sm">Mai 2025</div>
        </DialogHeader>
        
        <div className="mt-4 space-y-4 text-gray-700 text-sm sm:text-base">
          <p className="leading-relaxed">
            En l'année 2025, la situation d'insécurité en Haïti prend de plus en plus d'ampleur et la population est grandement affectée. L'aire métropolitaine et d'autres régions du pays subissent les assauts répétés de bandes armées. La désolation, la disparition brutale d'institutions publiques et privées de renom, l'exode massive interne des habitants chassés de leur logis vandalisés ou détruits, l'aggravation des carences nutritionnelles, les maladies infectieuses, les traumatismes par balle, le stress chronique sont le lot quotidien de toute la population qui ne sait à quel saint se vouer.
          </p>
          <p className="leading-relaxed">
            Comme des millions de concitoyens, les membres d'INFOCHIR/RHCA n'en sont pas épargnés. Leurs vies et leurs biens sont aussi menacés. Les rafales continuelles d'armes automatiques chassent certains de leurs maisons qu'ils ne retrouveront peut-être plus ; d'autres craignent, perplexes, que leur tour n'arrive ; d'autres encore redoutent une fin tragique…
          </p>
          <p className="leading-relaxed">
            Cette incertitude grandissante et cette lutte quotidienne pour la survie sont débilitantes. Elles sont assez ankylosantes et favorisent peu l'opérationnalisation de notre plateforme. Toutefois, en dépit de ce contexte délétère, l'équipe, dans un instinct de survie, entend maintenir ses publications tant et aussi longtemps qu'elle le pourra.
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
          <Button onClick={handleClose} className="w-full h-10 sm:h-9">
            Continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
