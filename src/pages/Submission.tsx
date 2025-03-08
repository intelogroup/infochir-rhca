import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import MainLayout from '@/components/layouts/MainLayout';
import { SubmissionHeader } from '@/components/submission/SubmissionHeader';
import { ArticleDetailsFields } from '@/components/submission/ArticleDetailsFields';
import { CorrespondingAuthorFields } from '@/components/submission/CorrespondingAuthorFields';
import { PublicationTypeField } from '@/components/submission/PublicationTypeField';
import { AbstractField } from '@/components/submission/AbstractField';
import { DeclarationsFields } from '@/components/submission/DeclarationsFields';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(5, { message: "Le titre doit contenir au moins 5 caractères" }),
  authors: z.string().min(2, { message: "Veuillez indiquer les auteurs" }),
  institution: z.string().min(2, { message: "Veuillez indiquer l'institution" }),
  keywords: z.string().min(2, { message: "Veuillez indiquer les mots-clés" }),
  abstract: z.string().min(50, { message: "Le résumé doit contenir au moins 50 caractères" }),
  publicationType: z.enum(["IGM", "RHCA"]),
  correspondingAuthor: z.object({
    name: z.string().min(2, { message: "Veuillez indiquer le nom de l'auteur correspondant" }),
    email: z.string().email({ message: "Email invalide" }),
    phone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
    address: z.string().min(5, { message: "Veuillez indiquer l'adresse complète" }),
  }),
  ethicsApproval: z.boolean().refine(val => val === true, { 
    message: "Vous devez confirmer l'approbation éthique" 
  }),
  noConflict: z.boolean().refine(val => val === true, { 
    message: "Vous devez confirmer l'absence de conflit d'intérêt" 
  }),
  originalWork: z.boolean().refine(val => val === true, { 
    message: "Vous devez confirmer qu'il s'agit d'un travail original" 
  }),
});

// Form type based on schema
type FormValues = z.infer<typeof formSchema>;

const Submission = () => {
  const [tab, setTab] = useState("details");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
        description: "Votre article a été soumis avec succès. Nous vous contacterons prochainement.",
        variant: "default",
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error("Submission error:", error);
      
      toast({
        title: "Erreur de soumission",
        description: "Une erreur est survenue lors de la soumission. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if current tab is valid
  const isCurrentTabValid = () => {
    const { errors, touchedFields } = form.formState;
    
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
    <MainLayout>
      <SubmissionHeader />
      
      <div className="container max-w-4xl py-8">
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
      </div>
    </MainLayout>
  );
};

export default Submission;
