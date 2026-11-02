
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories: string[];
  categoryStats: Record<string, number>;
}

// Radix Select forbids an empty-string item value; "" stays the app's
// "all categories" state and is mapped to this sentinel at the Select edge.
const ALL_VALUE = "__all__";

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  categoryStats
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="category-filter" className="text-sm font-medium">
        Catégorie
      </label>
      <Select
        value={selectedCategory || ALL_VALUE}
        onValueChange={(value) => setSelectedCategory(value === ALL_VALUE ? "" : value)}
      >
        <SelectTrigger id="category-filter">
          <SelectValue placeholder="Toutes les catégories" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={ALL_VALUE}>Toutes les catégories</SelectItem>
            {categories.filter(category => category !== "").map(category => (
              <SelectItem key={category} value={category}>
                {category} ({categoryStats[category] || 0})
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
