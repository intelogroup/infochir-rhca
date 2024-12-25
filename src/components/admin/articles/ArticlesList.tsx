import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArticleForm } from "./ArticleForm";
import { toast } from "sonner";
import { Edit, Trash, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
  id: string;
  title: string;
  date: string;
  abstract: string;
  pdf_url: string | null;
}

interface ArticlesListProps {
  articles: Article[];
  isLoading: boolean;
  onUpdate: () => void;
}

export const ArticlesList = ({ articles, isLoading, onUpdate }: ArticlesListProps) => {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this article?");
    if (!confirmed) return;

    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Article deleted successfully");
      onUpdate();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Error deleting article");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-8" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={`row-${i}`} className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, j) => (
              <Skeleton key={`cell-${i}-${j}`} className="h-12" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>PDF</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">{article.title}</TableCell>
              <TableCell>
                {new Date(article.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {article.pdf_url ? "✓" : "✗"}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingArticle(article)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Article</DialogTitle>
                    </DialogHeader>
                    <ArticleForm 
                      article={editingArticle} 
                      onSuccess={() => {
                        onUpdate();
                        setEditingArticle(null);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                  disabled={isDeleting === article.id}
                >
                  {isDeleting === article.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};