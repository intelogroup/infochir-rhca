import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type { Highlight } from "./carouselData";
import { useState } from "react";
import { Eye, Quote, X, Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CarouselCardProps {
  highlight: Highlight;
  index: number;
}

export const CarouselCard = ({ highlight, index }: CarouselCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderContent = () => {
    const category = (highlight.category || '').toLowerCase();
    
    switch (category) {
      case 'événement':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Détails de l'événement</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <h4 className="font-medium">Horaire</h4>
                  <p className="text-sm text-gray-600">
                    {highlight.date} - Durée estimée: 2 heures
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <h4 className="font-medium">Lieu</h4>
                  <p className="text-sm text-gray-600">
                    Centre de Conférences Médical<br />
                    123 Avenue de la Médecine, Paris
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <h4 className="font-medium">Participants</h4>
                  <p className="text-sm text-gray-600">
                    Limité à 150 participants<br />
                    Ouvert aux professionnels de santé
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Programme</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Accueil et introduction</li>
                <li>Présentations principales</li>
                <li>Sessions interactives</li>
                <li>Networking et conclusion</li>
              </ul>
            </div>
          </div>
        );

      case 'formation':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Users className="h-5 w-5" />
              <span className="font-medium">Détails de la formation</span>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Objectifs pédagogiques</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                  <li>Maîtriser les techniques avancées</li>
                  <li>Développer des compétences pratiques</li>
                  <li>Comprendre les applications cliniques</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Public cible</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Chirurgiens expérimentés souhaitant approfondir leurs compétences
                </p>
              </div>
              <div>
                <h4 className="font-medium">Prérequis</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Minimum 3 ans d'expérience en chirurgie
                </p>
              </div>
              <div>
                <h4 className="font-medium">Modalités</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                  <li>12 heures de formation</li>
                  <li>Groupes de 10 participants maximum</li>
                  <li>Exercices pratiques sur simulateur</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary/60" />
                <span>{highlight.views} vues</span>
              </div>
              <div className="flex items-center gap-2">
                <Quote className="h-4 w-4 text-primary/60" />
                <span>{highlight.citations} citations</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Points clés</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Impact significatif dans le domaine</li>
                <li>Nouvelles perspectives de recherche</li>
                <li>Applications pratiques innovantes</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Conclusion</h4>
              <p className="text-sm text-gray-600">
                Cette étude apporte une contribution significative à notre compréhension 
                du sujet et ouvre la voie à de nouvelles recherches dans le domaine.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="p-2 h-full"
      >
        <div 
          className="relative group h-full rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.img
              src={highlight.image}
              alt={highlight.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">
              {highlight.category || 'Article'}
            </Badge>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {highlight.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {highlight.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              {highlight.date && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {highlight.date}
                </span>
              )}
              {highlight.author && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {highlight.author}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[80vh] overflow-y-auto">
          <div className="relative">
            <Button
              variant="ghost"
              size="default"
              className="absolute right-0 top-0 z-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="space-y-6">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">
                  {highlight.category || 'Article'}
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {highlight.title}
                </h2>
                <p className="text-gray-600">
                  {highlight.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 border-y border-gray-100 py-4">
                {highlight.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {highlight.date}
                  </span>
                )}
                {highlight.author && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {highlight.author}
                  </span>
                )}
              </div>

              {renderContent()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
