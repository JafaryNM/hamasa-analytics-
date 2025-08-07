import { z } from "zod";

export const basicInfoSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
  gender: z.string().optional(),
  dateOfBirth: z
    .union([z.string(), z.date()])
    .transform((val) =>
      val instanceof Date ? val.toISOString().split("T")[0] : val
    )
    .refine((val) => !isNaN(Date.parse(val)), "Please select a valid date."),
  nationality: z.string().optional(),
  address: z.string().optional(),
  region: z.object({
    label: z.string().min(1, "Region is required"),
    value: z.string().min(2, "Invalid region"),
  }),
  district: z.object({
    label: z.string().min(1, "District is required"),
    value: z.string().min(2, "Invalid district"),
  }),
  profilePicture: z
    .union([
      z
        .instanceof(File, { message: "Image is required" })
        .refine((file) => !file || file.size !== 0 || file.size <= 5000000, {
          message: "Max size exceeded",
        }),
      z.string().optional(), // to hold default image
    ])
    .refine((value) => value instanceof File || typeof value === "string", {
      message: "Image is required",
    }),
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;
