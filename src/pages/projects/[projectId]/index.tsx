import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../../components/NavBar";
import AddProjectForm from "../../../components/projects/AddProjectForm";
import EditProjectForm from "../../../components/projects/ProjectForm";
import ProjectList from "../../../components/projects/ProjectList";
import TasksList from "../../../components/tasks/TaskList";
import { NewProject } from "../../../model/newProject";
import { Project } from "../../../model/project";
import { Task } from "../../../model/task";
import { User } from "../../../model/user";
import { ProjectStatus, TaskFunction } from "../../../utils/utils";

interface Context {
  req: {
    cookies: {
      [key: string]: string;
    };
  };
}

export const getServerSideProps = async (context: Context) => {
  const token = context.req.cookies.token;
  const id = parseInt(context.req.cookies.id);
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
        token: token,
        id: id,
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
  const onChangeStatusHandler = () => {};

  return (
    <div>
      <div>
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