import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userRole = sessionStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(userRole || "");
    } else {
      // Force logout when page reloads or browser closes
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      setIsLoggedIn(false);
      setRole("");
    }
  }, []);

  const login = (token, role) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("role", role);
    setIsLoggedIn(true);
    setRole(role);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
