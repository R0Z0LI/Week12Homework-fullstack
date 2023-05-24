import { useState } from "react";
import { Task } from "../../model/task";
import { TaskFunction } from "../../utils/utils";
import TaskItem from "./TaskItem";
import TaskTableHead from "./TaskTableHead";

const TasksList: React.FC<{
  onDelete?: (index: number | undefined) => void;
  onArchive?: (archive: boolean | undefined, id: number) => void;
  onEdit?: (index: number) => void;
  onChangeStatus: (status: string, id: number | undefined) => void;
  functions: TaskFunction;
  items: Task[];
}> = (props) => {
  const [tasks, setTasks] = useState<Task[]>(props.items);

  const onDeleteHandler = (id: number | undefined) => {
    if (id !== undefined && props.onDelete) {
      props.onDelete(id);
    }
  };

  const onArchiveHandler = (
    archive: boolean | undefined,
    id: number | undefined
  ) => {
    if (id !== undefined && archive !== undefined && props.onArchive) {
      props.onArchive(archive, id);
    }
  };

  const onEditHandler = (id: number | undefined) => {
    if (id !== undefined && props.onEdit) {
      props.onEdit(id);
    }
  };

  const onChangeStatusHandler = (status: string, id: number | undefined) => {
    if (id !== undefined) {
      props.onChangeStatus(status, id);
    }
  };
  return (
    <div>
      <ul className="m-4 border-2 border-blue-500">
        <TaskTableHead function={props.functions} />
        {tasks.map((item, index) => (
          <TaskItem
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            status={item.status}
            archived={item.isArchived}
            project={item.project}
            user={item.user}
            items={tasks}
            item={index}
            onDelete={onDeleteHandler}
            onArchive={onArchiveHandler}
            onEdit={onEditHandler}
            onChangeStatus={onChangeStatusHandler}
            function={props.functions}
          />
        ))}
      </ul>
    </div>
  );
};

export default TasksList;
