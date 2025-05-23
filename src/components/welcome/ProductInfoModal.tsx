
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const ProductInfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Check if current page is a product page
  const isProductPage = ['/rhca', '/igm', '/atlas', '/index-medicus'].some(
    path => location.pathname.startsWith(path)
  );

  useEffect(() => {
    // Only show on product pages after user has navigated there, not on initial load
    if (!isProductPage) return;
    
    // Use a different key for this modal
    const storageKey = `hasSeenProductInfo_${location.pathname.split('/')[1]}`;
    const hasSeenInfo = localStorage.getItem(storageKey);

    // Don't show on initial page load - check if this was a navigation
    const isInitialLoad = sessionStorage.getItem('appInitialized') !== 'true';
    if (isInitialLoad) {
      sessionStorage.setItem('appInitialized', 'true');
      return;
    }

    if (!hasSeenInfo) {
      // Show the product info dialog after the page has fully loaded
      const timer = setTimeout(() => {
        // Only show modal if page is completely loaded
        if (document.readyState === 'complete') {
          setIsOpen(true);
        } else {
          // If page isn't loaded yet, wait for load event
          window.addEventListener('load', () => setIsOpen(true), { once: true });
        }
      }, 2500); // Increased delay to prioritize content loading

      return () => clearTimeout(timer);
    }
  }, [location.pathname, isProductPage]);

  const handleClose = () => {
    // Mark that the user has seen this specific product info
    const storageKey = `hasSeenProductInfo_${location.pathname.split('/')[1]}`;
    localStorage.setItem(storageKey, "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-bold text-primary">
            Bienvenue sur Infochir-RHCA
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Votre Espace Scientifique En Ligne
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4 text-gray-700">
          <p className="leading-relaxed">
            Chères visiteuses, chers visiteurs, INFOCHIR/RHCA vous salue très cordialement et vous annonce le changement de présentation de notre site web.
          </p>
          <p className="leading-relaxed">
            Cette modification s'inscrit dans notre souci de vous offrir une plateforme plus conviviale, plus fonctionnelle et plus riche.
          </p>
          <p className="leading-relaxed">
            Nous travaillons pour remettre toutes nos publications à votre disposition depuis 2011 et nous nous excusons du délai imparti à ce transfert de données.
          </p>
          <p className="leading-relaxed">
            Espérant que vous apprécierez notre travail...
          </p>
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
