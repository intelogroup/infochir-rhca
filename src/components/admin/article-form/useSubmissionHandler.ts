
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
          // Map authors array to primary_author (first) and co_authors (rest)
          primary_author: values.authors[0] || "",
          co_authors: values.authors.slice(1),
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

  return { handleSubmit };
};
