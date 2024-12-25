import { Article, ArticleSource } from "@/types/article";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleFormSchema, ArticleFormValues } from "@/lib/validations/article";
import { toast } from "sonner";
import { FormFields } from "./article-form/FormFields";
import { PDFUploadField } from "./article-form/PDFUploadField";
import { SubmitButton } from "./article-form/SubmitButton";

interface ArticleFormProps {
  article?: Article | null;
  onSubmit: (formData: Partial<Article>) => Promise<void>;
  isLoading?: boolean;
  sources?: ArticleSource[];
}

export const ArticleForm = ({ 
  article, 
  onSubmit, 
  isLoading = false,
  sources = ["RHCA", "IGM", "ATLAS", "ADC"]
}: ArticleFormProps) => {
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: article?.title || "",
      abstract: article?.abstract || "",
      volume: article?.volume || "",
      issueNumber: article?.issue_number || undefined,
      source: article?.source || sources[0],
    },
  });

  const handleSubmit = async (values: ArticleFormValues) => {
    try {
      await onSubmit({
        title: values.title,
        abstract: values.abstract,
        volume: values.volume,
        issue_number: values.issueNumber,
        source: values.source,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save article");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormFields form={form} sources={sources} />
        <PDFUploadField />
        <SubmitButton isLoading={isLoading} article={article} />
      </form>
    </Form>
  );
};