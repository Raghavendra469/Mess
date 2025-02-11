import React, { useState } from "react";
import { useAuth } from "../../../context/authContext";
import axios from "axios";

const AddSongForm = () => {
  const { userData } = useAuth(); // Get user data
  const [formData, setFormData] = useState({
    songName: "",
    releaseDate: "",
  });
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

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
    if (!userData?._id) {
      console.error("User data not found!");
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
      // const notificationResponse = await axios.post("http://localhost:3000/api/notifications/", newSong);
      if (response.data.success) {
        setSuccessMessage("Song added successfully! 🎵"); // Show success message
        setFormData({ songName: "", releaseDate: "" }); // Reset form

        // Hide message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to add song:", error);
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

        <form onSubmit={handleSubmit}>
          {/* Artist ID (Read-Only) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="artistId">
              Artist ID
            </label>
            <input
              type="text"
              id="artistId"
              value={userData?.artistId || "N/A"}
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
