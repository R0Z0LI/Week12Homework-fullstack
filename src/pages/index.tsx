import AuthenticationForm from "../components/auth/AuthenticationForm";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
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
      },
    };
  } catch (error) {
    return {
      props: {
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
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

  const [suspended, setSuspended] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (suspended) {
      setTimeout(() => {
        setSuspended(false);
      }, 2000);
    }
  }, [suspended]);

  useEffect(() => {
    if (invalid) {
      setTimeout(() => {
        setInvalid(false);
      }, 2000);
    }
  }, [invalid]);

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
      console.log(response.data);
      const token = response.data.access_token;
      const isAdmin = response.data.role;
      const isSuspended = response.data.suspended;
      if (isSuspended) {
        setSuspended(true);
      } else {
        Cookies.set("token", token);
        userAuthCtx.setLoggedIn(true);
        if (isAdmin) {
          userAuthCtx.setIsAdmin(true);
          router.push("/users");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      setInvalid(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <div>
        <p className="text-3xl pb-10">
          Welcome to this project management program
        </p>
      </div>
      <div>
        <p className="text-xl pb-10">
          You can log in using your credentials below
        </p>
      </div>
      <AuthenticationForm onSubmit={onSubmitHandler} />
      {suspended && (
        <div>
          <p className="text-red-500">Your account hase been suspended</p>
        </div>
      )}
      {invalid && (
        <div>
          <p className="text-red-500">Your email or password is incorrect</p>
        </div>
      )}
    </div>
  );
}
