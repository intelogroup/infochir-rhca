
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SubmissionFormValues } from "../schema";
import { createLogger } from "@/lib/error-logger";

// Create a logger specifically for submissions
const logger = createLogger("SubmissionHandler");

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

      // Get user session if available (but we'll support anonymous submissions)
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      logger.info("Starting submission process", {
        publicationType: values.publicationType,
        title: values.title,
        userId: userId || "anonymous"
      });
      
      if (!userId) {
        logger.info("Anonymous submission: user is not authenticated");
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
        status: 'pending',
        // Include user_id if available
        user_id: userId || null
      };

      // Try to insert directly first (will work if RLS policies allow anonymous inserts)
      try {
        logger.info("Attempting direct submission to database");
        let { data, error } = await supabase
          .from('article_submissions')
          .insert(submissionData)
          .select();

        // If direct insertion fails due to RLS, call an edge function to bypass RLS
        if (error) {
          logger.error("Direct submission error:", error);
          
          if (error.code === '42501' || error.code === '401') {
            logger.info("Direct submission failed due to RLS, trying edge function approach");
            
            // Call our edge function to handle the submission
            logger.info("Calling submit-article edge function");
            const { data: funcData, error: funcError } = await supabase.functions.invoke(
              'submit-article',
              {
                body: submissionData
              }
            );
            
            if (funcError) {
              logger.error('Edge function error:', funcError);
              toast.dismiss();
              toast.error("Une erreur est survenue lors de l'envoi de votre soumission");
              return { success: false, error: funcError };
            }
            
            logger.info("Edge function submission successful", funcData);
            
            // Check notification status from the response
            if (funcData.notification_sent === false) {
              const errorMessage = funcData.notification_message || "L'email de notification n'a pas pu être envoyé.";
              logger.warn("Email notification failed:", errorMessage);
              
              toast.dismiss();
              toast.success("Votre soumission a été enregistrée avec succès!");
              toast.error("Notification d'email: " + errorMessage, { duration: 5000 });
            } else {
              logger.info("Submission and notification successful");
              toast.dismiss();
              toast.success("Votre soumission a été envoyée avec succès!");
            }
            
            data = funcData;
            error = null;
          } else {
            throw error; // Re-throw other errors to be caught by outer catch
          }
        } else {
          logger.info("Direct submission successful");
          toast.dismiss();
          toast.success("Votre soumission a été envoyée avec succès!");
        }
      } catch (submissionError) {
        logger.error('Submission error:', submissionError);
        toast.dismiss();
        toast.error("Une erreur est survenue lors de l'envoi de votre soumission");
        return { success: false, error: submissionError };
      }
      
      // Test email configuration in development mode
      if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
        try {
          logger.info("Development mode: Testing email configuration");
          
          const { data: configData, error: configError } = await supabase.functions.invoke(
            'check-email-config'
          );
          
          if (configError) {
            logger.error('Email config check error:', configError);
          } else if (configData) {
            logger.info('Email configuration status:', configData);
            
            // Log specific issues with the email configuration
            if (!configData.api_key_status?.valid) {
              logger.error('API key issue:', configData.api_key_status?.message);
            }
            
            if (!configData.primary_domain_status?.verified) {
              logger.warn('Domain verification issue:', configData.primary_domain_status?.message);
            }
          }
        } catch (configCheckError) {
          logger.error('Error checking email configuration:', configCheckError);
        }
      }
      
      // Determine where to redirect based on publication type
      if (values.publicationType === 'RHCA') {
        navigate('/rhca');
      } else {
        navigate('/igm');
      }
      
      return { success: true };
    } catch (error) {
      logger.error('Submission error:', error);
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
