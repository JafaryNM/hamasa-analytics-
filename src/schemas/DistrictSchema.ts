import { z } from "zod";

export const DistrictSchema = z.object({
  name: z.string().trim().min(1, "Name of district is required"),
  region: z.object({
    label: z.string().min(1, "Region is required"),
    value: z.string().min(2, "Invalid region"),
  }),
});

export type DistrictForm = z.infer<typeof DistrictSchema>;
