import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";

const RequestManagerList = () => {
  const { userData } = useAuth(); // Get logged-in artist data
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState({}); // State to track request status

  useEffect(() => {
    const fetchManagers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/users/role/Manager");
        setManagers(response.data.users);
      } catch (error) {
        console.error("Failed to fetch managers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManagers();
  }, []);

  const sendRequest = async (managerId) => {
    try {
      console.log("manager id", managerId);
      console.log("artistId", userData._id);
      
      const response = await axios.post("http://localhost:3000/api/collaborations/", {
        collaborationId: Math.random().toString(36).substring(2, 9),
        artistId: userData._id,
        managerId: managerId,
      });

      if (response.data.success) {
        setRequestStatus((prevStatus) => ({
          ...prevStatus,
          [managerId]: "Request Sent",
        }));
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setRequestStatus((prevStatus) => ({
        ...prevStatus,
        [managerId]: "Request Failed",
      }));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Managers</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading managers...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managers.length > 0 ? (
            managers.map((manager) => (
              <div
                key={manager._id}
                className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold text-gray-800">{manager.fullName}</h3>
                <p className="text-gray-600 mt-2"><strong>Email:</strong> {manager.email}</p>
                <p className="text-gray-600"><strong>Mobile No:</strong> {manager.mobileNo}</p>
                <p className="text-gray-600"><strong>Address:</strong> {manager.address}</p>
                <p className="text-gray-600"><strong>Description:</strong> {manager.description}</p>
                <p className="text-gray-600"><strong>Manager Share:</strong> {manager.managerShare}%</p>
                <p className="text-gray-600"><strong>Managed Artists:</strong> {manager.managedArtists.length}</p>
                
                <button
                  onClick={() => sendRequest(manager._id)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  disabled={requestStatus[manager._id] === "Request Sent"}
                >
                  {requestStatus[manager._id] === "Request Sent" ? "Request Sent" : "Send Request"}
                </button>

                {requestStatus[manager._id] && (
                  <p className={`mt-2 ${requestStatus[manager._id] === "Request Sent" ? "text-green-600" : "text-red-600"}`}>
                    {requestStatus[manager._id]}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No managers available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestManagerList;
