import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TopArtistsChart = ({ data = [] }) => {
  if (!data.length) {
    return <div className="p-4 bg-white rounded-lg shadow-lg text-center">No Artist Data Available</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-lg font-semibold mb-4 text-center">Top Artists Performance</h2>

      {/* Total Streams Chart */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-center">Total Streams</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="fullName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalStreams" fill="#8884d8" name="Total Streams" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Full Royalty Chart */}
      <div>
        <h3 className="text-md font-medium mb-3 text-center">Full Royalty Earned</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="fullName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="fullRoyalty" fill="#82ca9d" name="Full Royalty" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopArtistsChart;
