import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";


const ManagerArtists = () => {
  const [artists, setArtists] = useState([]);
  const { userData } = useAuth(); // Get logged-in user & artist

//   console.log("userData", userData)

  
//   const managerId = "67a3be671f2927a6985e545f"; // Replace with dynamic manager ID if needed

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userData.username}`);
        console.log("API Response:", response.data);

        setArtists(response.data.user.managedArtists);
        // console.log("artist-----------------------------------",artists);
      } catch (error) {
        console.error("Error fetching artists:", error);
        setArtists([]);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md py-4 px-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Managed Artists</h1>
      </header>

      {/* Artist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.length > 0 ? (
          artists.map((artist) => (
            <div
              key={artist._id}
              className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-gray-800">{artist.fullName}</h3>
              <p className="text-gray-600 mt-2"><strong>Email:</strong> {artist.email}</p>
              <p className="text-gray-600"><strong>Mobile No:</strong> {artist.mobileNo}</p>
              <p className="text-gray-600"><strong>Address :</strong> {artist.address}</p>
              <p className="text-gray-600"><strong>Total Streams :</strong> {artist.totalStreams}</p>
              <p className="text-gray-600"><strong>Total Royalty :</strong> {artist.fullRoyalty}</p>
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
