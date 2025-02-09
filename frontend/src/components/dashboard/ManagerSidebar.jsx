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
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/manager-dashboard/manager-artists"
          onClick={handleLinkClick}
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ''} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-gray-400 hover:text-white hover:scale-105 transition-all duration-200`}
        >
          Artists
        </NavLink>
        <NavLink
          to="/manager-dashboard/manager-request"
          onClick={handleLinkClick}
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ''} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-gray-400 hover:text-white hover:scale-105 transition-all duration-200`}
        >
          Requests
        </NavLink>
        <NavLink
          to="/manager-royalty-transactions"
          onClick={handleLinkClick}
          className="flex items-center space-x-4 block py-2.5 px-4 rounded"
        >
          Royalty Transactions
        </NavLink>
        <NavLink
          to="/manager-dashboard/manager-notifications"
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ''} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-gray-400 hover:text-white hover:scale-105 transition-all duration-200`}
        >
          Notifications
        </NavLink>
        <NavLink
          to="/manager-dashboard/manager-profile-settings"
          onClick={handleLinkClick}
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ''} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-gray-400 hover:text-white hover:scale-105 transition-all duration-200`}
        >
          Profile Settings
        </NavLink>
        <NavLink
          to="/logout"
          onClick={handleLinkClick}
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ''} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-gray-400 hover:text-white hover:scale-105 transition-all duration-200`}
        >
          Log Out
        </NavLink>
      </div>
    </div>
  );
};

export default ManagerSidebar;