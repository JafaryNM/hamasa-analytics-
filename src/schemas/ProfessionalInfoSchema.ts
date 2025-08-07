import { z } from "zod";

export const professionalInfoSchema = z
  .object({
   
    bio: z.string().trim().min(10, "Bio should be at least 10 characters long"),

    expertise: z
      .array(z.string())
      .nonempty("At least one expertise is required"),

    experience: z.preprocess(
      (val) => Number(val), 
      z
        .number()
        .min(1, "Years of experience is required")
        .max(100, "Experience cannot be more than 100 years")
    ),

  
    educationLevel: z
      .union([
        z
          .object({
            uuid: z.string().uuid("Invalid education level ID"),
            name: z.string().min(1, "Invalid education level name"),
          }),
        z.null(),
        z.undefined(),
      ])
      .optional(),

   
    eduSchool: z.string().min(1, "College name is required"),

  
    eduCompletionYear: z
      .preprocess(
        (val) => (typeof val === "number" ? val.toString() : val), 
        z
          .string()
          .regex(/^\d{4}$/, "Invalid year format (YYYY)")
          .optional()
          .nullable()
          .refine((year) => {
            if (!year) return true; // Allow empty values
            const numYear = parseInt(year, 10);
            return numYear >= 1900 && numYear <= new Date().getFullYear();
          }, "Year must be between 1900 and the current year")
      ),
  })


  .refine(
    (data) => {
      if (data.educationLevel && !data.eduSchool) {
        return false;
      }
      return true;
    },
    {
      message: "School name is required if education level is selected",
      path: ["eduSchool"],
    }
  );

export type ProfessionalInfoData = z.infer<typeof professionalInfoSchema>;
