export interface JudgeScore {
  uuid: string;
  score: number;
  comments: string;
  status: string;
  isActive: boolean;
  createdAt?: string;
}
