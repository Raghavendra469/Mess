import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/notificationContext";
import SearchBar from "../../commonComponents/SearchBar";

const DeleteSong = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const { userData } = useAuth();
  const { sendNotification } = useNotifications();

  // Fetch songs when the component loads or when userData changes
  useEffect(() => {
    const fetchSongs = async () => {
      if (!userData?._id) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/songs/artist/${userData._id}`);
        if (response.data.success) {
          setSongs(response.data.songs);
          setFilteredSongs(response.data.songs);
        }
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
    };
    fetchSongs();
  }, [userData]); 

  // Search functionality
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredSongs(songs);
    } else {
      setFilteredSongs(
        songs.filter((song) =>
          song.songName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  // Delete a song without reloading
  const handleDeleteSong = async (songId, songName) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/songs/${songId}`);
      if (response.data.message) {
        setSongs((prevSongs) => prevSongs.filter((song) => song.songId !== songId));
        setFilteredSongs((prevSongs) => prevSongs.filter((song) => song.songId !== songId));

        setStatusMessage("✅ Song deleted successfully!");
        setTimeout(() => setStatusMessage(""), 3000);

        await sendNotification(userData.manager.managerId,`${userData.fullName} deleted a song: ${songName}.`,"songUpdate");
      }
    } catch (error) {
      setStatusMessage("❌ Failed to delete song.");
      console.error("Failed to delete song:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Header with SearchBar */}
      <header className="bg-white shadow-md py-4 px-6 mb-6 flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manage Songs</h1>
        <SearchBar onSearch={handleSearch} />
      </header>

      {/* ✅ Status message (instead of alerts) */}
      {statusMessage && (
        <p className="text-center text-gray-700 font-semibold mb-4">{statusMessage}</p>
      )}

      {/* Songs displayed as responsive cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <div key={song._id} className="bg-white p-6 rounded-lg shadow-lg">
              <p className="font-bold text-lg">{song.songName}</p>
              <p className="text-sm text-gray-600">Release Date: {new Date(song.releaseDate).toLocaleDateString()}</p>
              <p className="text-lg"><b>Total Streams:</b> {song.totalStreams}</p>
              <p className="text-lg"><b>Total Royalty:</b> {song.totalRoyalty}</p>
              <div className="mt-4">
                <button
                  onClick={() => handleDeleteSong(song.songId, song.songName)}
                  className="w-full px-4 py-2 rounded text-white font-semibold bg-red-500 hover:bg-red-700"
                >
                  Delete Song
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No songs found.</p>
        )}
      </div>
    </div>
  );
};

export default DeleteSong;