import { z } from "zod";

export const CollaboratorInfoSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional(),
}).refine((data) => data.email || data.phoneNumber, {
  message: "Either email or phone number is required",
});

export type CollaboratorInfoData = z.infer<typeof CollaboratorInfoSchema>;
