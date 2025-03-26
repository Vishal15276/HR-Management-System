import React from "react";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">120</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">New Registrations</h2>
          <p className="text-3xl font-bold">15</p>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Reports Filed</h2>
          <p className="text-3xl font-bold">5</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-700">
            View All Users
          </button>
          <button className="bg-green-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-700">
            Add New User
          </button>
          <button className="bg-red-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-red-700">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
