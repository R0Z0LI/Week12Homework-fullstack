import { User } from "../../model/user";
import Icon from "@mdi/react";
import { mdiAccountRemove, mdiAccountOff } from "@mdi/js";

const UserItem: React.FC<{
  id: number | undefined;
  name: string | undefined;
  email: string | undefined;
  login: Date;
  isAdmin: boolean;
  isSuspended: boolean;
  items: User[];
  item: number;
  onDelete: (index: number | undefined) => void;
  onSuspend: (suspend: boolean | undefined) => void;
}> = (props) => {
  const onDeleteHandler = () => {
    props.onDelete(props.id);
  };

  const onSuspenHandler = () => {
    props.isSuspended = !props.isSuspended;
    props.onSuspend(props.isSuspended);
  };
  return (
    <li className="p-3 grid gap-4 grid-cols-6 border-2 border-black hover:bg-blue-300">
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
    </li>
  );
};

export default UserItem;
