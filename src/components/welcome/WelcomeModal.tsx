
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    
    // Only show the modal if the user hasn't seen it before
    if (!hasSeenWelcome) {
      // Short delay before showing the modal
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleClose = () => {
    // Mark that the user has seen the welcome modal
    localStorage.setItem("hasSeenWelcome", "true");
    setIsOpen(false);
  };
  
  const handleExplore = () => {
    // Mark that the user has seen the welcome modal
    localStorage.setItem("hasSeenWelcome", "true");
    setIsOpen(false);
    
    // Navigate to the about page
    navigate("/about");
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Bienvenue sur InfoChir
              </DialogTitle>
              <DialogDescription className="text-center">
                Découvrez notre plateforme dédiée aux professionnels de santé en Haïti.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <motion.img
                  src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
                  alt="InfoChir Logo"
                  className="h-24 w-24 object-contain"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <p className="text-center text-muted-foreground">
                InfoChir est votre portail d'accès aux publications scientifiques
                et ressources médicales pour les professionnels de santé en Haïti.
              </p>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="sm:w-auto w-full"
              >
                Fermer
              </Button>
              <Button
                onClick={handleExplore}
                className="sm:w-auto w-full group"
              >
                Explorer
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </DialogFooter>
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
