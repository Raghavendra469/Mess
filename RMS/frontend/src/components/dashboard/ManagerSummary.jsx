import React from "react";
import { Bar } from "react-chartjs-2";

const ManagerDashboard = () => {
  const chartData = {
    labels: ["Artist 1", "Artist 2", "Artist 3", "Artist 4"],
    datasets: [
      {
        label: "Streams",
        data: [15000, 20000, 18000, 22000],
        backgroundColor: ["#4fd1c5", "#63b3ed", "#fc8181", "#68d391"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top Performing Artists",
      },
    },
  };

  return (
    <div className=" p-6 bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md py-4 px-6 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Streams Overview</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
          <ul>
            <li className="flex justify-between py-2 border-b">
              <span>Royalty Payment to Artist 1</span>
              <span>$1200</span>
            </li>
            <li className="flex justify-between py-2 border-b">
              <span>Royalty Payment to Artist 2</span>
              <span>$1500</span>
            </li>
            <li className="flex justify-between py-2">
              <span>Royalty Payment to Artist 3</span>
              <span>$1100</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;