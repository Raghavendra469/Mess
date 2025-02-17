import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/collaborations";

// Fetch collaboration requests for a manager
export const fetchCollaborationRequests = async (managerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${managerId}/Manager`);
    return response.data.collaborations || [];
  } catch (error) {
    console.error("Error fetching collaboration requests:", error);
    throw error;
  }
};

// Accept a collaboration request
export const acceptCollaborationRequest = async (requestId) => {
  try {
    await axios.put(`${API_BASE_URL}/${requestId}`, { status: "Approved" });
  } catch (error) {
    console.error("Error accepting collaboration request:", error);
    throw error;
  }
};

// Reject a collaboration request
export const rejectCollaborationRequest = async (requestId) => {
  try {
    await axios.put(`${API_BASE_URL}/${requestId}`, { status: "Rejected" });
  } catch (error) {
    console.error("Error rejecting collaboration request:", error);
    throw error;
  }
};

// Send a collaboration request
export const sendCollaborationRequest = async (artistId, managerId) => {
  try {
    const response = await axios.post(API_BASE_URL, {
      collaborationId: Math.random().toString(36).substring(2, 9),
      artistId,
      managerId,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending collaboration request:", error);
    throw error;
  }
};
