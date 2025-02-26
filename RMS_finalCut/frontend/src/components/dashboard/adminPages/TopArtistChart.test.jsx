import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TopArtistsChart from "./TopArtistChart";

// Mocking Recharts components
jest.mock("recharts", () => ({
  BarChart: (props) => <div data-testid="bar-chart" {...props} />,
  Bar: (props) => <div data-testid="bar" {...props} />,
  LineChart: (props) => <div data-testid="line-chart" {...props} />,
  Line: (props) => <div data-testid="line" {...props} />,
  XAxis: (props) => <div data-testid="x-axis" {...props} />,
  YAxis: (props) => <div data-testid="y-axis" {...props} />,
  Tooltip: (props) => <div data-testid="tooltip" {...props} />,
  Legend: (props) => <div data-testid="legend" {...props} />,
  ResponsiveContainer: (props) => <div data-testid="responsive-container" {...props} />,
}));

const mockData = [
  { fullName: "John Doe", totalStreams: 1000, fullRoyalty: 500 },
  { fullName: "Jane Smith", totalStreams: 2000, fullRoyalty: 1200 },
];

describe("TopArtistsChart Component", () => {
  test("renders 'No Artist Data Available' when data is empty", () => {
    render(<TopArtistsChart data={[]} />);
    expect(screen.getByText("No Artist Data Available")).toBeInTheDocument();
  });

  test("renders headings", () => {
    render(<TopArtistsChart data={mockData} />);
    expect(screen.getByText("Top Artists Performance")).toBeInTheDocument();
    expect(screen.getByText("Total Streams")).toBeInTheDocument();
    expect(screen.getByText("Full Royalty Earned")).toBeInTheDocument();
  });

  test("renders BarChart and LineChart components", () => {
    render(<TopArtistsChart data={mockData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

//   test("renders artist data correctly", () => {
//     render(<TopArtistsChart data={mockData} />);
//     expect(screen.getByTestId("x-axis")).toBeInTheDocument();
//     expect(screen.getByTestId("y-axis")).toBeInTheDocument();
//     expect(screen.getByTestId("bar")).toBeInTheDocument();
//     expect(screen.getByTestId("line")).toBeInTheDocument();
//   });
});
