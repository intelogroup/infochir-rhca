
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SubmissionFormValues } from "../schema";

export const useSubmissionHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (
    values: SubmissionFormValues,
    articleFiles: string[],
    imageAnnexes: string[],
    formErrors: {[key: string]: string}
  ) => {
    // Final validation check
    const finalErrors: {[key: string]: string} = {};
    
    if (articleFiles.length === 0) {
      finalErrors.articleFiles = "Veuillez uploader au moins un fichier d'article";
    }

    if (!values.ethicsApproval || !values.noConflict || !values.originalWork) {
      finalErrors.declarations = "Toutes les déclarations doivent être acceptées";
    }

    if (Object.keys(finalErrors).length > 0) {
      return { success: false, errors: finalErrors };
    }

    try {
      setIsSubmitting(true);
      toast.loading("Envoi de votre soumission en cours...");

      // Get user session if available, but don't require it
      const { data: userSession } = await supabase.auth.getSession();
      const userId = userSession?.session?.user?.id;

      const { data, error } = await supabase
        .from('article_submissions')
        .insert({
          publication_type: values.publicationType,
          title: values.title,
          authors: values.authors,
          institution: values.institution,
          keywords: values.keywords,
          abstract: values.abstract,
          corresponding_author_name: values.correspondingAuthor.name,
          corresponding_author_email: values.correspondingAuthor.email,
          corresponding_author_phone: values.correspondingAuthor.phone,
          corresponding_author_address: values.correspondingAuthor.address,
          ethics_approval: values.ethicsApproval,
          no_conflict: values.noConflict,
          original_work: values.originalWork,
          article_files_urls: articleFiles,
          image_annexes_urls: imageAnnexes,
          user_id: userId, // This is now optional
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Submission error:', error);
        throw error;
      }

      toast.dismiss();
      toast.success("Votre soumission a été envoyée avec succès!");
      
      // Determine where to redirect based on publication type
      if (values.publicationType === 'RHCA') {
        navigate('/rhca');
      } else {
        navigate('/igm');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Submission error:', error);
      toast.dismiss();
      toast.error("Une erreur est survenue lors de l'envoi de votre soumission");
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    toast("Sauvegarde en brouillon non implémentée");
  };

  return {
    isSubmitting,
    handleSubmit,
    handleSaveDraft
  };
};
