import { z } from "zod";

export const AwardInstructionSchema = z.object({
  number: z.string().trim().min(1, "Number of the instruction is required"),
  instruction: z.string().trim().min(1, "Instruction of the award is required"),
});

export type AwardInstructionForm = z.infer<typeof AwardInstructionSchema>;
