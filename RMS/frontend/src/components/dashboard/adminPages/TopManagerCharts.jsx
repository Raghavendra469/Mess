import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
 
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
 
const TopManagersChart = ({ data }) => {
    if (!data || data.length === 0) return <p className="p-4 bg-white rounded-lg shadow-lg text-center">No manager data available</p>;
 
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F"];
 
    const chartData = {
        labels: data.map((manager) => manager.name),
        datasets: [
            {
                label: "Streams",
                data: data.map((manager) => manager.totalStreams),
                backgroundColor: "#8884d8", // Blue
                borderColor: "#8884d8",
                borderWidth: 1,
                barThickness: 30,
            },
            {
                label: "Royalty",
                data: data.map((manager) => manager.totalRoyalty),
                backgroundColor: "#82ca9d", // Green
                borderColor: "#82ca9d",
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
            y: { grid: { display: false }, beginAtZero: true },
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