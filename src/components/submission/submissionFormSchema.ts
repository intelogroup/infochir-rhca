
import { z } from 'zod';

export const submissionFormSchema = z.object({
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
