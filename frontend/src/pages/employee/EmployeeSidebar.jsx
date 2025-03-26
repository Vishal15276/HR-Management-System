import React from "react";
import { Link } from "react-router-dom";

const EmployeeSidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 p-5">
     
      <ul className="space-y-4">
        <li>
          <Link to="/employee/profile" className="block p-2 hover:bg-gray-700 rounded">
            Profile
          </Link>
        </li>
        <li>
          <Link to="/employee/leave" className="block p-2 hover:bg-gray-700 rounded">
            Leave Apply
          </Link>
        </li>
        <li>
          <Link to="/employee/training" className="block p-2 hover:bg-gray-700 rounded">
            Training
          </Link>
        </li>
        <li>
          <Link to="/employee/tasks" className="block p-2 hover:bg-gray-700 rounded">
            Tasks
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default EmployeeSidebar;
