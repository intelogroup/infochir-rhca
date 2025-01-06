import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export const TagSelector = ({ availableTags, selectedTags, onTagToggle }: TagSelectorProps) => {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Mots-clés</p>
      <ScrollArea className="h-[100px] w-full rounded-md border p-4">
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};