import { z } from "zod";

export const AwardSchema = z.object({
  title: z.string().trim().min(1, "Title of the award is required"),
  description: z.string().trim().min(1, "Description of the award is required"),
  startDate: z.date({ message: "Start date of the award is required" }),
  endDate: z.date({ message: "End date of the award is required" }),
  judgeAccessStartDate: z.date({
    message: "Judge access start date of the award is required",
  }),
  judgeAccessEndDate: z.date({
    message: "Judge access end date of the award is required",
  }),
  resultsReleaseDate: z.date({
    message: "Release date  of the award is required",
  }),
});

export type AwardForm = z.infer<typeof AwardSchema>;
