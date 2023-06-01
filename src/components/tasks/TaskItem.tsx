import { useState } from "react";
import { Project } from "../../model/project";
import { Task } from "../../model/task";
import { TaskStatus } from "../../utils/utils";
import { User } from "../../model/user";
import Icon from "@mdi/react";
import { mdiDelete, mdiFileEdit, mdiArchiveArrowDown } from "@mdi/js";
import { TaskFunction } from "../../utils/utils";

const TaskItem: React.FC<{
  id: string | undefined;
  name: string | undefined;
  description: string | undefined;
  status: string | undefined;
  archived: boolean;
  user: User | undefined;
  project: Project | undefined;
  items: Task[];
  item: number;
  onDelete?: (index: string | undefined) => void;
  onArchive?: (archive: boolean | undefined, id: string | undefined) => void;
  onEdit?: (index: string | undefined) => void;
  onChangeStatus: (status: string, id: string | undefined) => void;
  function: TaskFunction;
}> = (props) => {
  const [selectedStatus, setSelectedStatus] = useState(props.status);
  const onDeleteHandler = () => {
    if (props.onDelete) {
      props.onDelete(props.id);
    }
  };

  const onEditHandler = () => {
    if (props.onEdit) {
      props.onEdit(props.id);
    }
  };

  const onArchiveHandler = () => {
    const isArchived = !props.archived;
    if (props.onArchive) {
      props.onArchive(isArchived, props.id);
    }
  };

  const onChangeStatusHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedStatus(event.target.value);
    props.onChangeStatus(event.target.value, props.id);
  };
  return (
    <div>
      {props.function == TaskFunction.ADMIN_FUNCTIONS && (
        <li
          className={`group p-3 md:grid gap-4 border-2 border-black hover:bg-blue-300 ${
            props.archived && "bg-slate-300 text-slate-600"
          }`}
          style={{
            gridTemplateColumns:
              "repeat(5, minmax(0, 2fr)) repeat(3, minmax(0, 0.7fr))",
          }}
        >
          <div className="p-1">
            <span className="md:hidden">Name: {props.name}</span>
            <span className="md:block hidden">{props.name}</span>
          </div>
          <div className="p-1">
            <span className="md:hidden">Description: {props.description}</span>
            <span className="md:block hidden">{props.description}</span>
          </div>
          <div className="p-1">
            <span className="md:hidden">Status: </span>
            <select
              className="group-hover:bg-blue-300 hover:cursor-pointer"
              value={selectedStatus}
              onChange={onChangeStatusHandler}
            >
              {Object.values(TaskStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="p-1">
            <span className="md:hidden">User Name: {props.user?.name}</span>
            <span className="md:block hidden">{props.user?.name}</span>
          </div>
          <div className="p-1">
            <span className="md:hidden">
              Project Name: {props.project?.name}
            </span>
            <span className="md:block hidden">{props.project?.name}</span>
          </div>
          <div className="p-1">
            <span className="md:hidden">Archive Task: </span>
            <button onClick={onArchiveHandler}>
              <Icon path={mdiArchiveArrowDown} size={1} />
            </button>
          </div>
          <div className="p-1">
            <span className="md:hidden">Delete Task: </span>
            <button onClick={onDeleteHandler}>
              <Icon path={mdiDelete} size={1} />
            </button>
          </div>
          <div className="p-1">
            <span className="md:hidden">Edit Task: </span>
            <button onClick={onEditHandler}>
              <Icon path={mdiFileEdit} size={1} />
            </button>
          </div>
        </li>
      )}
      {props.function === TaskFunction.USER_FUNCTIONS && (
        <li
          className="p-3 grid gap-4 border-2 border-blue-500 hover:bg-blue-300"
          style={{
            gridTemplateColumns: "repeat(5, minmax(0, 2fr))",
            alignItems: "stretch",
          }}
        >
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
        </li>
      )}
    </div>
  );
};

export default TaskItem;
