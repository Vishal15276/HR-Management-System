import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">HR Management</h1>
        <div className="flex items-center space-x-8">  {/* Added spacing */}
          <Link to="/" className="text-white text-lg hover:text-gray-200">Home</Link>
          <Link to="/about" className="text-white text-lg hover:text-gray-200">About Us</Link>
          <Link to="/login">
            <button className="bg-white text-blue-600 px-5 py-2 rounded-md font-medium hover:bg-gray-200">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
