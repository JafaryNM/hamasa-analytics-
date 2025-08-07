import { z } from "zod";

// Published Work (Link or File)
const PublishedWorkSchema = z
  .object({
    title: z.string().min(1, "Work title is required"),
    submissionType: z.enum(["link", "file"], {
      required_error: "Choose submission method",
    }),
    link: z.string().url("Provide a valid URL").optional(),
    file: z.any().optional(), // Adapt based on your Upload structure
  })
  .refine(
    (data) =>
      (data.submissionType === "link" && !!data.link) ||
      (data.submissionType === "file" && !!data.file),
    {
      message: "Provide a valid link or file based on selected method.",
      path: ["submissionType"],
    }
  );

// Main Schema
export const BasicApplicationInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  awardCategoryUuid: z.string().min(1, "Award category is required"),
  description: z.string().min(1, "Description is required"),

  isGroup: z.object({
    label: z.string().min(1, "Required"),
    value: z.enum(["true", "false"], {
      errorMap: () => ({ message: "Invalid option" }),
    }),
  }),

  publishedDate: z
    .union([z.string(), z.date()])
    .transform((val) =>
      val instanceof Date ? val.toISOString().split("T")[0] : val
    )
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please select a valid date",
    }),

  publishedWorks: z
    .array(PublishedWorkSchema)
    .min(2, "Submit at least two published work samples"),

  // Upload fields
  conceptNote: z.any({
    required_error: "Concept Note is required",
  }),
  motivationStatement: z.any({
    required_error: "Motivation Statement is required",
  }),
  newsroomExperience: z.any({
    required_error:
      "Please upload your answer to 'How will you use this experience...'",
  }),
  cv: z.any({
    required_error: "CV upload is required",
  }),
  recommendationLetter: z.any().optional(), // Optional
});

export type BasicApplicationInfoData = z.infer<
  typeof BasicApplicationInfoSchema
>;
