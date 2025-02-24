import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CollaborationRequests from "./CollaborationRequests";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import "@testing-library/jest-dom";

import {
  fetchCollaborationRequests,
  acceptCollaborationRequest,
  rejectCollaborationRequest,
} from "../../../services/CollaborationService";

jest.mock("../../../context/authContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../context/NotificationContext", () => ({
  useNotifications: jest.fn(),
}));

jest.mock("../../../services/CollaborationService", () => ({
  fetchCollaborationRequests: jest.fn(),
  acceptCollaborationRequest: jest.fn(),
  rejectCollaborationRequest: jest.fn(),
}));

describe("CollaborationRequests Component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ userData: { _id: "manager123", fullName: "Test Manager" } });
    useNotifications.mockReturnValue({ sendNotification: jest.fn() });
  });

  it("renders 'No collaboration requests found' when there are no requests", async () => {
    fetchCollaborationRequests.mockResolvedValue([]);

    render(<CollaborationRequests />);

    await waitFor(() => {
      expect(screen.getByText("No collaboration requests found.")).toBeInTheDocument();
    });
  });

//   it("renders pending collaboration requests", async () => {
//     fetchCollaborationRequests.mockResolvedValue([
//       {
//         _id: "req1",
//         status: "Pending",
//         artistId: { artistId: "artist123", fullName: "Artist One", email: "artist1@example.com", mobileNo: "1234567890" },
//       },
//     ]);

//     render(<CollaborationRequests />);

//     await waitFor(() => {
//       expect(screen.getByText("Artist One")).toBeInTheDocument();
//       expect(
//         screen.getByText((content, element) => 
//           element.textContent.includes("Email: artist1@example.com")
//         )
//       ).toBeInTheDocument();
//       expect(screen.getByText("Mobile No: 1234567890")).toBeInTheDocument();
//       expect(screen.getByText("Accept")).toBeInTheDocument();
//       expect(screen.getByText("Reject")).toBeInTheDocument();
//     });
//   });

  it("handles accept request correctly", async () => {
    fetchCollaborationRequests.mockResolvedValue([
      {
        _id: "req1",
        status: "Pending",
        artistId: { artistId: "artist123", fullName: "Artist One", email: "artist1@example.com", mobileNo: "1234567890" },
      },
    ]);
    acceptCollaborationRequest.mockResolvedValue({});
    const sendNotificationMock = jest.fn();
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
    const sendNotificationMock = jest.fn();
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
    useAuth.mockReturnValue({ userData: null }); // Mock userData as null
  
    render(<CollaborationRequests />);
  
    expect(fetchCollaborationRequests).not.toHaveBeenCalled();
  });
  
  it("logs an error when fetching requests fails", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    fetchCollaborationRequests.mockRejectedValue(new Error("Network Error"));
  
    render(<CollaborationRequests />);
    await waitFor(() => expect(consoleErrorMock).toHaveBeenCalledWith("Error fetching requests:", expect.any(Error)));
  
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
