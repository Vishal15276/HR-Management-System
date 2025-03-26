import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-800 text-white h-full p-6">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-4">
        <Link to="/admin" className="block hover:text-gray-300">
          Dashboard
        </Link>
        <Link to="/admin/user-management" className="block hover:text-gray-300">
          User Management
        </Link>
        <Link to="/admin/reports" className="block hover:text-gray-300">
          Reports
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
