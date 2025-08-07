import { z } from "zod";

export const AwardCategorySchema = z.object({
  category: z.object({
    label: z.string().min(1, "Category is required"),
    value: z.string().min(2, "Invalid category"),
  }),
});

export type AwardCategoryForm = z.infer<typeof AwardCategorySchema>;
