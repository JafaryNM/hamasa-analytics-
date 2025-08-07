import { z } from "zod";

export const JudgeApplicationSchema = z.object({
  score: z.number().min(1).max(10),
  comments: z.string().min(1).max(1000),
  awardUuid: z.string(),
  awardRoundUuid: z.string(),
  applicationUuid: z.string(),
});

export type JudgeApplicationForm = z.infer<typeof JudgeApplicationSchema>;
