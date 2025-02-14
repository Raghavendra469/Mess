import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopManagersChart = ({ data }) => {
    if (!data || data.length === 0) return <p>No manager data available</p>;

    const chartData = {
        labels: data.map((manager) => manager.name),
        datasets: [
            {
                label: "Streams",
                data: data.map((manager) => manager.totalStreams),
                backgroundColor: "rgba(153, 102, 255, 0.6)", // Purple
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
                barThickness: 30,
            },
            {
                label: "Royalty",
                data: data.map((manager) => manager.totalRoyalty),
                backgroundColor: "rgba(255, 159, 64, 0.6)", // Orange
                borderColor: "rgba(255, 159, 64, 1)",
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
            title: { display: true, text: "Top Managers Performance" },
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

export default TopManagersChart;
