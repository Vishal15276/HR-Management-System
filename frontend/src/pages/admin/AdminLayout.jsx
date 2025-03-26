import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AdminSidebar"; // Ensure correct path

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet /> {/* This will load AdminDashboard, UserManagement, or Reports */}
      </div>
    </div>
  );
};

export default AdminLayout;
