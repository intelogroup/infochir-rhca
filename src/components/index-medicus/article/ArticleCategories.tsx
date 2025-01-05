import { Badge } from "@/components/ui/badge";

interface ArticleCategoriesProps {
  source: string;
  category: string;
}

export const ArticleCategories = ({ source, category }: ArticleCategoriesProps) => {
  return (
    <div className="flex gap-2">
      <Badge variant="secondary" className="font-semibold">
        {source}
      </Badge>
      <Badge variant="outline" className="text-gray-600">
        {category}
      </Badge>
    </div>
  );
};