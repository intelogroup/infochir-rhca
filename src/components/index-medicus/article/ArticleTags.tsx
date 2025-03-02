
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface ArticleTagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleTags = ({ tags, onTagClick, selectedTags = [] }: ArticleTagsProps) => {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
      <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-ocean flex-shrink-0" />
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTags.includes(tag) ? "default" : "secondary"}
          className={`
            cursor-pointer transition-all duration-200 font-medium text-xs px-2 py-0.5 sm:px-2.5 sm:py-0.5
            ${selectedTags.includes(tag) 
              ? 'bg-ocean text-white hover:bg-ocean-hover scale-105 shadow-sm' 
              : 'bg-ocean/10 text-ocean-dark hover:bg-ocean/20'}
            hover:shadow-md hover:scale-105 truncate max-w-[150px] sm:max-w-full
          `}
          onClick={() => onTagClick?.(tag)}
          title={tag}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};
