import React, { createContext, useState } from 'react';

export const userContext = createContext({
  token: null,
  settoken: () => {}
});

export default function UserContext({ children }) {
  const [token, settoken] = useState(localStorage.getItem("token") || null);

  return (
    <userContext.Provider value={{ token, settoken }}>
      {children}
    </userContext.Provider>
  );
}