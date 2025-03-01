
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle, HelpCircle, Loader2 } from 'lucide-react';

interface PdfStatusIndicatorProps {
  status: 'loading' | 'available' | 'unavailable' | 'unknown';
  className?: string;
}

export const PdfStatusIndicator: React.FC<PdfStatusIndicatorProps> = ({ 
  status, 
  className = "" 
}) => {
  let icon;
  let tooltipText;
  let color;

  switch (status) {
    case 'loading':
      icon = <Loader2 className="h-4 w-4 animate-spin" />;
      tooltipText = "Vérification de la disponibilité du PDF...";
      color = "text-gray-400";
      break;
    case 'available':
      icon = <CheckCircle className="h-4 w-4" />;
      tooltipText = "PDF disponible";
      color = "text-green-500";
      break;
    case 'unavailable':
      icon = <AlertCircle className="h-4 w-4" />;
      tooltipText = "PDF non disponible";
      color = "text-red-500";
      break;
    case 'unknown':
    default:
      icon = <HelpCircle className="h-4 w-4" />;
      tooltipText = "Statut PDF inconnu";
      color = "text-yellow-500";
      break;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`${color} ${className}`}>
            {icon}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
