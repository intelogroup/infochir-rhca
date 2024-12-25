import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterSelectsProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  categories: string[];
  sources: string[];
}

export const FilterSelects = ({
  selectedCategory,
  setSelectedCategory,
  selectedSource,
  setSelectedSource,
  categories,
  sources,
}: FilterSelectsProps) => {
  return (
    <>
      <Select onValueChange={setSelectedCategory} value={selectedCategory}>
        <SelectTrigger aria-label="Sélectionner une catégorie">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={setSelectedSource} value={selectedSource}>
        <SelectTrigger aria-label="Sélectionner une source">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          {sources.map((source) => (
            <SelectItem key={source} value={source}>
              {source}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};