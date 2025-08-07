import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().trim().min(1, "Name of category is required"),
  description: z.string().optional(),
});

export type CategoryForm = z.infer<typeof CategorySchema>;
