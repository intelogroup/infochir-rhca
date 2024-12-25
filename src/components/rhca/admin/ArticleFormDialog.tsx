import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";

interface ArticleFormDialogProps {
  article?: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ArticleFormDialog = ({ article, isOpen, onClose, onSuccess }: ArticleFormDialogProps) => {
  const [title, setTitle] = useState(article?.title || "");
  const [abstract, setAbstract] = useState(article?.abstract || "");
  const [volume, setVolume] = useState(article?.volume || "");
  const [issueNumber, setIssueNumber] = useState(article?.issue_number?.toString() || "");
  const [articleCount, setArticleCount] = useState(article?.article_count?.toString() || "1");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (article) {
        const { error } = await supabase
          .from("articles")
          .update({
            title,
            abstract,
            volume,
            issue_number: parseInt(issueNumber),
            article_count: parseInt(articleCount),
            updated_at: new Date().toISOString(),
          })
          .eq("id", article.id);

        if (error) throw error;
        toast.success("Article updated successfully");
      } else {
        const { error } = await supabase.from("articles").insert({
          title,
          abstract,
          volume,
          issue_number: parseInt(issueNumber),
          article_count: parseInt(articleCount),
          source: "RHCA",
          date: new Date().toISOString(),
        });

        if (error) throw error;
        toast.success("Article added successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Error saving article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {article ? "Edit Article" : "Add New Article"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="volume" className="block text-sm font-medium mb-1">
                Volume
              </label>
              <Input
                id="volume"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="issueNumber" className="block text-sm font-medium mb-1">
                Issue Number
              </label>
              <Input
                id="issueNumber"
                type="number"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="articleCount" className="block text-sm font-medium mb-1">
              Number of Articles
            </label>
            <Input
              id="articleCount"
              type="number"
              min="1"
              value={articleCount}
              onChange={(e) => setArticleCount(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="abstract" className="block text-sm font-medium mb-1">
              Abstract
            </label>
            <Textarea
              id="abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              PDF Upload
            </label>
            <PDFUploader />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : article ? (
              "Update Article"
            ) : (
              "Add Article"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};