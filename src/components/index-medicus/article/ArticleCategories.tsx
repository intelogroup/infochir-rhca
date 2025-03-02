
import { Badge } from "@/components/ui/badge";
import { BookOpen, LayoutGrid } from "lucide-react";

interface ArticleCategoriesProps {
  source: string;
  category: string;
}

export const ArticleCategories = ({ source, category }: ArticleCategoriesProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-1.5">
        <BookOpen className="h-3.5 w-3.5 text-primary/70" />
        <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5 bg-secondary/20 text-secondary-dark">
          {source}
        </Badge>
      </div>
      <div className="flex items-center gap-1.5">
        <LayoutGrid className="h-3.5 w-3.5 text-gray-500" />
        <Badge variant="outline" className="text-gray-600 text-xs font-medium border-gray-300">
          {category}
        </Badge>
      </div>
    </div>
  );
};
