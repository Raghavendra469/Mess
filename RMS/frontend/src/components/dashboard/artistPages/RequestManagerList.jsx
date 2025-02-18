import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import { useArtistsManagers } from "../../../context/ArtistsManagersContext"; // Import the context hook
import { sendCollaborationRequest } from "../../../services/CollaborationService"; // Import the collaboration service

const RequestManagerList = () => {
  const { userData } = useAuth(); // Get logged-in artist data
  const { managers } = useArtistsManagers(); // Access managers from the ArtistsManagersContext
  const { sendNotification } = useNotifications(); // For sending notifications
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState({}); // State to track request status
  const [alreadyHasManager, setAlreadyHasManager] = useState(false);
  const [message, setMessage] = useState(""); // Message to display in UI

  useEffect(() => {
    // Check if the artist already has a manager
    if (userData.manager) {
      setAlreadyHasManager(true);
      setMessage("You already have a manager! You cannot send a new request.");
    }
  }, [userData]);

  const handleSendRequest = async (managerId,notifyManager) => {
    if (alreadyHasManager) {
      alert("You already have a manager! You cannot send a new request.");
      return;
    }

    try {
      // Call the collaboration service to send the request
      const response = await sendCollaborationRequest(userData._id, managerId);

      if (response.success) {
        setRequestStatus((prevStatus) => ({
          ...prevStatus,
          [managerId]: "Request Sent",
        }));

        // Notify the manager about the collaboration request
        await sendNotification(notifyManager, `${userData.fullName} requested you for collaboration.`, "collaborationRequest");
      }
    } catch (error) {
      setRequestStatus((prevStatus) => ({
        ...prevStatus,
        [managerId]: "Request Failed",
      }));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Managers</h1>
      {message && <p className="mb-4 text-red-600 font-semibold">{message}</p>}
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
                <p className="text-gray-600"><strong>Commission Percentage:</strong> {manager.commissionPercentage}%</p>
                <p className="text-gray-600"><strong>Managed Artists:</strong> {manager.managedArtists.length}</p>
                
                <button
                  onClick={() => handleSendRequest(manager._id,manager.managerId)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
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
