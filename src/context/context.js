import React, { useState, createContext } from "react";

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [host, setHost] = useState();

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        host,
        setHost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
