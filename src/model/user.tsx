import { Project } from "./project";
import { Task } from "./task";

export interface User {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  lastLogin: Date;
  isSuspended: boolean;
  isAdmin: boolean;
}
