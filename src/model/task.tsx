import { Project } from "./project";
import { User } from "./user";

export enum TaskStatus {
  TODO = "to-do",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export interface Task {
  id?: number;
  name?: string;
  description?: string;
  isArchived: boolean;
  user?: User;
  status?: TaskStatus;
  project?: Project;
}
