import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  return (
    <div className="bg-white/95 backdrop-blur-xs rounded-xl p-4 border border-gray-100 mb-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher par titre, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
          <SelectTrigger>
            <SelectValue placeholder="Spécialité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les spécialités</SelectItem>
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