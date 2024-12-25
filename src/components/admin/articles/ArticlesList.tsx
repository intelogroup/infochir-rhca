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

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this article?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error deleting article");
      return;
    }

    toast.success("Article deleted successfully");
    onUpdate();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};