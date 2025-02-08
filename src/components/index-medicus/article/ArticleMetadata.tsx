
import { Calendar, User, Eye, Quote, FileText, Share2, BookOpen } from "lucide-react";

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
  pageNumber
}: ArticleMetadataProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
      <User className="h-4 w-4" />
      {authors.join(", ")}
      
      <span className="mx-2">•</span>
      <Calendar className="h-4 w-4" />
      {new Date(date).toLocaleDateString()}
      
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
          {views} vues
        </>
      )}
      
      {citations !== undefined && (
        <>
          <span className="mx-2">•</span>
          <Quote className="h-4 w-4" />
          {citations} citations
        </>
      )}
      
      {downloads !== undefined && (
        <>
          <span className="mx-2">•</span>
          <FileText className="h-4 w-4" />
          {downloads} téléchargements
        </>
      )}
      
      {shares !== undefined && (
        <>
          <span className="mx-2">•</span>
          <Share2 className="h-4 w-4" />
          {shares} partages
        </>
      )}
    </div>
  );
};
