import { ProjectStatus } from "../utils/utils";
import { Task } from "./task";
import { User } from "./user";

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
