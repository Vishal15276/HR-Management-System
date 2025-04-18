import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";
import LeaveApproval from "./pages/admin/LeaveApproval"; 

// HR & Manager Dashboards
import HRDashboard from "./pages/hr/HRDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";

// Employee Pages
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeTasks from "./pages/employee/Tasks";
import EmployeeProfile from "./pages/employee/Profile";
import EmployeeLeave from "./pages/employee/Leave";
import EmployeeTraining from "./pages/employee/Training";
import LeaveRequests from "./pages/employee/LeaveRequests"; // ✅ Added Leave Requests page

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="leave-approval" element={<LeaveApproval />} /> {/* ✅ Admin Leave Approval */}
          </Route>

          {/* HR & Manager Dashboards */}
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />

          {/* Employee Routes */}
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="training" element={<EmployeeTraining />} />
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="leave" element={<EmployeeLeave />} /> 
            <Route path="leave-requests" element={<LeaveRequests />} /> {/* ✅ Added Leave Requests */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
