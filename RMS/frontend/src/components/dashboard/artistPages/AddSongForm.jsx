import React, { useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import SongService from "../../../services/SongService";

const AddSongForm = () => {
  const { userData } = useAuth();
  const { sendNotification } = useNotifications();
  const [formData, setFormData] = useState({ songName: "", releaseDate: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    setSuccessMessage("");
    setErrorMessage("");

    if (!userData?._id) {
      setErrorMessage("User data not found. Please log in again.");
      return;
    }

    const newSong = {
      artistId: userData._id,
      artistName: userData.fullName,
      songName: formData.songName,
      releaseDate: formData.releaseDate,
    };

    try {
      const response = await SongService.addSong(newSong);
      if (response.success) {
        setSuccessMessage("Song added successfully! 🎵");
        setFormData({ songName: "", releaseDate: "" });

        await sendNotification(
          userData.manager.managerId,
          `${userData.fullName} added a song: ${newSong.songName}.`,
          "songUpdate"
        );

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to add song. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <header className="bg-white shadow-md py-4 px-6 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Add New Song</h1>
      </header>

      <div className="bg-white shadow-md rounded-lg p-6">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="artistId">
              Artist ID
            </label>
            <input
              type="text"
              id="artistId"
              value={userData?._id || "N/A"}
              readOnly
              className="shadow border rounded w-full py-2 px-3 bg-gray-200 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="artistName">
              Artist Name
            </label>
            <input
              type="text"
              id="artistName"
              value={userData?.fullName || "N/A"}
              readOnly
              className="shadow border rounded w-full py-2 px-3 bg-gray-200 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="songName">
              Song Name
            </label>
            <input
              type="text"
              id="songName"
              value={formData.songName}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3"
              placeholder="Enter Song Title"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="releaseDate">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Song
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSongForm;
