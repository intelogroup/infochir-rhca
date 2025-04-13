
import { useState } from "react";
import { useAtlasArticles } from "./hooks/useAtlasArticles";
import { Button } from "@/components/ui/button";
import { TableProperties, ChevronRight, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

export const AtlasTableOfContents = () => {
  const { data: chapters } = useAtlasArticles();
  
  if (!chapters || chapters.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-gray-500">Aucun chapitre disponible</p>
      </div>
    );
  }

  // Group chapters by category
  const chaptersByCategory = chapters.reduce((acc, chapter) => {
    const category = chapter.category || 'Autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(chapter);
    return acc;
  }, {} as Record<string, typeof chapters>);

  const categories = Object.keys(chaptersByCategory).sort();

  return (
    <div className="w-full">
      <Accordion type="multiple" className="w-full">
        {categories.map((category) => (
          <AccordionItem key={category} value={category} className="border-b">
            <AccordionTrigger className="text-sm font-medium hover:text-secondary">
              {category}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 pl-2">
                {chaptersByCategory[category].map((chapter) => (
                  <li key={chapter.id} className="text-sm">
                    <Link 
                      to={`/adc/chapters/${chapter.id}`}
                      className="block py-1 px-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      {chapter.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AtlasTableOfContents;
