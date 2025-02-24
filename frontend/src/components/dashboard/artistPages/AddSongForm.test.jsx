import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddSongForm from "./AddSongForm";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import SongService from "../../../services/SongService";
import React from "react";
import "@testing-library/jest-dom";
 
jest.mock("../../../context/authContext");
jest.mock("../../../context/NotificationContext");
jest.mock("../../../services/SongService");
 
describe("AddSongForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      userData: { _id: "artist123", fullName: "Test Artist", manager: { managerId: "manager456" } },
    });
    useNotifications.mockReturnValue({ sendNotification: jest.fn() });
  });
 
  it("renders the form correctly", () => {
    render(<AddSongForm />);
    expect(screen.getByLabelText(/song name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/release date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add song/i })).toBeInTheDocument();
  });
 
  it("updates input fields correctly", () => {
    render(<AddSongForm />);
    const songNameInput = screen.getByLabelText(/song name/i);
    const releaseDateInput = screen.getByLabelText(/release date/i);
 
    fireEvent.change(songNameInput, { target: { value: "Test Song" } });
    fireEvent.change(releaseDateInput, { target: { value: "2025-02-23" } });
 
    expect(songNameInput.value).toBe("Test Song");
    expect(releaseDateInput.value).toBe("2025-02-23");
  });
 
  it("submits the form successfully", async () => {
    SongService.addSong.mockResolvedValue({ success: true });
    const { sendNotification } = useNotifications();
 
    render(<AddSongForm />);
   
    fireEvent.change(screen.getByLabelText(/song name/i), { target: { value: "Test Song" } });
    fireEvent.change(screen.getByLabelText(/release date/i), { target: { value: "2025-02-23" } });
    fireEvent.click(screen.getByRole("button", { name: /add song/i }));
 
    await waitFor(() => {
      expect(SongService.addSong).toHaveBeenCalledWith({
        artistId: "artist123",
        artistName: "Test Artist",
        songName: "Test Song",
        releaseDate: "2025-02-23",
      });
      expect(screen.getByText(/song added successfully/i)).toBeInTheDocument();
    });
    expect(sendNotification).toHaveBeenCalledWith(
      "manager456",
      "Test Artist added a song: Test Song.",
      "songUpdate"
    );
  });
 
  it("handles API failure gracefully", async () => {
    SongService.addSong.mockRejectedValue(new Error("Failed to add song"));
 
    render(<AddSongForm />);
   
    fireEvent.change(screen.getByLabelText(/song name/i), { target: { value: "Test Song" } });
    fireEvent.change(screen.getByLabelText(/release date/i), { target: { value: "2025-02-23" } });
    fireEvent.click(screen.getByRole("button", { name: /add song/i }));
 
    await waitFor(() => {
      expect(screen.getByText(/failed to add song/i)).toBeInTheDocument();
    });
  });
 
  it("displays an error if user data is missing", async () => {
    useAuth.mockReturnValue({ userData: null });
    render(<AddSongForm />);
 
    fireEvent.click(screen.getByRole("button", { name: /add song/i }));
 
    await waitFor(() => {
      expect(screen.getByText(/user data not found/i)).toBeInTheDocument();
    });
  });
});