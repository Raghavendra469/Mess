import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa"; // Import hamburger icon from react-icons

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // If loading, show a loading message or spinner
  if (loading) {
    return <div className="flex items-center justify-between h-16 bg-teal-600 px-5 relative">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-between h-16 bg-teal-600 px-5 relative">
      {/* Hamburger Menu */}
      <button
        onClick={toggleSidebar}
        className={`text-white text-2xl cursor-pointer lg:hidden ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300`}
      >
        <FaBars />
      </button>
      <p className="text-xl font-bold text-white">Welcome, {user ? user.username : "Guest"}</p>
      <div className="flex items-center space-x-6">
        <button onClick={toggleProfile} className="text-white text-2xl cursor-pointer">
          <FaUserCircle />
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded cursor-pointer"
        >
          Logout
        </button>
      </div>

      {showProfile && user && (
        <div
          ref={profileRef}
          className="absolute right-4 top-16 bg-white shadow-lg rounded-lg p-6 w-80"
        >
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