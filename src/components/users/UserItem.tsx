import { User } from "../../model/user";

const UserItem: React.FC<{
  id: number | undefined;
  name: string | undefined;
  email: string | undefined;
  login: Date;
  isAdmin: boolean;
  isSuspended: boolean;
  items: User[];
  item: number;
}> = (props) => {
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
      </div>
    </li>
  );
};

export default UserItem;
