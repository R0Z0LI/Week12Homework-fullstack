import axios from "axios";
import { useState } from "react";
import Navbar from "../../components/NavBar";
import AddProjectForm from "../../components/projects/AddProjectForm";
import ProjectList from "../../components/projects/ProjectList";
import { Project } from "../../model/project";
import { User } from "../../model/user";

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
    console.log(projectData);
    const projects = await projectData
      .map((project: Project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        archived: project.isArchived,
        manager: project.manager,
        users: project.users,
      }))
      .slice()
      .reverse();
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
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const onDeleteHandler = () => {};
  const onSuspendHandler = () => {};
  const onEditHandler = () => {};

  const onAddSubmitHandler = () => {};

  return (
    <div key={refreshKey} className="flex flex-col">
      <Navbar />
      <button
        className="bg-blue-300 hover:bg-blue-200 rounded-lg p-2 self-end mr-4"
        onClick={() => setShowAddModal(true)}
      >
        Add Project
      </button>
      {showAddModal && (
        <AddProjectForm
          onSubmit={onAddSubmitHandler}
          onClose={() => setShowAddModal(false)}
          items={users}
        />
      )}
      {/*showUpdateModal && (
        <EditUserForm
          user={users.find((user) => user.id === editUserId)}
          onSubmit={onEditSubmitHandler}
          onClose={() => setShowUpdateModal(false)}
        />
      )*/}
      <ProjectList
        items={projects}
        onDelete={onDeleteHandler}
        onSuspend={onSuspendHandler}
        onEdit={onEditHandler}
      />
    </div>
  );
}

export default ProjectsPage;
