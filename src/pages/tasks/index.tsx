import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import TaskForm from "../../components/tasks/TaskForm";
import TasksList from "../../components/tasks/TaskList";
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

  const [taskId, setTaskId] = useState(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const userAuthCtx = useContext(UserAuthContext);

  const [isAdmin, setIsAdmin] = useState(userAuthCtx.isAdmin);

  const authorizationHeader = `Bearer ${token}`;

  const router = useRouter();

  useEffect(() => {
    if (showArchived) {
      setSortedTasks(tasks);
    } else {
      setSortedTasks(tasks.filter((task) => !task.isArchived));
    }
    refreshData();
  }, [projects, showArchived]);

  const onDeleteHandler = async (id: number | undefined) => {
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
    id: number | undefined
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
      const sortTasks = updatedTasks.filter((task) => !task.isArchived);
      setSortedTasks(sortTasks);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onEditHandler = (id: number) => {
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

  const onLoginHandler = () => {
    router.push("/");
  };

  const onDashboardHandler = () => {
    router.push("/dashboard");
  };

  return (
    <div key={refreshKey} className="flex flex-col">
      {!isAdmin && (
        <div>
          <p>You don't have permisson to for this page</p>
          <p>Please login with an admin accout to access this page</p>
          <button onClick={onLoginHandler}>Login page</button>
          <p>Or check your tasks</p>
          <button onClick={onDashboardHandler}>Dashboard page</button>
        </div>
      )}
      {isAdmin && (
        <div>
          <Navbar />
          <button
            className="bg-blue-300 hover:bg-blue-200 rounded-lg p-2 self-start mr-4"
            onClick={() => setShowArchived((prev) => !prev)}
          >
            {showArchived ? "Hide Archived Tasks" : "Show Archived Tasks"}
          </button>
          <button
            className="bg-blue-300 hover:bg-blue-200 rounded-lg p-2 self-end mr-4"
            onClick={() => setShowAddModal(true)}
          >
            Add Task
          </button>
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
  );
}

export default TaskPage;
