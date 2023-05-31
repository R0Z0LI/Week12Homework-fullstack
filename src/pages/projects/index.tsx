import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import ProjectForm from "../../components/projects/ProjectForm";
import ProjectList from "../../components/projects/ProjectList";
import { NewProject } from "../../model/newProject";
import { Project } from "../../model/project";
import { User } from "../../model/user";
import UserAuthContext from "../../store/user-auth";
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
    return {
      props: {
        loadedUsers: JSON.parse(JSON.stringify(users)),
        loadedProjects: JSON.parse(JSON.stringify(projects)),
        token: token,
      },
    };
  } catch (error) {
    return {
      props: {
        loadedUsers: [],
        loadedProjects: [],
        token: token,
      },
    };
  }
};

function ProjectsPage({
  loadedUsers,
  loadedProjects,
  token,
}: {
  loadedUsers: User[];
  loadedProjects: Project[];
  token: string;
}) {
  const [users, setUsers] = useState<User[]>(loadedUsers);
  const [projects, setProjects] = useState<Project[]>(loadedProjects);
  const [sortedProjects, setSortedProjects] = useState<Project[]>([]);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [projectId, setProjectId] = useState("");

  const userAuthContext = useContext(UserAuthContext);

  const [role, setRole] = useState(userAuthContext.isAdmin);

  const router = useRouter();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const authorizationHeader = `Bearer ${token}`;

  useEffect(() => {
    if (showArchived) {
      setSortedProjects(projects);
    } else {
      setSortedProjects(projects.filter((project) => !project.isArchived));
    }
    refreshData();
  }, [projects, showArchived]);

  const onDeleteHandler = async (id: string | undefined) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/project/${id}`,
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const updatedProjects = projects.filter((project) => project.id !== id);
      setProjects(updatedProjects);
      const sortProjects = updatedProjects.filter(
        (project) => !project.isArchived
      );
      setSortedProjects(sortProjects);
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
        `http://localhost:3000/api/project/archive/${id}`,
        { isArchived: archive },
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const updatedProject = response.data;
      const updatedProjects = projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
      setProjects(updatedProjects);
      const sortProjects = updatedProjects.filter(
        (project) => !project.isArchived
      );
      setSortedProjects(sortProjects);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onEditHandler = (id: string) => {
    setProjectId(id);
    setShowUpdateModal(true);
  };

  const onAddSubmitHandler = async (
    newProject: NewProject,
    addedUsers?: User[]
  ) => {
    setShowAddModal(false);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/project",
        {
          project: newProject,
          users: addedUsers,
        },
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const data = response.data;
      const addedProjects = [...projects, data];
      setProjects(addedProjects);
      const sortProjects = addedProjects.filter(
        (project) => !project.isArchived
      );
      setSortedProjects(sortProjects);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onEditSubmitHandler = async (project: Project) => {
    setShowUpdateModal(false);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/project/${projectId}`,
        project,
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const updatedProject = response.data;
      const updatedProjects = projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
      const sortProjects = updatedProjects.filter(
        (project) => !project.isArchived
      );
      setSortedProjects(sortProjects);
      setProjects(updatedProjects);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onChangeStatusHandler = async (
    status: string,
    id: string | undefined
  ) => {
    const statusToUpdate = status as ProjectStatus;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/project/status/${id}`,
        { status: statusToUpdate },
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const updatedProject = response.data;
      const updatedProjects = projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
      setProjects(updatedProjects);
      const sortProjects = updatedProjects.filter(
        (project) => !project.isArchived
      );
      setSortedProjects(sortProjects);
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
      {projects.length > 0 && (
        <div>
          {!role && (
            <div>
              <p>You don't have permisson to for this page</p>
              <p>Please login with an admin accout to access this page</p>
              <button onClick={onLoginHandler}>Login page</button>
              <p>Or check your tasks</p>
              <button onClick={onDashboardHandler}>Dashboard page</button>
            </div>
          )}
          {role && (
            <div>
              <Navbar />
              <div className="flex justify-between">
                <button
                  className="bg-blue-300 hover:bg-blue-200 rounded-lg md:p-2 md:mr-4 md:ml-4 mt-2 ml-2 p-1"
                  onClick={() => setShowArchived((prev) => !prev)}
                >
                  {showArchived
                    ? "Hide Archived Projects"
                    : "Show Archived Projects"}
                </button>
                <button
                  className="bg-blue-300 hover:bg-blue-200 rounded-lg md:p-2 md:mr-4 mt-2 mr-2 p-1"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Project
                </button>
              </div>
              {showAddModal && (
                <ProjectForm
                  onSubmit={onAddSubmitHandler}
                  onClose={() => setShowAddModal(false)}
                  items={users}
                />
              )}
              {showUpdateModal && (
                <ProjectForm
                  project={projects.find((project) => project.id === projectId)}
                  onSubmit={onEditSubmitHandler}
                  onClose={() => setShowUpdateModal(false)}
                  items={users}
                />
              )}
              <ProjectList
                items={sortedProjects}
                onDelete={onDeleteHandler}
                onArchive={onArchiveHandler}
                onEdit={onEditHandler}
                onChangeStatus={onChangeStatusHandler}
              />
            </div>
          )}
        </div>
      )}
      {projects.length < 1 && (
        <div className="flex justify-center">
          <p className="text-4xl">You don't have any project yet</p>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
