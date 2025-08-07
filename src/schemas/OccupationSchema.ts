import { z } from "zod";

export const OccupationSchema = z.object({
  name: z.string().trim().min(1, "Name of occupation is required"),
});

export type OccupationForm = z.infer<typeof OccupationSchema>;
