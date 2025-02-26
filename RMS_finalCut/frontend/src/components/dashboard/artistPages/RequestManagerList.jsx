import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import { useArtistsManagers } from "../../../context/ArtistsManagersContext"; 
import { sendCollaborationRequest } from "../../../services/CollaborationService";

const RequestManagerList = () => {
  const { userData } = useAuth(); 
  const { managers } = useArtistsManagers(); 
  const { sendNotification } = useNotifications(); 
  const [loading] = useState(false);
  const [requestStatus, setRequestStatus] = useState({});
  const [alreadyHasManager, setAlreadyHasManager] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userData.manager) {
      setAlreadyHasManager(true);
      setMessage("You already have a manager! You cannot send a new request.");
    }
  }, [userData]);

  const handleSendRequest = async (managerId, notifyManager) => {
    if (alreadyHasManager) {
      alert("You already have a manager! You cannot send a new request.");
      return;
    }

    try {
      const response = await sendCollaborationRequest(userData._id, managerId);
      if (response.success) {
        setRequestStatus((prevStatus) => ({
          ...prevStatus,
          [managerId]: "Request Sent",
        }));

        await sendNotification(
          notifyManager,
          `${userData.fullName} requested you for collaboration.`,
          "collaborationRequest"
        );
      }
    } catch (error) {
      setRequestStatus((prevStatus) => ({
        ...prevStatus,
        [managerId]: "Request Failed",
      }));
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Available Managers
      </h1>
      {message && <p className="mb-4 text-red-600 font-semibold text-center">{message}</p>}

      {loading ? (
        <p className="text-center text-gray-600">Loading managers...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managers.length > 0 ? (
            managers.map((manager) => (
              <div
                key={manager._id}
                className="bg-white p-6 shadow-md rounded-2xl border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                  {manager.fullName}
                </h3>

                <div className="space-y-3 text-gray-600">
                  <p><strong>Email:</strong> {manager.email}</p>
                  <p><strong>Mobile No:</strong> {manager.mobileNo}</p>
                  <p><strong>Address:</strong> {manager.address}</p>
                  <p><strong>Commission Percentage:</strong> {manager.commissionPercentage}%</p>
                  <p><strong>Managed Artists:</strong> {manager.managedArtists.length}</p>
                  <p><strong>Description:</strong> {manager.description}</p>
                </div>

                <div className="mt-6 flex flex-col items-center">
                  <button
                    onClick={() => handleSendRequest(manager._id, manager.managerId)}
                    className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition-all duration-200 
                      ${
                        requestStatus[manager._id] === "Request Sent"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    disabled={requestStatus[manager._id] === "Request Sent"}
                  >
                    {requestStatus[manager._id] === "Request Sent"
                      ? "Request Sent"
                      : "Send Request"}
                  </button>

                  {requestStatus[manager._id] && (
                    <p className={`mt-3 font-semibold ${
                      requestStatus[manager._id] === "Request Sent"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {requestStatus[manager._id]}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">No managers available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestManagerList;
