import { useState } from "react";
import { Article, ArticleSource } from "@/types/article";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleFormSchema, ArticleFormValues } from "@/lib/validations/article";
import { toast } from "sonner";

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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="issueNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Number</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abstract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
    </Form>
  );
};