import { z } from "zod";

export const AwardRoundSchema = z.object({
  name: z.string().trim().min(1, "Name of the round is required"),
  number: z.string().trim().min(1, "Number of the round is required"),
  score: z.string().trim().min(1, "Score of the round is required"),
  isFinal: z.object({
    label: z.string().min(1, "This field is required"),
    value: z.string().min(2, "Invalid value"),
  }),
});

export type AwardRoundForm = z.infer<typeof AwardRoundSchema>;
