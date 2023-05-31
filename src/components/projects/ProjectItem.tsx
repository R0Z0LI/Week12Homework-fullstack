import { User } from "../../model/user";
import Icon from "@mdi/react";
import { mdiDelete, mdiFileEdit, mdiArchiveArrowDown } from "@mdi/js";
import { Project } from "../../model/project";
import { useState } from "react";
import { ProjectStatus } from "../../utils/utils";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const ProjectItem: React.FC<{
  id: string | undefined;
  name: string | undefined;
  decription: string | undefined;
  status: string | undefined;
  archived: boolean;
  managerId: User | undefined;
  items: Project[];
  item: number;
  onDelete: (index: string | undefined) => void;
  onArchive: (archive: boolean | undefined, id: string | undefined) => void;
  onEdit: (index: string | undefined) => void;
  onChangeStatus: (status: string, id: string | undefined) => void;
}> = (props) => {
  const [selectedStatus, setSelectedStatus] = useState(props.status);

  const router = useRouter();

  const onDeleteHandler = () => {
    props.onDelete(props.id);
  };

  const onEditHandler = () => {
    props.onEdit(props.id);
  };

  const onArchiveHandler = () => {
    const isArchived = !props.archived;
    props.onArchive(isArchived, props.id);
  };

  const onChangeStatusHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedStatus(event.target.value);
    props.onChangeStatus(event.target.value, props.id);
  };

  const onClickHandler = () => {
    if (props.id !== undefined) {
      const id = props.id?.toString();
      Cookies.set("id", id);
      router.push(`/projects/${props.id}`);
    }
  };

  return (
    <li
      className={`p-3 grid group gap-4 border-2 border-blue-500 hover:bg-blue-300 ${
        props.archived && "bg-slate-300 text-slate-600"
      }`}
      style={{
        gridTemplateColumns:
          "repeat(4, minmax(0, 2fr)) repeat(3, minmax(0, 0.7fr))",
      }}
    >
      <div
        className="p-1 text-blue-600 hover:cursor-pointer"
        onClick={onClickHandler}
      >
        <p>{props.name}</p>
      </div>
      <div className="p-1">
        <span>{props.decription}</span>
      </div>
      <div className="p-1">
        <select
          className="group-hover:bg-blue-300 hover:cursor-pointer"
          value={selectedStatus}
          onChange={onChangeStatusHandler}
        >
          {Object.values(ProjectStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="p-1">
        <span>{props.managerId?.name}</span>
      </div>
      <div className="p-1">
        <button onClick={onArchiveHandler}>
          <Icon path={mdiArchiveArrowDown} size={1} />
        </button>
      </div>
      <div className="p-1">
        <button onClick={onDeleteHandler}>
          <Icon path={mdiDelete} size={1} />
        </button>
      </div>
      <div className="p-1">
        <button onClick={onEditHandler}>
          <Icon path={mdiFileEdit} size={1} />
        </button>
      </div>
    </li>
  );
};

export default ProjectItem;
