import { Calendar, User, Eye, Quote } from "lucide-react";

interface ArticleMetadataProps {
  authors: string[];
  date: string;
  views?: number;
  citations?: number;
}

export const ArticleMetadata = ({ authors, date, views, citations }: ArticleMetadataProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
      <User className="h-4 w-4" />
      {authors.join(", ")}
      <span className="mx-2">•</span>
      <Calendar className="h-4 w-4" />
      {new Date(date).toLocaleDateString()}
      {views && (
        <>
          <span className="mx-2">•</span>
          <Eye className="h-4 w-4" />
          {views} vues
        </>
      )}
      {citations && (
        <>
          <span className="mx-2">•</span>
          <Quote className="h-4 w-4" />
          {citations} citations
        </>
      )}
    </div>
  );
};