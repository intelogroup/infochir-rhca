
import { z } from "zod";

export const articleFormSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(200, "Le titre ne doit pas dépasser 200 caractères"),
  abstract: z.string().min(50, "Le résumé doit contenir au moins 50 caractères").max(2000, "Le résumé ne doit pas dépasser 2000 caractères"),
  publicationType: z.enum(["RHCA", "IGM", "ADC", "INDEX"], {
    required_error: "Veuillez sélectionner un type de publication",
  }),
  authors: z.array(z.string()).min(1, "Au moins un auteur est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  tags: z.array(z.string()).min(1, "Au moins un tag est requis"),
  institution: z.string().min(1, "L'institution est requise"),
  keywords: z.array(z.string()).optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pageNumber: z.string().optional(),
  specialty: z.string().optional(),
  primaryAuthor: z.string().min(1, "L'auteur principal est requis"),
  coAuthors: z.array(z.string()).optional(),
  authorAffiliations: z.array(z.string()).optional(),
  fundingSource: z.string().optional(),
  doi: z.string().optional(),
  status: z.enum(["draft", "published"], {
    required_error: "Veuillez sélectionner un statut",
  }),
});
