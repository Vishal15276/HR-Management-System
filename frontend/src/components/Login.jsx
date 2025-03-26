import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on user role
      switch (user.role) {
        case "Admin":
          navigate("/admin");
          break;
        case "HR":
          navigate("/hr-dashboard");
          break;
        case "Manager":
          navigate("/manager-dashboard");
          break;
        case "Employee":
          navigate("/employee");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      setMessage("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {message && <p className="text-red-500">{message}</p>}

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
