import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiagnosticCase } from "./types";

interface DiagnosticCardProps {
  diagnosticCase: DiagnosticCase;
}

export const DiagnosticCard = memo(({ diagnosticCase }: DiagnosticCardProps) => {
  if (!diagnosticCase) {
    return null;
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 rounded-xl border border-gray-100">
      <div className="aspect-[4/3] relative overflow-hidden">
        {diagnosticCase.imageUrl && (
          <img
            loading="lazy"
            src={diagnosticCase.imageUrl}
            alt={diagnosticCase.title}
            className="object-cover w-full h-full transition-transform duration-300 ease-in-out"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
            }}
          />
        )}
      </div>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-sm font-medium line-clamp-2">
            {diagnosticCase.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            {diagnosticCase.specialty}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {diagnosticCase.date}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {diagnosticCase.description}
        </p>
        <p className="text-xs font-semibold">
          Diagnostic: <span className="text-primary">{diagnosticCase.diagnosis}</span>
        </p>
      </CardContent>
    </Card>
  );
});

DiagnosticCard.displayName = "DiagnosticCard";