import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import EditProjectForm from "../../components/projects/ProjectForm";
import ProjectList from "../../components/projects/ProjectList";
import EditTaskForm from "../../components/tasks/TaskForm";
import TasksList from "../../components/tasks/TaskList";
import { NewProject } from "../../model/newProject";
import { NewTask } from "../../model/newTask";
import { Project } from "../../model/project";
import { Task, TaskStatus } from "../../model/task";
import { User } from "../../model/user";
import UserAuthContext from "../../store/user-auth";
import { ProjectStatus, TaskFunction } from "../../utils/utils";

interface Context {
  req: {
    cookies: {
      [key: string]: string;
    };
  };
}

export const getServerSideProps = async (context: Context) => {
  const token = context.req.cookies.token;

  const id = context.req.cookies.id;
  const authorizationHeader = `Bearer ${token}`;
  try {
    const taskResponse = await axios.get(
      `http://localhost:3000/api/task/user/${id}`,
      {
        headers: { Authorization: authorizationHeader },
      }
    );
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
        loadedTasks: JSON.parse(JSON.stringify(tasks)),
        token: token,
      },
    };
  } catch (error) {
    return {
      props: {
        loadedTasks: [],
        token: token,
      },
    };
  }
};

function ProjectDetailsPage({
  loadedTasks,
  token,
  id,
}: {
  loadedTasks: Task[];
  token: string;
  id: number;
}) {
  const [tasks, setTasks] = useState<Task[]>(loadedTasks);
  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const authorizationHeader = `Bearer ${token}`;
  const onChangeStatusHandler = async (
    status: string,
    id: number | undefined
  ) => {
    const statusToUpdate = status as TaskStatus;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/task/status/${id}`,
        { taskStatus: statusToUpdate },
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const updatedTask = response.data;
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
      const sortTasks = updatedTasks.filter((task) => !task.isArchived);
      setSortedTasks(sortTasks);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const refreshData = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div>
      <div>
        <Navbar />
        <TasksList
          functions={TaskFunction.USER_FUNCTIONS}
          items={tasks}
          onChangeStatus={onChangeStatusHandler}
        />
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
