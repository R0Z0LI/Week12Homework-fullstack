import AuthenticationForm from "../components/auth/AuthenticationForm";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useContext } from "react";
import UserAuthContext from "../store/user-auth";

export default function Home() {
  const router = useRouter();
  const userAuthCtx = useContext(UserAuthContext);

  const onSubmitHandler = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );
      console.log(response);
      const token = response.data.access_token;
      const isAdmin = response.data.role;
      Cookies.set("token", token);
      userAuthCtx.setLoggedIn(true);
      if (isAdmin) {
        userAuthCtx.setIsAdmin(true);
      }
      if (isAdmin) {
        router.push("/users");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("ERROR");
    }
  };

  return (
    <div>
      <AuthenticationForm onSubmit={onSubmitHandler} />
    </div>
  );
}
