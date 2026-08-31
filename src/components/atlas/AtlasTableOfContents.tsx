
import { useState } from "react";
import { useAtlasArticles } from "./hooks/useAtlasArticles";
import type { AtlasChapter } from "./types";
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
        <p className="text-sm text-muted-foreground">Aucun chapitre disponible</p>
      </div>
    );
  }

  // Sort chapters: Introduction first, then by chapter/issue number
  const getOrder = (chapter: AtlasChapter) => {
    if (chapter.title?.toLowerCase().includes('introduction')) return 0;
    const fromIssue = chapter.issue ? parseInt(chapter.issue, 10) : NaN;
    if (!isNaN(fromIssue)) return fromIssue;
    if (chapter.chapterNumber) return chapter.chapterNumber;
    const fromPage = parseInt(chapter.pageNumber || '', 10);
    return isNaN(fromPage) ? 999 : fromPage;
  };
  const sortedChapters = [...chapters].sort((a, b) => getOrder(a) - getOrder(b));

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="w-3 h-3 text-green-600" />;
      case 'coming-soon':
      case 'coming':
        return <Clock className="w-3 h-3 text-yellow-600" />;
      default:
        return <AlertCircle className="w-3 h-3 text-destructive" />;
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
    // Check if title already includes "Atlas de Diagnostic Chirurgical (ADC)"
    if (title.includes("Atlas de Diagnostic Chirurgical")) {
      return title;
    }
    
    // Add the full ADC prefix if not present
    const chapterName = title;
    return `Atlas de Diagnostic Chirurgical (ADC) - ${chapterName}`;
  };

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-muted border border-border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-medium text-blue-900">Atlas des Décisions Cliniques</h4>
        </div>
        <p className="text-xs text-primary">
          {chapters.length} chapitre{chapters.length > 1 ? 's' : ''} au total · {chapters.filter(c => c.status === 'available').length} disponible{chapters.filter(c => c.status === 'available').length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="w-full">
        <ul className="space-y-1">
          {sortedChapters.map((chapter) => (
            <li key={chapter.id} className="group">
              <div className="flex items-start gap-3 py-3 px-3 rounded-md hover:bg-muted transition-colors border-b border-border last:border-b-0">
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  {getStatusIcon(chapter.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/adc/chapters/${chapter.id}`}
                    className="block group-hover:text-secondary transition-colors"
                  >
                    <h5 className="text-sm font-medium text-foreground group-hover:text-secondary mb-1 leading-tight">
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
      <div className="mt-4 p-3 bg-muted border border-border rounded-lg">
        <h5 className="text-xs font-medium text-foreground/80 mb-2">Légende</h5>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span className="text-muted-foreground">Chapitre disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-yellow-600" />
            <span className="text-muted-foreground">En préparation</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-destructive" />
            <span className="text-muted-foreground">Non disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasTableOfContents;
