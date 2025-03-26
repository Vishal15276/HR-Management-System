import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-1/4 bg-blue-800 text-white p-6 h-screen">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/admin" className="block p-2 hover:bg-blue-700 rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/user-management" className="block p-2 hover:bg-blue-700 rounded">
            User Management
          </Link>
        </li>
        <li>
          <Link to="/admin/reports" className="block p-2 hover:bg-blue-700 rounded">
            Reports
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
