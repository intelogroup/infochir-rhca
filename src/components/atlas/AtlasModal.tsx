import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, User, Eye, Share2, Download } from "lucide-react";
import { AtlasModalProps } from "./types";

export const AtlasModal = ({ chapter, open, onOpenChange }: AtlasModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{chapter.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
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

          {chapter.description && (
            <p className="text-gray-600">{chapter.description}</p>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Eye className="h-6 w-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-primary">
                {chapter.stats?.views || 0}
              </span>
              <span className="text-sm text-gray-500">Vues</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Share2 className="h-6 w-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-primary">
                {chapter.stats?.shares || 0}
              </span>
              <span className="text-sm text-gray-500">Partages</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Download className="h-6 w-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-primary">
                {chapter.stats?.downloads || 0}
              </span>
              <span className="text-sm text-gray-500">Téléchargements</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};