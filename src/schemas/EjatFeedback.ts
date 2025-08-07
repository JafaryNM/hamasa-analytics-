import { z } from "zod";

// Enums
const ExperienceRatingEnum = z.enum(["Excellent", "Good", "Fair", "Poor"]);
const CriteriaClarityEnum = z.enum([
  "Very clear",
  "Somewhat clear",
  "Not clear",
  "Not applicable",
]);
const SupportReceivedEnum = z.enum(["Yes", "Partially", "No"]);
const SubmissionQualityEnum = z.enum([
  "Very high",
  "Satisfactory",
  "Mixed",
  "Generally low",
]);
const WillingToJudgeEnum = z.enum(["Yes", "No", "Maybe"]);
const JournalismStateEnum = z.enum(["Thriving", "Declining"]);

// Schema
export const EjatFeedbackSchema = z
  .object({
    experienceRating: ExperienceRatingEnum,
    criteriaClarity: CriteriaClarityEnum,
    supportReceived: SupportReceivedEnum,
    submissionQuality: SubmissionQualityEnum,
    challenges: z.string().optional(),
    difficultCategories: z.string().optional(),
    improvements: z.string().optional(),
    willingToJudge: WillingToJudgeEnum,
    maybeReason: z.string().optional(),
    journalismState: JournalismStateEnum,
    reasonForDeclining: z.string().optional(),
    reasonForThriving: z.string().optional(),
  })
  .refine(
    (data) =>
      data.willingToJudge !== "Maybe" ||
      (data.maybeReason && data.maybeReason.trim() !== ""),
    {
      path: ["maybeReason"],
      message: "Please explain why you selected 'Maybe'",
    }
  )
  .refine(
    (data) =>
      data.journalismState !== "Declining" ||
      (data.reasonForDeclining && data.reasonForDeclining.trim() !== ""),
    {
      path: ["reasonForDeclining"],
      message: "Please explain why you believe journalism is declining.",
    }
  )
  .refine(
    (data) =>
      data.journalismState !== "Thriving" ||
      (data.reasonForThriving && data.reasonForThriving.trim() !== ""),
    {
      path: ["reasonForThriving"],
      message: "Please explain why you believe journalism is thriving.",
    }
  );

export type EjatFeedbackFormData = z.infer<typeof EjatFeedbackSchema>;
