import React from "react";
import { Outlet } from "react-router-dom";
import EmployeeSidebar from "./EmployeeSidebar"; // Import Sidebar

const EmployeeLayout = () => {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <EmployeeSidebar />

      {/* Main Content (Outlet will load different pages here) */}
      <div className="flex-1 p-6 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;
