import { z } from "zod";

export const AdminSchema = z.object({
  firstName: z.string().trim().min(1, "First name of user is required"),
  lastName: z.string().trim().min(1, "Last name of user is required"),
  email: z
    .string({
      required_error: "Please enter your email.",
    })
    .email("Please provide a valid email address."),
  phone: z
    .string({
      required_error: "Please enter your phone number.",
    })
    .length(10, "Please enter a valid phone number."),
  gender: z.object({
    label: z.string().min(1, "Gender is required"),
    value: z.string().min(2, "Invalid gender"),
  }),
});

export type AdminForm = z.infer<typeof AdminSchema>;
