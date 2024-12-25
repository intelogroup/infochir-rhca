import { Article } from "@/types/article";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArticleForm } from "./ArticleForm";

interface ArticleFormDialogProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Article>) => Promise<void>;
  isLoading?: boolean;
  title?: string;
}

export const ArticleFormDialog = ({
  article,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  title = article ? "Edit Article" : "Add New Article"
}: ArticleFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ArticleForm
          article={article}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};