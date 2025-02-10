import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
import SearchBar from "../../commonComponents/SearchBar";

const ManagerArtists = () => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchArtists = async () => {
      if (!userData?.username) return; // Prevent API call if username is undefined

      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userData.username}`);
        // console.log("me-------------",response)
        if (response.data.user && response.data.user.managedArtists) {
          setArtists(response.data.user.managedArtists);
          setFilteredArtists(response.data.user.managedArtists);
        } else {
          setArtists([]);
          setFilteredArtists([]);
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
        setArtists([]);
        setFilteredArtists([]);
      }
    };

    fetchArtists();
  }, [userData]); // Only trigger API call when userData updates

  // Search by artist name
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredArtists(artists);
    } else {
      setFilteredArtists(
        artists.filter((artist) =>
          artist.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md py-4 px-6 mb-6 flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Managed Artists</h1>
        <SearchBar onSearch={handleSearch} />
      </header>

      {/* Artist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <div
              key={artist._id}
              className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-gray-800">{artist.fullName}</h3>
              <p className="text-gray-600 mt-2"><strong>Email:</strong> {artist.email}</p>
              <p className="text-gray-600"><strong>Mobile No:</strong> {artist.mobileNo}</p>
              <p className="text-gray-600"><strong>Address :</strong> {artist.address}</p>
              <p className="text-gray-600"><strong>Total Streams :</strong> {artist.totalStreams}</p>
              <p className="text-gray-600"><strong>Total Royalty :</strong> {artist.fullRoyalty?.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No artists found.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerArtists;
