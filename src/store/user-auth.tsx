import React, { useState } from "react";
interface Props {
  children: React.ReactNode;
}

type UserAuthObj = {
  isAdmin: boolean;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
};
const UserAuthContext = React.createContext<UserAuthObj>({
  isAdmin: false,
  loggedIn: false,
  setLoggedIn: () => {},
  setIsAdmin: () => {},
});
export const UserAuthContextProvider: React.FC<Props> = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const setLoggedInHandler = (loggedIn: boolean) => {
    setLoggedIn(loggedIn);
  };
  const setIsAdminHandler = (isAdmin: boolean) => {
    setIsAdmin(isAdmin);
  };

  const contextValue: UserAuthObj = {
    isAdmin: isAdmin,
    loggedIn: loggedIn,
    setLoggedIn: setLoggedInHandler,
    setIsAdmin: setIsAdminHandler,
  };
  return (
    <UserAuthContext.Provider value={contextValue}>
      {props.children}
    </UserAuthContext.Provider>
  );
};
export default UserAuthContext;
