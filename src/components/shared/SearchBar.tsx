
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { trackSearch } from "@/lib/analytics/track";
import { debounce } from "lodash";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  category?: string;
}

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Rechercher...", 
  className = "",
  disabled = false,
  category
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);
  
  // Track search with debounce
  const debouncedTrackSearch = debounce((query: string) => {
    if (query.trim().length > 2) {
      trackSearch(query, category);
    }
  }, 1000);
  
  // When input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    // Track search if query is meaningful
    debouncedTrackSearch(newValue);
  };
  
  // Sync with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedTrackSearch.cancel();
    };
  }, [debouncedTrackSearch]);

  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="pl-10 bg-white/50"
        disabled={disabled}
      />
    </div>
  );
};
