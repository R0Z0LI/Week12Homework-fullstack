import AuthenticationForm from "../components/auth/AuthenticationForm";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import UserAuthContext from "../store/user-auth";

interface Context {
  req: {
    cookies: {
      [key: string]: string;
    };
  };
}

export const getServerSideProps = async (context: Context) => {
  const token = context.req.cookies.token;
  let isLoggedIn = false;
  let isAdmin = false;
  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/validate_token",
      { token }
    );
    if (response.status === 201) {
      isLoggedIn = true;
      isAdmin = response.data.admin;
    } else {
      Cookies.remove("token");
    }
    console.log(response.data);
    return {
      props: {
        isAdmin: isAdmin,
        isLoggedIn: isLoggedIn,
        token: token,
      },
    };
  } catch (error) {
    return {
      props: {
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        token: token,
      },
    };
  }
};

export default function Home({
  isLoggedIn,
  isAdmin,
}: {
  isLoggedIn: boolean;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const userAuthCtx = useContext(UserAuthContext);

  console.log(isAdmin);
  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      userAuthCtx.setLoggedIn(true);
      router.push("/dashboard");
    } else if (isLoggedIn && isAdmin) {
      userAuthCtx.setLoggedIn(true);
      userAuthCtx.setIsAdmin(true);
      router.push("/users");
    }
  }, []);

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
