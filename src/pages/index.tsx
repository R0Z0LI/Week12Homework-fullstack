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
      const token = response.data.access_token;
      Cookies.set("token", token);
      router.push("/users");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div>
      <AuthenticationForm onSubmit={onSubmitHandler} />
    </div>
  );
}
