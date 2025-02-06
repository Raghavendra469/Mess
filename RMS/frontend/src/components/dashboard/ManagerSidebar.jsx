import { NavLink } from "react-router-dom";
import React from "react";

const ManagerSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 w-64">
      <div className="bg-teal-600 h-16 flex items-center justify-center text-2xl font-bold uppercase tracking-wide">
        <h3 className="text-3xl font-pacific text-center">RMS</h3>
      </div>
      <div className="px-4 py-2">
        <NavLink
          to="/manager-dashboard"
          className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/manager-artists"
          className="flex items-center space-x-4 block py-2.5 px-4 rounded"
        >
          Artists
        </NavLink>
        <NavLink
          to="/manager-artists"
          className="flex items-center space-x-4 block py-2.5 px-4 rounded"
        >
          Requests
        </NavLink>
        <NavLink
          to="/manager-royalty-transactions"
          className="flex items-center space-x-4 block py-2.5 px-4 rounded"
        >
          Royalty Transactions
        </NavLink>
        <NavLink
          to="/manager-notifications"
          className="flex items-center space-x-4 block py-2.5 px-4 rounded"
        >
          Notifications
        </NavLink>
        <NavLink
          to="/manager-profile-settings"
          className="flex items-center space-x-4 block py-2.5 px-4 rounded"
        >
          Profile Settings
        </NavLink>
        <NavLink
          to="/logout"
          className="flex items-center space-x-4 block py-2.5 px-4 rounded text-red-500"
        >
          Log Out
        </NavLink>
      </div>
    </div>
  );
};

export default ManagerSidebar;