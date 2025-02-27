import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import CollaborationCancellation from "./CollaborationCancellation";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import { fetchCollaborationsByUserAndRole, handleCancellationResponse } from "../../../services/CollaborationService";

vi.mock("../../../context/authContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../context/NotificationContext", () => ({
  useNotifications: vi.fn(),
}));

vi.mock("../../../services/CollaborationService", () => ({
  fetchCollaborationsByUserAndRole: vi.fn(),
  handleCancellationResponse: vi.fn(),
}));

describe("CollaborationCancellation Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    useAuth.mockReturnValue({ userData: { _id: "123" } });
    useNotifications.mockReturnValue({ sendNotification: vi.fn() });
    fetchCollaborationsByUserAndRole.mockResolvedValue([]);

    render(<CollaborationCancellation />);
    expect(screen.getByText("Loading cancellation requests...")).toBeInTheDocument();
  });

  it("renders no cancellation request message when no request is found", async () => {
    useAuth.mockReturnValue({ userData: { _id: "123" } });
    useNotifications.mockReturnValue({ sendNotification: vi.fn() });
    fetchCollaborationsByUserAndRole.mockResolvedValue([]);

    render(<CollaborationCancellation />);
    await waitFor(() => expect(screen.getByText("No cancellation requests found.")).toBeInTheDocument());
  });

  it("renders a pending cancellation request", async () => {
    useAuth.mockReturnValue({ userData: { _id: "123" } });
    useNotifications.mockReturnValue({ sendNotification: vi.fn() });
    fetchCollaborationsByUserAndRole.mockResolvedValue([
      {
        _id: "collab123",
        status: "cancel_requested",
        artistId: { fullName: "Artist Name", email: "artist@example.com", artistId: "artist123" },
        cancellationReason: "Personal reasons",
      },
    ]);

    render(<CollaborationCancellation />);
    
    await waitFor(() => {
      expect(screen.getByText("Artist Name")).toBeInTheDocument();
      expect(screen.getByText("Email: artist@example.com")).toBeInTheDocument();
      expect(screen.getByText("Reason: Personal reasons")).toBeInTheDocument();
    });
  });

  it("approves a cancellation request", async () => {
    useAuth.mockReturnValue({ userData: { _id: "123" } });
    useNotifications.mockReturnValue({ sendNotification: vi.fn() });
    fetchCollaborationsByUserAndRole.mockResolvedValue([
      {
        _id: "collab123",
        status: "cancel_requested",
        artistId: { fullName: "Artist Name", email: "artist@example.com", artistId: "artist123" },
        cancellationReason: "Personal reasons",
      },
    ]);

    render(<CollaborationCancellation />);
    await waitFor(() => screen.getByText("Artist Name"));

    fireEvent.click(screen.getByText("Approve"));
    await waitFor(() => expect(handleCancellationResponse).toHaveBeenCalledWith("collab123", "approved"));
  });

  it("declines a cancellation request", async () => {
    useAuth.mockReturnValue({ userData: { _id: "123" } });
    useNotifications.mockReturnValue({ sendNotification: vi.fn() });
    fetchCollaborationsByUserAndRole.mockResolvedValue([
      {
        _id: "collab123",
        status: "cancel_requested",
        artistId: { fullName: "Artist Name", email: "artist@example.com", artistId: "artist123" },
        cancellationReason: "Personal reasons",
      },
    ]);

    render(<CollaborationCancellation />);
    await waitFor(() => screen.getByText("Artist Name"));

    fireEvent.click(screen.getByText("Decline"));
    await waitFor(() => expect(handleCancellationResponse).toHaveBeenCalledWith("collab123", "declined"));
  });
});
