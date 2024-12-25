import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Article {
  id: string;
  title: string;
  abstract: string;
}

interface ArticleFormProps {
  article?: Article | null;
  onSuccess: () => void;
}

export const ArticleForm = ({ article, onSuccess }: ArticleFormProps) => {
  const [title, setTitle] = useState(article?.title || "");
  const [abstract, setAbstract] = useState(article?.abstract || "");
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
            updated_at: new Date().toISOString(),
          })
          .eq("id", article.id);

        if (error) throw error;
        toast.success("Article updated successfully");
      } else {
        const { error } = await supabase.from("articles").insert({
          title,
          abstract,
          source: "RHCA",
          date: new Date().toISOString(),
        });

        if (error) throw error;
        toast.success("Article added successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Error saving article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};