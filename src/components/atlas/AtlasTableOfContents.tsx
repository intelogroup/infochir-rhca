
import { useState } from "react";
import { useAtlasArticles } from "./hooks/useAtlasArticles";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";

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

  // Sort chapters by issue/chapter number
  const sortedChapters = [...chapters].sort((a, b) => {
    const aNum = a.chapterNumber || parseInt(a.pageNumber || '999', 10) || 999;
    const bNum = b.chapterNumber || parseInt(b.pageNumber || '999', 10) || 999;
    return aNum - bNum;
  });

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
        return <Badge variant="success" className="text-xs">Disponible</Badge>;
      case 'coming-soon':
      case 'coming':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Bientôt</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 hover:bg-red-100">Indisponible</Badge>;
    }
  };

  const formatTitle = (title: string, issueNumber?: number) => {
    // Check if title already includes "Atlas de Diagnostic Chirurgicale (ADC)"
    if (title.includes("Atlas de Diagnostic Chirurgicale")) {
      return title;
    }
    
    // Add the full ADC prefix if not present
    const chapterName = title;
    return `Atlas de Diagnostic Chirurgicale (ADC) - ${chapterName}`;
  };

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-blue-900">Atlas des Décisions Cliniques</h4>
        </div>
        <p className="text-xs text-blue-700">
          {chapters.length} chapitre{chapters.length > 1 ? 's' : ''} disponible{chapters.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="w-full">
        <ul className="space-y-1">
          {sortedChapters.map((chapter) => (
            <li key={chapter.id} className="group">
              <div className="flex items-start gap-3 py-3 px-3 rounded-md hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded min-w-[2rem] text-center">
                    {chapter.chapterNumber !== undefined ? chapter.chapterNumber : 
                     chapter.pageNumber ? parseInt(chapter.pageNumber, 10) : '—'}
                  </span>
                  {getStatusIcon(chapter.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/adc/chapters/${chapter.id}`}
                    className="block group-hover:text-secondary transition-colors"
                  >
                    <h5 className="text-sm font-medium text-gray-900 group-hover:text-secondary mb-1 leading-tight">
                      {formatTitle(chapter.title, chapter.chapterNumber)}
                    </h5>
                  </Link>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(chapter.status)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
