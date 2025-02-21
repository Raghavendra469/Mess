import React from "react";
import { render, screen } from "@testing-library/react";
import TopArtistsChart from "./TopArtistsChart";

jest.mock("recharts", () => ({
  __esModule: true,
  ResponsiveContainer: ({ children }) => <div data-testid="chart-container">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar-element" />,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line-element" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe("TopArtistsChart", () => {
  const mockData = [
    { fullName: "John Doe", totalStreams: 5000, fullRoyalty: 200.5 },
    { fullName: "Jane Smith", totalStreams: 3000, fullRoyalty: 150.75 },
    { fullName: "Mike Johnson", totalStreams: 1000, fullRoyalty: 50.25 },
  ];

  test("renders 'No Artist Data Available' message when data is empty", () => {
    render(<TopArtistsChart data={[]} />);
    expect(screen.getByText(/No Artist Data Available/i)).toBeInTheDocument();
  });

  test("renders charts when valid data is provided", () => {
    render(<TopArtistsChart data={mockData} />);
    
    expect(screen.getByText(/Top Artists Performance/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Streams/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Royalty Earned/i)).toBeInTheDocument();

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });
});
