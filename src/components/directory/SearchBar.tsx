
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        placeholder="Rechercher un membre..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-white border-gray-200 focus:border-primary/50 focus:ring-primary/50 transition-colors focus:shadow-sm"
      />
    </div>
  );
};
