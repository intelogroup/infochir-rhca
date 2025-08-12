
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FileUploaders } from "./article-form/FileUploaders";
import { PublicationTypeSelector } from "./article-form/PublicationTypeSelector";
import { ArticleDetails } from "./article-form/ArticleDetails";
import { CoverImageUploader } from "./article-form/CoverImageUploader";
import { Article, ArticleFormData } from "@/types/article";
import { FormErrors } from "./article-form/FormErrors";
import { StatusSelector } from "./article-form/StatusSelector";
import { useArticleFormState } from "./article-form/useArticleFormState";
import { useSubmissionHandler } from "./article-form/useSubmissionHandler";

interface ArticleFormProps {
  initialData?: Article;
  onSubmit?: (data: ArticleFormData) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
}

export const ArticleForm = ({ initialData, onSubmit: customSubmit, isLoading = false, isEditing = false }: ArticleFormProps) => {
  const {
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
  } = useArticleFormState({ initialData, isEditing });

  const { handleSubmit } = useSubmissionHandler({
    articleFilesUrls,
    coverImageUrl,
    setFormErrors,
    setIsSubmitting,
    setCoverImageUrl,
    setArticleFilesUrls,
    setImageAnnexesUrls,
    form,
    customSubmit
  });

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
          
          <StatusSelector form={form} />

          <ArticleDetails form={form} />
          
          {!isEditing && (
            <>
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
            </>
          )}

          {isEditing && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Les fichiers PDF et images de couverture ne peuvent pas être modifiés. 
                Seules les informations textuelles peuvent être mises à jour.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!isFormValid || isSubmitting || isLoading}
            className="min-w-[200px]"
          >
            {isSubmitting || isLoading 
              ? (isEditing ? "Mise à jour en cours..." : "Création en cours...")
              : isEditing 
                ? "Mettre à jour l'article"
                : "Créer l'article"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};
