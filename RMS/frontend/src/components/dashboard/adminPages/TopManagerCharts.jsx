import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopManagersChart = ({ data }) => {
    if (!data || data.length === 0) return <p className="p-4 bg-white rounded-lg shadow-lg text-center">No manager data available</p>;

    const COLORS = { streams: "#8884d8", royalty: "#82ca9d" };

    const streamsData = {
        labels: data.map((manager) => manager.name),
        datasets: [
            {
                label: "Streams",
                data: data.map((manager) => manager.totalStreams),
                backgroundColor: COLORS.streams,
                borderColor: COLORS.streams,
                borderWidth: 1,
                barThickness: 50,  // Increased width of the bars
            },
        ],
    };

    const royaltyData = {
        labels: data.map((manager) => manager.name),
        datasets: [
            {
                label: "Royalty",
                data: data.map((manager) => manager.totalRoyalty),
                backgroundColor: COLORS.royalty,
                borderColor: COLORS.royalty,
                borderWidth: 1,
                barThickness: 50,  // Increased width of the bars
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { display: false }, beginAtZero: true },
        },
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">Top Managers Performance</h2>
            
            {/* Stacked layout (one after another) */}
            <div className="space-y-6">
                {/* Streams Graph */}
                <div>
                    <h3 className="text-md font-medium mb-3 text-center">Total Streams</h3>
                    <div style={{ height: "300px" }}>
                        <Bar data={streamsData} options={options} />
                    </div>
                </div>

                {/* Royalty Graph */}
                <div>
                    <h3 className="text-md font-medium mb-3 text-center">Full Royalty Earned</h3>
                    <div style={{ height: "300px" }}>
                        <Bar data={royaltyData} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopManagersChart;
