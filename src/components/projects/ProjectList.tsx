import { useState } from "react";
import { Project } from "../../model/project";
import ProjectItem from "./ProjectItem";
import ProjectTableHead from "./ProjectTableHead";

const ProjectList: React.FC<{
  onDelete: (index: number | undefined) => void;
  onSuspend: (suspend: boolean | undefined, id: number) => void;
  onEdit: (index: number | undefined) => void;
  items: Project[];
}> = (props) => {
  const [projects, setProjects] = useState<Project[]>(props.items);

  const onDeleteHandler = (id: number | undefined) => {
    if (id !== undefined) {
      props.onDelete(id);
    }
  };

  const onSuspenHandler = (
    suspend: boolean | undefined,
    id: number | undefined
  ) => {
    if (id !== undefined) {
      props.onSuspend(suspend, id);
    }
  };

  const onEditHandler = (id: number | undefined) => {
    if (id !== undefined) {
      props.onEdit(id);
    }
  };
  return (
    <div>
      <ul className="m-4 border-2 border-blue-500">
        <ProjectTableHead />
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
            onSuspend={onSuspenHandler}
            onEdit={onEditHandler}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
