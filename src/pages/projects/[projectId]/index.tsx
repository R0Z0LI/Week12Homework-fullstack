import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import TasksList from "../../../components/tasks/TaskList";
import { Task } from "../../../model/task";
import UserAuthContext from "../../../store/user-auth";
import { TaskFunction } from "../../../utils/utils";

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
      `http://localhost:3000/api/task/project/${id}`,
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
        id: id,
      },
    };
  } catch (error) {
    return {
      props: {
        loadedTasks: [],
        token: null,
        id: null,
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
  const router = useRouter();
  const userAuthContext = useContext(UserAuthContext);

  const [role, setRole] = useState(userAuthContext.isAdmin);
  const onChangeStatusHandler = () => {};

  const onLoginHandler = () => {
    router.push("/");
  };

  const onDashboardHandler = () => {
    router.push("/dashboard");
  };

  return (
    <div>
      {!role && (
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
      {role && (
        <div>
          {tasks.length > 0 && (
            <div>
              <div className="flex justify-start pt-8">
                <button
                  className="bg-blue-300 hover:bg-blue-200 rounded-lg p-2 mr-4 ml-4"
                  onClick={() => router.push("/projects")}
                >
                  Back
                </button>
              </div>
              <div>
                <TasksList
                  functions={TaskFunction.USER_FUNCTIONS}
                  items={tasks}
                  onChangeStatus={onChangeStatusHandler}
                />
              </div>
            </div>
          )}
          {tasks.length < 1 && (
            <div className="flex flex-col">
              <div>
                <p className="text-4xl text-center pt-4">
                  This project doesn't have any task yet
                </p>
              </div>
              <div>
                <p className="text-4xl text-center pt-4 hover:cursor-pointer">
                  You can add tasks{" "}
                  <span
                    className="text-blue-400 underline"
                    onClick={() => {
                      router.push("/tasks");
                    }}
                  >
                    here
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectDetailsPage;
