import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ManagerSummary = () => {
  const { userData } = useAuth();
  const [artists, setArtists] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      if (!userData?.username) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userData.username}`);
        if (response.data.user.managedArtists) {
          setArtists(response.data.user.managedArtists);
        }
      } catch (error) {
        console.error("Failed to fetch managed artists:", error);
      }
    };

    fetchArtists();
  }, [userData]);

  useEffect(() => {
    const fetchSongData = async () => {
      if (!selectedArtistId) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/songs/artist/${selectedArtistId}`);
        if (response.data.success) {
          setSongData(response.data.songs);
        }
      } catch (error) {
        console.error("Failed to fetch song data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongData();
  }, [selectedArtistId]);

  const totalRoyalty = artists.reduce((sum, artist) => sum + artist.fullRoyalty, 0);
  const topArtist = artists.reduce((top, artist) => (artist.fullRoyalty > (top?.fullRoyalty || 0) ? artist : top), null);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F"];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manager Dashboard</h1>

      {/* Cards for Summary Info */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Managed Artists</h2>
          <p className="text-2xl font-bold">{artists.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Managed Royalty</h2>
          <p className="text-2xl font-bold">${totalRoyalty.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Top Artist (by Royalty)</h2>
          <p className="text-2xl font-bold">{topArtist ? topArtist.fullName : "N/A"}</p>
        </div>
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

          {loading ? (
            <p>Loading artist data...</p>
          ) : songData.length === 0 ? (
            <p>No song data available for this artist.</p>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-lg font-semibold mb-4">Top Performing Songs by Streams</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={songData}>
                    <XAxis dataKey="songName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalStreams" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-lg font-semibold mb-4">Top Earning Songs by Royalty</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={songData}>
                    <XAxis dataKey="songName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalRoyalty" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Streams Distribution by Song</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={songData} dataKey="totalStreams" nameKey="songName" cx="50%" cy="50%" outerRadius={100} label>
                      {songData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagerSummary;