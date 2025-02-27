import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import CollaborationRequests from "./CollaborationRequests";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import {
  fetchCollaborationRequests,
  acceptCollaborationRequest,
  rejectCollaborationRequest,
} from "../../../services/CollaborationService";
import "@testing-library/jest-dom/vitest"; // Needed for matchers in Vitest

vi.mock("../../../context/authContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../context/NotificationContext", () => ({
  useNotifications: vi.fn(),
}));

vi.mock("../../../services/CollaborationService", () => ({
  fetchCollaborationRequests: vi.fn(),
  acceptCollaborationRequest: vi.fn(),
  rejectCollaborationRequest: vi.fn(),
}));

describe("CollaborationRequests Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clears all mocks between tests
    useAuth.mockReturnValue({ userData: { _id: "manager123", fullName: "Test Manager" } });
    useNotifications.mockReturnValue({ sendNotification: vi.fn() });
  });

  it("renders 'No collaboration requests found' when there are no requests", async () => {
    fetchCollaborationRequests.mockResolvedValue([]);

    render(<CollaborationRequests />);

    await waitFor(() => {
      expect(screen.getByText("No collaboration requests found.")).toBeInTheDocument();
    });
  });

  it("handles accept request correctly", async () => {
    fetchCollaborationRequests.mockResolvedValue([
      {
        _id: "req1",
        status: "Pending",
        artistId: { artistId: "artist123", fullName: "Artist One", email: "artist1@example.com", mobileNo: "1234567890" },
      },
    ]);
    acceptCollaborationRequest.mockResolvedValue({});
    const sendNotificationMock = vi.fn();
    useNotifications.mockReturnValue({ sendNotification: sendNotificationMock });

    render(<CollaborationRequests />);

    await waitFor(() => {
      expect(screen.getByText("Artist One")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Accept"));

    await waitFor(() => {
      expect(acceptCollaborationRequest).toHaveBeenCalledWith("req1");
      expect(sendNotificationMock).toHaveBeenCalledWith(
        "artist123",
        "Test Manager accepted your request.",
        "collaborationRequest"
      );
    });
  });

  it("handles reject request correctly", async () => {
    fetchCollaborationRequests.mockResolvedValue([
      {
        _id: "req1",
        status: "Pending",
        artistId: { artistId: "artist123", fullName: "Artist One", email: "artist1@example.com", mobileNo: "1234567890" },
      },
    ]);
    rejectCollaborationRequest.mockResolvedValue({});
    const sendNotificationMock = vi.fn();
    useNotifications.mockReturnValue({ sendNotification: sendNotificationMock });

    render(<CollaborationRequests />);

    await waitFor(() => {
      expect(screen.getByText("Artist One")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Reject"));

    await waitFor(() => {
      expect(rejectCollaborationRequest).toHaveBeenCalledWith("req1");
      expect(sendNotificationMock).toHaveBeenCalledWith(
        "artist123",
        "Test Manager rejected your request.",
        "collaborationRequest"
      );
    });
  });

  it("does not fetch requests when userData is missing", async () => {
    useAuth.mockReturnValue({ userData: null });

    render(<CollaborationRequests />);

    expect(fetchCollaborationRequests).not.toHaveBeenCalled();
  });

  it("logs an error when fetching requests fails", async () => {
    const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchCollaborationRequests.mockRejectedValue(new Error("Network Error"));

    render(<CollaborationRequests />);
    
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith("Error fetching requests:", expect.any(Error));
    });

    consoleErrorMock.mockRestore();
  });

  it("removes a request from UI after acceptance", async () => {
    useAuth.mockReturnValue({ userData: { _id: "manager123", fullName: "Manager" } });

    fetchCollaborationRequests.mockResolvedValue([
      { _id: "request1", artistId: { artistId: "artist123", fullName: "Artist One", email: "artist1@example.com" }, status: "Pending" },
    ]);

    render(<CollaborationRequests />);

    await waitFor(() => expect(screen.getByText("Artist One")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Accept"));

    await waitFor(() => expect(screen.queryByText("Artist One")).not.toBeInTheDocument());
  });
});
