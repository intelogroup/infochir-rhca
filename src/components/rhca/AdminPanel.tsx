import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { ArticleList } from "@/components/admin/ArticleList";
import { AdminHeader } from "./admin/AdminHeader";

interface Article {
  id: string;
  title: string;
  abstract: string;
  date: string;
  pdf_url: string | null;
}

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Sample Article 1",
    abstract: "This is a sample abstract",
    date: new Date().toISOString(),
    pdf_url: null,
  },
];

export const AdminPanel = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (data: { title: string; abstract: string }) => {
    setIsLoading(true);
    try {
      if (editingArticle) {
        const updatedArticles = articles.map(article => 
          article.id === editingArticle.id 
            ? { ...article, ...data }
            : article
        );
        setArticles(updatedArticles);
        toast.success("Article updated successfully");
      } else {
        const newArticle: Article = {
          id: String(articles.length + 1),
          ...data,
          date: new Date().toISOString(),
          pdf_url: null,
        };
        setArticles([...articles, newArticle]);
        toast.success("Article added successfully");
      }
      setEditingArticle(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error saving article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this article?");
    if (!confirmed) return;

    const updatedArticles = articles.filter(article => article.id !== id);
    setArticles(updatedArticles);
    toast.success("Article deleted successfully");
  };

  return (
    <div className="space-y-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AdminHeader />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "Edit Article" : "Add New Article"}
            </DialogTitle>
          </DialogHeader>
          <ArticleForm
            initialData={editingArticle || undefined}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <ArticleList
        articles={articles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};