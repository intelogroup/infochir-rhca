
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onSelectTag: (tag: string) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  availableTags,
  selectedTags,
  onSelectTag
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);
    onSelectTag(currentValue);
  };

  // Filter out already selected tags
  const availableUnselectedTags = availableTags.filter(
    (tag) => !selectedTags.includes(tag)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value : "Sélectionner des tags..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher un tag..." />
          <CommandEmpty>Aucun tag trouvé.</CommandEmpty>
          <CommandGroup>
            {availableUnselectedTags.map((tag) => (
              <CommandItem
                key={tag}
                value={tag}
                onSelect={() => handleSelect(tag)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === tag ? "opacity-100" : "opacity-0"
                  )}
                />
                {tag}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
