import axios from "axios";
import Navbar from "../../components/NavBar";
import UsersList from "../../components/users/UserList";
import { User } from "../../model/user";
import { useEffect, useState } from "react";
import AddUserForm from "../../components/users/AddUserForm";
import { NewUser } from "../../model/newUser";
import { useRouter } from "next/router";
import EditUserForm from "../../components/users/EditUserForm";

interface Context {
  req: {
    cookies: {
      [key: string]: string;
    };
  };
}

export const getServerSideProps = async (context: Context) => {
  const token = context.req.cookies.token;
  const authorizationHeader = `Bearer ${token}`;
  try {
    const response = await axios.get("http://localhost:3000/api/user", {
      headers: { Authorization: authorizationHeader },
    });
    const data = response.data;
    const users = await data.map((user: User, index: number) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      lastLogin: user.lastLogin,
      isSuspended: user.isSuspended,
      isAdmin: user.isAdmin,
    }));

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        token: token,
      },
    };
  } catch (error) {
    return {
      props: {
        people: [],
        token: token,
      },
    };
  }
};

function UsersPage({ users, token }: { users: User[]; token: string }) {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [users2, setUsers2] = useState<User[]>(users);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editUserId, setEditUserId] = useState(0);

  const onDeleteHandler = async (id: number | undefined) => {
    const authorizationHeader = `Bearer ${token}`;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/user/${id}`,
        {
          headers: { Authorization: authorizationHeader },
        }
      );

      const newUsers = users2.filter((user) => user.id !== id);
      setUsers2(newUsers);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onAddSubmitHandler = async (user: NewUser) => {
    setShowAddModal(false);
    const authorizationHeader = `Bearer ${token}`;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user",
        user,
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const data = response.data;
      const addedUsers = [...users2, data];
      setUsers2(addedUsers);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onEditSubmitHandler = async (user: NewUser) => {
    setShowUpdateModal(false);
    const authorizationHeader = `Bearer ${token}`;
    console.log(user);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/user/${editUserId}`,
        user,
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const updatedUser = response.data;
      const updatedUsers = users2.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      setUsers2(updatedUsers);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onSuspendHandler = async (
    suspend: boolean | undefined,
    id: number | undefined
  ) => {
    const authorizationHeader = `Bearer ${token}`;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/user/suspend/${id}`,
        { suspend },
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const updatedUser = response.data;
      const addedUsers = users2.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers2([...addedUsers]);
      setUsers2(addedUsers);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onEditHandler = (id: number) => {
    setEditUserId(id);
    setShowUpdateModal(true);
  };

  const refreshData = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div key={refreshKey} className="flex flex-col">
      <Navbar />
      <button
        className="bg-blue-300 hover:bg-blue-200 rounded-lg p-2 self-end mr-4"
        onClick={() => setShowAddModal(true)}
      >
        Add User
      </button>
      {showAddModal && (
        <AddUserForm
          onSubmit={onAddSubmitHandler}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {showUpdateModal && (
        <EditUserForm
          user={users2.find((user) => user.id === editUserId)}
          onSubmit={onEditSubmitHandler}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
      <UsersList
        items={users2}
        onDelete={onDeleteHandler}
        onSuspend={onSuspendHandler}
        onEdit={onEditHandler}
      />
    </div>
  );
}

export default UsersPage;
