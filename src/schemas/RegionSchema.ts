import { z } from "zod";

export const RegionSchema = z.object({
  name: z.string().trim().min(1, "Name of region is required"),
});

export type RegionForm = z.infer<typeof RegionSchema>;
