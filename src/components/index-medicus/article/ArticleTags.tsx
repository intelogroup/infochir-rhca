
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
      <Tag className="h-4 w-4 text-primary" />
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTags.includes(tag) ? "default" : "secondary"}
          className={`
            cursor-pointer transition-all duration-200 font-medium text-xs px-2.5 py-0.5
            ${selectedTags.includes(tag) 
              ? 'bg-primary text-white hover:bg-primary-light scale-105 shadow-sm' 
              : 'bg-secondary/10 text-secondary-dark hover:bg-secondary/20'}
          `}
          onClick={() => onTagClick?.(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};
