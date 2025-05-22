
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
        value={selectedCategory}
        onValueChange={setSelectedCategory}
      >
        <SelectTrigger id="category-filter">
          <SelectValue placeholder="Toutes les catégories" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="">Toutes les catégories</SelectItem>
            {categories.map(category => (
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
