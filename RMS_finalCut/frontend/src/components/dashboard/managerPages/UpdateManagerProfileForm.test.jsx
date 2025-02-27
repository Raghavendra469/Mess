import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UpdateManagerProfileForm from "../../../components/dashboard/managerPages/UpdateManagerProfileForm";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import { fetchUserDetails, updateUserProfile } from "../../../services/userService";
import { describe, it, vi, beforeEach, expect } from "vitest";

vi.mock("../../../context/authContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../context/NotificationContext", () => ({
  useNotifications: vi.fn(),
}));

vi.mock("../../../services/userService", () => ({
  fetchUserDetails: vi.fn(),
  updateUserProfile: vi.fn(),
}));

describe("UpdateManagerProfileForm Component", () => {
  const mockUser = { username: "manager123" };
  const mockUserData = { fullName: "John Doe", managedArtists: [{ artistId: "1" }, { artistId: "2" }] };
  const mockProfileData = {
    fullName: "John Doe",
    mobileNo: "1234567890",
    commissionPercentage: "10",
    address: "123 Main St",
    description: "Experienced manager",
  };

  let sendNotificationMock;

  beforeEach(() => {
    vi.clearAllMocks(); // Vitest equivalent of jest.clearAllMocks()
    sendNotificationMock = vi.fn(); // Define sendNotificationMock before using it

    useAuth.mockReturnValue({ user: mockUser, userData: mockUserData, loading: false });
    useNotifications.mockReturnValue({ sendNotification: sendNotificationMock });
    fetchUserDetails.mockResolvedValue(mockProfileData);
  });

  it("renders the update profile form with fetched data", async () => {
    render(<UpdateManagerProfileForm />);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
      expect(screen.getByDisplayValue("10")).toBeInTheDocument();
      expect(screen.getByDisplayValue("123 Main St")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Experienced manager")).toBeInTheDocument();
    });
  });

  it("updates form input values on change", async () => {
    render(<UpdateManagerProfileForm />);
    
    await waitFor(() => expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument());
    
    const nameInput = screen.getByDisplayValue("John Doe");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    
    expect(nameInput.value).toBe("Jane Doe");
  });

  it("submits updated profile data and sends notifications", async () => {
    updateUserProfile.mockResolvedValue({ success: true });

    render(<UpdateManagerProfileForm />);
    
    await waitFor(() => expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument());
    
    fireEvent.click(screen.getAllByText("Update Profile")[1]);
    
    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith("manager123", mockProfileData);
      expect(sendNotificationMock).toHaveBeenCalledTimes(2);
    });
  });

  it("displays an error message when fetching user details fails", async () => {
    fetchUserDetails.mockRejectedValue(new Error("Network error"));
  
    render(<UpdateManagerProfileForm />);
  
    await waitFor(() => {
      expect(screen.getByText("Failed to load artist data.")).toBeInTheDocument();
    });
  });

  it("does not send notifications if manager has no artists", async () => {
    useAuth.mockReturnValue({ user: mockUser, userData: { managedArtists: [] }, loading: false });

    render(<UpdateManagerProfileForm />);
  
    await waitFor(() => expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument());
  
    fireEvent.click(screen.getAllByText("Update Profile")[1]);
  
    await waitFor(() => {
      expect(sendNotificationMock).not.toHaveBeenCalled();
    });
  });
});
