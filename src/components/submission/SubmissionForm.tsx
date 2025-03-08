
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ArticleDetailsFields } from './ArticleDetailsFields';
import { CorrespondingAuthorFields } from './CorrespondingAuthorFields';
import { PublicationTypeField } from './PublicationTypeField';
import { AbstractField } from './AbstractField';
import { DeclarationsFields } from './DeclarationsFields';
import { submissionFormSchema } from './submissionFormSchema';

type FormValues = z.infer<typeof submissionFormSchema>;

interface SubmissionFormProps {
  onSubmitSuccess?: () => void;
}

export const SubmissionForm = ({ onSubmitSuccess }: SubmissionFormProps) => {
  const [tab, setTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      title: "",
      authors: "",
      institution: "",
      keywords: "",
      abstract: "",
      publicationType: "IGM",
      correspondingAuthor: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      ethicsApproval: false,
      noConflict: false,
      originalWork: false,
    }
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Form submitted:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Soumission réussie",
        description: "Votre article a été soumis avec succès. Nous vous contacterons prochainement."
      });
      
      // Reset form
      form.reset();
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
    } catch (error) {
      console.error("Submission error:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur de soumission",
        description: "Une erreur est survenue lors de la soumission. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if current tab is valid
  const isCurrentTabValid = () => {
    const { errors } = form.formState;
    
    switch (tab) {
      case "details":
        return !errors.title && !errors.authors && !errors.institution && 
               !errors.keywords && !errors.publicationType;
      case "abstract":
        return !errors.abstract;
      case "author":
        return !errors.correspondingAuthor?.name && !errors.correspondingAuthor?.email && 
               !errors.correspondingAuthor?.phone && !errors.correspondingAuthor?.address;
      case "declarations":
        return !errors.ethicsApproval && !errors.noConflict && !errors.originalWork;
      default:
        return true;
    }
  };
  
  // Navigate to next tab if current is valid
  const handleNextTab = () => {
    const tabs = ["details", "abstract", "author", "declarations"];
    const currentIndex = tabs.indexOf(tab);
    
    if (currentIndex < tabs.length - 1) {
      setTab(tabs[currentIndex + 1]);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="abstract">Résumé</TabsTrigger>
          <TabsTrigger value="author">Auteur correspondant</TabsTrigger>
          <TabsTrigger value="declarations">Déclarations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <PublicationTypeField form={form} />
          <ArticleDetailsFields form={form} />
          
          <div className="flex justify-end mt-6">
            <Button 
              type="button" 
              onClick={handleNextTab}
              disabled={!isCurrentTabValid()}
            >
              Suivant
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="abstract" className="space-y-4">
          <AbstractField form={form} />
          
          <div className="flex justify-end mt-6">
            <Button 
              type="button" 
              onClick={handleNextTab}
              disabled={!isCurrentTabValid()}
            >
              Suivant
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="author" className="space-y-4">
          <CorrespondingAuthorFields form={form} />
          
          <div className="flex justify-end mt-6">
            <Button 
              type="button" 
              onClick={handleNextTab}
              disabled={!isCurrentTabValid()}
            >
              Suivant
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="declarations" className="space-y-4">
          <DeclarationsFields form={form} />
          
          <div className="flex justify-end mt-6">
            <Button 
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Soumission en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Soumettre l'article
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};
