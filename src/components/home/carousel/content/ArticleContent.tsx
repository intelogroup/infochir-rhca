import { Eye, Quote } from "lucide-react";

interface ArticleContentProps {
  views?: number;
  citations?: number;
}

export const ArticleContent = ({ views = 0, citations = 0 }: ArticleContentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary/60" />
          <span>{views} vues</span>
        </div>
        <div className="flex items-center gap-2">
          <Quote className="h-4 w-4 text-primary/60" />
          <span>{citations} citations</span>
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
};