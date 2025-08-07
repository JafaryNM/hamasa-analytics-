import { z } from "zod";

export const OrganizationSchema = z.object({
  name: z.string().trim().min(1, "Name of organization is required"),
});

export type OrganizationForm = z.infer<typeof OrganizationSchema>;
