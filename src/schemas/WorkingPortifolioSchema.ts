import { z } from "zod";

export const workingPortfolioSchema = z
  .object({
    organization: z.object({
      label: z.string().min(1, "Region is required"),
      value: z.string().min(2, "Invalid region"),
    }),
    occupation: z.object({
      label: z.string().min(1, "Region is required"),
      value: z.string().min(2, "Invalid region"),
    }),
    startDate: z
      .union([z.string(), z.date()])
      .transform((val) =>
        val instanceof Date ? val.toISOString().split("T")[0] : val
      )
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Please select a valid start date."
      ),
    endDate: z
      .union([z.string(), z.date()])
      .transform((val) =>
        val instanceof Date ? val.toISOString().split("T")[0] : val
      )
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Please select a valid end date."
      ),
    publishedArticles: z
      .array(
        z.object({
          title: z.string().min(3, "Title must be at least 3 characters"),
          link: z.string().url("Invalid URL format"),
        })
      )
      .optional(),
    linkedinLink: z
      .union([z.string().url("Invalid LinkedIn URL"), z.literal("")])
      .optional(),
    twitterLink: z
      .union([z.string().url("Invalid Twitter URL"), z.literal("")])
      .optional(),
    facebookLink: z
      .union([z.string().url("Invalid Facebook URL"), z.literal("")])
      .optional(),
    websiteLink: z
      .union([z.string().url("Invalid Website URL"), z.literal("")])
      .optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date.",
    path: ["endDate"],
  });

export type WorkingPortfolioData = z.infer<typeof workingPortfolioSchema>;
