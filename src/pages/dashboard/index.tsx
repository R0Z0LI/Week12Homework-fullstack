import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Navbar from "../../components/NavBar";
import TasksList from "../../components/tasks/TaskList";
import { Task } from "../../model/task";
import { User } from "../../model/user";
import UserAuthContext from "../../store/user-auth";
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
    const userResponse = await axios.get(
      `http://localhost:3000/api/user/${id}`,
      {
        headers: { Authorization: authorizationHeader },
      }
    );
    const userData = userResponse.data;
    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      lastLogin: userData.lastLogin,
      isSuspended: userData.isSuspended,
      isAdmin: userData.isAdmin,
    };
    return {
      props: {
        loadedTasks: JSON.parse(JSON.stringify(tasks)),
        user: user,
        token: token,
      },
    };
  } catch (error) {
    return {
      props: {
        loadedTasks: [],
        user: null,
        token: null,
      },
    };
  }
};

function ProjectDetailsPage({
  loadedTasks,
  user,
  token,
}: {
  loadedTasks: Task[];
  user: User;
  token: string;
}) {
  const [tasks, setTasks] = useState<Task[]>(loadedTasks);
  const [currentUser, setCurrentUser] = useState(user);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const router = useRouter();
  const userAuthCtx = useContext(UserAuthContext);
  const [loggedIn, setLoggedIn] = useState(userAuthCtx.loggedIn);
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
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const refreshData = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const onLoginHandler = () => {
    router.push("/");
  };

  return (
    <div>
      {!loggedIn && (
        <div className="p-2 flex justify-center flex-col text-center text-2xl">
          <p>You don't have permisson to for this page</p>
          <p>Please login to access this page</p>
          <button className="text-blue-500" onClick={onLoginHandler}>
            Login page
          </button>
        </div>
      )}
      {loggedIn && (
        <div>
          <Navbar />
          <div className="md:pl-4 pl-2 p-2 text-4xl">
            <span>Welcome </span>
            <span>{currentUser.name}</span>
          </div>
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
      )}
    </div>
  );
}

export default ProjectDetailsPage;
