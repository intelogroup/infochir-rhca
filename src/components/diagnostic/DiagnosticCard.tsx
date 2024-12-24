import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiagnosticCase } from "./types";

interface DiagnosticCardProps {
  diagnosticCase: DiagnosticCase;
}

export const DiagnosticCard = ({ diagnosticCase }: DiagnosticCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-2xl">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={diagnosticCase.imageUrl}
          alt={diagnosticCase.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xs font-medium line-clamp-2">{diagnosticCase.title}</CardTitle>
          <Badge variant="outline" className="text-[10px] whitespace-nowrap">
            {diagnosticCase.specialty}
          </Badge>
        </div>
        <CardDescription className="text-[10px]">{diagnosticCase.date}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-[10px] text-gray-600 mb-1 line-clamp-2">{diagnosticCase.description}</p>
        <p className="text-[10px] font-semibold">
          Diagnostic: <span className="text-primary">{diagnosticCase.diagnosis}</span>
        </p>
      </CardContent>
    </Card>
  );
};