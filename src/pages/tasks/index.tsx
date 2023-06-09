import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import TaskForm from "../../components/tasks/TaskForm";
import TasksList from "../../components/tasks/TaskList";
import { NewTask } from "../../model/newTask";
import { Project } from "../../model/project";
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
  const authorizationHeader = `Bearer ${token}`;
  try {
    const userResponse = await axios.get("http://localhost:3000/api/user", {
      headers: { Authorization: authorizationHeader },
    });
    const userData = userResponse.data;
    const users = await userData.map((user: User) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      lastLogin: user.lastLogin,
      isSuspended: user.isSuspended,
      isAdmin: user.isAdmin,
    }));
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
        token: null,
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

  const [taskId, setTaskId] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const userAuthCtx = useContext(UserAuthContext);

  const [isAdmin, setIsAdmin] = useState(userAuthCtx.isAdmin);

  const authorizationHeader = `Bearer ${token}`;

  const router = useRouter();

  useEffect(() => {
    const sorted = [...tasks].sort((a, b) => {
      return a.isArchived === b.isArchived ? 0 : a.isArchived ? 1 : -1;
    });

    if (showArchived) {
      setSortedTasks(sorted);
    } else {
      setSortedTasks(sorted.filter((task) => !task.isArchived));
    }
    refreshData();
  }, [tasks, showArchived]);

  const onDeleteHandler = async (id: string | undefined) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/task/${id}`,
        {
          headers: { Authorization: authorizationHeader },
        }
      );

      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      const sortTasks = updatedTasks.filter((project) => !project.isArchived);
      setSortedTasks(sortTasks);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onArchiveHandler = async (
    archive: boolean | undefined,
    id: string | undefined
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/task/archive/${id}`,
        { isArchived: archive },
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const updatedTask = response.data;
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);

      const sorted = [...updatedTasks].sort((a, b) => {
        return a.isArchived === b.isArchived ? 0 : a.isArchived ? 1 : -1;
      });

      if (showArchived) {
        setSortedTasks(sorted);
      } else {
        setSortedTasks(sorted.filter((task) => !task.isArchived));
      }

      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onEditHandler = (id: string) => {
    setTaskId(id);
    setShowUpdateModal(true);
  };

  const onAddSubmitHandler = async (newTask: NewTask) => {
    setShowAddModal(false);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/task",
        newTask,
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const data = response.data;
      const addedTasks = [...tasks, data];
      setTasks(addedTasks);
      const sortTasks = addedTasks.filter((task) => !task.isArchived);
      setSortedTasks(sortTasks);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onEditSubmitHandler = async (task: Task) => {
    setShowUpdateModal(false);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/task/${taskId}`,
        task,
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

  const onLoginHandler = () => {
    router.push("/");
  };

  const onDashboardHandler = () => {
    router.push("/dashboard");
  };

  return (
    <div key={refreshKey} className="flex flex-col">
      <div>
        {!isAdmin && (
          <div className="p-2 flex justify-center flex-col text-center text-2xl">
            <p>You don't have permisson to for this page</p>
            <p>Please login with an admin accout to access this page</p>
            <button className="text-blue-500" onClick={onLoginHandler}>
              Login page
            </button>
            <p>Or check your tasks</p>
            <button className="text-blue-500" onClick={onDashboardHandler}>
              Dashboard page
            </button>
          </div>
        )}
        {isAdmin && (
          <div>
            <Navbar />
            <div className="flex justify-between">
              <button
                className="bg-blue-300 hover:bg-blue-200 rounded-lg md:p-2 md:mr-4 md:ml-4 mt-2 ml-2 p-1"
                onClick={() => setShowArchived((prev) => !prev)}
              >
                {showArchived ? "Hide Archived Tasks" : "Show Archived Tasks"}
              </button>
              <button
                className="bg-blue-300 hover:bg-blue-200 rounded-lg md:p-2 md:mr-4 mt-2 mr-2 p-1"
                onClick={() => setShowAddModal(true)}
              >
                Add Task
              </button>
            </div>
            {showAddModal && (
              <TaskForm
                onSubmit={onAddSubmitHandler}
                onClose={() => setShowAddModal(false)}
                users={users}
                projects={projects}
              />
            )}
            {showUpdateModal && (
              <TaskForm
                onSubmit={onEditSubmitHandler}
                onClose={() => setShowAddModal(false)}
                users={users}
                projects={projects}
                task={tasks.find((task) => task.id === taskId)}
              />
            )}
            <TasksList
              items={sortedTasks}
              functions={TaskFunction.ADMIN_FUNCTIONS}
              onDelete={onDeleteHandler}
              onArchive={onArchiveHandler}
              onEdit={onEditHandler}
              onChangeStatus={onChangeStatusHandler}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskPage;
