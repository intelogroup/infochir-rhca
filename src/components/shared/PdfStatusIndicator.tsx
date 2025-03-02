
import { FileCheck, FileX, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PdfStatusIndicatorProps {
  status: "checking" | "available" | "unavailable";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PdfStatusIndicator = ({ 
  status,
  size = "md",
  className = ""
}: PdfStatusIndicatorProps) => {
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }[size];
  
  const messages = {
    checking: "Vérification de la disponibilité du PDF...",
    available: "PDF disponible pour téléchargement",
    unavailable: "PDF non disponible"
  };
  
  const colors = {
    checking: "text-ocean-light animate-pulse",
    available: "text-green-500",
    unavailable: "text-gray-300"
  };
  
  const icons = {
    checking: (
      <div className="relative">
        <Loader2 className={cn(`${sizeClass} animate-spin text-ocean`, className)} />
        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-ocean rounded-full animate-ping"></span>
      </div>
    ),
    available: (
      <div className="relative">
        <FileCheck className={cn(`${sizeClass} ${colors.available} transition-all duration-300 hover:scale-110`, className)} />
        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
      </div>
    ),
    unavailable: <FileX className={cn(`${sizeClass} ${colors.unavailable} transition-all duration-300 hover:text-gray-400`, className)} />
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help transition-transform duration-200 hover:scale-110">{icons[status]}</span>
        </TooltipTrigger>
        <TooltipContent className="bg-white border border-gray-200 shadow-md">
          <p className={cn("text-sm font-medium", colors[status])}>{messages[status]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
