
import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

import { SubmissionHeader } from "@/components/submission/SubmissionHeader";
import { PublicationTypeField } from "@/components/submission/PublicationTypeField";
import { ArticleDetailsFields } from "@/components/submission/ArticleDetailsFields";
import { CorrespondingAuthorFields } from "@/components/submission/CorrespondingAuthorFields";
import { AbstractField } from "@/components/submission/AbstractField";
import { DeclarationsFields } from "@/components/submission/DeclarationsFields";
import { MultiFileUploader } from "@/components/pdf/MultiFileUploader";

const formSchema = z.object({
  publicationType: z.enum(["RHCA", "IGM"], {
    required_error: "Veuillez sélectionner un type de publication",
  }),
  title: z.string().min(1, "Le titre est requis").max(200, "Le titre ne doit pas dépasser 200 caractères"),
  authors: z.string().min(1, "Les auteurs sont requis"),
  institution: z.string().min(1, "L'institution est requise"),
  keywords: z.string()
    .min(1, "Les mots clés sont requis")
    .refine(
      (val) => val.split(",").length >= 3 && val.split(",").length <= 5,
      "Veuillez fournir entre 3 et 5 mots clés"
    ),
  correspondingAuthor: z.object({
    name: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(1, "Le téléphone est requis"),
    address: z.string().min(1, "L'adresse est requise"),
  }),
  abstract: z.string()
    .min(50, "Le résumé doit contenir au moins 50 mots")
    .max(250, "Le résumé ne doit pas dépasser 250 mots"),
  ethicsApproval: z.boolean(),
  noConflict: z.boolean(),
  originalWork: z.boolean(),
});

const Submission: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [articleFiles, setArticleFiles] = useState<string[]>([]);
  const [imageAnnexes, setImageAnnexes] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ethicsApproval: false,
      noConflict: false,
      originalWork: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (articleFiles.length === 0) {
      toast.error("Veuillez uploader au moins un fichier d'article");
      return;
    }

    try {
      setIsSubmitting(true);
      
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
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Votre soumission a été envoyée avec succès!");
      
      // Redirect based on publication type
      if (values.publicationType === 'RHCA') {
        navigate('/rhca');
      } else {
        navigate('/igm');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Une erreur est survenue lors de l'envoi de votre soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
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
                <div className="space-y-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
                  <PublicationTypeField form={form} />
                  <ArticleDetailsFields form={form} />
                  <CorrespondingAuthorFields form={form} />
                  <AbstractField form={form} />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Fichiers de l'article</h3>
                    <MultiFileUploader
                      bucket="article_files"
                      acceptedFileTypes={{
                        'application/pdf': ['.pdf'],
                        'application/msword': ['.doc'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                      }}
                      maxFileSize={10}
                      maxFiles={3}
                      onUploadComplete={setArticleFiles}
                      helperText="Formats acceptés: DOC, DOCX, PDF. Taille max: 10MB"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Images et annexes</h3>
                    <MultiFileUploader
                      bucket="article_annexes"
                      acceptedFileTypes={{
                        'image/*': ['.png', '.jpg', '.jpeg', '.gif']
                      }}
                      maxFileSize={5}
                      maxFiles={5}
                      onUploadComplete={setImageAnnexes}
                      helperText="Formats acceptés: PNG, JPEG, GIF. Taille max: 5MB"
                    />
                  </div>

                  <DeclarationsFields form={form} />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="gap-2"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4" />
                    Sauvegarder comme brouillon
                  </Button>
                  <Button 
                    type="submit"
                    className="gap-2"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Envoi en cours..." : "Soumettre l'article"}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Submission;
