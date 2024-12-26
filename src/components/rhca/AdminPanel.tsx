import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash } from "lucide-react";

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
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingArticle) {
        const updatedArticles = articles.map(article => 
          article.id === editingArticle.id 
            ? { ...article, title, abstract }
            : article
        );
        setArticles(updatedArticles);
        toast.success("Article updated successfully");
      } else {
        const newArticle: Article = {
          id: String(articles.length + 1),
          title,
          abstract,
          date: new Date().toISOString(),
          pdf_url: null,
        };
        setArticles([...articles, newArticle]);
        toast.success("Article added successfully");
      }

      setTitle("");
      setAbstract("");
      setEditingArticle(null);
    } catch (error) {
      toast.error("Error saving article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setAbstract(article.abstract);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">RHCA Admin Panel</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? "Edit Article" : "Add New Article"}
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingArticle ? "Update" : "Save"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
              <TableCell>{article.title}</TableCell>
              <TableCell>
                {new Date(article.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {article.pdf_url ? "✓" : "✗"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(article)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
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