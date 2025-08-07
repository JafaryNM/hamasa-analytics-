import { Award } from "./award";
import { Criteria } from "./criteria";

export interface AwardCriteria {
  uuid: string;
  award: Award;
  criteria: Criteria;
  createdAt?: string;
}
