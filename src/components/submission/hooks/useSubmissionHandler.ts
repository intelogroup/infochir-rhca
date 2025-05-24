
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

      logger.info("Calling submit-article edge function with data:", {
        title: submissionData.title,
        userEmail: submissionData.corresponding_author_email,
        fileCount: submissionData.article_files_urls.length
      });

      // Call our edge function to handle the submission
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
      
      logger.info("Edge function submission successful", {
        submissionId: funcData.id,
        notificationSent: funcData.notification_sent
      });
      
      toast.dismiss();
      
      // Check notification status from the response
      if (funcData.notification_sent === false) {
        const errorMessage = funcData.notification_message || "L'email de notification n'a pas pu être envoyé.";
        logger.warn("Email notification failed:", errorMessage);
        
        // Show success for submission but warning for email
        toast.success("Votre soumission a été enregistrée avec succès!");
        
        // Show detailed email error information
        if (errorMessage.includes("API key")) {
          toast.error("Configuration email manquante - L'administrateur sera notifié", { 
            duration: 6000,
            description: "Votre soumission est sauvegardée mais l'email automatique n'a pas pu être envoyé."
          });
        } else if (errorMessage.includes("rate limit")) {
          toast.warning("Email temporairement indisponible", {
            duration: 4000,
            description: "Votre soumission est enregistrée. L'équipe sera notifiée manuellement."
          });
        } else {
          toast.error("Notification email échouée: " + errorMessage, { 
            duration: 5000,
            description: "Votre soumission est sauvegardée."
          });
        }
      } else {
        logger.info("Submission and notification successful");
        toast.success("Votre soumission a été envoyée avec succès!");
        
        // Show additional confirmation if we have notification details
        if (funcData.notification_details?.results) {
          const results = funcData.notification_details.results;
          const adminSuccess = results.find(r => r.type === 'admin')?.success;
          const userSuccess = results.find(r => r.type === 'user')?.success;
          
          if (adminSuccess && userSuccess) {
            toast.success("Emails de confirmation envoyés avec succès", {
              duration: 3000,
              description: "Vous et l'équipe éditoriale avez reçu une confirmation."
            });
          } else if (userSuccess) {
            toast.success("Email de confirmation envoyé", {
              duration: 3000,
              description: "Vérifiez votre boîte de réception."
            });
          }
        }
      }
      
      // Test email configuration in development mode for debugging
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
            
            // Show developer notifications for configuration issues
            if (configData.overall_status === "CONFIGURATION_NEEDED") {
              console.warn("Email configuration needs attention:", configData.recommendations);
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
