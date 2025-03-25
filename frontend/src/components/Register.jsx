import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee"); // Default role
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", { name, email, password, role });
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (err) {
      alert("User already exists or error in registration.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-xl mb-4">Register</h2>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        
        {/* Dropdown for Role Selection */}
        <select
          className="border p-2 w-full mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="HR">HR</option>
          <option value="Admin">Admin</option>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>

        <button type="submit" className="bg-green-500 text-white p-2 w-full rounded">
          Register
        </button>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-500 underline">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
