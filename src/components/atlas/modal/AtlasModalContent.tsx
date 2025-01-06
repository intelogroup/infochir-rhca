import { Book, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AtlasChapter } from "../types";

interface AtlasModalContentProps {
  chapter: AtlasChapter;
}

export const AtlasModalContent = ({ chapter }: AtlasModalContentProps) => {
  return (
    <>
      {chapter.description && (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Info className="h-5 w-5" />
              <h3 className="text-lg font-semibold">À propos de ce chapitre</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {chapter.description}
            </p>
          </div>
          <Separator />
        </>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Book className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Contenu du chapitre</h3>
        </div>
        <p className="text-gray-600">
          Ce chapitre fait partie de l'Atlas de Diagnostic Chirurgical, 
          un guide complet conçu pour les professionnels de santé. 
          Il contient des informations détaillées, des illustrations et 
          des protocoles cliniques.
        </p>
      </div>
    </>
  );
};