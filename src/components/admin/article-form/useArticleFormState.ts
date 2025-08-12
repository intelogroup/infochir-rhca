
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleFormData, Article } from "@/types/article";
import { articleFormSchema } from "./formSchema";

interface UseArticleFormStateProps {
  initialData?: Article;
}

export const useArticleFormState = ({ initialData }: UseArticleFormStateProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.image_url || "");
  const [articleFilesUrls, setArticleFilesUrls] = useState<string[]>(initialData?.article_files || []);
  const [imageAnnexesUrls, setImageAnnexesUrls] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      // Required fields
      publicationType: (initialData?.publication_type as "RHCA" | "IGM" | "ADC" | "INDEX") || "RHCA",
      title: initialData?.title || "",
      abstract: initialData?.abstract || "",
      authors: initialData?.authors || [],
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      status: (initialData?.status as "draft" | "published") || "draft",
      
      // Optional advanced fields
      institution: initialData?.institution || "",
      keywords: initialData?.keywords || [],
      volume: initialData?.volume || "",
      issue: initialData?.issue || "",
      pageNumber: initialData?.page_number || "",
      specialty: initialData?.specialty || "",
      authorAffiliations: initialData?.author_affiliations || [],
      fundingSource: initialData?.funding_source || "",
      doi: initialData?.doi || "",
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

  const isFormValid = form.formState.isValid && 
                     articleFilesUrls.length > 0 && 
                     !!coverImageUrl && 
                     Object.keys(formErrors).length === 0;

  return {
    form,
    formValues,
    publicationType,
    isSubmitting,
    setIsSubmitting,
    coverImageUrl,
    setCoverImageUrl,
    articleFilesUrls,
    setArticleFilesUrls,
    imageAnnexesUrls,
    setImageAnnexesUrls,
    formErrors,
    setFormErrors,
    isFormValid
  };
};
