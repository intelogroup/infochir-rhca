
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

      // Get user session if available
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      // If no user is logged in, show a friendly message instead of an error
      if (!userId) {
        console.log("No authenticated user found, proceeding with anonymous submission");
        // We'll continue with submission but without user_id
      }

      // Prepare submission data
      const submissionData = {
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
        status: 'pending'
      };
      
      // Only add user_id if we have one
      if (userId) {
        Object.assign(submissionData, { user_id: userId });
      }

      // Insert the submission
      const { data, error } = await supabase
        .from('article_submissions')
        .insert(submissionData)
        .select()
        .single();

      if (error) {
        console.error('Submission error:', error);
        
        // Handle specific error cases
        if (error.code === '42501') { // Row-level security violation
          toast.dismiss();
          toast.error("Accès restreint. Veuillez vous connecter ou vérifier vos permissions.");
          return { success: false, error };
        } else if (error.code === '401') { // Unauthorized
          toast.dismiss();
          toast.error("Authentification requise. Veuillez vous connecter pour soumettre un article.");
          return { success: false, error };
        }
        
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
