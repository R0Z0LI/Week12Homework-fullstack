import { Task } from "./task";
import { User } from "./user";

export enum ProjectStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
}

export interface Project {
  id?: number;
  name?: string;
  description?: string;
  isArchived: boolean;
  status?: ProjectStatus;
  users?: User[];
  tasks?: Task[];
  manager?: User;
}
