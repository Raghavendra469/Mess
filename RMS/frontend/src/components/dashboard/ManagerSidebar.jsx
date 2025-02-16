import { NavLink } from "react-router-dom";
import React from "react";

const ManagerSidebar = ({ isOpen, toggleSidebar }) => {

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <div className={`bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0`}>
      <div className="bg-teal-600 h-16 flex items-center justify-center text-2xl font-bold uppercase tracking-wide">
        <h3 className="text-3xl font-pacific text-center">RMS</h3>
      </div>
      <div className="px-4 py-2">
        <NavLink
          to="/manager-dashboard"
          end
          onClick={handleLinkClick}
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ''} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-gray-400 hover:text-white hover:scale-105 transition-all duration-200`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/manager-dashboard/view-artists"
          onClick={handleLinkClick}
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ''} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-gray-400 hover:text-white hover:scale-105 transition-all duration-200`}
        >
          My Artists
        </NavLink>
        <NavLink
          to="/manager-dashboard/collaboration-requests"
          onClick={handleLinkClick}
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ''} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-gray-400 hover:text-white hover:scale-105 transition-all duration-200`}
        >
          Colabration Request
        </NavLink>
        <NavLink
          to="/manager-dashboard/royalty-transactions"
          onClick={handleLinkClick}
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ''} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-gray-400 hover:text-white hover:scale-105 transition-all duration-200`}
        >
          Royalty Transactions
        </NavLink>
        <NavLink
          to="/manager-dashboard/update-profile"
          onClick={handleLinkClick}
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ''} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-gray-400 hover:text-white hover:scale-105 transition-all duration-200`}
        >
          Update Profile
        </NavLink>
      </div>
    </div>
  );
};

export default ManagerSidebar;