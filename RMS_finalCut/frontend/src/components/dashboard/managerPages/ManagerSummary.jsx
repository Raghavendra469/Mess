import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/authContext";
import SummaryCard from "../../commonComponents/SummaryCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fetchUserDetails } from "../../../services/userService";  // Import userService
import ArtistSummary from "../artistPages/ArtistSummary";

const ManagerSummary = () => {
  const { userData } = useAuth();
  const [artists, setArtists] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);



  useEffect(() => {
    if (!userData?.username) return;
  
    const fetchArtists = async () => {
      try {
        const userDetails = await fetchUserDetails(userData.username);
        if (userDetails.managedArtists) {
          setArtists(userDetails.managedArtists);
        }
      } catch (error) {
        console.error("Failed to fetch managed artists:", error);
      }
    };
  
    fetchArtists();
    const interval = setInterval(fetchArtists, 60000); // Fetch data every 1 min
  
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [userData]);
 

  // Calculate the total royalty and top artist
  const totalRoyalty = artists.reduce((sum, artist) => sum + artist.fullRoyalty, 0);
  const topArtist = artists.reduce((top, artist) => (artist.fullRoyalty > (top?.fullRoyalty || 0) ? artist : top), null);


  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manager Dashboard</h1>

      {/* Cards for Summary Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard title="Total Managed Artists" value={artists.length} />
        <SummaryCard title="Total Managed Royalty" value={`$${totalRoyalty.toFixed(2)}`} />
        <SummaryCard title="Top Artist (by Royalty)" value={topArtist ? topArtist.fullName : "N/A"} />
      </div>

      {/* Artist Comparison Bar Graph */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Artist Comparison by Total Royalty</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={artists} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="fullName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="fullRoyalty" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Artist Selection Dropdown */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Select an Artist</h2>
        <select
          onChange={(e) => setSelectedArtistId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">-- Select an Artist --</option>
          {artists.map((artist) => (
            <option key={artist._id} value={artist._id}>
              {artist.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Show Artist Summary if an artist is selected */}
      {selectedArtistId && (
        <div className="bg-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Artist Performance Summary</h1>
            <ArtistSummary userId={selectedArtistId}/>
        </div>
      )}
    </div>
  );
};

export default ManagerSummary;
