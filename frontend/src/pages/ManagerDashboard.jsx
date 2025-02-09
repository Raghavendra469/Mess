import React  from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../components/dashboard/ManagerSidebar";
import Navbar from "../components/dashboard/Navbar";
// import ManagerSummary from "../components/dashboard/ManagerSummary";
import { Outlet } from "react-router-dom";
import { useState } from "react";


const ManagerDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

    return (
    <div className="flex">
      <ManagerSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 ml-64  bg-gray-100 h-screen">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Outlet /> {/* This will render the nested routes */}

        {/* <ManagerSummary /> */}
      </div>
    </div>
    )
}
export default ManagerDashboard

