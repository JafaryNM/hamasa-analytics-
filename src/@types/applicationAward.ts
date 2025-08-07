import { Award } from "./award";
import { AwardCategory } from "./awardCategory";
import { JudgeScore } from "./judgeScore";
import { MediaChannel } from "./mediaChannel";
import { RoundScore } from "./roundScore";

export interface Attachment {
  uuid: string;
  title?: string;
  filename?: string;
  url: string;
  type: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface MemberDetails {
  uuid: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

export interface Member {
  uuid: string;
  member: MemberDetails;
  type: string;
}

export interface ApplicationAward {
  uuid: string;
  title: string;
  description: string;
  isGroup: boolean;
  createdAt: string;
  status: string;
  statusComment?: string | null;
  publishedDate: string;
  members: Member[];
  award: Award;
  awardCategory: AwardCategory;
  attachments: Attachment[];
  mediaChannel: MediaChannel;
  roundScores: RoundScore[];
  judgeScores: JudgeScore[];
}

export interface ApplicationResponse {
  data: ApplicationAward;
}
