import { z } from "zod";

export const ApplicationCommentSchema = z.object({
  comments: z.string().min(1, "Comments are required"),
});

export type ApplicationCommentForm = z.infer<typeof ApplicationCommentSchema>;
