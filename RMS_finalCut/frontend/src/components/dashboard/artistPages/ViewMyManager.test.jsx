import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewMyManager from "./ViewMyManager";
import "@testing-library/jest-dom";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import { cancelCollaboration, fetchCollaborationsByUserAndRole } from "../../../services/CollaborationService";
 
jest.mock("../../../context/authContext", () => ({
  useAuth: jest.fn(),
}));
 
jest.mock("../../../context/NotificationContext", () => ({
  useNotifications: jest.fn(),
}));
 
jest.mock("../../../services/CollaborationService", () => ({
  cancelCollaboration: jest.fn(),
  fetchCollaborationsByUserAndRole: jest.fn(),
}));
 
describe("ViewMyManager Component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      userData: {
        _id: "artist123",
        fullName: "John Doe",
        manager: {
          fullName: "Jane Smith",
          email: "jane@example.com",
          mobileNo: "1234567890",
          address: "123 Manager St",
          commissionPercentage: 10,
          managedArtists: [{}],
          description: "Experienced manager",
          managerId: "manager123",
        },
      },
    });
 
    useNotifications.mockReturnValue({
      sendNotification: jest.fn(),
    });
  });
 
  test("renders manager details correctly", async () => {
    render(<ViewMyManager />);
    expect(await screen.findByText("Manager Details")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
  });
 
  test("renders 'No manager assigned' message when no manager exists", async () => {
    useAuth.mockReturnValue({ userData: { _id: "artist123" } });
    render(<ViewMyManager />);
    expect(screen.getByText("No manager assigned.")).toBeInTheDocument();
  });
 
  test("clicking 'Cancel Collaboration' shows reason box", async () => {
    useAuth.mockReturnValue({
      userData: {
        _id: "artist123",
        fullName: "Test Artist",
        manager: {
          fullName: "Jane Smith",
          email: "jane@example.com",
          mobileNo: "1234567890",
          address: "123 Manager St",
          commissionPercentage: 10,
          managedArtists: [{}],
          managerId: "manager123",
        },
      },
    });
 
    fetchCollaborationsByUserAndRole.mockResolvedValue([
      { _id: "collab123", status: "Approved" },
    ]);
 
    render(<ViewMyManager />);
 
    // Wait for the button to appear
    const cancelButton = await screen.findByRole("button", {
      name: /cancel collaboration/i,
    });
 
    fireEvent.click(cancelButton);
 
    // Ensure the reason box appears
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter reason for cancellation...")
      ).toBeInTheDocument();
    });
  });
 
  test("clicking outside the reason box closes it", async () => {
    useAuth.mockReturnValue({
      userData: {
        _id: "artist123",
        fullName: "Test Artist",
        manager: {
          fullName: "Jane Smith",
          email: "jane@example.com",
          mobileNo: "1234567890",
          address: "123 Manager St",
          commissionPercentage: 10,
          managedArtists: [{}],
          managerId: "manager123",
        },
      },
    });
 
    fetchCollaborationsByUserAndRole.mockResolvedValue([
      { _id: "collab123", status: "Approved" },
    ]);
 
    render(<ViewMyManager />);
 
    // Wait for the button to appear
    const cancelButton = await screen.findByRole("button", {
      name: /cancel collaboration/i,
    });
 
    fireEvent.click(cancelButton);
 
    // Ensure the reason box appears
    expect(
      screen.getByPlaceholderText("Enter reason for cancellation...")
    ).toBeInTheDocument();
 
    // Simulate clicking outside the reason box
    fireEvent.mouseDown(document.body);
 
    // Ensure the reason box disappears
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Enter reason for cancellation...")
      ).not.toBeInTheDocument();
    });
  });
 
 
  test("submitting cancel request calls API and updates UI", async () => {
    const sendNotificationMock = jest.fn();
    useNotifications.mockReturnValue({ sendNotification: sendNotificationMock });
    fetchCollaborationsByUserAndRole.mockResolvedValue([{ _id: "collab123", status: "Approved" }]);
    cancelCollaboration.mockResolvedValue();
 
    render(<ViewMyManager />);
    const cancelButton = await screen.findByText("Cancel Collaboration");
    fireEvent.click(cancelButton);
 
    const reasonInput = screen.getByPlaceholderText("Enter reason for cancellation...");
    fireEvent.change(reasonInput, { target: { value: "Not satisfied" } });
 
    const submitButton = screen.getByText("Submit Request");
    fireEvent.click(submitButton);
 
    await waitFor(() => expect(cancelCollaboration).toHaveBeenCalledWith("collab123", "Not satisfied"));
    await waitFor(() => expect(sendNotificationMock).toHaveBeenCalled());
    expect(screen.getByText("Request sent for cancellation.")).toBeInTheDocument();
  });
});