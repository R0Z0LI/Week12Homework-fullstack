import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import AddProjectForm from "../../components/projects/AddProjectForm";
import EditProjectForm from "../../components/projects/EditProjectForm";
import ProjectList from "../../components/projects/ProjectList";
import AddTaskForm from "../../components/tasks/AddTaskForm";
import EditTaskForm from "../../components/tasks/EditTaskForm";
import TasksList from "../../components/tasks/TaskList";
import { NewProject } from "../../model/newProject";
import { NewTask } from "../../model/newTask";
import { Project } from "../../model/project";
import { Task, TaskStatus } from "../../model/task";
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
