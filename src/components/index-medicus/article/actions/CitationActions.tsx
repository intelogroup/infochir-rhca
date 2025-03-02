
import React from "react";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CitationActionsProps {
  onCitation: (format: "APA" | "MLA" | "Chicago" | "Harvard") => void;
}

export const CitationActions: React.FC<CitationActionsProps> = ({ onCitation }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Quote className="h-4 w-4" />
          Citer
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onCitation("APA")}>
          Format APA
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCitation("MLA")}>
          Format MLA
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCitation("Chicago")}>
          Format Chicago
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCitation("Harvard")}>
          Format Harvard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
