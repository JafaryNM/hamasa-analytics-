import { z } from "zod";

export const AwardCriteriaSchema = z.object({
  criteria: z.object({
    label: z.string().min(1, "Criteria is required"),
    value: z.string().min(2, "Invalid criteria"),
  }),
});

export type AwardCriteriaForm = z.infer<typeof AwardCriteriaSchema>;
