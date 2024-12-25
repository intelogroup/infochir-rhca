import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArticleForm } from "./ArticleForm";
import type { Article } from "@/types/article";

interface ArticleFormDialogProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ArticleFormDialog = ({
  article,
  isOpen,
  onClose,
  onSuccess,
}: ArticleFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {article ? "Edit Article" : "Add New Article"}
          </DialogTitle>
        </DialogHeader>
        <ArticleForm
          article={article}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};