import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Employee" });
  const [editingUser, setEditingUser] = useState(null);
  const [updateData, setUpdateData] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users", newUser);
      fetchUsers();
      setNewUser({ name: "", email: "", password: "", role: "Employee" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setUpdateData({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/users/${editingUser}`, updateData);
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchUsers();
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="mb-6 bg-white p-4 rounded shadow-md">
        <h2 className="text-xl mb-4">Add User</h2>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border p-2 w-full mb-2"
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border p-2 w-full mb-4"
        >
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Add User</button>
      </form>

      {/* Users Table */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl mb-4">User List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2 flex justify-center">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleEditClick(user)}>Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
