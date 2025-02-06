import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminSummary = () => {
  const chartData = {
    labels: ["Manager 1", "Manager 2", "Manager 3", "Artist 1", "Artist 2", "Artist 3"],
    datasets: [
      {
        label: "Performance",
        data: [85, 70, 90, 75, 88, 95], // Example data for performance scores
        backgroundColor: ["#4fd1c5", "#63b3ed", "#fc8181", "#68d391", "#f6ad55", "#ed64a6"], // Bar colors
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // This allows the chart to resize based on the container size
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performance of Managers and Artists",
      },
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Top Performing Artists & Managers
        </h1>
      </header>

      {/* Chart Section */}
      <div className="bg-white shadow-md rounded-lg p-6" style={{ height: "400px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminSummary;