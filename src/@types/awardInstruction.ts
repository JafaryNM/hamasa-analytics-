import { Award } from "./award";

export interface AwardInstruction {
  uuid: string;
  award: Award;
  number: number;
  instruction: string;
  createdAt?: string;
}
