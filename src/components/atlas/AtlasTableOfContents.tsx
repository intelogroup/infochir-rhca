
import { useState } from "react";
import { useAtlasArticles } from "./hooks/useAtlasArticles";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, FileText, Users } from "lucide-react";

export const AtlasTableOfContents = () => {
  const { data: chapters, isLoading } = useAtlasArticles();
  
  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }
  
  if (!chapters || chapters.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-gray-500">Aucun chapitre disponible</p>
      </div>
    );
  }

  // Group chapters by category and sort by chapter number
  const chaptersByCategory = chapters.reduce((acc, chapter) => {
    const category = chapter.category || 'Autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(chapter);
    return acc;
  }, {} as Record<string, typeof chapters>);

  // Sort chapters within each category by chapter number
  Object.keys(chaptersByCategory).forEach(category => {
    chaptersByCategory[category].sort((a, b) => {
      const aNum = a.chapterNumber || 999;
      const bNum = b.chapterNumber || 999;
      return aNum - bNum;
    });
  });

  const categories = Object.keys(chaptersByCategory).sort();

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="w-3 h-3 text-green-600" />;
      case 'coming-soon':
      case 'coming':
        return <Clock className="w-3 h-3 text-yellow-600" />;
      default:
        return <AlertCircle className="w-3 h-3 text-red-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Disponible</Badge>;
      case 'coming-soon':
      case 'coming':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Bientôt</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 hover:bg-red-100">Indisponible</Badge>;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-blue-900">Atlas des Décisions Cliniques</h4>
        </div>
        <p className="text-xs text-blue-700">
          {chapters.length} chapitre{chapters.length > 1 ? 's' : ''} • {categories.length} catégorie{categories.length > 1 ? 's' : ''}
        </p>
      </div>

      <Accordion type="multiple" className="w-full">
        {categories.map((category, categoryIndex) => {
          const categoryChapters = chaptersByCategory[category];
          const availableCount = categoryChapters.filter(ch => ch.status === 'available').length;
          
          return (
            <AccordionItem key={category} value={category} className="border-b border-gray-200">
              <AccordionTrigger className="text-sm font-medium hover:text-secondary py-3 px-2 hover:bg-gray-50 rounded transition-colors">
                <div className="flex items-center justify-between w-full mr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {String.fromCharCode(65 + categoryIndex)}
                    </span>
                    <span>{category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {availableCount}/{categoryChapters.length}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <ul className="space-y-1 pl-2">
                  {categoryChapters.map((chapter) => (
                    <li key={chapter.id} className="group">
                      <div className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs font-mono text-gray-400 flex-shrink-0 w-8">
                            {chapter.chapterNumber ? `${chapter.chapterNumber}.` : '—'}
                          </span>
                          {getStatusIcon(chapter.status)}
                          <Link 
                            to={`/adc/chapters/${chapter.id}`}
                            className="text-sm text-gray-700 hover:text-secondary transition-colors flex-1 min-w-0 truncate group-hover:text-secondary"
                            title={chapter.title}
                          >
                            {chapter.title}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusBadge(chapter.status)}
                        </div>
                      </div>
                      
                      {/* Optional metadata row */}
                      {(chapter.authors || chapter.author) && (
                        <div className="ml-12 pb-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            <span>{chapter.authors?.join(', ') || chapter.author}</span>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h5 className="text-xs font-medium text-gray-700 mb-2">Légende</h5>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span className="text-gray-600">Chapitre disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-yellow-600" />
            <span className="text-gray-600">En préparation</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span className="text-gray-600">Non disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasTableOfContents;
