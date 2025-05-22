
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
import { SubmitButton } from "./article-form/SubmitButton";

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(200, "Le titre ne doit pas dépasser 200 caractères"),
  abstract: z.string().min(50, "Le résumé doit contenir au moins 50 caractères").max(2000, "Le résumé ne doit pas dépasser 2000 caractères"),
  publicationType: z.enum(["RHCA", "IGM", "ADC", "INDEX"], {
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
      publicationType: (initialData?.publication_type as "RHCA" | "IGM" | "ADC" | "INDEX") || "RHCA",
      title: initialData?.title || "",
      abstract: initialData?.abstract || "",
    },
    mode: "onChange" // This enables validation as the user types
  });
  
  // Watch for form changes to update validation state
  const formValues = form.watch();
  const publicationType = form.watch("publicationType");
  
  // Watch for form errors
  useEffect(() => {
    const subscription = form.watch(() => {
      // Clear custom form errors when user makes changes
      if (Object.keys(formErrors).length > 0) {
        setFormErrors({});
      }
    });
    return () => subscription.unsubscribe();
  }, [form, formErrors]);

  // Check file uploads when they change
  useEffect(() => {
    if (articleFilesUrls.length > 0 && formErrors.files) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.files;
        return newErrors;
      });
    }
  }, [articleFilesUrls, formErrors]);

  const handleSubmit = async (values: ArticleFormData) => {
    // Reset form errors
    setFormErrors({});
    
    // Validate file uploads
    if (articleFilesUrls.length === 0) {
      setFormErrors((prev) => ({...prev, files: "Veuillez uploader au moins un fichier d'article"}));
      toast.error("Veuillez uploader au moins un fichier d'article");
      return;
    }

    if (!coverImageUrl) {
      setFormErrors((prev) => ({...prev, coverImage: "Veuillez ajouter une image de couverture"}));
      toast.error("Veuillez ajouter une image de couverture");
      return;
    }

    if (customSubmit) {
      try {
        setIsSubmitting(true);
        toast.loading("Soumission en cours...");
        await customSubmit(values);
        toast.dismiss();
      } catch (error) {
        console.error('Custom submission error:', error);
        toast.error("Une erreur est survenue lors de la soumission de l'article");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);
    toast.loading("Création de l'article en cours...");
    
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

      toast.dismiss();
      toast.success("Article créé avec succès!");
      form.reset();
      setCoverImageUrl("");
      setArticleFilesUrls([]);
      setImageAnnexesUrls([]);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.dismiss();
      
      // Handle specific database errors
      if (error.code === '23505') { // Unique violation
        toast.error("Un article avec ce titre existe déjà");
        setFormErrors((prev) => ({...prev, title: "Un article avec ce titre existe déjà"}));
      } else {
        toast.error("Une erreur est survenue lors de la création de l'article");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate if form is valid for submit button
  const isFormValid = form.formState.isValid && 
                     articleFilesUrls.length > 0 && 
                     !!coverImageUrl && 
                     Object.keys(formErrors).length === 0;

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
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Image de couverture</h3>
            <CoverImageUploader
              onImageUpload={setCoverImageUrl}
              currentImage={coverImageUrl}
              className="mb-2"
            />
            {formErrors.coverImage && (
              <p className="text-sm text-destructive mt-1">{formErrors.coverImage}</p>
            )}
          </div>

          <FileUploaders
            setArticleFilesUrls={setArticleFilesUrls}
            setImageAnnexesUrls={setImageAnnexesUrls}
            errors={formErrors}
            publicationType={publicationType}
          />
        </div>

        <div className="flex justify-end">
          <SubmitButton 
            isLoading={isSubmitting || isLoading} 
            isEditing={!!initialData}
          />
        </div>
      </form>
    </Form>
  );
};
