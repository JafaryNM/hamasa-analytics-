import { Award } from "./award";

export interface AwardRound {
  uuid: string;
  award: Award;
  name: string;
  number: number;
  score: number;
  isFinal: boolean;
  isCurrent: boolean;
  createdAt?: string;
}
