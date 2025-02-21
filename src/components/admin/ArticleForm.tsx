
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUploaders } from "./article-form/FileUploaders";
import { PublicationTypeSelector } from "./article-form/PublicationTypeSelector";
import { ArticleDetails } from "./article-form/ArticleDetails";
import { CoverImageUploader } from "./article-form/CoverImageUploader";
import { supabase } from "@/integrations/supabase/client";
import { Article, ArticleFormData } from "@/types/article";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  abstract: z.string().min(50, "Le résumé doit contenir au moins 50 caractères"),
  publicationType: z.enum(["RHCA", "IGM", "ADC"]),
});

interface ArticleFormProps {
  initialData?: Article;
  onSubmit?: (data: ArticleFormData) => Promise<void>;
  isLoading?: boolean;
}

export const ArticleForm = ({ initialData, onSubmit: customSubmit, isLoading = false }: ArticleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.image_url || "");
  const [articleFilesUrls, setArticleFilesUrls] = useState<string[]>(initialData?.article_files || []);

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicationType: (initialData?.publication_type as "RHCA" | "IGM" | "ADC") || "RHCA",
      title: initialData?.title || "",
      abstract: initialData?.abstract || "",
    }
  });

  const handleSubmit = async (values: ArticleFormData) => {
    if (articleFilesUrls.length === 0) {
      toast.error("Veuillez uploader au moins un fichier d'article");
      return;
    }

    if (customSubmit) {
      await customSubmit(values);
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('unified_content')
        .insert({
          title: values.title,
          abstract: values.abstract,
          source: values.publicationType,
          article_files: articleFilesUrls,
          image_url: coverImageUrl,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Article créé avec succès!");
      form.reset();
      setCoverImageUrl("");
      setArticleFilesUrls([]);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Une erreur est survenue lors de la création de l'article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
          <PublicationTypeSelector form={form} />
          <ArticleDetails form={form} />
          
          <CoverImageUploader
            onImageUpload={setCoverImageUrl}
            currentImage={coverImageUrl}
            className="mb-6"
          />

          <FileUploaders
            setArticleFilesUrls={setArticleFilesUrls}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "En cours..." : initialData ? "Mettre à jour" : "Créer l'article"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
