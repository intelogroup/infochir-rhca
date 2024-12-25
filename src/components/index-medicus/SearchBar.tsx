import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onSearch: () => void;
  categories: string[];
  sources: string[];
}

export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedSource,
  setSelectedSource,
  date,
  setDate,
  onSearch,
  categories,
  sources,
}: SearchBarProps) => {
  // Validate required props
  if (!Array.isArray(categories) || !Array.isArray(sources)) {
    console.error("Categories and sources must be arrays");
    toast.error("Une erreur est survenue lors du chargement des options de recherche");
    return null;
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSearchTerm(e.target.value);
    } catch (error) {
      console.error("Error updating search term:", error);
      toast.error("Une erreur est survenue lors de la saisie");
    }
  };

  const handleCategoryChange = (value: string) => {
    try {
      setSelectedCategory(value);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Une erreur est survenue lors de la sélection de la catégorie");
    }
  };

  const handleSourceChange = (value: string) => {
    try {
      setSelectedSource(value);
    } catch (error) {
      console.error("Error updating source:", error);
      toast.error("Une erreur est survenue lors de la sélection de la source");
    }
  };

  const handleSearch = () => {
    try {
      onSearch();
    } catch (error) {
      console.error("Error performing search:", error);
      toast.error("Une erreur est survenue lors de la recherche");
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xs rounded-xl p-6 border border-gray-100">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher par titre, auteur..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
            aria-label="Rechercher des articles"
          />
        </div>

        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
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

        <Select onValueChange={handleSourceChange} value={selectedSource}>
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

        <DatePickerWithRange date={date} setDate={setDate} />

        <div className="lg:col-span-4">
          <Button 
            onClick={handleSearch} 
            className="w-full gap-2"
            aria-label="Lancer la recherche"
          >
            <Search className="h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </div>
    </div>
  );
};