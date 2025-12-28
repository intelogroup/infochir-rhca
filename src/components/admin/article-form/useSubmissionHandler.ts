
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArticleFormData } from "@/types/article";

interface UseSubmissionHandlerProps {
  articleFilesUrls: string[];
  coverImageUrl: string;
  setFormErrors: (errors: {[key: string]: string} | ((prev: {[key: string]: string}) => {[key: string]: string})) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setCoverImageUrl: (url: string) => void;
  setArticleFilesUrls: (urls: string[]) => void;
  setImageAnnexesUrls: (urls: string[]) => void;
  form: any;
  customSubmit?: (data: ArticleFormData) => Promise<void>;
}

export const useSubmissionHandler = ({
  articleFilesUrls,
  coverImageUrl,
  setFormErrors,
  setIsSubmitting,
  setCoverImageUrl,
  setArticleFilesUrls,
  setImageAnnexesUrls,
  form,
  customSubmit
}: UseSubmissionHandlerProps) => {
  const handleSubmit = async (values: ArticleFormData) => {
    setFormErrors({});
    
    // Files are now optional for admin CMS - only warn if missing
    const hasFiles = articleFilesUrls.length > 0;
    const hasCoverImage = !!coverImageUrl;
    
    if (!hasFiles) {
      console.warn("No article files uploaded - article will be created without PDF");
    }
    
    if (!hasCoverImage) {
      console.warn("No cover image uploaded - article will be created without image");
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
      // Prepare the first PDF file URL for pdf_url field (optional)
      const primaryPdfUrl = articleFilesUrls.length > 0 ? articleFilesUrls[0] : null;
      const primaryPdfFilename = primaryPdfUrl ? primaryPdfUrl.split('/').pop() : null;
      
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
          volume: values.volume,
          issue: values.issue,
          page_number: values.pageNumber,
          specialty: values.specialty,
          pdf_url: primaryPdfUrl,
          pdf_filename: primaryPdfFilename,
          image_url: coverImageUrl || null,
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

  return { handleSubmit };
};
