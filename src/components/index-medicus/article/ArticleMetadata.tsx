
import { Calendar, User, Eye, Quote, FileText, Share2, BookOpen, Stethoscope } from "lucide-react";

interface ArticleMetadataProps {
  authors: string[];
  date: string;
  views?: number;
  citations?: number;
  downloads?: number;
  shares?: number;
  volume?: string;
  issue?: string;
  pageNumber?: string;
  specialty?: string;
}

export const ArticleMetadata = ({ 
  authors, 
  date, 
  views, 
  citations,
  downloads,
  shares,
  volume,
  issue,
  pageNumber,
  specialty
}: ArticleMetadataProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
      {authors.length > 0 && (
        <>
          <User className="h-4 w-4" />
          <span className="truncate max-w-[200px]">
            {authors.join(", ")}
          </span>
        </>
      )}
      
      <span className="mx-2">•</span>
      <Calendar className="h-4 w-4" />
      {new Date(date).toLocaleDateString()}
      
      {specialty && (
        <>
          <span className="mx-2">•</span>
          <Stethoscope className="h-4 w-4" />
          {specialty}
        </>
      )}
      
      {volume && issue && (
        <>
          <span className="mx-2">•</span>
          <BookOpen className="h-4 w-4" />
          Volume {volume}, Issue {issue}
        </>
      )}
      
      {pageNumber && (
        <>
          <span className="mx-2">•</span>
          <FileText className="h-4 w-4" />
          Page {pageNumber}
        </>
      )}
      
      {views !== undefined && (
        <>
          <span className="mx-2">•</span>
          <Eye className="h-4 w-4" />
          {views.toLocaleString()} vues
        </>
      )}
      
      {citations !== undefined && (
        <>
          <span className="mx-2">•</span>
          <Quote className="h-4 w-4" />
          {citations.toLocaleString()} citations
        </>
      )}
      
      {downloads !== undefined && (
        <>
          <span className="mx-2">•</span>
          <FileText className="h-4 w-4" />
          {downloads.toLocaleString()} téléchargements
        </>
      )}
      
      {shares !== undefined && (
        <>
          <span className="mx-2">•</span>
          <Share2 className="h-4 w-4" />
          {shares.toLocaleString()} partages
        </>
      )}
    </div>
  );
};
