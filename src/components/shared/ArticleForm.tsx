import { useState } from "react";
import { Article, ArticleSource } from "@/types/article";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArticleFormProps {
  article?: Article | null;
  onSubmit: (formData: Partial<Article>) => Promise<void>;
  isLoading?: boolean;
  sources?: ArticleSource[];
}

export const ArticleForm = ({ 
  article, 
  onSubmit, 
  isLoading,
  sources = ["RHCA", "IGM", "ATLAS", "ADC"]
}: ArticleFormProps) => {
  const [title, setTitle] = useState(article?.title || "");
  const [abstract, setAbstract] = useState(article?.abstract || "");
  const [volume, setVolume] = useState(article?.volume || "");
  const [issueNumber, setIssueNumber] = useState(article?.issue_number?.toString() || "");
  const [source, setSource] = useState<ArticleSource>(article?.source || sources[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      abstract,
      volume,
      issue_number: parseInt(issueNumber),
      source,
    });
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

      <div>
        <label htmlFor="source" className="block text-sm font-medium mb-1">
          Source
        </label>
        <Select value={source} onValueChange={(value) => setSource(value as ArticleSource)}>
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            {sources.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
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