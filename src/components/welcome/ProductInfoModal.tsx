
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink, FileText, Info } from "lucide-react";

export const ProductInfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user has seen the modal before
    const hasSeenProductInfo = localStorage.getItem("hasSeenProductInfo");
    
    // Only show after welcome modal and if not seen before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    
    if (hasSeenWelcome === "true" && !hasSeenProductInfo) {
      // Short delay showing this modal if welcome modal was just shown
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenProductInfo", "true");
  };
  
  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Découvrez nos publications
          </DialogTitle>
          <DialogDescription>
            Explorez nos différentes publications scientifiques et ressources disponibles.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="rhca" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="rhca">RHCA</TabsTrigger>
            <TabsTrigger value="igm">IGM</TabsTrigger>
            <TabsTrigger value="adc">ADC</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rhca" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Revue Haïtienne de Chirurgie et d'Anesthésiologie</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Publication trimestrielle dédiée aux avancées en chirurgie et anesthésiologie.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-primary/5">Chirurgie</Badge>
                  <Badge variant="outline" className="bg-primary/5">Anesthésiologie</Badge>
                  <Badge variant="outline" className="bg-primary/5">Recherche</Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleNavigate('/rhca')}
              className="w-full flex items-center gap-2"
            >
              Accéder à la RHCA
              <ExternalLink className="h-4 w-4" />
            </Button>
          </TabsContent>
          
          <TabsContent value="igm" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <FileText className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Info Gynéco Magazine</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Magazine spécialisé en gynécologie, obstétrique et santé des femmes.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-secondary/5">Gynécologie</Badge>
                  <Badge variant="outline" className="bg-secondary/5">Obstétrique</Badge>
                  <Badge variant="outline" className="bg-secondary/5">Santé féminine</Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleNavigate('/igm')}
              className="w-full flex items-center gap-2"
              variant="secondary"
            >
              Accéder à l'IGM
              <ExternalLink className="h-4 w-4" />
            </Button>
          </TabsContent>
          
          <TabsContent value="adc" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <FileText className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Atlas de Chirurgie</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Collection d'illustrations et de guides pratiques pour les procédures chirurgicales.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-destructive/5">Anatomie</Badge>
                  <Badge variant="outline" className="bg-destructive/5">Techniques</Badge>
                  <Badge variant="outline" className="bg-destructive/5">Guides pratiques</Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleNavigate('/adc')}
              className="w-full flex items-center gap-2"
              variant="destructive"
            >
              Accéder à l'ADC
              <ExternalLink className="h-4 w-4" />
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted/50 p-3 rounded-lg mt-4">
          <h4 className="font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            Accès unifié via Index Medicus
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Vous pouvez également accéder à toutes nos publications via notre Index Medicus centralisé.
          </p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="sm:mr-auto"
          >
            Fermer
          </Button>
          <Button 
            onClick={() => handleNavigate('/index-medicus')}
            className="gap-2"
          >
            Accéder à l'Index Medicus
            <ExternalLink className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
