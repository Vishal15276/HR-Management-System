import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );
  const [role, setRole] = useState(sessionStorage.getItem("role") || "");

  useEffect(() => {
    console.log("Initial Load: isLoggedIn =", isLoggedIn, "role =", role);
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/check-auth", {
        credentials: "include",
      });
      const data = await res.json();

      console.log("checkAuth response:", data);

      if (data.isLoggedIn) {
        setIsLoggedIn(true);
        setRole(data.role);
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("role", data.role);
      } else {
        setIsLoggedIn(false);
        setRole("");
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("role");
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsLoggedIn(false);
      setRole("");
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("role");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    console.log("Attempting login...");
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      console.log("Login successful. Calling checkAuth...");
      await checkAuth(); // ✅ Recheck session after login
    } else {
      console.error("Login failed");
    }
  };

  const logout = async () => {
    console.log("Logging out...");
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });

    setIsLoggedIn(false);
    setRole("");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("role");
    console.log("Logout successful.");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
