import { TaskFunction } from "../../utils/utils";

const TaskTableHead: React.FC<{
  function: TaskFunction;
}> = (props) => {
  return (
    <div>
      {props.function === TaskFunction.ADMIN_FUNCTIONS && (
        <li
          className="p-3 grid gap-4 border-2 border-blue-500"
          style={{
            gridTemplateColumns:
              "repeat(5, minmax(0, 2fr)) repeat(3, minmax(0, 0.7fr))",
          }}
        >
          <div>
            <span className="p-1">Name</span>
          </div>
          <div>
            <span className="p-1">Description</span>
          </div>
          <div>
            <span className="p-1">Status</span>
          </div>
          <div>
            <span className="p-1">User</span>
          </div>
          <div>
            <span className="p-1">Project</span>
          </div>
          <div>
            <span className="p-1">Archive</span>
          </div>
          <div>
            <span className="p-1">Delete</span>
          </div>
          <div>
            <span className="p-1">Edit</span>
          </div>
        </li>
      )}
      {props.function === TaskFunction.USER_FUNCTIONS && (
        <li
          className="p-3 grid gap-4 border-2 border-blue-500"
          style={{
            gridTemplateColumns: "0.5fr 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr",
            alignItems: "stretch",
          }}
        >
          <div>
            <span className="p-1">Id</span>
          </div>
          <div>
            <span className="p-1">Name</span>
          </div>
          <div>
            <span className="p-1">Description</span>
          </div>
          <div>
            <span className="p-1">Status</span>
          </div>
          <div>
            <span className="p-1">User</span>
          </div>
          <div>
            <span className="p-1">Project</span>
          </div>
        </li>
      )}
    </div>
  );
};

export default TaskTableHead;
