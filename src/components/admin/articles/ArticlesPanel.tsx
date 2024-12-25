import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArticlesList } from "./ArticlesList";
import { ArticleForm } from "./ArticleForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ArticlesPanel = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
      return;
    }

    setArticles(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-sm text-gray-500">Manage your articles here</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Article</DialogTitle>
            </DialogHeader>
            <ArticleForm onSuccess={fetchArticles} />
          </DialogContent>
        </Dialog>
      </div>
      <ArticlesList 
        articles={articles} 
        isLoading={isLoading} 
        onUpdate={fetchArticles} 
      />
    </div>
  );
};