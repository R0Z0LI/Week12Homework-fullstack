import axios from "axios";
import Navbar from "../../components/NavBar";
import UserItem from "../../components/users/UserItem";
import UsersList from "../../components/users/UserList";
import { User } from "../../model/user";

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
  console.log(authorizationHeader);
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
      },
    };
  } catch (error) {
    return {
      props: {
        people: [],
      },
    };
  }
};

function UsersPage({ users }: { users: User[] }) {
  return (
    <div>
      <Navbar />

      <UsersList items={users} />
    </div>
  );
}

export default UsersPage;
