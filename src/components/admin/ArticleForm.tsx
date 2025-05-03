
import React, { useState, useEffect } from "react";
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
import { FormErrors } from "./article-form/FormErrors";

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(200, "Le titre ne doit pas dépasser 200 caractères"),
  abstract: z.string().min(50, "Le résumé doit contenir au moins 50 caractères").max(2000, "Le résumé ne doit pas dépasser 2000 caractères"),
  publicationType: z.enum(["RHCA", "IGM", "ADC"], {
    required_error: "Veuillez sélectionner un type de publication",
  }),
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
  const [imageAnnexesUrls, setImageAnnexesUrls] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicationType: (initialData?.publication_type as "RHCA" | "IGM" | "ADC") || "RHCA",
      title: initialData?.title || "",
      abstract: initialData?.abstract || "",
    },
    mode: "onChange" // This enables validation as the user types
  });

  // Watch for form errors
  useEffect(() => {
    const subscription = form.watch(() => {
      setFormErrors({});
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (values: ArticleFormData) => {
    // Reset form errors
    setFormErrors({});
    
    // Validate file uploads
    if (articleFilesUrls.length === 0) {
      setFormErrors((prev) => ({...prev, files: "Veuillez uploader au moins un fichier d'article"}));
      return;
    }

    if (customSubmit) {
      try {
        await customSubmit(values);
      } catch (error) {
        console.error('Custom submission error:', error);
        toast.error("Une erreur est survenue lors de la soumission de l'article");
      }
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
      setImageAnnexesUrls([]);
    } catch (error: any) {
      console.error('Submission error:', error);
      
      // Handle specific database errors
      if (error.code === '23505') { // Unique violation
        toast.error("Un article avec ce titre existe déjà");
      } else {
        toast.error("Une erreur est survenue lors de la création de l'article");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
          {/* Show validation errors at the top */}
          <FormErrors errors={{
            ...formErrors,
            ...Object.entries(form.formState.errors).reduce((acc, [key, error]) => {
              if (error && error.message) {
                acc[key] = error.message as string;
              }
              return acc;
            }, {} as Record<string, string>)
          }} />
          
          <PublicationTypeSelector form={form} />
          <ArticleDetails form={form} />
          
          <CoverImageUploader
            onImageUpload={setCoverImageUrl}
            currentImage={coverImageUrl}
            className="mb-6"
          />

          <FileUploaders
            setArticleFilesUrls={setArticleFilesUrls}
            setImageAnnexesUrls={setImageAnnexesUrls}
            errors={formErrors}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading || !form.formState.isValid}
          >
            {isSubmitting || isLoading ? "En cours..." : initialData ? "Mettre à jour" : "Créer l'article"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
