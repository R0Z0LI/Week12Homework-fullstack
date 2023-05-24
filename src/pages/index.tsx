import AuthenticationForm from "../components/auth/AuthenticationForm";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

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
      Cookies.set("role", isAdmin);
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
