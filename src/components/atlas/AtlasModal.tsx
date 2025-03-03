
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AtlasChapter } from "./types";
import { AtlasCategory } from "./data/atlasCategories";
import { useState, useEffect } from "react";
import { ModalHeader } from "./modal/ModalHeader";
import { ModalContent } from "./modal/ModalContent";
import { ModalActions } from "./modal/ModalActions";
import { ScrollIndicator } from "./modal/ScrollIndicator";

interface AtlasModalProps {
  chapter: AtlasChapter;
  category?: AtlasCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AtlasModal = ({ chapter, category, open, onOpenChange }: AtlasModalProps) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Handle scroll indicator
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollIndicator(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white/80 backdrop-blur-xl">
        <ModalHeader chapter={chapter} category={category} />

        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          <ModalContent chapter={chapter} />
          <ModalActions chapter={chapter} />
        </ScrollArea>

        <ScrollIndicator show={showScrollIndicator} />
      </DialogContent>
    </Dialog>
  );
};
