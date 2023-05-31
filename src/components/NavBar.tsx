import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import UserAuthContext from "../store/user-auth";

function Navbar() {
  const userAuthContext = useContext(UserAuthContext);
  const router = useRouter();
  const onCLickeHandler = () => {
    Cookies.remove("token");
    userAuthContext.setLoggedIn(false);
    userAuthContext.setIsAdmin(false);
  };
  return (
    <ul className="flex justify-start p-1 md:py-4 md:px-6 md:m-6 md:rounded-lg bg-blue-600">
      <li
        className={`md:p-2 p-1 m-1 md:ml-8 rounded-lg ${
          router.pathname === "/dashboard" ? "bg-blue-400" : "bg-blue-300"
        } hover:bg-blue-200`}
      >
        <Link href="/dashboard">
          <p className="">Dashboard</p>
        </Link>
      </li>
      {userAuthContext.isAdmin && (
        <li
          className={`md:p-2 p-1 m-1 md:ml-8 rounded-lg ${
            router.pathname === "/users" ? "bg-blue-400" : "bg-blue-300"
          } hover:bg-blue-200`}
        >
          <Link href="/users">
            <p className="">Users</p>
          </Link>
        </li>
      )}
      {userAuthContext.isAdmin && (
        <li
          className={`md:p-2 p-1 m-1 md:ml-8 rounded-lg ${
            router.pathname === "/projects" ? "bg-blue-400" : "bg-blue-300"
          } hover:bg-blue-200`}
        >
          <Link href="/projects">
            <p className="">Projects</p>
          </Link>
        </li>
      )}
      {userAuthContext.isAdmin && (
        <li
          className={`md:p-2 p-1 m-1 md:ml-8 rounded-lg ${
            router.pathname === "/tasks" ? "bg-blue-400" : "bg-blue-300"
          } hover:bg-blue-200`}
        >
          <Link href="/tasks">
            <p className="">Tasks</p>
          </Link>
        </li>
      )}
      <li className="md:p-2 p-1 m-1 md:ml-8 rounded-lg bg-blue-300 hover:bg-blue-200">
        <Link href="/" onClick={onCLickeHandler}>
          <p className="">Logout</p>
        </Link>
      </li>
    </ul>
  );
}

export default Navbar;
