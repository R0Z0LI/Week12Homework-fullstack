import React, { useState } from "react";
interface Props {
  children: React.ReactNode;
}

type UserAuthObj = {
  isAdmin: boolean;
  loggedIn: boolean;
  id: number;
  setLoggedIn: (loggedIn: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setId: (id: number) => void;
};
const UserAuthContext = React.createContext<UserAuthObj>({
  isAdmin: false,
  loggedIn: false,
  id: 0,
  setLoggedIn: () => {},
  setIsAdmin: () => {},
  setId: () => {},
});
export const UserAuthContextProvider: React.FC<Props> = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [id, setId] = useState(0);
  const setLoggedInHandler = (loggedIn: boolean) => {
    setLoggedIn(loggedIn);
  };
  const setIsAdminHandler = (isAdmin: boolean) => {
    setIsAdmin(isAdmin);
  };
  const setIdHandler = (id: number) => {
    setId(id);
  };

  const contextValue: UserAuthObj = {
    isAdmin: isAdmin,
    loggedIn: loggedIn,
    id: id,
    setLoggedIn: setLoggedInHandler,
    setIsAdmin: setIsAdminHandler,
    setId: setIdHandler,
  };
  return (
    <UserAuthContext.Provider value={contextValue}>
      {props.children}
    </UserAuthContext.Provider>
  );
};
export default UserAuthContext;
