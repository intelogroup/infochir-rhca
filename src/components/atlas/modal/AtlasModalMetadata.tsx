import { Calendar, User, Tag } from "lucide-react";
import { AtlasChapter } from "../types";

interface AtlasModalMetadataProps {
  chapter: AtlasChapter;
}

export const AtlasModalMetadata = ({ chapter }: AtlasModalMetadataProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {chapter.lastUpdate && (
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>MàJ: {chapter.lastUpdate}</span>
          </div>
        )}
        {chapter.author && (
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{chapter.author}</span>
          </div>
        )}
        {chapter.status === "coming" && (
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm">
            <Tag className="h-4 w-4" />
            <span>À venir</span>
          </div>
        )}
      </div>
    </div>
  );
};