
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

interface AuthorFilterProps {
  selectedAuthors: string[];
  setSelectedAuthors: (authors: string[]) => void;
  availableAuthors: string[];
}

export const AuthorFilter: React.FC<AuthorFilterProps> = ({
  selectedAuthors,
  setSelectedAuthors,
  availableAuthors
}) => {
  const clearAuthor = (author: string) => {
    setSelectedAuthors(selectedAuthors.filter(a => a !== author));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">Auteurs</label>
        <Select
          value=""
          onValueChange={author => {
            if (!selectedAuthors.includes(author)) {
              setSelectedAuthors([...selectedAuthors, author]);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner des auteurs" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {availableAuthors.map(author => (
                <SelectItem key={author} value={author}>
                  {author}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {selectedAuthors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedAuthors.map(author => (
            <Badge key={author} variant="secondary" className="px-2 py-1">
              {author}
              <button
                onClick={() => clearAuthor(author)}
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
