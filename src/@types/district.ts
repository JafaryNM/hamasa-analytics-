import { Region } from "./region";

export interface District {
  uuid: string;
  name: string;
  region: Region;
  createdAt?: string;
}
