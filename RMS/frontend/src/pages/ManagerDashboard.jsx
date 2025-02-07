import React  from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../components/dashboard/ManagerSidebar";
import Navbar from "../components/dashboard/Navbar";
import ManagerSummary from "../components/dashboard/ManagerSummary";


const ManagerDashboard = () => {
    const {user} = useAuth()
    return (
    <div className="flex">
      <ManagerSidebar />
      <div className="flex-1 ml-64  bg-gray-100 h-screen">
        <Navbar />
        <ManagerSummary />
      </div>
    </div>
    )
}
export default ManagerDashboard

