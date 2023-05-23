import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import AddProjectForm from "../../components/projects/AddProjectForm";
import EditProjectForm from "../../components/projects/EditProjectForm";
import ProjectList from "../../components/projects/ProjectList";
import { NewProject } from "../../model/newProject";
import { Project } from "../../model/project";
import { Task } from "../../model/task";
import { User } from "../../model/user";
import { ProjectStatus } from "../../utils/utils";

interface Context {
  req: {
    cookies: {
      [key: string]: string;
    };
  };
}

export const getServerSideProps = async (context: Context) => {
  const token = context.req.cookies.token;
  const authorizationHeader = `Bearer ${token}`;
  try {
    const userResponse = await axios.get("http://localhost:3000/api/user", {
      headers: { Authorization: authorizationHeader },
    });
    const userData = userResponse.data;
    const users = await userData
      .map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        lastLogin: user.lastLogin,
        isSuspended: user.isSuspended,
        isAdmin: user.isAdmin,
      }))
      .slice()
      .reverse();
    const projectResponse = await axios.get(
      "http://localhost:3000/api/project",
      {
        headers: { Authorization: authorizationHeader },
      }
    );
    const projectData = projectResponse.data;
    const projects = await projectData.map((project: Project) => {
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        isArchived: project.isArchived,
        manager: project.manager,
        users: project.users,
      };
    });
    const taskResponse = await axios.get("http://localhost:3000/api/task", {
      headers: { Authorization: authorizationHeader },
    });
    const taskData = taskResponse.data;
    const tasks = await taskData.map((task: Task) => {
      return {
        id: task.id,
        name: task.name,
        description: task.description,
        isArchived: task.isArchived,
        user: task.user,
        status: task.status,
        project: task.project,
      };
    });
    return {
      props: {
        loadedUsers: JSON.parse(JSON.stringify(users)),
        loadedProjects: JSON.parse(JSON.stringify(projects)),
        loadedTasks: JSON.parse(JSON.stringify(tasks)),
        token: token,
      },
    };
  } catch (error) {
    return {
      props: {
        loadedUsers: [],
        loadedProjects: [],
        loadedTasks: [],
        token: token,
      },
    };
  }
};

function TaskPage({
  loadedUsers,
  loadedProjects,
  loadedTasks,
  token,
}: {
  loadedUsers: User[];
  loadedProjects: Project[];
  loadedTasks: Task[];
  token: string;
}) {
  const [users, setUsers] = useState<User[]>(loadedUsers);
  const [projects, setProjects] = useState<Project[]>(loadedProjects);
  const [tasks, setTasks] = useState<Task[]>(loadedTasks);
  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [tasktId, setTaskId] = useState(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const authorizationHeader = `Bearer ${token}`;
}
