import { TaskStatus } from "../utils/utils";
import { Project } from "./project";
import { User } from "./user";

export interface Task {
  id?: string;
  name?: string;
  description?: string;
  isArchived: boolean;
  user?: User;
  status?: TaskStatus;
  project?: Project;
}
