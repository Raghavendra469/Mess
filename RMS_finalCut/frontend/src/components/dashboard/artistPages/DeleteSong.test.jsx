import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // ✅ Ensure `toBeInTheDocument` works
import { useAuth } from "../../../context/authContext";
import { NotificationProvider } from "../../../context/NotificationContext";
import DeleteSong from "../artistPages/DeleteSong";
import SongService from "../../../services/SongService";
 
// Mock context
jest.mock("../../../context/authContext", () => ({
  useAuth: jest.fn(),
}));
 
// Mock SongService
jest.mock("../../../services/SongService", () => ({
  fetchSongsByArtist: jest.fn(),
  deleteSong: jest.fn(),
}));
 
describe("DeleteSong Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
 
    useAuth.mockReturnValue({
      userData: { _id: "123", name: "Test Artist" },
    });
 
    SongService.fetchSongsByArtist.mockResolvedValue([
      {
        _id: "1",
        songId: "test-song-a",
        songName: "Test Song A",
        releaseDate: "2024-01-01T00:00:00Z",
        totalStreams: 1000,
        totalRoyalty: 500.5,
      },
      {
        _id: "2",
        songId: "test-song-b",
        songName: "Test Song B",
        releaseDate: "2024-02-01T00:00:00Z",
        totalStreams: 2000,
        totalRoyalty: 750.75,
      },
    ]);
  });
 
  it("renders the delete song component with song list", async () => {
    render(
      <NotificationProvider>
        <DeleteSong />
      </NotificationProvider>
    );
 
    await waitFor(() => {
      expect(screen.getByText("Manage Songs")).toBeInTheDocument();
    });
 
    // Ensure songs are rendered
    await waitFor(() => {
      expect(screen.getByText("Test Song A")).toBeInTheDocument();
      expect(screen.getByText("Test Song B")).toBeInTheDocument();
    });
  });
 
  it("deletes a song when delete button is clicked", async () => {
    SongService.deleteSong.mockResolvedValue({ success: true });
 
    render(
      <NotificationProvider>
        <DeleteSong />
      </NotificationProvider>
    );
 
    // Wait for songs to load
    await waitFor(() => {
      expect(screen.getByText("Test Song A")).toBeInTheDocument();
    });
 
    const deleteButtons = screen.getAllByText("🗑 Delete Song");
 
    // Click delete on first song
    fireEvent.click(deleteButtons[0]);
 
    await waitFor(() => {
      expect(SongService.deleteSong).toHaveBeenCalledWith("test-song-a");
    });
 
    await waitFor(() => {
      expect(screen.queryByText("Test Song A")).not.toBeInTheDocument();
    });
  });
 
 
  it("handles empty song list gracefully", async () => {
    SongService.fetchSongsByArtist.mockResolvedValue([]);
 
    render(
      <NotificationProvider>
        <DeleteSong />
      </NotificationProvider>
    );
 
    await waitFor(() => {
      expect(screen.getByText("No songs found.")).toBeInTheDocument();
    });
  });
 
 
  // ✅ New Test Case 3: Filters songs based on search input
  it("filters songs based on search input", async () => {
    render(
      <NotificationProvider>
        <DeleteSong />
      </NotificationProvider>
    );
 
    await waitFor(() => {
      expect(screen.getByText("Test Song A")).toBeInTheDocument();
      expect(screen.getByText("Test Song B")).toBeInTheDocument();
    });
 
    const searchInput = screen.getByPlaceholderText("Search here...");
    fireEvent.change(searchInput, { target: { value: "A" } });
 
    await waitFor(() => {
      expect(screen.getByText("Test Song A")).toBeInTheDocument();
      expect(screen.queryByText("Test Song B")).not.toBeInTheDocument();
    });
  });
 
  // ✅ New Test Case 4: Deletes multiple songs correctly
  it("deletes multiple songs one by one", async () => {
    SongService.deleteSong.mockResolvedValue({ success: true });
 
    render(
      <NotificationProvider>
        <DeleteSong />
      </NotificationProvider>
    );
 
    await waitFor(() => {
      expect(screen.getByText("Test Song A")).toBeInTheDocument();
      expect(screen.getByText("Test Song B")).toBeInTheDocument();
    });
 
    const deleteButtons = screen.getAllByText("🗑 Delete Song");
 
    // Delete first song
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(SongService.deleteSong).toHaveBeenCalledWith("test-song-a");
      expect(screen.queryByText("Test Song A")).not.toBeInTheDocument();
    });
 
    // Delete second song
    fireEvent.click(screen.getByText("🗑 Delete Song"));
    await waitFor(() => {
      expect(SongService.deleteSong).toHaveBeenCalledWith("test-song-b");
      expect(screen.queryByText("Test Song B")).not.toBeInTheDocument();
    });
 
    // Ensure empty state is shown
    await waitFor(() => {
      expect(screen.getByText("No songs found.")).toBeInTheDocument();
    });
  });
});
 
 