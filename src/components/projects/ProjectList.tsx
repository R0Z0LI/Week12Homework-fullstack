import { useState } from "react";
import { Project } from "../../model/project";
import ProjectItem from "./ProjectItem";
import ProjectTableHead from "./ProjectTableHead";

const ProjectList: React.FC<{
  onDelete: (index: string | undefined) => void;
  onArchive: (archive: boolean | undefined, id: string) => void;
  onEdit: (index: string) => void;
  onChangeStatus: (status: string, id: string | undefined) => void;
  items: Project[];
}> = (props) => {
  const [projects, setProjects] = useState<Project[]>(props.items);

  const onDeleteHandler = (id: string | undefined) => {
    if (id !== undefined) {
      props.onDelete(id);
    }
  };

  const onArchiveHandler = (
    archive: boolean | undefined,
    id: string | undefined
  ) => {
    if (id !== undefined) {
      props.onArchive(archive, id);
    }
  };

  const onEditHandler = (id: string | undefined) => {
    if (id !== undefined) {
      props.onEdit(id);
    }
  };

  const onChangeStatusHandler = (status: string, id: string | undefined) => {
    if (id !== undefined) {
      props.onChangeStatus(status, id);
    }
  };
  return (
    <div>
      <ul className="md:m-4 m-2 border-2 border-black">
        <div className="md:block hidden">
          <ProjectTableHead />
        </div>
        {projects.map((item, index) => (
          <ProjectItem
            key={item.id}
            id={item.id}
            name={item.name}
            decription={item.description}
            status={item.status}
            archived={item.isArchived}
            managerId={item.manager}
            items={projects}
            item={index}
            onDelete={onDeleteHandler}
            onArchive={onArchiveHandler}
            onEdit={onEditHandler}
            onChangeStatus={onChangeStatusHandler}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
