import React  from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../components/dashboard/ManagerSidebar";
import ManagerNavbar from "../components/dashboard/ManagerNavbar";
import ManagerSummary from "../components/dashboard/ManagerSummary";


const ManagerDashboard = () => {
    const {user} = useAuth()
    return (
    <div className="flex">
      <ManagerSidebar />
      <div className="flex-1 ml-64  bg-gray-100 h-screen">
        <ManagerNavbar />
        <ManagerSummary />
      </div>
    </div>
    )
}
export default ManagerDashboard

