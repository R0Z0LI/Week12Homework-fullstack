import { useState } from "react";
import { User } from "../../model/user";
import TableHead from "./UserTableHead";
import UserItem from "./UserItem";

const UsersList: React.FC<{
  onDelete: (index: string) => void;
  onSuspend: (suspend: boolean | undefined, id: string) => void;
  onEdit: (index: string) => void;
  items: User[];
}> = (props) => {
  const [users, setUsers] = useState<User[]>(props.items);

  const onDeleteHandler = (id: string | undefined) => {
    if (id !== undefined) {
      props.onDelete(id);
    }
  };

  const onSuspenHandler = (
    suspend: boolean | undefined,
    id: string | undefined
  ) => {
    if (id !== undefined) {
      props.onSuspend(suspend, id);
    }
  };

  const onEditHandler = (id: string | undefined) => {
    if (id !== undefined) {
      props.onEdit(id);
    }
  };
  return (
    <div>
      <ul className="m-2 border-2 border-black">
        <div className="md:block hidden">
          <TableHead />
        </div>
        {users.map((item, index) => (
          <UserItem
            key={item.id}
            id={item.id}
            name={item.name}
            email={item.email}
            login={item.lastLogin}
            isAdmin={item.isAdmin}
            isSuspended={item.isSuspended}
            items={users}
            item={index}
            onDelete={onDeleteHandler}
            onSuspend={onSuspenHandler}
            onEdit={onEditHandler}
          />
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
