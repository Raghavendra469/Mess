import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, test, beforeEach, vi, spyOn } from "vitest";
import UpdateArtistProfileForm from "./updateArtistProfileForm";
import { useAuth } from "../../../context/authContext";
import { useNotifications } from "../../../context/NotificationContext";
import { fetchUserDetails, updateUserProfile } from "../../../services/userService";
 
// Mock dependencies
vi.mock("../../../context/authContext");
vi.mock("../../../context/NotificationContext");
vi.mock("../../../services/userService");
 
describe("UpdateArtistProfileForm - Alternative Methods", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
 
    const mockUser = { username: "testuser" };
    const mockUserData = {
        fullName: "Test User",
        mobileNo: "1234567890",
        address: "123 Test Street",
        description: "Music lover",
        manager: { managerId: "manager123" },
    };
 
    test("shows loading state initially", async () => {
        useAuth.mockReturnValue({ user: mockUser, userData: null, loading: true });
        useNotifications.mockReturnValue({ sendNotification: vi.fn() }); // Ensure it's defined
        render(<UpdateArtistProfileForm />);
        // Check if "Loading..." is rendered
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
    test("submits updated profile and sends notification", async () => {
        useAuth.mockReturnValue({ user: mockUser, userData: mockUserData, loading: false });
        fetchUserDetails.mockResolvedValue(mockUserData);
        updateUserProfile.mockResolvedValue({ success: true });
        const sendNotificationMock = vi.fn();
        useNotifications.mockReturnValue({ sendNotification: sendNotificationMock });
 
        await act(async () => render(<UpdateArtistProfileForm />));
 
        const updateButton = screen.getByRole("button", { name: /Update Profile/i });
        await userEvent.click(updateButton);
 
        await waitFor(() => expect(updateUserProfile).toHaveBeenCalledWith("testuser", expect.any(Object)));
 
        expect(sendNotificationMock).toHaveBeenCalledWith(
            "manager123",
            "Test User updated their profile.",
            "profileUpdate"
        );
        expect(screen.getByText("Profile updated successfully!")).toBeInTheDocument();
    });
 
    test("does not send notification when manager is missing", async () => {
        const userDataWithoutManager = { ...mockUserData, manager: null };
        useAuth.mockReturnValue({ user: mockUser, userData: userDataWithoutManager, loading: false });
        fetchUserDetails.mockResolvedValue(userDataWithoutManager);
        updateUserProfile.mockResolvedValue({ success: true });
        const sendNotificationMock = vi.fn();
        useNotifications.mockReturnValue({ sendNotification: sendNotificationMock });
 
        await act(async () => render(<UpdateArtistProfileForm />));
 
        const updateButton = screen.getByRole("button", { name: /Update Profile/i });
        await userEvent.click(updateButton);
 
        await waitFor(() => expect(updateUserProfile).toHaveBeenCalled());
        expect(sendNotificationMock).not.toHaveBeenCalled();
 
        expect(screen.getByText("Profile updated successfully!")).toBeInTheDocument();
    });
});