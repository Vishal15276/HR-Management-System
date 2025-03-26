import React, { useState } from "react";
import axios from "axios";

const Leave = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.employeeId) {
      setMessage("❌ Employee ID is required.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/apply-leave",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setFormData({
        employeeId: "",
        employeeName: "",
        leaveType: "Sick Leave",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      setMessage("❌ Failed to submit leave request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-64 p-6">
      <h2 className="text-3xl font-bold mb-4">Apply for Leave</h2>
      {message && <p className={`text-${message.includes("Failed") ? "red" : "green"}-500`}>{message}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg w-96">
        <div className="mb-4">
          <label className="block text-gray-700">Employee ID</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter Employee ID"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Employee Name</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter Employee Name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Earned Leave">Earned Leave</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default Leave;
