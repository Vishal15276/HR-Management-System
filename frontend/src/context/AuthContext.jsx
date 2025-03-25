import React, { createContext, useState, useEffect } from "react";

// Create Auth Context
export const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  // Check login state on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  }, []);

  // Login function
  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setIsLoggedIn(true);
    setRole(role);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
