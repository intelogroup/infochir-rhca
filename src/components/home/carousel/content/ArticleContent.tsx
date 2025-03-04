
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
    </div>
  );
};
