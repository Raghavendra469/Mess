import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import { useArtistsManagers } from "../../../context/ArtistsManagersContext";
import { sendCollaborationRequest } from "../../../services/CollaborationService";
import RequestManagerList from "../artistPages/RequestManagerList";
 
// Mock context and services
jest.mock("../../../context/authContext", () => ({
  useAuth: jest.fn(),
}));
jest.mock("../../../context/NotificationContext", () => ({
  useNotifications: jest.fn(),
}));
jest.mock("../../../context/ArtistsManagersContext", () => ({
  useArtistsManagers: jest.fn(),
}));
jest.mock("../../../services/CollaborationService", () => ({
  sendCollaborationRequest: jest.fn(),
}));
 
describe("RequestManagerList Component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      userData: { _id: "artist123", fullName: "Test Artist", manager: null },
    });
 
    useNotifications.mockReturnValue({
      sendNotification: jest.fn(),
    });
 
    useArtistsManagers.mockReturnValue({
      managers: [
        {
          _id: "manager1",
          fullName: "Manager One",
          email: "manager1@example.com",
          mobileNo: "1234567890",
          address: "123 Street",
          commissionPercentage: 10,
          managedArtists: [],
          description: "Experienced Music Manager",
          managerId: "manager1-notify",
        },
        {
          _id: "manager2",
          fullName: "Manager Two",
          email: "manager2@example.com",
          mobileNo: "0987654321",
          address: "456 Avenue",
          commissionPercentage: 15,
          managedArtists: [],
          description: "Expert in Royalty Management",
          managerId: "manager2-notify",
        },
      ],
    });
  });
 
  it("renders the RequestManagerList component with managers", async () => {
    render(<RequestManagerList />);
 
    expect(screen.getByText("Available Managers")).toBeInTheDocument();
    expect(screen.getByText("Manager One")).toBeInTheDocument();
    expect(screen.getByText("Manager Two")).toBeInTheDocument();
    expect(screen.getAllByText("Send Request")).toHaveLength(2);
  });
 
  it("shows a message when an artist already has a manager", async () => {
    useAuth.mockReturnValue({
      userData: { _id: "artist123", fullName: "Test Artist", manager: "manager1" },
    });
 
    render(<RequestManagerList />);
 
    expect(
      screen.getByText("You already have a manager! You cannot send a new request.")
    ).toBeInTheDocument();
  });
 
  it("sends a request when clicking the 'Send Request' button", async () => {
    sendCollaborationRequest.mockResolvedValue({ success: true });
 
    render(<RequestManagerList />);
 
    // Find the first manager's request button
    const managerButtons = screen.getAllByText("Send Request");
 
    // Click the first manager's button
    fireEvent.click(managerButtons[0]);
 
    await waitFor(() => {
      expect(managerButtons[0]).toHaveTextContent("Request Sent");
    });
 
    expect(sendCollaborationRequest).toHaveBeenCalledWith("artist123", "manager1");
  });
 
 
  it("displays an error message if the request fails", async () => {
    sendCollaborationRequest.mockRejectedValue(new Error("Request failed"));
 
    render(<RequestManagerList />);
 
    const sendRequestButton = screen.getAllByText("Send Request")[0];
    fireEvent.click(sendRequestButton);
 
    await waitFor(() => {
      expect(screen.getByText("Request Failed")).toBeInTheDocument();
    });
  });
 
  it("disables the button after a request is sent", async () => {
    sendCollaborationRequest.mockResolvedValue({ success: true });
 
    render(<RequestManagerList />);
 
    const sendRequestButton = screen.getAllByText("Send Request")[0];
    fireEvent.click(sendRequestButton);
 
    await waitFor(() => {
      expect(sendRequestButton).toHaveAttribute("disabled");
    });
  });
 
  it("displays 'No managers available' when no managers are present", async () => {
    useArtistsManagers.mockReturnValue({ managers: [] });
 
    render(<RequestManagerList />);
 
    expect(screen.getByText("No managers available.")).toBeInTheDocument();
  });
});