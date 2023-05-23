import { TaskStatus } from "./task";

export interface newTask {
  name?: string;
  description?: string;
  isArchived: boolean;
  status?: TaskStatus;
}
