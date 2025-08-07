import { Award } from "./award";
import { Category } from "./category";

export interface AwardCategory {
  uuid: string;
  award: Award;
  category: Category;
  createdAt?: string;
}
