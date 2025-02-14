import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopArtistsChart = ({ data = [] }) => {
  if (!data.length) {
    return <div className="p-4 bg-white rounded-lg shadow-lg text-center">No Artist Data Available</div>;
  }

  const chartData = {
    labels: data.map((artist) => artist.fullName),
    datasets: [
      {
        label: "Streams",
        data: data.map((artist) => artist.totalStreams),
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue with opacity
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        barThickness: 30,
      },
      {
        label: "Royalty",
        data: data.map((artist) => artist.fullRoyalty),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Green with opacity
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Top Artists Performance" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <div style={{ height: "300px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TopArtistsChart;
