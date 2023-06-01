import { useState } from "react";
import { Task } from "../../model/task";
import { TaskFunction } from "../../utils/utils";
import TaskItem from "./TaskItem";
import TaskTableHead from "./TaskTableHead";

const TasksList: React.FC<{
  onDelete?: (index: string | undefined) => void;
  onArchive?: (archive: boolean | undefined, id: string) => void;
  onEdit?: (index: string) => void;
  onChangeStatus: (status: string, id: string | undefined) => void;
  functions: TaskFunction;
  items: Task[];
}> = (props) => {
  const [tasks, setTasks] = useState<Task[]>(props.items);

  const onDeleteHandler = (id: string | undefined) => {
    if (id !== undefined && props.onDelete) {
      props.onDelete(id);
    }
  };

  const onArchiveHandler = (
    archive: boolean | undefined,
    id: string | undefined
  ) => {
    if (id !== undefined && archive !== undefined && props.onArchive) {
      props.onArchive(archive, id);
    }
  };

  const onEditHandler = (id: string | undefined) => {
    if (id !== undefined && props.onEdit) {
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
      {tasks.length > 0 && (
        <ul className="md:m-4 m-2 border-2 border-black">
          <div className="md:block hidden">
            <TaskTableHead function={props.functions} />
          </div>
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
      )}
      {tasks.length < 1 && (
        <div className="flex justify-center">
          <p className="text-4xl">You don't have any task yet</p>
        </div>
      )}
    </div>
  );
};

export default TasksList;
