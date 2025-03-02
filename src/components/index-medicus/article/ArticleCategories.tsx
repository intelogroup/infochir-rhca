
import { Badge } from "@/components/ui/badge";
import { BookOpen, LayoutGrid } from "lucide-react";

interface ArticleCategoriesProps {
  source: string;
  category: string;
}

export const ArticleCategories = ({ source, category }: ArticleCategoriesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex items-center gap-1.5 transition-transform hover:scale-105">
        <BookOpen className="h-3.5 w-3.5 text-primary/90" />
        <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          {source}
        </Badge>
      </div>
      <div className="flex items-center gap-1.5 transition-transform hover:scale-105">
        <LayoutGrid className="h-3.5 w-3.5 text-secondary/90" />
        <Badge variant="outline" className="text-secondary-dark text-xs font-medium border-secondary/20 hover:bg-secondary/5 transition-colors">
          {category}
        </Badge>
      </div>
    </div>
  );
};
