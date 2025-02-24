import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const TopManagersChart = ({ data }) => {
    if (!data || data.length === 0) return <p className="p-6 bg-white rounded-lg shadow-lg text-center text-gray-700">No manager data available</p>;

    const COLORS = { streams: "#4F46E5", royalty: "#10B981" };

    const labels = data.map((manager) => manager.name);

    const streamsData = {
        labels,
        datasets: [
            {
                label: "Total Streams",
                data: data.map((manager) => manager.totalStreams),
                backgroundColor: COLORS.streams,
                borderColor: COLORS.streams,
                borderWidth: 1,
                barThickness: 40, 
            },
        ],
    };

    const royaltyData = {
        labels,
        datasets: [
            {
                label: "Royalty Earned",
                data: data.map((manager) => manager.totalRoyalty),
                borderColor: COLORS.royalty,
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                borderWidth: 2,
                pointBackgroundColor: COLORS.royalty,
                tension: 0.3, // Smooth line
                fill: true,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { display: true }, beginAtZero: true },
        },
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { display: true }, beginAtZero: true },
        },
    };

    return (
        <div className="w-full p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Top Managers Performance</h2>

            {/* Side-by-Side Layout */}
            <div className="grid md:grid-cols-2 gap-8">
                
                {/* Streams Bar Chart */}
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-center mb-3 text-gray-700">Total Streams</h3>
                    <div style={{ height: "300px" }}>
                        <Bar data={streamsData} options={barOptions} />
                    </div>
                </div>

                {/* Royalty Line Chart */}
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-center mb-3 text-gray-700">Full Royalty Earned</h3>
                    <div style={{ height: "300px" }}>
                        <Line data={royaltyData} options={lineOptions} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TopManagersChart;
