
import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Form } from "@/components/ui/form";
import { motion } from "framer-motion";
import { FormErrors } from "@/components/admin/article-form/FormErrors";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Newly refactored components
import { submissionFormSchema } from "@/components/submission/schema";
import { useSubmissionForm } from "@/components/submission/hooks/useSubmissionForm";
import { useSubmissionHandler } from "@/components/submission/hooks/useSubmissionHandler";
import { SubmissionHeader } from "@/components/submission/SubmissionHeader";
import { PublicationTypeField } from "@/components/submission/PublicationTypeField";
import { ArticleDetailsFields } from "@/components/submission/ArticleDetailsFields";
import { CorrespondingAuthorFields } from "@/components/submission/CorrespondingAuthorFields";
import { AbstractField } from "@/components/submission/AbstractField";
import { DeclarationsFields } from "@/components/submission/DeclarationsFields";
import { FileUploadsSection } from "@/components/submission/FileUploadsSection";
import { SubmissionFormActions } from "@/components/submission/SubmissionFormActions";

const Submission = () => {
  const [articleFiles, setArticleFiles] = useState<string[]>([]);
  const [imageAnnexes, setImageAnnexes] = useState<string[]>([]);
  
  // Use our custom hooks
  const { form, formErrors, setFormErrors } = useSubmissionForm(articleFiles);
  const { isSubmitting, handleSubmit, handleSaveDraft } = useSubmissionHandler();

  const onSubmit = async (values: any) => {
    const result = await handleSubmit(values, articleFiles, imageAnnexes, formErrors);
    
    if (!result.success && result.errors) {
      setFormErrors(result.errors);
    }
  };

  return (
    <MainLayout>
      {isSubmitting && (
        <LoadingSpinner 
          fullScreen
          text="Envoi de votre soumission en cours..."
          variant="medical"
          size="lg"
        />
      )}
      
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <SubmissionHeader />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <motion.div 
                  className="space-y-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Display form errors */}
                  <FormErrors errors={{
                    ...formErrors,
                    ...Object.entries(form.formState.errors).reduce((acc, [key, error]) => {
                      if (error && error.message) {
                        if (key.includes('correspondingAuthor.')) {
                          const fieldName = key.replace('correspondingAuthor.', '');
                          acc[`author_${fieldName}`] = error.message as string;
                        } else {
                          acc[key] = error.message as string;
                        }
                      }
                      return acc;
                    }, {} as Record<string, string>)
                  }} />

                  <PublicationTypeField form={form} />
                  <ArticleDetailsFields form={form} />
                  <CorrespondingAuthorFields form={form} />
                  <AbstractField form={form} />
                  
                  <FileUploadsSection 
                    articleFiles={articleFiles}
                    setArticleFiles={setArticleFiles}
                    imageAnnexes={imageAnnexes}
                    setImageAnnexes={setImageAnnexes}
                    formErrors={formErrors}
                  />

                  <DeclarationsFields form={form} />
                  {formErrors.declarations && (
                    <p className="text-sm text-destructive">{formErrors.declarations}</p>
                  )}
                </motion.div>

                <SubmissionFormActions 
                  isSubmitting={isSubmitting}
                  isValid={form.formState.isValid}
                  hasErrors={Object.keys(formErrors).length > 0}
                  onSaveDraft={handleSaveDraft}
                />
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Submission;
