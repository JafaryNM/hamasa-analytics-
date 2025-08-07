import { z } from "zod";

export const ExpertiseSchema = z.object({
  name: z.string().trim().min(1, "Name of expertise is required"),
});

export type ExpertiseForm = z.infer<typeof ExpertiseSchema>;
