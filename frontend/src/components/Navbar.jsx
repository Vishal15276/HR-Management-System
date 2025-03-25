import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Check login state on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">HR Management</h1>
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-white text-lg hover:text-gray-200">Home</Link>
          <Link to="/about" className="text-white text-lg hover:text-gray-200">About Us</Link>

          {/* Show Login if not logged in */}
          {!isLoggedIn ? (
            <Link to="/login">
              <button className="bg-white text-blue-600 px-5 py-2 rounded-md font-medium hover:bg-gray-200">
                Login
              </button>
            </Link>
          ) : (
            // Show Profile Dropdown when logged in
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-white text-blue-600 px-5 py-2 rounded-md font-medium hover:bg-gray-200 flex items-center"
              >
                Profile ▾
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
                  <p className="text-center text-sm p-2 text-gray-700 font-semibold border-b">
                    {role}
                  </p>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Details
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
