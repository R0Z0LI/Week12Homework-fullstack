import " /styles/globals.css";
import type { AppProps } from "next/app";
import Cookies from "js-cookie";
import { UserAuthContextProvider } from "../store/user-auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserAuthContextProvider>
      <Component {...pageProps} />
    </UserAuthContextProvider>
  );
}
