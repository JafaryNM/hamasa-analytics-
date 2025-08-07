import { z } from "zod";

export const JudgeScoreSchema = z.object({
  label: z.string().optional(),
  awardCriteriaUuid: z.string().optional(),
  score: z.number().min(1, "Minimum score is 1").max(10, "Maximum score is 10"),
  comments: z.string().min(2, "Comments is required"),
});

export type JudgeScoreForm = z.infer<typeof JudgeScoreSchema>;

export const JudgeApplicationReviewSchema = z.object({
  judgeReviews: z.array(JudgeScoreSchema).nonempty("Reviews are required"),
});

export type JudgeApplicationReviewForm = z.infer<
  typeof JudgeApplicationReviewSchema
>;
