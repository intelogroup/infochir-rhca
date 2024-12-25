import * as z from "zod";

export const articleFormSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  abstract: z.string()
    .min(1, "Abstract is required")
    .min(10, "Abstract must be at least 10 characters"),
  volume: z.string().optional(),
  issueNumber: z.number().int().positive().optional(),
  source: z.enum(["RHCA", "IGM", "ATLAS", "ADC"]),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;