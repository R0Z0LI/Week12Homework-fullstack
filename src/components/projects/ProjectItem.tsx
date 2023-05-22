import { User } from "../../model/user";
import Icon from "@mdi/react";
import { mdiAccountRemove, mdiAccountOff, mdiAccountEdit } from "@mdi/js";
import { Project } from "../../model/project";

const ProjectItem: React.FC<{
  id: number | undefined;
  name: string | undefined;
  decription: string | undefined;
  status: string | undefined;
  archived: boolean;
  managerId: User | undefined;
  items: Project[];
  item: number;
  onDelete: (index: number | undefined) => void;
  onSuspend: (suspend: boolean | undefined, id: number | undefined) => void;
  onEdit: (index: number | undefined) => void;
}> = (props) => {
  const onDeleteHandler = () => {
    props.onDelete(props.id);
  };

  const onSuspenHandler = () => {};

  const onEditHandler = () => {
    props.onEdit(props.id);
  };

  console.log(props.managerId);

  return (
    <li
      className="p-3 grid gap-4 border-2 border-blue-500 hover:bg-blue-300"
      style={{
        gridTemplateColumns: "minmax(0, 1fr) repeat(6, minmax(0, 2fr))",
      }}
    >
      <div>
        <p>{props.id}</p>
      </div>
      <div>
        <p>{props.name}</p>
      </div>
      <div>
        <span>{props.decription}</span>
      </div>
      <div>
        <span>{props.status}</span>
      </div>
      <div>
        <span>{props.managerId?.name}</span>
      </div>
      <div>
        <button onClick={onDeleteHandler}>
          <Icon path={mdiAccountRemove} size={1} />
        </button>
      </div>
      <div>
        <button onClick={onEditHandler}>
          <Icon path={mdiAccountEdit} size={1} />
        </button>
      </div>
    </li>
  );
};

export default ProjectItem;
