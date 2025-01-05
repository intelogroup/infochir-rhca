import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye } from "lucide-react";
import { AtlasChapter } from "./types";

interface AtlasCardProps {
  chapter: AtlasChapter;
}

export const AtlasCard = ({ chapter }: AtlasCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
          {chapter.title}
        </CardTitle>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {chapter.lastUpdate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>MàJ: {chapter.lastUpdate}</span>
            </div>
          )}
          {chapter.author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{chapter.author}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {chapter.description && (
          <p className="text-gray-600 line-clamp-2">
            {chapter.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 hover:text-primary transition-colors"
          >
            <Eye className="h-4 w-4" />
            Consulter
          </Button>
          {chapter.status === "coming" && (
            <span className="text-sm text-gray-500 italic">À venir</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};