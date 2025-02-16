import React from "react";
import { useAuth } from "../../../context/authContext";

const ViewMyManager = () => {
  const { userData } = useAuth();

  if (!userData?.manager) {
    return <p className="text-gray-600 p-6 text-center">No manager assigned.</p>;
  }

  // console.log(userData, "----------manager");

  const {
    fullName,
    email,
    mobileNo,
    address,
    commissionPercentage,
    managedArtists = [],
    description,
  } = userData.manager;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Manager Details</h2>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-700">
            {fullName.charAt(0)}
          </div>

          <h3 className="text-2xl font-semibold text-gray-800">{fullName}</h3>
          <p className="text-gray-500">{description || "No description available"}</p>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-gray-600"><strong>Email:</strong> {email}</p>
          <p className="text-gray-600"><strong>Mobile No:</strong> {mobileNo}</p>
          <p className="text-gray-600"><strong>Address:</strong> {address}</p>
          <p className="text-gray-600"><strong>Commission Percentage:</strong> {commissionPercentage}%</p>
          <p className="text-gray-600"><strong>Number of Artists Managed:</strong> {managedArtists.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewMyManager;
