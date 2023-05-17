import axios from "axios";
import Navbar from "../../components/NavBar";
import UsersList from "../../components/users/UserList";
import { User } from "../../model/user";
import { useEffect, useState } from "react";
import AddUserForm from "../../components/users/AddUserForm";
import { NewUser } from "../../model/newUser";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const [users2, setUsers2] = useState<User[]>(users);
  const [refreshList, setRefreshList] = useState<boolean>(false);

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

  const onSubmitHandler = async (user: NewUser) => {
    const authorizationHeader = `Bearer ${token}`;
    console.log(authorizationHeader);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user",
        user,
        {
          headers: { Authorization: authorizationHeader },
        }
      );
      const data = response.data;
      const addedUsers = users2;
      addedUsers.push(data);
      setUsers2(addedUsers);
      if (response.status < 300) {
        refreshData();
      }
    } catch (error) {}
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    if (refreshList) {
      console.log("refreshed");
      setRefreshList(false);
    }
  }, [refreshList]);

  return (
    <div>
      <Navbar />
      <AddUserForm onSubmit={onSubmitHandler} />
      <UsersList items={users2} onDelete={onDeleteHandler} />
    </div>
  );
}

export default UsersPage;
