import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/leave-requests") // ✅ Fixed backend URL
      .then((response) => {
        setLeaveRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leave requests:", error);
        setError("Failed to load leave requests.");
        setLoading(false);
      });
  }, []);

  const handleApproval = (id, status) => {
    axios
      .put(`http://localhost:5000/approve-leave/${id}`, { status }) // ✅ Fixed update route
      .then(() => {
        setLeaveRequests((prev) =>
          prev.map((req) => (req._id === id ? { ...req, status } : req))
        );
      })
      .catch((error) => {
        console.error("Error updating leave status:", error);
        alert("Failed to update leave status. Try again!");
      });
  };

  if (loading) return <p className="text-center text-gray-500">Loading leave requests...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Leave Approval</h2>

      {leaveRequests.length === 0 ? (
        <p className="text-center text-gray-600">No leave requests available.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-3">Employee</th>
              <th className="border p-3">Start Date</th>
              <th className="border p-3">End Date</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req) => (
              <tr key={req._id} className="text-center border-b">
                <td className="border p-3">{req.employeeName}</td>
                <td className="border p-3">{new Date(req.startDate).toLocaleDateString()}</td>
                <td className="border p-3">{new Date(req.endDate).toLocaleDateString()}</td>
                <td
                  className={`border p-3 font-semibold ${
                    req.status === "Approved"
                      ? "text-green-600"
                      : req.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {req.status}
                </td>
                <td className="border p-3">
                  {req.status === "Pending" && (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 mx-1"
                        onClick={() => handleApproval(req._id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 mx-1"
                        onClick={() => handleApproval(req._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveApproval;
