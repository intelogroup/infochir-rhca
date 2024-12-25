import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  volume: z.string().optional(),
  issueNumber: z.number().optional(),
  source: z.string().min(1, "Source is required"),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;