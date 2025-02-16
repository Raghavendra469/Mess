import React, { useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/notificationContext";
import axios from "axios";

const AddSongForm = () => {
  const { userData } = useAuth(); // Get user data
  const { sendNotification } = useNotifications(); // Use context function
  const [formData, setFormData] = useState({
    songName: "",
    releaseDate: "",
  });
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); // Clear previous messages
    setErrorMessage(""); 

    if (!userData?._id) {
      setErrorMessage("User data not found. Please log in again.");
      return;
    }

    const newSong = {
      artistId: userData._id, // Use artist's ID from userData
      artistName: userData.fullName,
      songName: formData.songName,
      releaseDate: formData.releaseDate,
    };

    try {
      const response = await axios.post("http://localhost:3000/api/songs/", newSong);
      if (response.data.success) {
        setSuccessMessage("Song added successfully! 🎵");
        setFormData({ songName: "", releaseDate: "" }); // Reset form

        // Send notification via context
        await sendNotification(
          userData.manager.managerId,
          `${userData.fullName} added a song: ${newSong.songName}.`,
          "songUpdate"
        );

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage("Failed to add song. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add song:", error);
      setErrorMessage("An error occurred while adding the song because song is already exist");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <header className="bg-white shadow-md py-4 px-6 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Add New Song</h1>
      </header>

      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Artist ID (Read-Only) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="artistId">
              Artist ID
            </label>
            <input
              type="text"
              id="artistId"
              value={userData?._id || "N/A"}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* Artist Name (Read-Only) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="artistName">
              Artist Name
            </label>
            <input
              type="text"
              id="artistName"
              value={userData?.fullName || "N/A"}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* Song Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="songName">
              Song Name
            </label>
            <input
              type="text"
              id="songName"
              value={formData.songName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Song Title"
              required
            />
          </div>

          {/* Release Date */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="releaseDate">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Song
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSongForm;
