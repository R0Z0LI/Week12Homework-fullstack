import { User } from "./user";

export enum ProjectStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
}

export interface NewProject {
  name?: string;
  description?: string;
  isArchived: boolean;
  status?: ProjectStatus;
  manager?: User;
}
