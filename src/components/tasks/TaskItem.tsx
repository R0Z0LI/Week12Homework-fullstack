import { useState } from "react";
import { Project } from "../../model/project";
import { Task, TaskStatus } from "../../model/task";
import { User } from "../../model/user";
import Icon from "@mdi/react";
import { mdiDelete, mdiFileEdit, mdiArchiveArrowDown } from "@mdi/js";

const TaskItem: React.FC<{
  id: number | undefined;
  name: string | undefined;
  description: string | undefined;
  status: string | undefined;
  archived: boolean;
  user: User | undefined;
  project: Project | undefined;
  items: Task[];
  item: number;
  onDelete: (index: number | undefined) => void;
  onArchive: (archive: boolean | undefined, id: number | undefined) => void;
  onEdit: (index: number | undefined) => void;
  onChangeStatus: (status: string, id: number | undefined) => void;
}> = (props) => {
  const [selectedStatus, setSelectedStatus] = useState(props.status);
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
  return (
    <li
      className="p-3 grid gap-4 border-2 border-blue-500 hover:bg-blue-300"
      style={{
        gridTemplateColumns:
          "minmax(0, 0.3fr) repeat(5, minmax(0, 2fr)) repeat(3, minmax(0, 0.7fr))",
      }}
    >
      <div className="p-1">
        <p>{props.id}</p>
      </div>
      <div className="p-1">
        <p>{props.name}</p>
      </div>
      <div className="p-1">
        <span>{props.description}</span>
      </div>
      <div className="p-1">
        <select value={selectedStatus} onChange={onChangeStatusHandler}>
          {Object.values(TaskStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="p-1">
        <span>{props.user?.name}</span>
      </div>
      <div className="p-1">
        <span>{props.project?.name}</span>
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

export default TaskItem;
