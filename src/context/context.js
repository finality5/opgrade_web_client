import React, { useState, createContext } from "react";

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [host, setHost] = useState();
  const [current, setCurrent] = useState();
  const [mode, setMode] = useState();
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        host,
        setHost,
        current,
        setCurrent,
        mode,setMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
