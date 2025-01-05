import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface ArticleTagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleTags = ({ tags, onTagClick, selectedTags = [] }: ArticleTagsProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Tag className="h-4 w-4 text-gray-400" />
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTags.includes(tag) ? "default" : "secondary"}
          className={`
            cursor-pointer hover:bg-primary/10 transition-colors
            ${selectedTags.includes(tag) ? 'bg-primary/20' : 'bg-primary/5'}
          `}
          onClick={() => onTagClick?.(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};