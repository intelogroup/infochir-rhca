
import { z } from "zod";

export const correspondingAuthorSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const submissionFormSchema = z.object({
  publicationType: z.enum(["RHCA", "IGM", "ATLAS"], {
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
  correspondingAuthor: correspondingAuthorSchema,
  abstract: z.string()
    .min(50, "Le résumé doit contenir au moins 50 mots")
    .refine(
      (val) => {
        const wordCount = val.trim().split(/\s+/).filter(Boolean).length;
        return wordCount <= 3000;
      },
      "Le résumé ne doit pas dépasser 3000 mots"
    ),
  notes: z.string().optional(),
  ethicsApproval: z.boolean().optional(),
  noConflict: z.boolean().optional(),
  originalWork: z.boolean().optional(),
});

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>;
export type CorrespondingAuthorValues = z.infer<typeof correspondingAuthorSchema>;
