import React, { useEffect, useState } from "react";
import { fetchCollaborationsByUserAndRole, handleCancellationResponse } from "../../../services/CollaborationService";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";

const CollaborationCancellation = () => {
  const { userData } = useAuth();
  const { sendNotification } = useNotifications();
  const [collaboration, setCollaboration] = useState(null);
  const [collaborationId, setCollaborationId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaboration = async () => {
      if (!userData?._id) return;
      try {
        const collaborations = await fetchCollaborationsByUserAndRole(userData._id, "Manager");

        const pendingCollaboration = collaborations.find(
          (collab) => collab.status === "cancel_requested"
        );
        if (pendingCollaboration) {
        
          setCollaboration(pendingCollaboration);
          setCollaborationId(pendingCollaboration._id);
        } else {
          setCollaboration(null);
          setCollaborationId(null);
        }
      } catch (error) {
        console.error("Error fetching collaboration cancellation request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaboration();
  }, [userData]);

  const handleDecision = async (decision) => {
    if (!collaborationId) return;
    try {
      await handleCancellationResponse(collaborationId, decision);
      await sendNotification(
        collaboration.artistId.artistId,
        `Your collaboration cancellation request has been ${decision}.`,
        "cancelCollaboration"
      );
      setCollaboration(null); // Remove from UI after decision
      setCollaborationId(null);
    } catch (error) {
      console.error("Error handling cancellation response:", error);
    }
  };

  if (loading) return <p className="text-center p-6">Loading cancellation requests...</p>;
  if (!collaboration) return <p className="text-center p-6">No cancellation requests found.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Collaboration Cancellation Request</h2>
      <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 max-w-lg w-full">
        <h3 className="text-2xl font-semibold text-gray-800">{collaboration.artistId.fullName}</h3>
        <p className="text-gray-500">Email: {collaboration.artistId.email}</p>
        <p className="text-gray-500">Reason: {collaboration.cancellationReason}</p>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => handleDecision("approved")}
            className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-green-700 transition cursor-pointer"
          >
            Approve
          </button>
          <button
            onClick={() => handleDecision("declined")}
            className="bg-red-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-red-700 transition cursor-pointer"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationCancellation;
