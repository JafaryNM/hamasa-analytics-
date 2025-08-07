import { z } from "zod";

export const EducationLevelSchema = z.object({
  name: z.string().trim().min(1, "Name of education level is required"),
});

export type EducationLevelForm = z.infer<typeof EducationLevelSchema>;
