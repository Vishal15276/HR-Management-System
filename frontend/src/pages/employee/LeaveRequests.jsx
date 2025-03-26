import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.employeeId) {
          setError("User not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/leave-requests/${user.employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLeaveRequests(response.data);
      } catch (error) {
        setError("Failed to fetch leave requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  return (
    <div className="ml-64 p-6">
      <h2 className="text-3xl font-bold mb-4">My Leave Requests</h2>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading leave requests...</p>
      ) : leaveRequests.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Leave Type</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leave) => (
              <tr key={leave._id} className="text-center">
                <td className="border p-2">{leave.leaveType}</td>
                <td className="border p-2">{leave.startDate}</td>
                <td className="border p-2">{leave.endDate}</td>
                <td className="border p-2">{leave.reason}</td>
                <td className={`border p-2 font-bold ${leave.status === "Approved" ? "text-green-500" : leave.status === "Rejected" ? "text-red-500" : "text-yellow-500"}`}>
                  {leave.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveRequests;
