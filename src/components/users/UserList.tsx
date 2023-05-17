import { useState } from "react";
import { User } from "../../model/user";
import Navbar from "../NavBar";
import TableHead from "../TableHead";
import UserItem from "./UserItem";

const UsersList: React.FC<{
  onDelete: (index: number | undefined) => void;
  onSuspend: (suspend: boolean | undefined) => void;
  items: User[];
}> = (props) => {
  const [users, setUsers] = useState<User[]>(props.items);
  const onDeleteHandler = (id: number | undefined) => {
    props.onDelete(id);
  };
  const onSuspenHandler = (suspend: boolean | undefined) => {
    props.onSuspend(suspend);
  };
  return (
    <div>
      <ul className="p-4">
        <TableHead />
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
          />
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
