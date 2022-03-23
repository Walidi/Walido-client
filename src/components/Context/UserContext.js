import { createContext, useState } from "react";

export const UserContext = createContext();

// This context provider is passed to any component requiring the context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
    bachelorDegree: "",
    masterDegree: "",
    phoneNr: 0,
    cvFile: ""
  });

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};