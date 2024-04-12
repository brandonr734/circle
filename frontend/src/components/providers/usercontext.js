import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userTag', userData.userTag);
    localStorage.setItem('display_name', userData.display_name);
    localStorage.setItem('icon', userData.icon);
    localStorage.setItem('id', userData.id);
    localStorage.setItem('liked_posts', userData.liked_posts);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userTag');
    localStorage.removeItem('display_name');
    localStorage.removeItem('icon');
    localStorage.removeItem('id');
    localStorage.removeItem('liked_posts');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};