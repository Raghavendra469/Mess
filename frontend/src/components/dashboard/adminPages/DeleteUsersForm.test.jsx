import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteUserForm from "./DeleteUserForm";
import { useAuth } from "../../../context/authContext";
import { fetchUsersByRole, toggleUserStatus } from "../../../services/userService";
 
// ✅ Mock authentication context
jest.mock("../../../context/authContext", () => ({
  useAuth: jest.fn(),
}));
 
// ✅ Mock user service functions
jest.mock("../../../services/userService", () => ({
  fetchUsersByRole: jest.fn(),
  toggleUserStatus: jest.fn(),
}));
 
// ✅ Mock SearchBar component
jest.mock("../../commonComponents/SearchBar", () => ({ onSearch }) => (
  <input
    data-testid="search-bar"
    placeholder="Search users"
    onChange={(e) => onSearch(e.target.value)}
  />
));
 
describe("DeleteUserForm Component", () => {
  const mockUsers = [
    { _id: "user1", username: "john_doe", email: "john@example.com", role: "User", isActive: true },
    { _id: "user2", username: "jane_smith", email: "jane@example.com", role: "User", isActive: false },
  ];
 
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { role: "Admin" } });
    fetchUsersByRole.mockResolvedValue(mockUsers);
    toggleUserStatus.mockResolvedValue({ success: true });
  });
 
  test("renders without crashing and displays users", async () => {
    render(<DeleteUserForm />);
    await waitFor(() => expect(fetchUsersByRole).toHaveBeenCalledWith("User"));
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
      expect(screen.getByText("jane_smith")).toBeInTheDocument();
    });
  });
 
//   test("filters users based on search input", async () => {
//     render(<DeleteUserForm />);
//     await waitFor(() => expect(fetchUsersByRole).toHaveBeenCalled());
 
//     const searchBar = screen.getByTestId("search-bar");
//     fireEvent.change(searchBar, { target: { value: "john" } });
 
//     await waitFor(() => {
//       expect(screen.getByText("john_doe")).toBeInTheDocument();
//       expect(screen.queryByText("jane_smith")).not.toBeInTheDocument();
//     });
//   });
 
  test("toggles user status when button is clicked", async () => {
    render(<DeleteUserForm />);
    await waitFor(() => expect(fetchUsersByRole).toHaveBeenCalled());
 
    const deactivateButton = await screen.findByText("Deactivate");
    fireEvent.click(deactivateButton);
 
    await waitFor(() => expect(toggleUserStatus).toHaveBeenCalledWith("user1", false));
  });
});