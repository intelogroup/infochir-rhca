
import { z } from "zod";

export const submissionFormSchema = z.object({
  publicationType: z.enum(["RHCA", "IGM"], {
    required_error: "Veuillez sélectionner un type de publication",
  }),
  title: z.string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre ne doit pas dépasser 200 caractères"),
  authors: z.string()
    .min(1, "Les auteurs sont requis"),
  institution: z.string()
    .min(1, "L'institution est requise"),
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
    .refine(
      (val) => {
        const wordCount = val.trim().split(/\s+/).filter(Boolean).length;
        return wordCount <= 3000;
      },
      "Le résumé ne doit pas dépasser 3000 mots"
    ),
  ethicsApproval: z.boolean(),
  noConflict: z.boolean(),
  originalWork: z.boolean(),
});

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>;
