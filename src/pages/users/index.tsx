import axios from "axios";
import Navbar from "../../components/NavBar";
import UsersList from "../../components/users/UserList";
import { User } from "../../model/user";
import { useContext, useState } from "react";
import { NewUser } from "../../model/newUser";
import UserForm from "../../components/users/EditUserForm";
import { useRouter } from "next/router";
import UserAuthContext from "../../store/user-auth";

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
        loadedUsers: JSON.parse(JSON.stringify(users)),
        token: token,
      },
    };
  } catch (error) {
    return {
      props: {
        loadedUsers: [],
        token: token,
      },
    };
  }
};

function UsersPage({
  loadedUsers,
  token,
}: {
  loadedUsers: User[];
  token: string;
}) {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [users, setUsers] = useState<User[]>(loadedUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editUserId, setEditUserId] = useState("");
  const router = useRouter();
  const userAuthCtx = useContext(UserAuthContext);
  const [role, setRole] = useState(userAuthCtx.isAdmin);
  const onDeleteHandler = async (id: string | undefined) => {
    const authorizationHeader = `Bearer ${token}`;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/user/${id}`,
        {
          headers: { Authorization: authorizationHeader },
        }
      );

      const newUsers = users.filter((user) => user.id !== id);
      setUsers(newUsers);
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
      const addedUsers = [...users, data];
      setUsers(addedUsers);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onEditSubmitHandler = async (user: NewUser) => {
    setShowUpdateModal(false);
    const authorizationHeader = `Bearer ${token}`;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/user/${editUserId}`,
        user,
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const updatedUser = response.data;
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      setUsers(updatedUsers);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onSuspendHandler = async (
    suspend: boolean | undefined,
    id: string | undefined
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
      const addedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers([...addedUsers]);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const onEditHandler = (id: string) => {
    setEditUserId(id);
    setShowUpdateModal(true);
  };

  const refreshData = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const onLoginHandler = () => {
    router.push("/");
  };

  const onDashboardHandler = () => {
    router.push("/dashboard");
  };

  return (
    <div key={refreshKey} className="flex flex-col">
      {!role && (
        <div>
          <p>You don't have permisson to for this page</p>
          <p>Please login with an admin accout to access this page</p>
          <button onClick={onLoginHandler}>Login page</button>
          <p>Or check your tasks</p>
          <button onClick={onDashboardHandler}>Dashboard page</button>
        </div>
      )}
      {role && (
        <div>
          <Navbar />

          <div className="flex justify-end">
            <button
              className="bg-blue-300 hover:bg-blue-200 rounded-lg p-2 mr-4 ml-4"
              onClick={() => setShowAddModal(true)}
            >
              Add User
            </button>
          </div>
          {showAddModal && (
            <UserForm
              onSubmit={onAddSubmitHandler}
              onClose={() => setShowAddModal(false)}
            />
          )}
          {showUpdateModal && (
            <UserForm
              user={users.find((user) => user.id === editUserId)}
              onSubmit={onEditSubmitHandler}
              onClose={() => setShowUpdateModal(false)}
            />
          )}
          <UsersList
            items={users}
            onDelete={onDeleteHandler}
            onSuspend={onSuspendHandler}
            onEdit={onEditHandler}
          />
        </div>
      )}
    </div>
  );
}

export default UsersPage;
