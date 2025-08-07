import { Award } from "./award";
import { Judge } from "./judge";

export interface AwardJudge {
  uuid: string;
  award: Award;
  judge: Judge;
  createdAt?: string;
}
