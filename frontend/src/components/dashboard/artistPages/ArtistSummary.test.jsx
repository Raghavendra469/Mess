import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // ✅ Import this to fix `toBeInTheDocument`
import { useAuth } from "../../../context/authContext";
import SongService from "../../../services/SongService";
import ArtistSummary from "../artistPages/ArtistSummary";
 
// Mock context
jest.mock("../../../context/authContext", () => ({
  useAuth: jest.fn(),
}));
 
// Mock SongService
jest.mock("../../../services/SongService", () => ({
  fetchSongsByArtist: jest.fn(),
}));
 
// Mock recharts components to prevent ResizeObserver errors
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: () => <div>Mocked BarChart</div>,
  PieChart: () => <div>Mocked PieChart</div>,
  Bar: () => <div>Mocked Bar</div>,
  Pie: () => <div>Mocked Pie</div>,
  Tooltip: () => <div>Mocked Tooltip</div>,
  Legend: () => <div>Mocked Legend</div>,
  XAxis: () => <div>Mocked XAxis</div>,
  YAxis: () => <div>Mocked YAxis</div>,
  Cell: () => <div>Mocked Cell</div>,
}));
 
describe("ArtistSummary Component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      userData: { _id: "123", name: "Test Artist" },
    });
  });
 
  it("renders the artist dashboard with summary cards", async () => {
    SongService.fetchSongsByArtist.mockResolvedValue([
      { songName: "Song A", totalRoyalty: 100, totalStreams: 500 },
      { songName: "Song B", totalRoyalty: 150, totalStreams: 700 },
    ]);
 
    render(<ArtistSummary />);
 
    await waitFor(() => {
      expect(screen.getByText("Artist Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Total Songs")).toBeInTheDocument();
      expect(screen.getByText("Top Song")).toBeInTheDocument();
      expect(screen.getByText("Total Royalty")).toBeInTheDocument();
      expect(screen.getByText("Total Streams")).toBeInTheDocument();
    });
  });
 
  it("displays correct total songs count", async () => {
    SongService.fetchSongsByArtist.mockResolvedValue([
      { songName: "Song A", totalRoyalty: 100, totalStreams: 500 },
      { songName: "Song B", totalRoyalty: 150, totalStreams: 700 },
    ]);
 
    render(<ArtistSummary />);
 
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

});