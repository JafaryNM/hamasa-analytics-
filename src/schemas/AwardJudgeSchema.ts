import { z } from "zod";

export const AwardJudgeSchema = z.object({
  judge: z.object({
    label: z.string().min(1, "Judge is required"),
    value: z.string().min(2, "Invalid Judge"),
  }),
});

export type AwardJudgeForm = z.infer<typeof AwardJudgeSchema>;
