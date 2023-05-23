import { ProjectStatus } from "../utils/utils";
import { User } from "./user";

export interface NewProject {
  name?: string;
  description?: string;
  isArchived: boolean;
  status?: ProjectStatus;
  manager?: User;
}
