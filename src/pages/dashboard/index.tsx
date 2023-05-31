import axios from "axios";
import { useState } from "react";
import Navbar from "../../components/NavBar";
import TasksList from "../../components/tasks/TaskList";
import { Task } from "../../model/task";
import { TaskFunction, TaskStatus } from "../../utils/utils";

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
    id: string | undefined
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
        {tasks.length < 1 && (
          <div className="flex justify-center">
            <p className="text-4xl">You don't have any task</p>
          </div>
        )}
        {tasks.length > 0 && (
          <TasksList
            functions={TaskFunction.USER_FUNCTIONS}
            items={tasks}
            onChangeStatus={onChangeStatusHandler}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
