import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UpdateManagerProfileForm from "../../../components/dashboard/managerPages/UpdateManagerProfileForm";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import { fetchUserDetails, updateUserProfile } from "../../../services/userService";

jest.mock("../../../context/authContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../context/NotificationContext", () => ({
  useNotifications: jest.fn(),
}));

jest.mock("../../../services/userService", () => ({
  fetchUserDetails: jest.fn(),
  updateUserProfile: jest.fn(),
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
    jest.clearAllMocks();
    sendNotificationMock = jest.fn(); // Define sendNotificationMock before using it

    useAuth.mockReturnValue({ user: mockUser, userData: mockUserData, loading: false });
    useNotifications.mockReturnValue({ sendNotification: sendNotificationMock });
    fetchUserDetails.mockResolvedValue(mockProfileData);
  });

  test("renders the update profile form with fetched data", async () => {
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

  test("updates form input values on change", async () => {
    render(<UpdateManagerProfileForm />);
    
    await waitFor(() => expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument());
    
    const nameInput = screen.getByDisplayValue("John Doe");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    
    expect(nameInput.value).toBe("Jane Doe");
  });

  test("submits updated profile data and sends notifications", async () => {
    updateUserProfile.mockResolvedValue({ success: true });

    render(<UpdateManagerProfileForm />);
    
    await waitFor(() => expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument());
    
    fireEvent.click(screen.getAllByText("Update Profile")[1]);
    
    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith("manager123", mockProfileData);
      expect(sendNotificationMock).toHaveBeenCalledTimes(2);
    });
  });

  test("displays an error message when fetching user details fails", async () => {
    fetchUserDetails.mockRejectedValue(new Error("Network error"));
  
    render(<UpdateManagerProfileForm />);
  
    await waitFor(() => {
      expect(screen.getByText("Failed to load artist data.")).toBeInTheDocument();
    });
  });

  test("does not send notifications if manager has no artists", async () => {
    useAuth.mockReturnValue({ user: mockUser, userData: { managedArtists: [] }, loading: false });

    render(<UpdateManagerProfileForm />);
  
    await waitFor(() => expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument());
  
    fireEvent.click(screen.getAllByText("Update Profile")[1]);
  
    await waitFor(() => {
      expect(sendNotificationMock).not.toHaveBeenCalled();
    });
  });
});
