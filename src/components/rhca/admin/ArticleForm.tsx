import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Article {
  id: string;
  title: string;
  abstract: string;
  date: string;
  volume?: string;
  issue_number?: number;
  article_count?: number;
  source: "RHCA" | "IGM" | "ATLAS";
}

interface ArticleFormProps {
  article?: Article | null;
  onSuccess: () => void;
}

export const ArticleForm = ({ article, onSuccess }: ArticleFormProps) => {
  const [title, setTitle] = useState(article?.title || "");
  const [abstract, setAbstract] = useState(article?.abstract || "");
  const [volume, setVolume] = useState(article?.volume || "");
  const [issueNumber, setIssueNumber] = useState(article?.issue_number?.toString() || "");
  const [articleCount, setArticleCount] = useState(article?.article_count?.toString() || "1");
  const [source, setSource] = useState<"RHCA" | "IGM" | "ATLAS">(article?.source || "RHCA");
  const [date, setDate] = useState(article?.date?.split('T')[0] || new Date().toISOString().split('T')[0]);
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
            source,
            date,
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
          source,
          date,
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Publication Date
          </label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
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
      </div>
      <div>
        <label htmlFor="source" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Select value={source} onValueChange={(value: "RHCA" | "IGM" | "ATLAS") => setSource(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RHCA">RHCA</SelectItem>
            <SelectItem value="IGM">IGM</SelectItem>
            <SelectItem value="ATLAS">ATLAS</SelectItem>
          </SelectContent>
        </Select>
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