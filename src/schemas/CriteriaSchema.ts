import { z } from "zod";

export const CriteriaSchema = z.object({
  name: z.string().trim().min(1, "Name of criteria is required"),
  minScore: z
    .string()
    .trim()
    .min(1, "Minimum score of the criteria is required"),
  maxScore: z
    .string()
    .trim()
    .min(1, "Maximum score of the criteria is required"),
  description: z.string().optional(),
});

export type CriteriaForm = z.infer<typeof CriteriaSchema>;
