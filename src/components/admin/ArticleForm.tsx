
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

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  abstract: z.string().min(50, "Le résumé doit contenir au moins 50 caractères"),
  publicationType: z.enum(["RHCA", "IGM", "ADC"]),
});

type FormValues = z.infer<typeof formSchema>;

export const ArticleForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [articleFilesUrls, setArticleFilesUrls] = useState<string[]>([]);
  const [imageAnnexesUrls, setImageAnnexesUrls] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicationType: "RHCA",
      title: "",
      abstract: "",
    }
  });

  const onSubmit = async (values: FormValues) => {
    if (articleFilesUrls.length === 0) {
      toast.error("Veuillez uploader au moins un fichier d'article");
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
          article_files_urls: articleFilesUrls,
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
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Une erreur est survenue lors de la création de l'article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            setImageAnnexesUrls={setImageAnnexesUrls}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Création en cours..." : "Créer l'article"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
