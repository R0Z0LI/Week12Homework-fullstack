import " /styles/globals.css";
import type { AppProps } from "next/app";
import { UserAuthContextProvider } from "../store/user-auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserAuthContextProvider>
      <Component {...pageProps} />
    </UserAuthContextProvider>
  );
}
