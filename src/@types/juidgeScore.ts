import { AwardCriteria } from "./awardCriteria";

export interface JudgeScore {
  awardCriteria: AwardCriteria;
  score: string;
  comments: string;
}
