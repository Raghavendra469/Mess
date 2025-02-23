import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";
import { useAuth } from "../../context/authContext";
import { useNotifications } from "../../context/NotificationContext";

// Mock the useAuth hook
jest.mock("../../context/authContext", () => ({
  useAuth: jest.fn(),
}));

// Mock the useNotifications hook
jest.mock("../../context/NotificationContext", () => ({
  useNotifications: jest.fn(),
}));

// Mock the react-router-dom useNavigate hook
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock the react-icons
jest.mock("react-icons/fa", () => ({
  FaUserCircle: () => <div>FaUserCircle</div>,
  FaBars: () => <div>FaBars</div>,
  FaBell: () => <div>FaBell</div>,
}));

describe("Navbar Component", () => {
  const mockLogout = jest.fn();
  const mockNavigate = jest.fn();
  const mockToggleSidebar = jest.fn();

  beforeEach(() => {
    // Mock the useAuth hook
    useAuth.mockReturnValue({
      user: {
        username: "testuser",
        email: "testuser@example.com",
        role: "Artist",
      },
      logout: mockLogout,
    });

    // Mock the useNotifications hook
    useNotifications.mockReturnValue({
      unreadCount: 2,
      notifications: [],
      loading: false,
    });

    // Mock the useNavigate hook
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders Navbar with user details", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    // Check if the Navbar renders correctly
    expect(screen.getByText(/Welcome, testuser/i)).toBeInTheDocument();
    expect(screen.getByText("FaBars")).toBeInTheDocument();
    expect(screen.getByText("FaBell")).toBeInTheDocument();
    expect(screen.getByText("FaUserCircle")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("toggles sidebar when the bars icon is clicked", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    // Simulate clicking the bars icon
    fireEvent.click(screen.getByText("FaBars"));
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  test("toggles notifications dropdown when the bell icon is clicked", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    // Simulate clicking the bell icon
    fireEvent.click(screen.getByText("FaBell"));

    // Check if the notifications dropdown is displayed
    expect(screen.getByRole("heading", { name: /Notifications/i })).toBeInTheDocument();
    expect(screen.getByText(/No new notifications/i)).toBeInTheDocument();

    // Simulate clicking the bell icon again to close the dropdown
    fireEvent.click(screen.getByText("FaBell"));
    expect(screen.queryByRole("heading", { name: /Notifications/i })).not.toBeInTheDocument();
  });



test("toggles profile dropdown when the user icon is clicked", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);
  
    // Simulate clicking the user icon
    fireEvent.click(screen.getByText("FaUserCircle"));
  
    // Check if the profile dropdown is displayed
    expect(screen.getByRole("heading", { name: /Profile Details/i })).toBeInTheDocument();
  
    // Use a more specific query to target the profile dropdown content
    const profileDropdown = screen.getByRole("heading", { name: /Profile Details/i }).closest("div");
    expect(profileDropdown).toBeInTheDocument();
  
    // Check for the user details inside the profile dropdown
    expect(profileDropdown).toHaveTextContent(/Name: testuser/i);
    expect(profileDropdown).toHaveTextContent(/Email: testuser@example.com/i);
    expect(profileDropdown).toHaveTextContent(/Role: Artist/i);
  
    // Simulate clicking the user icon again to close the dropdown
    fireEvent.click(screen.getByText("FaUserCircle"));
    expect(screen.queryByRole("heading", { name: /Profile Details/i })).not.toBeInTheDocument();
  });

  
  test("calls logout and navigates to login page when logout button is clicked", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    // Simulate clicking the logout button
    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("closes dropdowns when clicking outside", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    // Open the profile dropdown
    fireEvent.click(screen.getByText("FaUserCircle"));
    expect(screen.getByRole("heading", { name: /Profile Details/i })).toBeInTheDocument();

    // Simulate clicking outside the dropdown
    fireEvent.mouseDown(document);
    expect(screen.queryByRole("heading", { name: /Profile Details/i })).not.toBeInTheDocument();

    // Open the notifications dropdown
    fireEvent.click(screen.getByText("FaBell"));
    expect(screen.getByRole("heading", { name: /Notifications/i })).toBeInTheDocument();

    // Simulate clicking outside the dropdown
    fireEvent.mouseDown(document);
    expect(screen.queryByRole("heading", { name: /Notifications/i })).not.toBeInTheDocument();
  });

  test("closes profile dropdown when notifications dropdown is opened", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    // Open the profile dropdown
    fireEvent.click(screen.getByText("FaUserCircle"));
    expect(screen.getByRole("heading", { name: /Profile Details/i })).toBeInTheDocument();

    // Open the notifications dropdown
    fireEvent.click(screen.getByText("FaBell"));
    expect(screen.queryByRole("heading", { name: /Profile Details/i })).not.toBeInTheDocument();
  });

  test("closes notifications dropdown when profile dropdown is opened", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    // Open the notifications dropdown
    fireEvent.click(screen.getByText("FaBell"));
    expect(screen.getByRole("heading", { name: /Notifications/i })).toBeInTheDocument();

    // Open the profile dropdown
    fireEvent.click(screen.getByText("FaUserCircle"));
    expect(screen.queryByRole("heading", { name: /Notifications/i })).not.toBeInTheDocument();
  });
});