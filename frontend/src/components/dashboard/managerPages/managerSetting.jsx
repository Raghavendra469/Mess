import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const [manager, setManager] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const managerId = "67a3be671f2927a6985e545f"; // Replace with the dynamic manager ID (e.g., from context or props)

  // Fetch the manager details on page load
  useEffect(() => {
    const fetchManagerDetails = async () => {
      try {
        const response = await axios.get(`/api/managers/${managerId}`);
        setManager(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching manager details:", error);
      }
    };

    fetchManagerDetails();
  }, [managerId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setManager((prevManager) => ({
      ...prevManager,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/managers/${managerId}`, manager);
      console.log("Updated manager:", response.data);
      navigate("/manager-dashboard"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating manager details:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md py-4 px-6 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
      </header>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={manager.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={manager.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="mobileNo"
              value={manager.mobileNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={manager.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
