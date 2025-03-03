import React, { createContext, useState, useEffect } from 'react';

export const userContext = createContext({
  token: null,
  settoken: () => {}
});

export default function UserContext({ children }) {
  const [token, settoken] = useState(localStorage.getItem("access_token") || null);
  
  useEffect(() => {
    console.log("Context token:", token);
    console.log("LocalStorage access_token:", localStorage.getItem("access_token"));
  }, [token]);
  
  return (
    <userContext.Provider value={{ token, settoken }}>
      {children}
    </userContext.Provider>
  );
}