import React from "react";
import { useAuth } from "../../context/authContext";


const ManagerNavbar = () => {
    const {user} = useAuth()
    return (
      <nav className="bg-teal-600 h-16 flex justify-between items-center px-6 shadow-md">
        <div className="text-white text-xl font-bold">Welcome, {user.name}</div>
        <div className="flex items-center space-x-6">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded bg-gray-100 text-gray-800"
          />
          <div className="relative">
            <button className="text-white">Notifications</button>
            {/* Dropdown can be added here */}
          </div>
          <div className="relative">
            <button className="text-white">Profile</button>
            {/* Profile dropdown can be added here */}
          </div>
        </div>
      </nav>
    );
  };
  
  export default ManagerNavbar;