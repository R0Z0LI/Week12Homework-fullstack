import { TaskStatus } from "../utils/utils";
import { Project } from "./project";

import { User } from "./user";

export interface NewTask {
  name?: string;
  description?: string;
  isArchived: boolean;
  status?: TaskStatus;
  user?: User;
  project?: Project;
}
