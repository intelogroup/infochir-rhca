
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionFormSchema, SubmissionFormValues } from "../schema";

export const useSubmissionForm = (articleFiles: string[]) => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      ethicsApproval: false,
      noConflict: false,
      originalWork: false,
    },
    mode: "onChange", // Real-time validation
  });

  // Watch for form changes
  const formValues = form.watch();

  // Effect to validate declarations when the form changes
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

    setFormErrors(newErrors);
  }, [formValues, articleFiles, formErrors]);

  return { form, formErrors, setFormErrors };
};
