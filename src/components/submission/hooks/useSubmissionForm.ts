
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionFormSchema, SubmissionFormValues } from "../schema";

export const useSubmissionForm = (articleFiles: string[]) => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      publicationType: undefined,
      title: "",
      authors: "",
      institution: "",
      keywords: "",
      correspondingAuthor: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      abstract: "",
      ethicsApproval: false,
      noConflict: false,
      originalWork: false,
    },
    mode: "onChange",
  });

  // Watch for form changes
  const formValues = form.watch();

  // Track when user starts interacting with the form
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && name) {
        setHasUserInteracted(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Effect to validate files and declarations
  useEffect(() => {
    const newErrors = {...formErrors};
    
    // Validate article files
    if (articleFiles.length === 0) {
      newErrors.articleFiles = "Veuillez uploader au moins un fichier d'article";
    } else {
      delete newErrors.articleFiles;
    }

    // Validate declarations
    if (!formValues.ethicsApproval || !formValues.noConflict || !formValues.originalWork) {
      newErrors.declarations = "Toutes les déclarations doivent être acceptées";
    } else {
      delete newErrors.declarations;
    }

    // Validate publication type
    if (!formValues.publicationType) {
      newErrors.publicationType = "Veuillez sélectionner un type de publication";
    } else {
      delete newErrors.publicationType;
    }

    setFormErrors(newErrors);
  }, [formValues, articleFiles]);

  return { 
    form, 
    formErrors, 
    setFormErrors, 
    hasUserInteracted,
    setHasUserInteracted 
  };
};
