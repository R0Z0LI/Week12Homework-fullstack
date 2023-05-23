import { Project } from "./project";
import { TaskStatus } from "./task";
import { User } from "./user";

export interface NewTask {
  name?: string;
  description?: string;
  isArchived: boolean;
  status?: TaskStatus;
  user?: User;
  project?: Project;
}
