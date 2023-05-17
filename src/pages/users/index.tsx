import axios from "axios";
import Navbar from "../../components/NavBar";
import UsersList from "../../components/users/UserList";
import { User } from "../../model/user";
import Modal from "react-modal";
import { useState } from "react";
import AddUserForm from "../../components/users/AddUserForm";
import { NewUser } from "../../model/newUser";
import Cookies from "js-cookie";
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
  const [users2, setUsers2] = useState<User[]>(users);

  console.log(token);
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
      console.log(data);
    } catch (error) {}
  };

  return (
    <div>
      <Navbar />
      <AddUserForm onSubmit={onSubmitHandler} />
      <UsersList items={users2} />
    </div>
  );
}

export default UsersPage;
