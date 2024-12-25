import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface DiagnosticSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (value: string) => void;
  specialties: string[];
}

export const DiagnosticSearch = ({
  searchTerm,
  setSearchTerm,
  selectedSpecialty,
  setSelectedSpecialty,
  specialties,
}: DiagnosticSearchProps) => {
  // Validate specialties prop
  if (!Array.isArray(specialties)) {
    console.error("Specialties prop must be an array");
    toast.error("Une erreur est survenue lors du chargement des spécialités");
    return null;
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSearchTerm(e.target.value);
    } catch (error) {
      console.error("Error updating search term:", error);
      toast.error("Une erreur est survenue lors de la recherche");
    }
  };

  const handleSpecialtyChange = (value: string) => {
    try {
      setSelectedSpecialty(value);
    } catch (error) {
      console.error("Error updating specialty:", error);
      toast.error("Une erreur est survenue lors de la sélection de la spécialité");
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xs rounded-xl p-4 border border-gray-100 mb-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher par titre, description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
            aria-label="Rechercher des diagnostics"
          />
        </div>

        <Select 
          value={selectedSpecialty} 
          onValueChange={handleSpecialtyChange}
          defaultValue="all"
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Spécialité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les spécialités</SelectItem>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};