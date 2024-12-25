import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiagnosticCase } from "./types";

interface DiagnosticCardProps {
  diagnosticCase: DiagnosticCase;
}

export const DiagnosticCard = memo(({ diagnosticCase }: DiagnosticCardProps) => {
  if (!diagnosticCase) {
    console.warn("DiagnosticCard received null or undefined diagnosticCase");
    return null;
  }

  const {
    title = "Untitled",
    imageUrl,
    specialty,
    date,
    description,
    diagnosis
  } = diagnosticCase;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    console.warn(`Image failed to load: ${target.src}`);
    target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 rounded-xl border border-gray-100">
      <div className="aspect-[4/3] relative overflow-hidden">
        {imageUrl && (
          <img
            loading="lazy"
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
            onError={handleImageError}
          />
        )}
      </div>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-sm font-medium line-clamp-2">
            {title}
          </CardTitle>
          {specialty && (
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {specialty}
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs">
          {date ? new Date(date).toLocaleDateString() : "Date not available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {description || "No description available"}
        </p>
        <p className="text-xs font-semibold">
          Diagnostic: <span className="text-primary">{diagnosis || "Not specified"}</span>
        </p>
      </CardContent>
    </Card>
  );
});

DiagnosticCard.displayName = "DiagnosticCard";