
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionFormSchema, SubmissionFormValues } from "../schema";

export const useSubmissionForm = (articleFiles: string[]) => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [hasSubmissionAttempt, setHasSubmissionAttempt] = useState(false);
  const scrollToErrorRef = useRef<(() => void) | null>(null);
  
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

  // Function to scroll to first error
  const scrollToFirstError = () => {
    setHasSubmissionAttempt(true);
    
    // Combine form errors with validation errors
    const allErrors = {
      ...formErrors,
      ...Object.keys(form.formState.errors).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>)
    };

    // Get first error field
    const errorFields = Object.keys(allErrors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      
      // Map field names to more specific selectors if needed
      let selector = `[name="${firstErrorField}"]`;
      
      if (firstErrorField === 'articleFiles') {
        selector = '[data-field="articleFiles"]';
      } else if (firstErrorField === 'declarations') {
        selector = '[data-field="declarations"]';
      } else if (firstErrorField === 'publicationType') {
        selector = '[data-field="publicationType"]';
      } else if (firstErrorField.startsWith('correspondingAuthor.')) {
        const subField = firstErrorField.replace('correspondingAuthor.', '');
        selector = `[name="correspondingAuthor.${subField}"]`;
      }

      // Scroll to the element
      setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Focus the element if it's focusable
          if (element instanceof HTMLElement && element.focus) {
            element.focus();
          }
        }
      }, 100);
    }
  };

  return { 
    form, 
    formErrors, 
    setFormErrors, 
    hasUserInteracted,
    setHasUserInteracted,
    hasSubmissionAttempt,
    scrollToFirstError
  };
};
