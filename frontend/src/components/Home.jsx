import React from "react";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-extrabold text-yellow-400 drop-shadow-lg">
        Welcome to HR Management System
      </h1>
      <p className="text-lg mt-4 max-w-lg text-center text-gray-300 drop-shadow-md">
        Manage employees, payroll, and HR tasks efficiently with our cutting-edge platform.
      </p>
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
        Get Started
      </button>
    </div>
  );
}

export default Home;
