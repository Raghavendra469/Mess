import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/notificationContext";


const CollaborationRequests = () => {
  const { userData } = useAuth(); // Get logged-in manager details
  const [requests, setRequests] = useState([]);
  const { sendNotification } = useNotifications();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userData?._id) return;
      try {
        // console.log("Fetching requests for manager:", userData._id);
        const response = await axios.get(`http://localhost:3000/api/collaborations/${userData._id}/Manager`);
        
        // console.log("Fetched response:", response.data.collaborations);
        if (response.data && response.data.collaborations) {
          setRequests(response.data.collaborations);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [userData]);

  // Handle Accept Request
  const handleAccept = async (requestId,artistId) => {
    try {
      await axios.put(`http://localhost:3000/api/collaborations/${requestId}`,{status:"Approved"});
      setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
      // console.log(artistId,"-------------------artist")
      await sendNotification(artistId,`${userData.fullName} accepted your Request.`,"collaborationRequest");

    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Handle Reject Request
  const handleReject = async (requestId,artistId) => {
    try {
      await axios.put(`http://localhost:3000/api/collaborations/${requestId}`,{status:"Rejected"});
      setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));

      await sendNotification(artistId,`${userData.fullName} rejected your Request.`,"collaborationRequest");

    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md py-4 px-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Collaboration Requests</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">{request.artistId?.fullName || "Unknown Artist"}</h3>
              <p className="text-gray-600 mt-2"><strong>Email:</strong> {request.artistId?.email || "N/A"}</p>
              <p className="text-gray-600"><strong>Mobile No:</strong> {request.artistId?.mobileNo || "N/A"}</p>
              {/* <p className="text-gray-600"><strong>Mobile No:</strong> {request.artistId?.artistId || "N/A"}</p> */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleAccept(request._id,request.artistId.artistId)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request._id,request.artistId.artistId)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No collaboration requests found.</p>
        )}
      </div>
    </div>
  );
};

export default CollaborationRequests;
