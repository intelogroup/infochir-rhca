
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onSelectTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ 
  availableTags,
  selectedTags,
  onSelectTag,
  onRemoveTag
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <Select
          value=""
          onValueChange={tag => {
            if (!selectedTags.includes(tag)) {
              onSelectTag(tag);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner des tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {availableTags
                .filter(tag => !selectedTags.includes(tag))
                .map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="px-2 py-1">
              {tag}
              <button
                onClick={() => onRemoveTag(tag)}
                className="ml-1 rounded-full hover:bg-gray-300/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
