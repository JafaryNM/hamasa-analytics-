export interface ApplicationResult {
  uuid: string;
  title: string;
  description: string;
  isGroup: boolean;
  status: string;
  statusComments: string;
  publishedDate: string;
  awardUuid: string;
  awardTitle: string;
  awardCategoryUuid: string;
  categoryUuid: string;
  categoryName: string;
  awardRoundUuid: string;
  awardRoundName: string;
  totalScore: number;
  createdAt: string;
}

export interface ApplicationResultResponse {
  totalPages: number;
  total: number;
  data: ApplicationResult[];
}
