import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { toast } from "sonner";

interface ArticleFormProps {
  initialData?: {
    title: string;
    abstract: string;
  };
  onSubmit: (data: { title: string; abstract: string }) => Promise<void>;
  isLoading: boolean;
}

export const ArticleForm = ({ initialData, onSubmit, isLoading }: ArticleFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [abstract, setAbstract] = useState(initialData?.abstract || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, abstract });
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
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : initialData ? "Update" : "Save"}
      </Button>
    </form>
  );
};