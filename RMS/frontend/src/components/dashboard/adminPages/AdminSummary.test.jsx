import React from "react";
import { render, screen } from "@testing-library/react";
import AdminSummary from "./AdminSummary";
import { useArtistsManagers } from "../../../context/ArtistsManagersContext";
import TopArtistsChart from "./TopArtistChart";
import TopManagersChart from "./TopManagerCharts";
import ArtistsTable from "./ArtistTable";
import ManagersTable from "./ManagerTable";
import SummaryCard from "../../commonComponents/SummaryCard";

// Mock Context
jest.mock("../../../context/ArtistsManagersContext", () => ({
  useArtistsManagers: jest.fn(),
}));

// Mock Components
jest.mock("./TopArtistChart", () => jest.fn(() => <div data-testid="top-artists-chart" />));
jest.mock("./TopManagerCharts", () => jest.fn(() => <div data-testid="top-managers-chart" />));
jest.mock("./ArtistTable", () => jest.fn(() => <div data-testid="artists-table" />));
jest.mock("./ManagerTable", () => jest.fn(() => <div data-testid="managers-table" />));
jest.mock("../../commonComponents/SummaryCard", () => jest.fn(({ title, value }) => (
  <div data-testid="summary-card">{title}: {value}</div>
)));

describe("AdminSummary Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the admin dashboard title", () => {
    useArtistsManagers.mockReturnValue({ artists: [], managers: [], managerStats: [] });

    render(<AdminSummary />);

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("renders summary cards with correct values", () => {
    useArtistsManagers.mockReturnValue({
      artists: [{ _id: "1" }, { _id: "2" }],
      managers: [{ _id: "m1" }, { _id: "m2" }, { _id: "m3" }],
      managerStats: [],
    });

    render(<AdminSummary />);

    expect(screen.getByText("Total Artists: 2")).toBeInTheDocument();
    expect(screen.getByText("Total Managers: 3")).toBeInTheDocument();
  });

  it("renders top artists chart", () => {
    useArtistsManagers.mockReturnValue({
      artists: [{ _id: "1", fullName: "Artist One" }, { _id: "2", fullName: "Artist Two" }],
      managers: [],
      managerStats: [],
    });

    render(<AdminSummary />);

    expect(screen.getByTestId("top-artists-chart")).toBeInTheDocument();
  });

  it("renders top managers chart", () => {
    useArtistsManagers.mockReturnValue({
      artists: [],
      managers: [],
      managerStats: [{ _id: "m1", name: "Manager One" }],
    });

    render(<AdminSummary />);

    expect(screen.getByTestId("top-managers-chart")).toBeInTheDocument();
  });

  it("renders artist and manager tables", () => {
    useArtistsManagers.mockReturnValue({
      artists: [{ _id: "1", fullName: "Artist One" }],
      managers: [],
      managerStats: [{ _id: "m1", name: "Manager One" }],
    });

    render(<AdminSummary />);

    expect(screen.getByTestId("artists-table")).toBeInTheDocument();
    expect(screen.getByTestId("managers-table")).toBeInTheDocument();
  });

  it("handles empty state gracefully", () => {
    useArtistsManagers.mockReturnValue({ artists: [], managers: [], managerStats: [] });

    render(<AdminSummary />);

    expect(screen.getByText("Total Artists: 0")).toBeInTheDocument();
    expect(screen.getByText("Total Managers: 0")).toBeInTheDocument();
  });
});
