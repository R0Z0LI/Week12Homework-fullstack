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
      className={`p-3 grid gap-4 border-2 border-black hover:bg-blue-300 ${
        props.isSuspended && "bg-slate-300 text-slate-600"
      }`}
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
        <span>{props.email}</span>
      </div>
      <div>
        {props.isAdmin && <span>Admin</span>}
        {!props.isAdmin && <span>User</span>}
      </div>
      <div>
        {props.isSuspended && <span>Suspended</span>}
        {!props.isSuspended && <span>Active</span>}
        <button onClick={onSuspenHandler}>
          <Icon path={mdiAccountOff} size={1} />
        </button>
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

export default UserItem;
