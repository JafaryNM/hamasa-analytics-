export interface Attachment {
  uuid: string;
  title?: string;
  filename?: string;
  url: string;
  type: "file" | "image";
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

export interface Award {
  uuid: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isPublished?: boolean;
  isActive?: boolean;
  createdAt?: string;
  rounds?: {
    uuid: string;
    name: string;
    number: number;
    score: number;
    isFinal: boolean;
    isCurrent: boolean;
    isActive: boolean;
    createdAt: string;
  }[];
}

export interface AwardCategory {
  uuid: string;
  isActive: boolean;
  createdAt: string;
  category: {
    uuid: string;
    name: string;
    description: string;
  };
}

export interface MediaChannel {
  uuid: string;
  name: string;
  description?: string;
}

export interface Member {
  uuid: string;
  member: MemberDetails;
  type: "Journalist" | "Admin" | "Judge";
}

export interface Application {
  uuid: string;
  title: string;
  description: string;
  isGroup: boolean;
  createdAt: string;
  status: "pending" | "submitted" | "rejected" | "approved";
  statusComment?: string | null;
  publishedDate: string;
  editorReferenceUrl?: string | null;
  members: Member[];
  award: Award;
  awardCategory?: AwardCategory;
  attachments: Attachment[];
  mediaChannel?: MediaChannel;
  attachedLinks?: { title: string; link: string }[];
  roundScores?: any[];
  judgeScores?: any[];
}

export interface ApplicationResponse {
  data: Application;
  success: boolean;
}
