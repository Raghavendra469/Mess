import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaBell } from "react-icons/fa";
import Notifications from "../commonComponents/Notification";
import useNotifications from "../../hooks/useNotifications";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (profileRef.current && !profileRef.current.contains(event.target)) &&
        (notificationRef.current && !notificationRef.current.contains(event.target))
      ) {
        setShowProfile(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between h-16 bg-teal-600 px-5 relative">
      {/* Hamburger Menu */}
      <button onClick={toggleSidebar} className="text-white text-2xl cursor-pointer lg:hidden">
        <FaBars />
      </button>
      <p className="text-xl font-bold text-white">Welcome, {user ? user.username : "Guest"}</p>

      <div className="flex items-center space-x-6 relative">
        {user && (user.role === "Artist" || user.role === "Manager") && (
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="relative text-white text-2xl cursor-pointer"
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>
        )}
        <button onClick={() => setShowProfile(!showProfile)} className="text-white text-2xl cursor-pointer">
          <FaUserCircle />
        </button>
        <button 
          onClick={handleLogout} 
          className="px-4 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div ref={notificationRef} className="absolute right-0 top-16 z-50">
          <Notifications />
        </div>
      )}

      {/* Profile Dropdown */}
      {showProfile && user && (
        <div ref={profileRef} className="absolute right-0 top-16 bg-white shadow-lg rounded-lg p-6 w-80 z-50">
          <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
          <p><strong>Name:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
