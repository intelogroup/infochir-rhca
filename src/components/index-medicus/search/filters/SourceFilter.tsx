
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SourceFilterProps {
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  sources: string[];
  sourceStats: Record<string, number>;
  disabled?: boolean;
}

export const SourceFilter: React.FC<SourceFilterProps> = ({
  selectedSource,
  setSelectedSource,
  sources,
  sourceStats,
  disabled = false
}) => {
  if (disabled) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <label htmlFor="source-filter" className="text-sm font-medium">
        Source
      </label>
      <Select
        value={selectedSource}
        onValueChange={setSelectedSource}
        disabled={disabled}
      >
        <SelectTrigger id="source-filter">
          <SelectValue placeholder="Toutes les sources" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="">Toutes les sources</SelectItem>
            {sources.map(source => (
              <SelectItem key={source} value={source}>
                {source} ({sourceStats[source] || 0})
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
