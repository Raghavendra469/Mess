import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
 
const TopArtistsChart = ({ data = [] }) => {
  if (!data.length) {
    return <div className="p-4 bg-white rounded-lg shadow-lg text-center">No Artist Data Available</div>;
  }
 
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-lg font-semibold mb-4">Top Artists Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="fullName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalStreams" fill="#8884d8" />
          <Bar dataKey="fullRoyalty" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
 
export default TopArtistsChart;