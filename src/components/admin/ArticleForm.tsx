
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(200, "Le titre ne doit pas dépasser 200 caractères"),
  abstract: z.string().min(50, "Le résumé doit contenir au moins 50 caractères").max(2000, "Le résumé ne doit pas dépasser 2000 caractères"),
  publicationType: z.enum(["RHCA", "IGM", "ADC", "INDEX"], {
    required_error: "Veuillez sélectionner un type de publication",
  }),
  authors: z.array(z.string()).min(1, "Au moins un auteur est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  tags: z.array(z.string()).min(1, "Au moins un tag est requis"),
  institution: z.string().min(1, "L'institution est requise"),
  keywords: z.array(z.string()).optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pageNumber: z.string().optional(),
  specialty: z.string().optional(),
  primaryAuthor: z.string().min(1, "L'auteur principal est requis"),
  coAuthors: z.array(z.string()).optional(),
  authorAffiliations: z.array(z.string()).optional(),
  fundingSource: z.string().optional(),
  doi: z.string().optional(),
  status: z.enum(["draft", "published"], {
    required_error: "Veuillez sélectionner un statut",
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
      authors: initialData?.authors || [],
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      institution: initialData?.institution || "",
      keywords: initialData?.keywords || [],
      volume: initialData?.volume || "",
      issue: initialData?.issue || "",
      pageNumber: initialData?.page_number || "",
      specialty: initialData?.specialty || "",
      primaryAuthor: initialData?.primary_author || "",
      coAuthors: initialData?.co_authors || [],
      authorAffiliations: initialData?.author_affiliations || [],
      fundingSource: initialData?.funding_source || "",
      doi: initialData?.doi || "",
      status: (initialData?.status as "draft" | "published") || "draft",
    },
    mode: "onChange"
  });
  
  const formValues = form.watch();
  const publicationType = form.watch("publicationType");
  
  useEffect(() => {
    const subscription = form.watch(() => {
      if (Object.keys(formErrors).length > 0) {
        setFormErrors({});
      }
    });
    return () => subscription.unsubscribe();
  }, [form, formErrors]);

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
    setFormErrors({});
    
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
          authors: values.authors,
          category: values.category,
          tags: values.tags,
          institution: values.institution,
          keywords: values.keywords,
          volume: values.volume,
          issue: values.issue,
          page_number: values.pageNumber,
          specialty: values.specialty,
          primary_author: values.primaryAuthor,
          co_authors: values.coAuthors,
          author_affiliations: values.authorAffiliations,
          funding_source: values.fundingSource,
          doi: values.doi,
          article_files: articleFilesUrls,
          image_url: coverImageUrl,
          status: values.status
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
      
      if (error.code === '23505') {
        toast.error("Un article avec ce titre existe déjà");
        setFormErrors((prev) => ({...prev, title: "Un article avec ce titre existe déjà"}));
      } else {
        toast.error("Une erreur est survenue lors de la création de l'article");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = form.formState.isValid && 
                     articleFilesUrls.length > 0 && 
                     !!coverImageUrl && 
                     Object.keys(formErrors).length === 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
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
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Statut de publication</h3>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
          <Button 
            type="submit" 
            disabled={!isFormValid || isSubmitting || isLoading}
            className="min-w-[200px]"
          >
            {isSubmitting || isLoading 
              ? "Création en cours..." 
              : initialData 
                ? "Mettre à jour l'article"
                : "Créer l'article"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};
