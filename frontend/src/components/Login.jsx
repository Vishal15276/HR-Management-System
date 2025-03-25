import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role); // Store role in local storage

      // Redirect based on role
      switch (res.data.role) {
        case "Admin":
          navigate("/admin-dashboard");
          break;
        case "HR":
          navigate("/hr-dashboard");
          break;
        case "Manager":
          navigate("/manager-dashboard");
          break;
        case "Employee":
          navigate("/employee-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-xl mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="text-blue-500 underline">
            Create Account
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
