import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Issue } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { IssueModalHeader } from "./components/modal/IssueModalHeader";
import { IssueModalMetadata } from "./components/modal/IssueModalMetadata";
import { IssueModalActions } from "./components/modal/IssueModalActions";
import { IssueModalArticles } from "./components/modal/IssueModalArticles";

interface IssueModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
}

export const IssueModal = ({ issue, isOpen, onClose }: IssueModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white/95 backdrop-blur-sm">
            <IssueModalHeader issue={issue} />
            
            <ScrollArea className="max-h-[80vh]">
              <motion.div 
                className="p-6 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <IssueModalMetadata issue={issue} />
                  <IssueModalActions issue={issue} />
                </div>

                <div className="prose prose-sm max-w-none">
                  <h3 className="text-[clamp(1.125rem,1.075rem+0.25vw,1.25rem)] font-semibold text-primary mb-4">Résumé</h3>
                  <p className="text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600 leading-relaxed">{issue.abstract}</p>
                </div>

                <IssueModalArticles issue={issue} />
              </motion.div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};