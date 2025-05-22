
import React from "react";
import { Input } from "@/components/ui/input";

interface TitleFilterProps {
  titleFilter: string;
  setTitleFilter: (value: string) => void;
}

export const TitleFilter: React.FC<TitleFilterProps> = ({
  titleFilter,
  setTitleFilter
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="title-filter" className="text-sm font-medium">
        Titre
      </label>
      <Input
        id="title-filter"
        value={titleFilter}
        onChange={e => setTitleFilter(e.target.value)}
        placeholder="Filtrer par titre..."
        className="w-full"
      />
    </div>
  );
};
