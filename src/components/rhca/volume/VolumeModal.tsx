import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar, Users, Tag } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RhcaVolume } from "../types";

interface VolumeModalProps {
  volume: RhcaVolume;
  isOpen: boolean;
  onClose: () => void;
}

export const VolumeModal = ({ volume, isOpen, onClose }: VolumeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white/95 backdrop-blur-sm">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary">
              Volume {volume.volume}
            </DialogTitle>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 space-y-6"
            >
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(volume.date), 'MMMM yyyy', { locale: fr })}
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {volume.articleCount} articles
                </div>
              </div>

              {volume.description && (
                <p className="text-gray-600 leading-relaxed">
                  {volume.description}
                </p>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Table des matières</h3>
                {volume.articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">
                      {article.title}
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {article.authors.join(", ")}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Page {article.pageNumber}
                      </div>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {article.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};