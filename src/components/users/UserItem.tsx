import { User } from "../../model/user";
import Icon from "@mdi/react";
import { mdiAccountRemove, mdiAccountOff, mdiAccountEdit } from "@mdi/js";

const UserItem: React.FC<{
  id: string;
  name: string | undefined;
  email: string | undefined;
  login: Date;
  isAdmin: boolean;
  isSuspended: boolean;
  items: User[];
  item: number;
  onDelete: (index: string | undefined) => void;
  onSuspend: (suspend: boolean | undefined, id: string | undefined) => void;
  onEdit: (index: string) => void;
}> = (props) => {
  const onDeleteHandler = () => {
    props.onDelete(props.id);
  };

  const onSuspenHandler = () => {
    let suspended = !props.isSuspended;

    props.onSuspend(suspended, props.id);
  };

  const onEditHandler = () => {
    props.onEdit(props.id);
  };

  return (
    <li
      className={`p-3 md:grid gap-4 border-2 border-black hover:bg-blue-300 ${
        props.isSuspended && "bg-slate-300 text-slate-600"
      }`}
      style={{
        gridTemplateColumns: "repeat(6, minmax(0, 2fr))",
      }}
    >
      <div>
        <span className="md:hidden">Name: {props.name}</span>
        <span className="md:block hidden">{props.name}</span>
      </div>
      <div>
        <span className="md:hidden">Email: {props.email}</span>
        <span className="md:block hidden">{props.email}</span>
      </div>
      <div>
        {props.isAdmin && (
          <div>
            <span className="md:hidden">Role: Admin</span>
            <span className="md:block hidden">Admin</span>
          </div>
        )}
        {!props.isAdmin && (
          <div>
            <span className="md:hidden">Role: User</span>
            <span className="md:block hidden">User</span>
          </div>
        )}
      </div>
      <div>
        {props.isSuspended && (
          <div>
            <span className="md:hidden">Status: Suspended</span>
            <span className="md:block hidden">Suspended</span>
            <button onClick={onSuspenHandler}>
              <Icon path={mdiAccountOff} size={1} />
            </button>
          </div>
        )}
        {!props.isSuspended && (
          <div>
            <span className="md:hidden">Status: Active</span>
            <span className="md:block hidden">Active</span>
            <button onClick={onSuspenHandler}>
              <Icon path={mdiAccountOff} size={1} />
            </button>
          </div>
        )}
      </div>
      <div>
        <span className="md:hidden">Delete User: </span>
        <button onClick={onDeleteHandler}>
          <Icon path={mdiAccountRemove} size={1} />
        </button>
      </div>
      <div>
        <span className="md:hidden">Edit User: </span>
        <button onClick={onEditHandler}>
          <Icon path={mdiAccountEdit} size={1} />
        </button>
      </div>
    </li>
  );
};

export default UserItem;
