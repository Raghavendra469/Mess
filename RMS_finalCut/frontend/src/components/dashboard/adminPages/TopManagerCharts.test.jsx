import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { act } from "react"; // Import `act` from React
import "@testing-library/jest-dom";
import TopManagersChart from "./TopManagerCharts";

// Mock ChartJS components properly
vi.mock("react-chartjs-2", () => ({
  Bar: (props) => <div data-testid="bar-chart">{JSON.stringify(props.data)}</div>,
  Line: (props) => <div data-testid="line-chart">{JSON.stringify(props.data)}</div>,
}));

describe("TopManagersChart Component", () => {
  it("renders without crashing", () => {
    act(() => {
      render(<TopManagersChart data={[]} />);
    });
  });

  it("shows 'No manager data available' when data is empty", () => {
    render(<TopManagersChart data={[]} />);
    expect(screen.getByText("No manager data available")).toBeInTheDocument();
  });

  it("renders charts when data is provided", () => {
    const mockData = [
      { name: "Manager A", totalStreams: 5000, totalRoyalty: 2000 },
      { name: "Manager B", totalStreams: 7000, totalRoyalty: 2500 },
    ];

    act(() => {
      render(<TopManagersChart data={mockData} />);
    });

    //  Ensure the heading is displayed
    expect(screen.getByText("Top Managers Performance")).toBeInTheDocument();

    // Ensure the mocked charts render correctly
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});
