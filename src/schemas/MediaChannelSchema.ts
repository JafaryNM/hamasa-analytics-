import { z } from "zod";

export const MediaChannelSchema = z.object({
  name: z.string().trim().min(1, "Name of media channel is required"),
  description: z.string().optional(),
});

export type MediaChannelForm = z.infer<typeof MediaChannelSchema>;
