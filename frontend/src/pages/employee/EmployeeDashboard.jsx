import React, { useEffect, useState } from "react";
import EmployeeSidebar from "./EmployeeSidebar";
import axios from "axios";

const EmployeeDashboard = () => {
  const employeeId = "660c3a45e6e2b68dfd9e3f42"; // Replace with dynamic employee ID
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/employee/${employeeId}`)
      .then((res) => setEmployee(res.data))
      .catch((err) => console.error(err));
  }, []);

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:5000/employee/${employeeId}/tasks/${taskId}`, { status });
      setEmployee((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        ),
      }));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="flex">
      <EmployeeSidebar />
      <div className="flex-1 p-6 ml-64">
        <h1 className="text-3xl font-bold mb-4">Employee Dashboard</h1>
        <p className="text-gray-600">Welcome, {employee.name}!</p>

        {/* Tasks Section */}
        <div className="bg-white shadow-lg p-4 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-3">My Tasks</h2>
          <ul>
            {employee.tasks.map((task) => (
              <li key={task._id} className="p-2 border-b flex justify-between">
                {task.title}
                <button
                  className={`px-3 py-1 text-white rounded ${
                    task.status === "Pending" ? "bg-red-500" : "bg-green-500"
                  }`}
                  onClick={() =>
                    updateTaskStatus(task._id, task.status === "Pending" ? "Completed" : "Pending")
                  }
                >
                  {task.status}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Schedule Section */}
        <div className="bg-white shadow-lg p-4 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-3">Upcoming Schedule</h2>
          <ul>
            {employee.schedule.map((event) => (
              <li key={event._id} className="p-2 border-b">
                <strong>{event.event}</strong>
                <p className="text-sm text-gray-500">
                  {event.date} at {event.time}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile Section */}
        <div className="bg-white shadow-lg p-4 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-3">Profile</h2>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Role:</strong> {employee.role}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
